import "server-only";
import { createAdminClient } from "@/lib/supabase/server";
import { calculateDeliveryCost, getSenderCityRef } from "./client";

const MIN_WEIGHT_KG = 0.1;

// Used only if a variant is missing from the query results entirely (e.g.
// deleted mid-checkout) — real weight normally comes from product_variants.weight_grams.
const FALLBACK_WEIGHT_GRAMS = 500;

// Flat fallback used only when the sender city isn't configured yet, or the
// Nova Poshta API call fails — keeps checkout usable instead of blocking it.
const SHIPPING_COST_FALLBACK = 80;

export type CheckoutLineItem = { variantId: string; quantity: number };

// Computes a real Nova Poshta shipping quote for the given recipient city
// and cart contents. Always re-derives prices/weights from the database —
// never trusts client-supplied amounts, same rule the rest of checkout follows.
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
    .select("id, weight_grams, products(price)")
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
  const weightGramsByVariant = new Map(
    variants.map((v) => [v.id, v.weight_grams as number]),
  );

  const declaredValue = items.reduce(
    (sum, i) => sum + (priceByVariant.get(i.variantId) ?? 0) * i.quantity,
    0,
  );
  const totalWeightGrams = items.reduce(
    (sum, i) =>
      sum +
      (weightGramsByVariant.get(i.variantId) ?? FALLBACK_WEIGHT_GRAMS) *
        i.quantity,
    0,
  );
  const weightKg = Math.max(totalWeightGrams / 1000, MIN_WEIGHT_KG);

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
