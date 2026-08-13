import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

// Session-aware client for Supabase Auth (admin login only — the storefront
// has no accounts). Uses the anon key; RLS still applies to anything queried
// through this client, same as createPublicClient.
export async function createAuthClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options),
            );
          } catch {
            // Called from a Server Component render — proxy.ts refreshes the
            // session cookie on navigation, so this can be safely ignored.
          }
        },
      },
    },
  );
}
