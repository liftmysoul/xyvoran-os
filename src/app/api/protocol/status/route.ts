import { NextResponse } from "next/server";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase-server";
import { getSupabaseAnonKey, getSupabaseUrl, isSupabaseConfigured, supabaseConfigMessage } from "@/lib/supabase-config";
import type { ProtocolStatus } from "@/types/database";

export async function PATCH(request: Request) {
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ error: supabaseConfigMessage() }, { status: 503 });
  }

  const { id, status } = await request.json().catch(() => ({}));
  if (!id || !["active", "completed", "archived"].includes(status)) {
    return NextResponse.json({ error: "Protocol id and valid status are required." }, { status: 400 });
  }

  const supabase = await createClient();
  const { data: cookieAuth, error: cookieAuthError } = await supabase.auth.getUser();
  const bearerToken = request.headers.get("authorization")?.replace(/^Bearer\s+/i, "").trim();
  const useBearerClient = Boolean(!cookieAuth.user && bearerToken);
  const { data: auth, error: authError } =
    useBearerClient && bearerToken ? await supabase.auth.getUser(bearerToken) : { data: cookieAuth, error: cookieAuthError };
  if (authError) return NextResponse.json({ error: `Unable to verify session: ${authError.message}` }, { status: 401 });
  if (!auth.user) return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  const dataClient =
    useBearerClient && bearerToken
      ? createSupabaseClient(getSupabaseUrl(), getSupabaseAnonKey(), {
          global: { headers: { Authorization: `Bearer ${bearerToken}` } },
          auth: { persistSession: false, autoRefreshToken: false }
        })
      : supabase;

  const { error } = await dataClient
    .from("generated_protocols")
    .update({ status: status as ProtocolStatus })
    .eq("id", id)
    .eq("user_id", auth.user.id);

  if (error) return NextResponse.json({ error: `Unable to update protocol status: ${error.message}` }, { status: 500 });
  return NextResponse.json({ ok: true });
}
