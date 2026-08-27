"use server";

import { createAdminClient } from "@/lib/supabase/server";
import { resolveShippingCost } from "@/lib/nova-poshta/pricing";
import { getOrderForAdmin } from "@/lib/admin/orders";
import { sendEmail, BUSINESS_EMAIL } from "@/lib/email";
import { checkoutSchema, type CheckoutInput } from "./checkout-schema";

export type CheckoutResult =
  { success: true; orderId: string } | { success: false; error: string };

export async function placeOrderAction(
  input: CheckoutInput,
): Promise<CheckoutResult> {
  const parsed = checkoutSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: "Некоректні дані замовлення." };
  }

  const {
    customerName,
    customerPhone,
    customerEmail,
    shippingCity,
    shippingCityRef,
    shippingBranch,
    items,
  } = parsed.data;

  // Never trust a client-supplied shipping cost — re-quote it server-side
  // from the real Nova Poshta API, same rule place_order() already applies
  // to price/stock.
  const shippingCost = await resolveShippingCost(shippingCityRef, items);

  const supabase = createAdminClient();

  const { data: orderId, error } = await supabase.rpc("place_order", {
    p_items: items.map((i) => ({
      variant_id: i.variantId,
      quantity: i.quantity,
    })),
    p_customer_name: customerName,
    p_customer_phone: customerPhone,
    p_customer_email: customerEmail || null,
    p_shipping_city: shippingCity,
    p_shipping_branch: shippingBranch,
    p_shipping_cost: shippingCost,
  });

  if (error || !orderId) {
    return {
      success: false,
      error: error?.message ?? "Не вдалося оформити замовлення.",
    };
  }

  // STUB: no real payment provider integrated yet — Monobank is a later phase.
  // This step stands in for what a verified payment webhook would do, and
  // must be replaced with real server-side payment verification before launch.
  const { error: paymentError } = await supabase
    .from("payments")
    .update({ status: "paid" })
    .eq("order_id", orderId);

  if (!paymentError) {
    await supabase
      .from("orders")
      .update({ status: "paid", paid_at: new Date().toISOString() })
      .eq("id", orderId);
  }

  await notifyOrderPlaced(orderId as string, customerEmail || null);

  return { success: true, orderId: orderId as string };
}

async function notifyOrderPlaced(
  orderId: string,
  customerEmail: string | null,
): Promise<void> {
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
    `Разом: ${order.total} грн`,
    "",
    `Отримувач: ${order.customer_name}, ${order.customer_phone}`,
    `Нова Пошта: ${order.shipping_city}, ${order.shipping_branch}`,
  ].join("\n");

  await sendEmail({
    to: BUSINESS_EMAIL,
    subject: `Нове замовлення №${order.id.slice(0, 8)}`,
    text: summary,
  });

  if (customerEmail) {
    await sendEmail({
      to: customerEmail,
      subject: `BOB Retail — замовлення №${order.id.slice(0, 8)} отримано`,
      text: `Дякуємо за замовлення!\n\n${summary}`,
    });
  }
}
