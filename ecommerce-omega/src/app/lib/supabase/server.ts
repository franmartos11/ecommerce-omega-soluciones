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
