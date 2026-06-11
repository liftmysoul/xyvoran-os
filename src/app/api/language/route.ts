import { NextResponse } from "next/server";
import { languageCookieName, normalizeLanguage } from "@/lib/i18n";
import { createClient } from "@/lib/supabase-server";

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  if (body.language !== "en" && body.language !== "es") return NextResponse.json({ error: "Unsupported language." }, { status: 400 });
  const language = normalizeLanguage(body.language);
  const response = NextResponse.json({ language });
  response.cookies.set(languageCookieName, language, { path: "/", maxAge: 60 * 60 * 24 * 365, sameSite: "lax", secure: process.env.NODE_ENV === "production" });

  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();
  if (data.user) {
    const { error } = await supabase.from("profiles").upsert({ id: data.user.id, email: data.user.email, language_preference: language }, { onConflict: "id" });
    if (error && !error.message.toLowerCase().includes("column")) return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return response;
}

