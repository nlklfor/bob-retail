import "server-only";
import { cache } from "react";
import { redirect } from "next/navigation";
import { createAuthClient } from "@/lib/supabase/auth";

// There's no public signup and no role table: the only way a Supabase Auth
// user exists at all is because staff created it manually (Supabase dashboard).
// So "has a valid session" already means "is staff" — nothing else to check.
export const requireStaffSession = cache(async () => {
  const supabase = await createAuthClient();
  const { data, error } = await supabase.auth.getUser();

  if (error || !data.user) {
    redirect("/admin/login");
  }

  return data.user;
});
