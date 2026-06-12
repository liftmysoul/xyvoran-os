import { NextResponse } from "next/server";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { getSupabaseAnonKey, getSupabaseProjectRef, getSupabaseUrl, isSupabaseConfigured } from "@/lib/supabase-config";

export const dynamic = "force-dynamic";

export async function GET() {
  const supabaseConfigured = isSupabaseConfigured();
  let phase7Schema = false;
  let phase8Schema = false;

  if (supabaseConfigured) {
    const supabase = createSupabaseClient(getSupabaseUrl(), getSupabaseAnonKey(), { auth: { persistSession: false } });
    const [{ error: phase7Error }, { error: profileError }, { error: membershipError }, { error: consentError }] = await Promise.all([
      supabase.from("profiles").select("language_preference").limit(1),
      supabase.from("profiles").select("member_id,first_name,last_name,date_of_birth").limit(1),
      supabase.from("memberships").select("status,join_date").limit(1),
      supabase.from("member_consents").select("consent_version").limit(1)
    ]);
    phase7Schema = !phase7Error;
    phase8Schema = ![profileError, membershipError, consentError].some(Boolean);
  }

  const checks = {
    app: true,
    supabase: supabaseConfigured,
    phase7Schema,
    phase8Schema,
    openai: Boolean(process.env.OPENAI_API_KEY?.trim())
  };
  const healthy = Object.values(checks).every(Boolean);
  return NextResponse.json(
    { status: healthy ? "ok" : "configuration_required", projectRef: supabaseConfigured ? getSupabaseProjectRef() : null, checks },
    { status: healthy ? 200 : 503, headers: { "Cache-Control": "no-store" } }
  );
}
