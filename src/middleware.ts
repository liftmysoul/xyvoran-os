import { type NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { ageConfirmedValue, ageGateCookieName } from "@/lib/age-gate";
import { getSupabaseAnonKey, getSupabaseUrl, isSupabaseConfigured } from "@/lib/supabase-config";

type CookieToSet = {
  name: string;
  value: string;
  options?: Parameters<NextResponse["cookies"]["set"]>[2];
};

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const ageGateExempt = pathname === "/age-gate" || pathname === "/api/age-verification" || pathname === "/api/language" || pathname === "/api/health";
  const ageConfirmed = request.cookies.get(ageGateCookieName)?.value === ageConfirmedValue;

  if (!ageGateExempt && !ageConfirmed) {
    if (pathname.startsWith("/api/")) {
      return NextResponse.json({ error: "Age verification is required.", ageVerificationRequired: true }, { status: 403 });
    }
    const ageGateUrl = request.nextUrl.clone();
    ageGateUrl.pathname = "/age-gate";
    ageGateUrl.search = "";
    ageGateUrl.searchParams.set("next", `${pathname}${request.nextUrl.search}`);
    return NextResponse.redirect(ageGateUrl);
  }

  let response = NextResponse.next({ request });
  if (!isSupabaseConfigured()) return response;

  const supabase = createServerClient(getSupabaseUrl(), getSupabaseAnonKey(), {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet: CookieToSet[]) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
      }
    }
  });

  await supabase.auth.getUser();
  return response;
}

export const config = {
  runtime: "nodejs",
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"]
};
