import type { PromoCodeKind } from "./types";

// What the checkout page knows about an applied code — enough to preview
// the discount. The authoritative calculation happens in place_order()
// (same formula), so this is display-only.
export type AppliedPromo = {
  code: string;
  kind: PromoCodeKind;
  amount: number | null;
  minOrderAmount: number | null;
};

export function normalizePromoCode(input: string): string {
  return input.trim().toUpperCase();
}

// Mirrors place_order(): free delivery zeroes the shipping, a fixed amount
// comes off the goods but never below zero for them.
export function calcPromoDiscount(
  promo: AppliedPromo,
  subtotal: number,
  shippingCost: number,
): number {
  if (promo.minOrderAmount !== null && subtotal < promo.minOrderAmount) {
    return 0;
  }
  if (promo.kind === "free_shipping") return shippingCost;
  return Math.min(promo.amount ?? 0, subtotal);
}

export function describePromo(promo: {
  kind: PromoCodeKind;
  amount: number | null;
}): string {
  return promo.kind === "free_shipping"
    ? "безкоштовна доставка"
    : `знижка ${promo.amount} грн`;
}
