import { createServerClient } from "@supabase/ssr";
import type { CookieOptions } from "@supabase/ssr";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

/**
 * Creates a Supabase server client safely for API routes or server actions.
 * No cookies() dependency (avoids runtime errors).
 */
export function createServerSupabaseClient() {
  const cookieOptions: CookieOptions = {
    get: () => undefined,
    set: () => {},
    remove: () => {},
  };

  return createServerClient(url, anon, { cookies: cookieOptions });
}
