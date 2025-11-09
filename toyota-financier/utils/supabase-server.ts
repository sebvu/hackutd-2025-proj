import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import type { CookieOptions } from "@supabase/ssr";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export function createServerSupabaseClient() {
  const cookieStore = cookies();
  const cookieOptions: CookieOptions = {
    get: (key) => cookieStore.get(key)?.value,
    set: (key, value, options) => cookieStore.set({ name: key, value, ...options }),
    remove: (key, options) => cookieStore.delete({ name: key, ...options }),
  };

  return createServerClient(url, anon, { cookies: cookieOptions });
}
