import { NextRequest, NextResponse } from "next/server";
import { isAuthorizedBackofficeUser } from "@/lib/backoffice-session";
import { createSupabaseAuthServerClient } from "@/lib/supabase-auth-server";

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const next = requestUrl.searchParams.get("next") ?? "/backoffice";
  const loginUrl = new URL("/backoffice/login", requestUrl.origin);
  const supabase = await createSupabaseAuthServerClient();

  if (!supabase || !code) {
    loginUrl.searchParams.set("error", "oauth_callback_failed");
    return NextResponse.redirect(loginUrl);
  }

  const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);

  if (exchangeError) {
    loginUrl.searchParams.set("error", "oauth_exchange_failed");
    return NextResponse.redirect(loginUrl);
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const email = user?.email?.toLowerCase() ?? null;
  const authorized = await isAuthorizedBackofficeUser(email);

  if (!authorized) {
    await supabase.auth.signOut();
    loginUrl.searchParams.set("unauthorized", "1");

    if (email) {
      loginUrl.searchParams.set("email", email);
    }

    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.redirect(new URL(next, requestUrl.origin));
}
