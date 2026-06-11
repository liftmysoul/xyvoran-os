import { NextResponse } from "next/server";
import { isSupabaseConfigured } from "@/lib/supabase-config";

export const dynamic = "force-dynamic";

export async function GET() {
  const checks = {
    app: true,
    supabase: isSupabaseConfigured(),
    openai: Boolean(process.env.OPENAI_API_KEY?.trim())
  };
  const healthy = Object.values(checks).every(Boolean);
  return NextResponse.json(
    { status: healthy ? "ok" : "configuration_required", checks },
    { status: healthy ? 200 : 503, headers: { "Cache-Control": "no-store" } }
  );
}
