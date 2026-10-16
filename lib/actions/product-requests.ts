"use server";

import { createAdminClient } from "@/lib/supabase/server";
import { uploadProductRequestImage } from "@/lib/product-requests/storage";
import { sendEmail, BUSINESS_EMAIL } from "@/lib/email";
import { renderNotificationEmail } from "@/lib/email-templates";
import { formatPrice } from "@/lib/format";
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
  const { data: created, error } = await supabase
    .from("product_requests")
    .insert({
      name: data.name || null,
      photos: data.photos,
      size: data.size,
      instagram_handle: data.instagramHandle,
      color: data.color || null,
      material: data.material || null,
      expected_cost: data.expectedCost ?? null,
      link: data.link || null,
      description: data.description || null,
    })
    .select("id")
    .single();

  if (error || !created) {
    return {
      success: false,
      error: "Не вдалося надіслати запит. Спробуйте пізніше.",
    };
  }

  try {
    const siteUrl = process.env.SITE_URL ?? "https://frombobwithlove.com";
    const handle = data.instagramHandle.replace(/^@/, "");
    const notification = renderNotificationEmail({
      subject: `Новий запит на товар${data.name ? `: ${data.name}` : ""}`,
      heading: "Новий запит «Під замовлення»",
      preheader: `${data.name || "Товар"} · розмір ${data.size} · @${handle}`,
      rows: [
        { label: "Товар", value: data.name || "Без назви" },
        { label: "Розмір", value: data.size },
        {
          label: "Instagram",
          value: `@${handle}`,
          // Only a plain handle becomes a profile link.
          href: /^[A-Za-z0-9._]+$/.test(handle)
            ? `https://www.instagram.com/${handle}`
            : undefined,
        },
        { label: "Колір", value: data.color || "" },
        { label: "Матеріал", value: data.material || "" },
        {
          label: "Очікувана вартість",
          value: data.expectedCost
            ? `${formatPrice(data.expectedCost)} грн`
            : "",
        },
        {
          label: "Посилання",
          value: data.link || "",
          href: data.link || undefined,
        },
      ],
      photos: data.photos,
      message: data.description
        ? { label: "Опис", text: data.description }
        : undefined,
      button: {
        href: `${siteUrl}/admin/product-requests/${created.id}`,
        label: "Відкрити в адмінці",
      },
      siteUrl,
    });
    await sendEmail({ to: BUSINESS_EMAIL, ...notification });
  } catch (err) {
    // Same rule as order/contact notifications: the request is already
    // saved — an email hiccup is a side effect, not a reason to report
    // failure to the customer.
    console.error("Failed to send product request notification:", err);
  }

  return { success: true };
}
