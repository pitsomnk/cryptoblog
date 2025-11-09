
import { NextResponse } from "next/server";

// NOTE: The project previously used `@supabase/ssr` helpers here. To avoid
// a hard dependency when the helpers aren't installed, provide a lightweight
// fallback that returns an unmodified NextResponse. If you'd like full
// Supabase server-side cookie handling, install and use the official
// Supabase Next helpers (for example `@supabase/auth-helpers-nextjs` or the
// current recommended package) and restore the original implementation.

export const createClient = () => {
  return NextResponse.next();
};
