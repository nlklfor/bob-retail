"use server";

import { createAdminClient } from "@/lib/supabase/server";
import { uploadProductRequestImage } from "@/lib/product-requests/storage";
import { sendEmail, BUSINESS_EMAIL } from "@/lib/email";
import {
  productRequestSchema,
  type ProductRequestInput,
} from "./product-requests-schema";

export async function uploadProductRequestImageAction(
  formData: FormData,
): Promise<{ url: string } | { error: string }> {
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
    const url = await uploadProductRequestImage(file);
    return { url };
  } catch {
    return { error: "Не вдалося завантажити файл." };
  }
}

export async function submitProductRequestAction(
  input: ProductRequestInput,
): Promise<{ success: true } | { success: false; error: string }> {
  const parsed = productRequestSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues[0]?.message ?? "Перевірте форму.",
    };
  }

  const { data } = parsed;
  const supabase = createAdminClient();
  const { error } = await supabase.from("product_requests").insert({
    name: data.name || null,
    photos: data.photos,
    size: data.size,
    instagram_handle: data.instagramHandle,
    color: data.color || null,
    material: data.material || null,
    expected_cost: data.expectedCost ?? null,
    link: data.link || null,
    description: data.description || null,
  });

  if (error) {
    return {
      success: false,
      error: "Не вдалося надіслати запит. Спробуйте пізніше.",
    };
  }

  try {
    await sendEmail({
      to: BUSINESS_EMAIL,
      subject: `Новий запит на товар${data.name ? `: ${data.name}` : ""}`,
      text: [
        data.name ? `Назва: ${data.name}` : null,
        `Розмір: ${data.size}`,
        `Instagram: ${data.instagramHandle}`,
        data.color ? `Колір: ${data.color}` : null,
        data.material ? `Матеріал: ${data.material}` : null,
        data.expectedCost
          ? `Очікувана вартість: ${data.expectedCost} грн`
          : null,
        data.link ? `Посилання: ${data.link}` : null,
        data.description ? `\n${data.description}` : null,
        `\nФото: ${data.photos.join(", ")}`,
      ]
        .filter((line) => line !== null)
        .join("\n"),
    });
  } catch (err) {
    // Same rule as order/contact notifications: the request is already
    // saved — an email hiccup is a side effect, not a reason to report
    // failure to the customer.
    console.error("Failed to send product request notification:", err);
  }

  return { success: true };
}
