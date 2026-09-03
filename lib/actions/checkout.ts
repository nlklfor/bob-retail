"use server";

import { createAdminClient } from "@/lib/supabase/server";
import { resolveShippingCost } from "@/lib/nova-poshta/pricing";
import { getOrderForAdmin } from "@/lib/admin/orders";
import { createInvoice } from "@/lib/monobank/client";
import { checkoutSchema, type CheckoutInput } from "./checkout-schema";

export type CheckoutResult =
  | { success: true; orderId: string; paymentUrl: string }
  | { success: false; error: string };

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

  // The order is created and stock is already decremented at this point —
  // everything from here is about getting the customer to a real Monobank
  // payment page. If that fails, the order is left as pending_payment
  // (same state a genuinely abandoned payment would also leave it in);
  // there is no separate "cancel the order" step here.
  const order = await getOrderForAdmin(orderId as string);
  if (!order) {
    return {
      success: false,
      error: "Замовлення створено, але не вдалося його завантажити.",
    };
  }

  const siteUrl = process.env.SITE_URL;
  if (!siteUrl) {
    console.error("SITE_URL is not configured — cannot start a real payment.");
    return {
      success: false,
      error: "Оплата тимчасово недоступна. Спробуйте пізніше.",
    };
  }

  try {
    const invoice = await createInvoice({
      amount: Math.round(order.total * 100),
      reference: order.id,
      destination: `Оплата замовлення №${order.id.slice(0, 8).toUpperCase()}`,
      basketOrder: order.order_items.map((item) => ({
        name: `${item.product_name}${item.size ? ` (${item.size})` : ""}`,
        qty: item.quantity,
        sum: Math.round(item.unit_price * 100),
        unit: "шт",
      })),
      redirectUrl: `${siteUrl}/order/${order.id}`,
      webHookUrl: `${siteUrl}/api/webhooks/monobank`,
    });

    await supabase
      .from("payments")
      .update({ provider: "monobank", external_reference: invoice.invoiceId })
      .eq("order_id", order.id);

    return { success: true, orderId: order.id, paymentUrl: invoice.pageUrl };
  } catch (err) {
    console.error("Failed to create Monobank invoice:", err);
    return {
      success: false,
      error: "Не вдалося ініціювати оплату. Спробуйте ще раз.",
    };
  }
}
