import "server-only";
import { createAdminClient } from "@/lib/supabase/server";
import { calculateDeliveryCost, getSenderCityRef } from "./client";

// Placeholder average weight per garment (kg) — used only as the Weight
// input to Nova Poshta's price calculation. Real per-variant weights don't
// exist in the schema yet (see docs/project-status.md). Tune this constant
// if quoted costs look off; replacing it with real weights is a later
// migration, not a blocker for having real distance-based pricing now.
const WEIGHT_PER_ITEM_KG = 0.5;
const MIN_WEIGHT_KG = 0.1;

// Flat fallback used only when the sender city isn't configured yet, or the
// Nova Poshta API call fails — keeps checkout usable instead of blocking it.
const SHIPPING_COST_FALLBACK = 80;

export type CheckoutLineItem = { variantId: string; quantity: number };

// Computes a real Nova Poshta shipping quote for the given recipient city
// and cart contents. Always re-derives prices from the database — never
// trusts client-supplied amounts, same rule the rest of checkout follows.
export async function resolveShippingCost(
  cityRecipientRef: string,
  items: CheckoutLineItem[],
): Promise<number> {
  const senderCityRef = await getSenderCityRef();
  if (!senderCityRef) {
    return SHIPPING_COST_FALLBACK;
  }

  const supabase = createAdminClient();
  const variantIds = items.map((i) => i.variantId);
  const { data: variants, error } = await supabase
    .from("product_variants")
    .select("id, products(price)")
    .in("id", variantIds);

  if (error || !variants) {
    return SHIPPING_COST_FALLBACK;
  }

  const priceByVariant = new Map(
    variants.map((v) => [
      v.id,
      (v.products as unknown as { price: number } | null)?.price ?? 0,
    ]),
  );
  const declaredValue = items.reduce(
    (sum, i) => sum + (priceByVariant.get(i.variantId) ?? 0) * i.quantity,
    0,
  );
  const totalQuantity = items.reduce((sum, i) => sum + i.quantity, 0);
  const weightKg = Math.max(totalQuantity * WEIGHT_PER_ITEM_KG, MIN_WEIGHT_KG);

  try {
    return await calculateDeliveryCost({
      citySenderRef: senderCityRef,
      cityRecipientRef,
      weightKg,
      declaredValue: Math.max(declaredValue, 1),
    });
  } catch {
    return SHIPPING_COST_FALLBACK;
  }
}
