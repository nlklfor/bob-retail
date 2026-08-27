"use server";

import { z } from "zod";
import { requireStaffSession } from "@/lib/admin/dal";
import { updateCategoryImage } from "@/lib/admin/categories";

const inputSchema = z.object({
  id: z.string().uuid(),
  imageUrl: z.string().trim().min(1).nullable(),
});

export async function updateCategoryImageAction(
  formData: FormData,
): Promise<{ success: true } | { error: string }> {
  await requireStaffSession();

  const parsed = inputSchema.safeParse({
    id: formData.get("id"),
    imageUrl: (formData.get("imageUrl") as string)?.trim() || null,
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Некоректні дані." };
  }

  await updateCategoryImage(parsed.data.id, parsed.data.imageUrl);
  return { success: true };
}
