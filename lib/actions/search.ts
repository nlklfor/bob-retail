"use server";

import { createPublicClient } from "@/lib/supabase/server";

export type SearchResult = {
  id: string;
  name: string;
  slug: string;
  price: number;
  image: string | null;
};

const RESULT_LIMIT = 6;

function escapeLike(value: string): string {
  return value.replace(/[%_\\]/g, (match) => `\\${match}`);
}

export async function searchProducts(query: string): Promise<SearchResult[]> {
  const trimmed = query.trim();
  if (!trimmed) return [];

  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from("products")
    .select("id, name, slug, price, images")
    .eq("is_active", true)
    .ilike("name", `%${escapeLike(trimmed)}%`)
    .order("name")
    .limit(RESULT_LIMIT);

  if (error) throw error;

  return (data ?? []).map((product) => ({
    id: product.id,
    name: product.name,
    slug: product.slug,
    price: product.price,
    image: product.images?.[0] ?? null,
  }));
}
