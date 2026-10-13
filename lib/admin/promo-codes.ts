import "server-only";
import { createAdminClient } from "@/lib/supabase/server";
import type { PromoCode } from "@/lib/types";

export async function getAllPromoCodesForAdmin(): Promise<PromoCode[]> {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("promo_codes")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data ?? [];
}

export async function getWelcomePromoCode(): Promise<PromoCode | null> {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("promo_codes")
    .select("*")
    .eq("is_welcome", true)
    .maybeSingle();

  if (error) throw error;
  return data;
}
