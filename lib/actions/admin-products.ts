"use server";

import { z } from "zod";
import { redirect } from "next/navigation";
import { requireStaffSession } from "@/lib/admin/dal";
import {
  createProduct,
  updateProduct,
  deleteProduct,
} from "@/lib/admin/products";
import { uploadProductImage } from "@/lib/admin/storage";

const variantSchema = z.object({
  size: z.string().trim().min(1).nullable(),
  stockQuantity: z.number().int().min(0),
});

const productSchema = z.object({
  name: z.string().trim().min(1).max(200),
  slug: z
    .string()
    .trim()
    .min(1)
    .max(200)
    .regex(
      /^[a-z0-9-]+$/,
      "Slug can only contain lowercase letters, numbers, and hyphens",
    ),
  categoryId: z.string().uuid().nullable(),
  description: z.string().trim().nullable(),
  price: z.number().min(0),
  images: z.array(z.string().trim().min(1)),
  isActive: z.boolean(),
  variants: z.array(variantSchema),
});

function parseFormData(formData: FormData) {
  const variants = JSON.parse(String(formData.get("variantsJson") ?? "[]")) as {
    size: string | null;
    stockQuantity: number;
  }[];

  const images = JSON.parse(
    String(formData.get("imagesJson") ?? "[]"),
  ) as string[];

  return productSchema.safeParse({
    name: formData.get("name"),
    slug: formData.get("slug"),
    categoryId: formData.get("categoryId") || null,
    description: formData.get("description") || null,
    price: Number(formData.get("price")),
    images,
    isActive: formData.get("isActive") === "on",
    variants,
  });
}

export async function createProductAction(
  formData: FormData,
): Promise<{ error: string } | void> {
  await requireStaffSession();

  const parsed = parseFormData(formData);
  if (!parsed.success) {
    return {
      error: parsed.error.issues[0]?.message ?? "Invalid product data.",
    };
  }

  const id = await createProduct(parsed.data);
  redirect(`/admin/products/${id}/edit`);
}

export async function updateProductAction(
  id: string,
  formData: FormData,
): Promise<{ error: string } | void> {
  await requireStaffSession();

  const parsed = parseFormData(formData);
  if (!parsed.success) {
    return {
      error: parsed.error.issues[0]?.message ?? "Invalid product data.",
    };
  }

  await updateProduct(id, parsed.data);
  redirect("/admin/products");
}

export async function uploadProductImageAction(
  formData: FormData,
): Promise<{ url: string } | { error: string }> {
  await requireStaffSession();

  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) {
    return { error: "No file provided." };
  }
  if (!file.type.startsWith("image/")) {
    return { error: "Only image files are allowed." };
  }
  if (file.size > 5 * 1024 * 1024) {
    return { error: "Image must be smaller than 5MB." };
  }

  try {
    const url = await uploadProductImage(file);
    return { url };
  } catch {
    return { error: "Upload failed." };
  }
}

export async function deleteProductAction(id: string): Promise<void> {
  await requireStaffSession();
  await deleteProduct(id);
  redirect("/admin/products");
}
