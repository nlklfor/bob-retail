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
  stockQuantity: z.number().int().min(0, "Залишок не може бути від'ємним"),
  weightGrams: z.number().int().min(1, "Вкажіть вагу більшу за 0"),
});

const productSchema = z.object({
  name: z.string().trim().min(1, "Вкажіть назву товару").max(200),
  slug: z
    .string()
    .trim()
    .min(1, "Вкажіть слаг")
    .max(200)
    .regex(
      /^[a-z0-9-]+$/,
      "Слаг може містити лише латинські малі літери, цифри та дефіси",
    ),
  sku: z.string().trim().max(100).nullable(),
  categoryId: z.string().uuid().nullable(),
  description: z.string().trim().nullable(),
  price: z.number().min(0, "Ціна не може бути від'ємною"),
  images: z.array(z.string().trim().min(1)),
  isActive: z.boolean(),
  variants: z.array(variantSchema),
});

// Postgres unique-violation errors (23505) come through with the
// constraint name embedded in the message, e.g. `duplicate key value
// violates unique constraint "products_slug_key"` — used to point the
// admin at which field actually collided instead of a raw DB error.
function friendlyProductError(err: unknown): string {
  if (
    err &&
    typeof err === "object" &&
    "code" in err &&
    (err as { code?: unknown }).code === "23505"
  ) {
    const message =
      "message" in err ? String((err as { message: unknown }).message) : "";
    if (message.includes("slug")) {
      return "Товар із таким слагом вже існує. Вкажіть інший.";
    }
    if (message.includes("sku")) {
      return "Товар із таким артикулом (SKU) вже існує. Вкажіть інший або залиште поле порожнім.";
    }
    return "Товар із такими даними вже існує.";
  }
  return "Не вдалося зберегти товар. Спробуйте ще раз.";
}

function parseFormData(formData: FormData) {
  const variants = JSON.parse(String(formData.get("variantsJson") ?? "[]")) as {
    size: string | null;
    stockQuantity: number;
    weightGrams: number;
  }[];

  const images = JSON.parse(
    String(formData.get("imagesJson") ?? "[]"),
  ) as string[];

  return productSchema.safeParse({
    name: formData.get("name"),
    slug: formData.get("slug"),
    sku: (formData.get("sku") as string)?.trim() || null,
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
      error: parsed.error.issues[0]?.message ?? "Некоректні дані товару.",
    };
  }

  try {
    await createProduct(parsed.data);
  } catch (err) {
    return { error: friendlyProductError(err) };
  }
  // Back to the list, not the new product's own edit page — closes out
  // the "add product" flow instead of dropping the admin into another
  // form to review/edit what they just filled in.
  redirect("/admin/products?created=1");
}

export async function updateProductAction(
  id: string,
  formData: FormData,
): Promise<{ error: string } | void> {
  await requireStaffSession();

  const parsed = parseFormData(formData);
  if (!parsed.success) {
    return {
      error: parsed.error.issues[0]?.message ?? "Некоректні дані товару.",
    };
  }

  try {
    await updateProduct(id, parsed.data);
  } catch (err) {
    return { error: friendlyProductError(err) };
  }
  redirect("/admin/products?updated=1");
}

export async function uploadProductImageAction(
  formData: FormData,
): Promise<{ url: string } | { error: string }> {
  await requireStaffSession();

  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) {
    return { error: "Файл не надано." };
  }
  if (!file.type.startsWith("image/")) {
    return { error: "Дозволені лише файли зображень." };
  }
  if (file.size > 5 * 1024 * 1024) {
    return { error: "Розмір зображення не повинен перевищувати 5МБ." };
  }

  try {
    const url = await uploadProductImage(file);
    return { url };
  } catch {
    return { error: "Не вдалося завантажити файл." };
  }
}

export async function deleteProductAction(id: string): Promise<void> {
  await requireStaffSession();
  try {
    await deleteProduct(id);
  } catch {
    redirect("/admin/products?deleteError=1");
  }
  redirect("/admin/products?deleted=1");
}
