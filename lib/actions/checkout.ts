"use server";

import { z } from "zod";
import { createAdminClient } from "@/lib/supabase/server";
import { resolveShippingCost } from "@/lib/nova-poshta/pricing";

const checkoutSchema = z.object({
  customerName: z.string().min(1).max(200),
  customerPhone: z.string().min(5).max(30),
  customerEmail: z.string().email().optional().or(z.literal("")),
  shippingCity: z.string().min(1).max(200),
  shippingCityRef: z.string().min(1),
  shippingBranch: z.string().min(1).max(200),
  shippingWarehouseRef: z.string().min(1),
  items: z
    .array(
      z.object({
        variantId: z.string().uuid(),
        quantity: z.number().int().min(1).max(20),
      }),
    )
    .min(1),
});

export type CheckoutInput = z.infer<typeof checkoutSchema>;

export type CheckoutResult =
  { success: true; orderId: string } | { success: false; error: string };

export async function placeOrderAction(
  input: CheckoutInput,
): Promise<CheckoutResult> {
  const parsed = checkoutSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: "Invalid checkout details." };
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
      error: error?.message ?? "Could not place order.",
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

  return { success: true, orderId: orderId as string };
}
