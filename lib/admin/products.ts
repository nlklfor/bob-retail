import "server-only";
import { createAdminClient } from "@/lib/supabase/server";
import type { ProductWithVariants } from "@/lib/types";

export async function getAllProductsForAdmin(): Promise<ProductWithVariants[]> {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("products")
    .select("*, product_variants(*)")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data as unknown as ProductWithVariants[];
}

export async function getProductForAdmin(
  id: string,
): Promise<ProductWithVariants | null> {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("products")
    .select("*, product_variants(*)")
    .eq("id", id)
    .maybeSingle();

  if (error) throw error;
  return data as unknown as ProductWithVariants | null;
}

export type ProductInput = {
  name: string;
  slug: string;
  categoryId: string | null;
  description: string | null;
  price: number;
  images: string[];
  isActive: boolean;
  variants: {
    size: string | null;
    stockQuantity: number;
    weightGrams: number;
  }[];
};

export async function createProduct(input: ProductInput): Promise<string> {
  const supabase = createAdminClient();

  const { data: product, error } = await supabase
    .from("products")
    .insert({
      name: input.name,
      slug: input.slug,
      category_id: input.categoryId,
      description: input.description,
      price: input.price,
      images: input.images,
      is_active: input.isActive,
    })
    .select("id")
    .single();

  if (error) throw error;

  if (input.variants.length > 0) {
    const { error: variantError } = await supabase
      .from("product_variants")
      .insert(
        input.variants.map((v) => ({
          product_id: product.id,
          size: v.size,
          stock_quantity: v.stockQuantity,
          weight_grams: v.weightGrams,
        })),
      );
    if (variantError) throw variantError;
  }

  return product.id;
}

export async function updateProduct(
  id: string,
  input: ProductInput,
): Promise<void> {
  const supabase = createAdminClient();

  const { error } = await supabase
    .from("products")
    .update({
      name: input.name,
      slug: input.slug,
      category_id: input.categoryId,
      description: input.description,
      price: input.price,
      images: input.images,
      is_active: input.isActive,
    })
    .eq("id", id);

  if (error) throw error;

  // Simplest correct approach for a low-traffic internal tool: replace the
  // whole variant set rather than diffing it. Not atomic across the two
  // calls, but nothing customer-facing is mid-checkout on an admin edit in
  // this store, and a failed insert just leaves it editable again, not corrupt.
  const { error: deleteError } = await supabase
    .from("product_variants")
    .delete()
    .eq("product_id", id);
  if (deleteError) throw deleteError;

  if (input.variants.length > 0) {
    const { error: variantError } = await supabase
      .from("product_variants")
      .insert(
        input.variants.map((v) => ({
          product_id: id,
          size: v.size,
          stock_quantity: v.stockQuantity,
          weight_grams: v.weightGrams,
        })),
      );
    if (variantError) throw variantError;
  }
}

export async function deleteProduct(id: string): Promise<void> {
  const supabase = createAdminClient();
  const { error } = await supabase.from("products").delete().eq("id", id);
  if (error) throw error;
}
