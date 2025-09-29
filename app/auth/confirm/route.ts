import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { type NextRequest } from "next/server";

/**
 * Handles the GET request for authentication confirmation.
 * This endpoint is responsible for exchanging an authorization code for a user session.
 * It extracts the code from the URL search parameters, exchanges it with Supabase,
 * and redirects the user to the appropriate page based on the result.
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/";

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      return redirect(next);
    }
  }

  return redirect(next);
}
