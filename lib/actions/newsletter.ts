"use server";

import { z } from "zod";
import { createAdminClient } from "@/lib/supabase/server";
import { sendEmail } from "@/lib/email";
import { getWelcomePromoCode } from "@/lib/admin/promo-codes";
import { renderWelcomeEmail } from "@/lib/email-templates";

const emailSchema = z.string().trim().min(1).email("Введіть коректний email.");

export async function subscribeAction(
  formData: FormData,
): Promise<{ success: true } | { success: false; error: string }> {
  const parsed = emailSchema.safeParse(formData.get("email"));
  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues[0]?.message ?? "Введіть коректний email.",
    };
  }

  const email = parsed.data.toLowerCase();
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("newsletter_subscribers")
    .insert({ email })
    .select("unsubscribe_token")
    .single();

  // Unique violation just means they're already subscribed — treat as
  // success, and don't re-send the welcome email (no spamming someone who
  // types their address in twice).
  if (error) {
    if (error.code === "23505") return { success: true };
    return {
      success: false,
      error: "Не вдалося підписатися. Спробуйте пізніше.",
    };
  }

  await sendWelcomeEmail(email, data.unsubscribe_token);
  return { success: true };
}

async function sendWelcomeEmail(
  email: string,
  unsubscribeToken: string,
): Promise<void> {
  const siteUrl = process.env.SITE_URL ?? "";
  const unsubscribeUrl = `${siteUrl}/unsubscribe?token=${unsubscribeToken}`;

  let promo: Awaited<ReturnType<typeof getWelcomePromoCode>> = null;
  try {
    promo = await getWelcomePromoCode();
  } catch (err) {
    // The subscription is already saved — a failed promo lookup just means
    // the welcome email goes out without a code, not that it fails.
    console.error("Failed to load welcome promo code:", err);
  }

  const message = renderWelcomeEmail({ siteUrl, unsubscribeUrl, promo });
  await sendEmail({ to: email, ...message, unsubscribeUrl });
}
