import "server-only";
import { createAdminClient } from "@/lib/supabase/server";
import { sendEmail, BUSINESS_EMAIL } from "@/lib/email";
import { getOrderForAdmin } from "@/lib/admin/orders";
import { renderOrderConfirmationEmail } from "@/lib/email-templates";
import type { MonobankInvoiceStatus } from "./client";

// Single source of truth for "a Monobank invoice reached status X — what
// does that mean for our order?" — called from both the webhook handler
// (the real-time path) and the order confirmation page's fallback status
// check (in case the webhook hasn't landed yet by the time the customer's
// browser redirects back). Idempotent: only acts on an order still sitting
// in pending_payment, so a duplicate call from either path is a no-op.
export async function applyInvoiceStatus(
  orderId: string,
  invoiceId: string,
  status: MonobankInvoiceStatus,
): Promise<void> {
  const supabase = createAdminClient();

  const { data: order } = await supabase
    .from("orders")
    .select("status")
    .eq("id", orderId)
    .maybeSingle();

  if (!order || order.status !== "pending_payment") return;

  if (status === "success") {
    await supabase
      .from("payments")
      .update({ status: "paid", external_reference: invoiceId })
      .eq("order_id", orderId);
    await supabase
      .from("orders")
      .update({ status: "paid", paid_at: new Date().toISOString() })
      .eq("id", orderId);
    await notifyOrderPaid(orderId);
    return;
  }

  if (status === "failure" || status === "expired" || status === "reversed") {
    await supabase
      .from("payments")
      .update({ status: "failed", external_reference: invoiceId })
      .eq("order_id", orderId);
    await supabase
      .from("orders")
      .update({ status: "payment_failed" })
      .eq("id", orderId);
    // place_order() already decremented stock at order creation — now that
    // the payment definitely won't complete, give it back.
    await supabase.rpc("release_order_stock", { p_order_id: orderId });
    return;
  }

  // "created" / "processing" / "hold" — still in flight, nothing to do yet.
}

async function notifyOrderPaid(orderId: string): Promise<void> {
  const order = await getOrderForAdmin(orderId);
  if (!order) return;

  const itemLines = order.order_items
    .map(
      (item) =>
        `${item.product_name}${item.size ? ` (${item.size})` : ""} x${item.quantity} — ${item.line_total} грн`,
    )
    .join("\n");

  const summary = [
    `Замовлення №${order.id.slice(0, 8)}`,
    "",
    itemLines,
    "",
    `Сума: ${order.subtotal} грн`,
    `Доставка: ${order.shipping_cost} грн`,
    order.discount > 0
      ? `Промокод${order.promo_code ? ` ${order.promo_code}` : ""}: −${order.discount} грн`
      : null,
    `Разом: ${order.total} грн`,
    "",
    `Отримувач: ${order.customer_name}, ${order.customer_phone}`,
    `Нова Пошта: ${order.shipping_city}, ${order.shipping_branch}`,
  ]
    .filter((line) => line !== null)
    .join("\n");

  await sendEmail({
    to: BUSINESS_EMAIL,
    subject: `Оплачено замовлення №${order.id.slice(0, 8)}`,
    text: summary,
  });

  if (order.customer_email) {
    const imageByProductId = await getProductThumbnails(
      order.order_items.map((item) => item.product_id),
    );
    const message = renderOrderConfirmationEmail(
      {
        ...order,
        items: order.order_items.map((item) => ({
          ...item,
          imageUrl: item.product_id
            ? (imageByProductId.get(item.product_id) ?? null)
            : null,
        })),
      },
      process.env.SITE_URL ?? "https://frombobwithlove.com",
    );
    await sendEmail({ to: order.customer_email, ...message });
  }
}

// First photo of each product, for the thumbnails in the confirmation
// email. A failure here just means an email without photos.
async function getProductThumbnails(
  productIds: (string | null)[],
): Promise<Map<string, string>> {
  const ids = [...new Set(productIds.filter((id): id is string => !!id))];
  const map = new Map<string, string>();
  if (ids.length === 0) return map;

  const { data, error } = await createAdminClient()
    .from("products")
    .select("id, images")
    .in("id", ids);
  if (error) {
    console.error("Failed to load product images for order email:", error);
    return map;
  }
  for (const product of data ?? []) {
    if (product.images?.[0]) map.set(product.id, product.images[0]);
  }
  return map;
}
