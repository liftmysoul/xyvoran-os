import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { analyzeLabMarkers } from "@/lib/labs/analyze";
import { extractLabMarkers } from "@/lib/labs/extract";
import { createClient } from "@/lib/supabase-server";
import { getSupabaseAnonKey, getSupabaseUrl, isSupabaseConfigured, supabaseConfigMessage } from "@/lib/supabase-config";
import type { LabReport } from "@/types/database";
import type { Profile } from "@/types/database";
import { normalizeLanguage } from "@/lib/i18n";
import { getServerLanguage } from "@/lib/i18n/server";

export const runtime = "nodejs";
export const maxDuration = 60;

const allowedTypes = new Set(["application/pdf", "image/jpeg", "image/png"]);

export async function POST(request: Request) {
  if (!isSupabaseConfigured()) return NextResponse.json({ error: supabaseConfigMessage() }, { status: 503 });
  const supabase = await createClient();
  const { data: cookieAuth } = await supabase.auth.getUser();
  const bearerToken = request.headers.get("authorization")?.replace(/^Bearer\s+/i, "").trim();
  const useBearerClient = Boolean(!cookieAuth.user && bearerToken);
  const { data: auth, error: authError } = useBearerClient ? await supabase.auth.getUser(bearerToken) : await supabase.auth.getUser();
  if (authError || !auth.user) return NextResponse.json({ error: "Sign in before uploading bloodwork." }, { status: 401 });
  const dataClient = useBearerClient && bearerToken
    ? createSupabaseClient(getSupabaseUrl(), getSupabaseAnonKey(), {
        global: { headers: { Authorization: `Bearer ${bearerToken}` } },
        auth: { persistSession: false, autoRefreshToken: false }
      })
    : supabase;
  const { data: profile } = await dataClient.from("profiles").select("id,language_preference").eq("id", auth.user.id).maybeSingle<Profile>();
  const language = normalizeLanguage(profile?.language_preference ?? await getServerLanguage());

  const form = await request.formData();
  const file = form.get("file");
  if (!(file instanceof File)) return NextResponse.json({ error: "Choose a PDF, JPG, JPEG, or PNG lab report." }, { status: 400 });
  if (!allowedTypes.has(file.type)) return NextResponse.json({ error: "Unsupported file type. Upload PDF, JPG, JPEG, or PNG." }, { status: 400 });
  if (file.size > 4 * 1024 * 1024) return NextResponse.json({ error: "Lab reports must be 4 MB or smaller for production uploads." }, { status: 400 });

  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "-");
  const path = `${auth.user.id}/${randomUUID()}-${safeName}`;
  const buffer = Buffer.from(await file.arrayBuffer());
  const { error: uploadError } = await dataClient.storage.from("lab-reports").upload(path, buffer, { contentType: file.type, upsert: false });
  if (uploadError) {
    const hint = uploadError.message.toLowerCase().includes("bucket") ? " Run supabase/phase5_labs_migration.sql in the Supabase SQL Editor." : "";
    return NextResponse.json({ error: `Unable to store lab report: ${uploadError.message}.${hint}` }, { status: 500 });
  }

  const { data: report, error: insertError } = await dataClient
    .from("lab_reports")
    .insert({ user_id: auth.user.id, file_name: file.name, file_type: file.type, file_path: path, processing_status: "processing" })
    .select("*")
    .single<LabReport>();
  if (insertError || !report) {
    await dataClient.storage.from("lab-reports").remove([path]);
    return NextResponse.json({ error: `Unable to create lab report record: ${insertError?.message ?? "Unknown database error"}. Run supabase/phase5_labs_migration.sql if needed.` }, { status: 500 });
  }

  try {
    const biomarkers = await extractLabMarkers(buffer, file.type);
    const analysis = analyzeLabMarkers(biomarkers, language);
    const { data: completed, error: updateError } = await dataClient
      .from("lab_reports")
      .update({ processing_status: "completed", analysis_json: analysis })
      .eq("id", report.id)
      .eq("user_id", auth.user.id)
      .select("*")
      .single<LabReport>();
    if (updateError) throw new Error(`Analysis completed but could not be saved: ${updateError.message}`);
    return NextResponse.json({ report: completed });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Lab extraction failed.";
    await dataClient.from("lab_reports").update({ processing_status: "failed", analysis_json: { error: message } }).eq("id", report.id).eq("user_id", auth.user.id);
    return NextResponse.json({ error: message }, { status: 422 });
  }
}
