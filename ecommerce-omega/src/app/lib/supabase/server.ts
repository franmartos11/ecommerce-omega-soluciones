import { createClient } from "@supabase/supabase-js";

/** Server-side Supabase client for API routes.
 *  Initialised lazily (inside request handlers) so Next.js
 *  build can collect page data without crashing. */
export function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

/** 
 * Admin-only server-side Supabase client.
 * Uses the Service Role Key to bypass RLS. Only use in protected /api/admin routes.
 */
export function getSupabaseAdmin() {
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error("Missing SUPABASE_SERVICE_ROLE_KEY. Por favor agregala en tu archivo .env.local");
  }
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );
}
