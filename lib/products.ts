import { createPublicClient } from "./supabase/server";
import type { Category, ProductWithVariants } from "./types";

export async function getActiveProducts(): Promise<ProductWithVariants[]> {
  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from("products")
    .select("*, product_variants(*)")
    .eq("is_active", true)
    .order("created_at", { ascending: false });

  if (error) throw error;
  // The client isn't wired to the generated schema types (see lib/types.ts),
  // so we assert the shape here based on the select() above.
  return data as unknown as ProductWithVariants[];
}

export async function getProductBySlug(
  slug: string,
): Promise<ProductWithVariants | null> {
  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from("products")
    .select("*, product_variants(*)")
    .eq("slug", slug)
    .eq("is_active", true)
    .maybeSingle();

  if (error) throw error;
  return data as unknown as ProductWithVariants | null;
}

export async function getCategories(): Promise<Category[]> {
  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .order("name");

  if (error) throw error;
  return data ?? [];
}
