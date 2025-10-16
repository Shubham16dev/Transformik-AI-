import { createClient } from "@supabase/supabase-js";

/**
 * Server-side Supabase client for data fetching in Server Components
 * Uses the same public credentials but marks it for server-side usage
 */
export const supabaseServer = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  {
    auth: {
      persistSession: false, // Don't persist sessions on the server
    },
  }
);
