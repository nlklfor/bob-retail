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
  const pattern = `%${escapeLike(trimmed)}%`;

  // Two separate queries (name, sku) merged in JS rather than a single
  // .or() filter — PostgREST's or() mini-language treats commas/parens in
  // the filter string specially, which a raw user-typed query could
  // contain; this sidesteps that instead of trying to escape around it.
  const [byName, bySku] = await Promise.all([
    supabase
      .from("products")
      .select("id, name, slug, price, images")
      .eq("is_active", true)
      .ilike("name", pattern)
      .order("name")
      .limit(RESULT_LIMIT),
    supabase
      .from("products")
      .select("id, name, slug, price, images")
      .eq("is_active", true)
      .ilike("sku", pattern)
      .order("name")
      .limit(RESULT_LIMIT),
  ]);

  if (byName.error) throw byName.error;
  if (bySku.error) throw bySku.error;

  const merged = new Map<string, SearchResult>();
  for (const product of [...(byName.data ?? []), ...(bySku.data ?? [])]) {
    if (!merged.has(product.id)) {
      merged.set(product.id, {
        id: product.id,
        name: product.name,
        slug: product.slug,
        price: product.price,
        image: product.images?.[0] ?? null,
      });
    }
  }

  return Array.from(merged.values()).slice(0, RESULT_LIMIT);
}
