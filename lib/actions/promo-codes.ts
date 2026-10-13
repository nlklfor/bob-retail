"use server";

import { createAdminClient } from "@/lib/supabase/server";
import { normalizePromoCode, type AppliedPromo } from "@/lib/promo-discount";

// Checkout's "Застосувати" button. A preview check only — the code isn't
// reserved here; place_order() re-validates it under a row lock when the
// order is actually placed, so a code that runs out in between still gets
// rejected there with a clear message.
export async function checkPromoCodeAction(
  rawCode: string,
  subtotal: number,
): Promise<
  { success: true; promo: AppliedPromo } | { success: false; error: string }
> {
  const code = normalizePromoCode(rawCode);
  if (!/^[A-Z0-9_-]{3,32}$/.test(code)) {
    return { success: false, error: "Промокод не знайдено." };
  }

  const supabase = createAdminClient();
  const { data: promo, error } = await supabase
    .from("promo_codes")
    .select("code, kind, amount, min_order_amount, usage_limit, times_used")
    .eq("code", code)
    .maybeSingle();

  if (error) {
    return {
      success: false,
      error: "Не вдалося перевірити промокод. Спробуйте пізніше.",
    };
  }
  if (!promo) {
    return { success: false, error: "Промокод не знайдено." };
  }
  if (promo.usage_limit !== null && promo.times_used >= promo.usage_limit) {
    return {
      success: false,
      error: "Цей промокод вже використано максимальну кількість разів.",
    };
  }
  if (promo.min_order_amount !== null && subtotal < promo.min_order_amount) {
    return {
      success: false,
      error: `Промокод діє для замовлень від ${Math.round(promo.min_order_amount)} грн.`,
    };
  }

  return {
    success: true,
    promo: {
      code: promo.code,
      kind: promo.kind,
      amount: promo.amount,
      minOrderAmount: promo.min_order_amount,
    },
  };
}
