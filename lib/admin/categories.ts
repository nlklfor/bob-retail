import "server-only";
import { createAdminClient } from "@/lib/supabase/server";
import type { Category } from "@/lib/types";

export async function getCategoriesForAdmin(): Promise<Category[]> {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .order("name");

  if (error) throw error;
  return data ?? [];
}

export async function updateCategoryImage(
  id: string,
  imageUrl: string | null,
): Promise<void> {
  const supabase = createAdminClient();
  const { error } = await supabase
    .from("categories")
    .update({ image_url: imageUrl })
    .eq("id", id);

  if (error) throw error;
}
