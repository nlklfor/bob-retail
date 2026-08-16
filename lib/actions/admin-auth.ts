"use server";

import { redirect } from "next/navigation";
import { createAuthClient } from "@/lib/supabase/auth";

export async function signInAction(
  formData: FormData,
): Promise<{ error: string } | void> {
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");

  if (!email || !password) {
    return { error: "Введіть email і пароль." };
  }

  const supabase = await createAuthClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    return { error: "Невірний email або пароль." };
  }

  redirect("/admin");
}

export async function signOutAction() {
  const supabase = await createAuthClient();
  await supabase.auth.signOut();
  redirect("/admin/login");
}
