import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { analyzeLabMarkers } from "@/lib/labs/analyze";
import { extractLabMarkers } from "@/lib/labs/extract";
import { applyLabScoreImpacts, mergeLabsIntoBiomarkers } from "@/lib/labs/integrate";
import { calculatePillars } from "@/lib/scoring";
import { generateBiologicalIntelligence } from "@/lib/biological-intelligence";
import { upsertInsights } from "@/app/api/biological-intelligence/_utils";
import { createClient } from "@/lib/supabase-server";
import { getSupabaseAnonKey, getSupabaseUrl, isSupabaseConfigured, supabaseConfigMessage } from "@/lib/supabase-config";
import type { BiomarkerEntry, LabReport, OnboardingData } from "@/types/database";
import type { Profile } from "@/types/database";
import { getDictionary, normalizeLanguage } from "@/lib/i18n";
import { isMissingSchemaError } from "@/lib/supabase-errors";
import { getServerLanguage } from "@/lib/i18n/server";

export const runtime = "nodejs";
export const maxDuration = 60;

const allowedTypes = new Set(["application/pdf", "image/jpeg", "image/png"]);

export async function POST(request: Request) {
  let language = await getServerLanguage();
  let copy = getDictionary(language);
  if (!isSupabaseConfigured()) return NextResponse.json({ error: supabaseConfigMessage() }, { status: 503 });
  const supabase = await createClient();
  const { data: cookieAuth } = await supabase.auth.getUser();
  const bearerToken = request.headers.get("authorization")?.replace(/^Bearer\s+/i, "").trim();
  const useBearerClient = Boolean(!cookieAuth.user && bearerToken);
  const { data: auth, error: authError } = useBearerClient ? await supabase.auth.getUser(bearerToken) : await supabase.auth.getUser();
  if (authError || !auth.user) return NextResponse.json({ error: copy.labs.signInUpload }, { status: 401 });
  const dataClient = useBearerClient && bearerToken
    ? createSupabaseClient(getSupabaseUrl(), getSupabaseAnonKey(), {
        global: { headers: { Authorization: `Bearer ${bearerToken}` } },
        auth: { persistSession: false, autoRefreshToken: false }
      })
    : supabase;
  const { data: profile } = await dataClient.from("profiles").select("id,language_preference").eq("id", auth.user.id).maybeSingle<Profile>();
  language = normalizeLanguage(profile?.language_preference ?? language);
  copy = getDictionary(language);

  const form = await request.formData();
  const file = form.get("file");
  if (!(file instanceof File)) return NextResponse.json({ error: copy.labs.chooseFile }, { status: 400 });
  if (!allowedTypes.has(file.type)) return NextResponse.json({ error: copy.labs.unsupportedFile }, { status: 400 });
  if (file.size > 4 * 1024 * 1024) return NextResponse.json({ error: copy.labs.maxFileSize }, { status: 400 });

  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "-");
  const path = `${auth.user.id}/${randomUUID()}-${safeName}`;
  const buffer = Buffer.from(await file.arrayBuffer());
  const { error: uploadError } = await dataClient.storage.from("lab-reports").upload(path, buffer, { contentType: file.type, upsert: false });
  if (uploadError) {
    const hint = uploadError.message.toLowerCase().includes("bucket") ? ` ${copy.labs.missingBucket}` : "";
    return NextResponse.json({ error: `${copy.labs.storeError}: ${uploadError.message}.${hint}` }, { status: 500 });
  }

  const { data: report, error: insertError } = await dataClient
    .from("lab_reports")
    .insert({ user_id: auth.user.id, file_name: file.name, file_type: file.type, file_path: path, processing_status: "processing" })
    .select("*")
    .single<LabReport>();
  if (insertError || !report) {
    await dataClient.storage.from("lab-reports").remove([path]);
    const migrationHint = isMissingSchemaError(insertError) ? ` ${copy.labs.storageError}.` : "";
    return NextResponse.json({ error: `${copy.labs.recordError}: ${insertError?.message ?? copy.common.error}.${migrationHint}` }, { status: 500 });
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
    if (updateError) throw new Error(`${copy.labs.analysisSaveError}: ${updateError.message}`);
    let intelligenceWarning: string | null = null;
    let generatedInsightCount = 0;
    try {
      const [{ data: onboarding }, { data: latestBiomarkers }] = await Promise.all([
        dataClient.from("onboarding_data").select("*").eq("user_id", auth.user.id).maybeSingle<OnboardingData>(),
        dataClient.from("biomarker_entries").select("*").eq("user_id", auth.user.id).order("created_at", { ascending: false }).limit(1).maybeSingle<BiomarkerEntry>()
      ]);
      const scoreBiomarkers = mergeLabsIntoBiomarkers(latestBiomarkers, analysis);
      const pillars = applyLabScoreImpacts(calculatePillars(onboarding ?? null, scoreBiomarkers, language), analysis, language);
      await dataClient.from("pillar_scores").upsert(
        pillars.map((pillar) => ({
          user_id: auth.user.id,
          pillar: pillar.pillar,
          score: pillar.score,
          status: pillar.status,
          metrics: pillar.metrics,
          suggested_next_action: pillar.nextAction
        })),
        { onConflict: "user_id,pillar" }
      );
      const intelligence = generateBiologicalIntelligence({
        userId: auth.user.id,
        onboarding: onboarding ?? null,
        latestBiomarkers: scoreBiomarkers,
        latestLabReport: completed,
        pillarScores: pillars
      });
      generatedInsightCount = intelligence.insights.length;
      await upsertInsights(dataClient, intelligence.insights);
    } catch (syncError) {
      intelligenceWarning = syncError instanceof Error ? syncError.message : "Lab intelligence synchronization failed.";
    }
    return NextResponse.json({ report: completed, intelligence: { generatedInsightCount }, warning: intelligenceWarning });
  } catch (error) {
    const message = error instanceof Error ? error.message : copy.labs.extractionFailed;
    await dataClient.from("lab_reports").update({ processing_status: "failed", analysis_json: { error: message } }).eq("id", report.id).eq("user_id", auth.user.id);
    return NextResponse.json({ error: message }, { status: 422 });
  }
}
