"use server";

import { z } from "zod";
import { createAdminClient } from "@/lib/supabase/server";

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

  const supabase = createAdminClient();
  const { error } = await supabase
    .from("newsletter_subscribers")
    .insert({ email: parsed.data.toLowerCase() });

  // Unique violation just means they're already subscribed — treat as success.
  if (error && error.code !== "23505") {
    return {
      success: false,
      error: "Не вдалося підписатися. Спробуйте пізніше.",
    };
  }

  return { success: true };
}
