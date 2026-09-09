import "server-only";
import { createAdminClient } from "@/lib/supabase/server";
import type { PriceOffer } from "@/lib/types";
import type { PriceOfferStatus } from "@/lib/price-offer-status-labels";

export async function getAllPriceOffersForAdmin(): Promise<PriceOffer[]> {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("price_offers")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data ?? [];
}

export async function getPriceOfferForAdmin(
  id: string,
): Promise<PriceOffer | null> {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("price_offers")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) throw error;
  return data;
}

export async function updatePriceOfferStatus(
  id: string,
  status: PriceOfferStatus,
): Promise<void> {
  const supabase = createAdminClient();
  const { error } = await supabase
    .from("price_offers")
    .update({ status })
    .eq("id", id);
  if (error) throw error;
}

export async function deletePriceOffer(id: string): Promise<void> {
  const supabase = createAdminClient();
  const { error } = await supabase.from("price_offers").delete().eq("id", id);
  if (error) throw error;
}
