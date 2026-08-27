"use server";

import { z } from "zod";
import { createAdminClient } from "@/lib/supabase/server";
import { sendEmail, BUSINESS_EMAIL } from "@/lib/email";

const contactSchema = z.object({
  name: z.string().trim().min(1, "Вкажіть ім'я."),
  email: z
    .string()
    .trim()
    .min(1, "Вкажіть email.")
    .email("Введіть коректний email."),
  socialHandle: z.string().trim().max(100).nullable(),
  message: z.string().trim().min(1, "Введіть повідомлення."),
});

export async function sendContactMessageAction(
  formData: FormData,
): Promise<{ success: true } | { success: false; error: string }> {
  const parsed = contactSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    socialHandle: (formData.get("socialHandle") as string)?.trim() || null,
    message: formData.get("message"),
  });

  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues[0]?.message ?? "Перевірте форму.",
    };
  }

  const supabase = createAdminClient();
  const { error } = await supabase.from("contact_messages").insert({
    name: parsed.data.name,
    email: parsed.data.email,
    social_handle: parsed.data.socialHandle,
    message: parsed.data.message,
  });

  if (error) {
    return {
      success: false,
      error: "Не вдалося надіслати повідомлення. Спробуйте пізніше.",
    };
  }

  await sendEmail({
    to: BUSINESS_EMAIL,
    subject: `Нове повідомлення від ${parsed.data.name}`,
    text: [
      `Ім'я: ${parsed.data.name}`,
      `Email: ${parsed.data.email}`,
      parsed.data.socialHandle
        ? `Telegram/Instagram: ${parsed.data.socialHandle}`
        : null,
      "",
      parsed.data.message,
    ]
      .filter((line) => line !== null)
      .join("\n"),
  });

  return { success: true };
}
