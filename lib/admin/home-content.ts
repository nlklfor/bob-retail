import "server-only";
import { createAdminClient } from "@/lib/supabase/server";
import type { HomeFeatureImage } from "@/lib/types";

export async function getHomeFeatureImagesForAdmin(): Promise<
  HomeFeatureImage[]
> {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("home_feature_images")
    .select("*")
    .order("position");

  if (error) throw error;
  return data ?? [];
}

export type HomeFeatureImageInput = {
  imageUrl: string | null;
  label: string | null;
  productId: string | null;
};

export async function updateHomeFeatureImage(
  position: number,
  input: HomeFeatureImageInput,
): Promise<void> {
  const supabase = createAdminClient();
  const { error } = await supabase
    .from("home_feature_images")
    .update({
      image_url: input.imageUrl,
      label: input.label,
      product_id: input.productId,
    })
    .eq("position", position);

  if (error) throw error;
}
