import "server-only";
import { createAdminClient } from "@/lib/supabase/server";
import type { ProductRequest } from "@/lib/types";
import type { ProductRequestStatus } from "@/lib/product-request-status-labels";

export async function getAllProductRequestsForAdmin(): Promise<
  ProductRequest[]
> {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("product_requests")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data ?? [];
}

export async function getProductRequestForAdmin(
  id: string,
): Promise<ProductRequest | null> {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("product_requests")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) throw error;
  return data;
}

export async function updateProductRequestStatus(
  id: string,
  status: ProductRequestStatus,
): Promise<void> {
  const supabase = createAdminClient();
  const { error } = await supabase
    .from("product_requests")
    .update({ status })
    .eq("id", id);
  if (error) throw error;
}

export async function deleteProductRequest(id: string): Promise<void> {
  const supabase = createAdminClient();
  const { error } = await supabase
    .from("product_requests")
    .delete()
    .eq("id", id);
  if (error) throw error;
}
