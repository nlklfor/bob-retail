"use server";

import { z } from "zod";
import { createAdminClient } from "@/lib/supabase/server";
import { sendEmail, BUSINESS_EMAIL } from "@/lib/email";
import { renderNotificationEmail } from "@/lib/email-templates";

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

  const { name, email, socialHandle, message } = parsed.data;
  const notification = renderNotificationEmail({
    subject: `Нове повідомлення від ${name}`,
    heading: "Нове повідомлення",
    preheader: message.slice(0, 120),
    rows: [
      { label: "Ім'я", value: name },
      { label: "Email", value: email, href: `mailto:${email}` },
      { label: "Telegram/Instagram", value: socialHandle ?? "" },
    ],
    message: { label: "Повідомлення", text: message },
    // There's no admin inbox for contact messages yet, so the useful action
    // is answering — and Reply in Gmail goes to the customer too (replyTo).
    button: {
      href: `mailto:${email}?subject=${encodeURIComponent("Re: ваше повідомлення на frombobwithlove.com")}`,
      label: "Відповісти",
    },
    siteUrl: process.env.SITE_URL ?? "https://frombobwithlove.com",
  });
  await sendEmail({ to: BUSINESS_EMAIL, replyTo: email, ...notification });

  return { success: true };
}
