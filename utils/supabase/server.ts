
import { createClient as createSupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

// Lightweight server-side client factory. The real `@supabase/ssr` helpers
// provide cookie-aware helpers for auth. If you need that behavior,
// install and use the official Supabase Next.js auth helpers. This fallback
// returns a plain Supabase client that does not manage cookies automatically.
export const createClient = () => {
  return createSupabaseClient(supabaseUrl, supabaseKey);
};
