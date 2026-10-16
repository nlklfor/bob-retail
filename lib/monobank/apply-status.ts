import "server-only";
import { createAdminClient } from "@/lib/supabase/server";
import { sendEmail, BUSINESS_EMAIL } from "@/lib/email";
import { getOrderForAdmin } from "@/lib/admin/orders";
import {
  renderNotificationEmail,
  renderOrderConfirmationEmail,
} from "@/lib/email-templates";
import { formatPrice } from "@/lib/format";
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

  const siteUrl = process.env.SITE_URL ?? "https://frombobwithlove.com";
  const number = order.id.slice(0, 8).toUpperCase();
  const imageByProductId = await getProductThumbnails(
    order.order_items.map((item) => item.product_id),
  );
  const imageFor = (productId: string | null) =>
    productId ? (imageByProductId.get(productId) ?? null) : null;

  const notification = renderNotificationEmail({
    subject: `Оплачено замовлення №${number} — ${formatPrice(order.total)} грн`,
    heading: `Нове замовлення №${number}`,
    preheader: `${order.customer_name} · ${formatPrice(order.total)} грн · ${order.shipping_city}`,
    rows: [
      { label: "Статус", value: "Оплачено" },
      { label: "Отримувач", value: order.customer_name },
      {
        label: "Телефон",
        value: order.customer_phone,
        href: `tel:${order.customer_phone}`,
      },
      {
        label: "Email",
        value: order.customer_email ?? "",
        href: order.customer_email
          ? `mailto:${order.customer_email}`
          : undefined,
      },
      {
        label: "Нова Пошта",
        value: `${order.shipping_city}, ${order.shipping_branch}`,
      },
    ],
    items: order.order_items.map((item) => ({
      name: item.product_name,
      detail: `${item.size ? `Розмір: ${item.size} · ` : ""}Кількість: ${item.quantity}`,
      price: `${formatPrice(item.line_total)} грн`,
      imageUrl: imageFor(item.product_id),
    })),
    totals: [
      { label: "Сума", value: `${formatPrice(order.subtotal)} грн` },
      { label: "Доставка", value: `${formatPrice(order.shipping_cost)} грн` },
      ...(order.discount > 0
        ? [
            {
              label: `Промокод${order.promo_code ? ` ${order.promo_code}` : ""}`,
              value: `−${formatPrice(order.discount)} грн`,
            },
          ]
        : []),
      {
        label: "Разом",
        value: `${formatPrice(order.total)} грн`,
        strong: true,
      },
    ],
    button: {
      href: `${siteUrl}/admin/orders/${order.id}`,
      label: "Відкрити в адмінці",
    },
    siteUrl,
  });
  await sendEmail({
    to: BUSINESS_EMAIL,
    replyTo: order.customer_email || undefined,
    ...notification,
  });

  if (order.customer_email) {
    const message = renderOrderConfirmationEmail(
      {
        ...order,
        items: order.order_items.map((item) => ({
          ...item,
          imageUrl: imageFor(item.product_id),
        })),
      },
      siteUrl,
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
