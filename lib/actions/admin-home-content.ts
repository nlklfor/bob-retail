"use server";

import { z } from "zod";
import { requireStaffSession } from "@/lib/admin/dal";
import { updateHomeFeatureImage } from "@/lib/admin/home-content";

const slotSchema = z.object({
  position: z.number().int().min(1).max(3),
  imageUrl: z.string().trim().min(1).nullable(),
  label: z.string().trim().min(1).max(200).nullable(),
  productId: z.string().uuid().nullable(),
});

export async function updateHomeFeatureImageAction(
  formData: FormData,
): Promise<{ success: true } | { error: string }> {
  await requireStaffSession();

  const parsed = slotSchema.safeParse({
    position: Number(formData.get("position")),
    imageUrl: (formData.get("imageUrl") as string)?.trim() || null,
    label: (formData.get("label") as string)?.trim() || null,
    productId: (formData.get("productId") as string) || null,
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Некоректні дані." };
  }

  await updateHomeFeatureImage(parsed.data.position, {
    imageUrl: parsed.data.imageUrl,
    label: parsed.data.label,
    productId: parsed.data.productId,
  });

  return { success: true };
}
