import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase-server";

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (error) return NextResponse.redirect(new URL("/auth/login?error=auth_callback_failed", request.url));
  }
  return NextResponse.redirect(new URL(code ? "/onboarding" : "/auth/login?error=missing_auth_code", request.url));
}
