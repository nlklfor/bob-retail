"use server";

import { z } from "zod";
import { createAdminClient } from "@/lib/supabase/server";

export async function unsubscribeAction(
  token: string,
): Promise<{ success: true } | { success: false; error: string }> {
  if (!z.string().uuid().safeParse(token).success) {
    return { success: false, error: "Посилання для відписки недійсне." };
  }

  // Deleting the row outright rather than flagging it — nothing about an
  // unsubscribed address needs keeping. Deleting an already-removed token
  // is a no-op, so clicking the button twice is still "success".
  const supabase = createAdminClient();
  const { error } = await supabase
    .from("newsletter_subscribers")
    .delete()
    .eq("unsubscribe_token", token);

  if (error) {
    return {
      success: false,
      error: "Не вдалося відписатися. Спробуйте пізніше.",
    };
  }
  return { success: true };
}
