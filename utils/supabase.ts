import { createClient } from "@supabase/supabase-js";

// Create a single Supabase client for both client and server side
export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);
