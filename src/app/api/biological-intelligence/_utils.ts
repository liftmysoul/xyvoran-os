import { NextResponse } from "next/server";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { calculatePillars } from "@/lib/scoring";
import { createClient } from "@/lib/supabase-server";
import { getSupabasePublishableKey, getSupabaseUrl, isSupabaseConfigured, supabaseConfigMessage } from "@/lib/supabase-config";
import { isMissingSchemaError } from "@/lib/supabase-errors";
import { generateBiologicalIntelligence, type BiologicalInsight } from "@/lib/biological-intelligence";
import type { BiomarkerEntry, BiologicalInsightRecord, LabReport, OnboardingData, PillarScore } from "@/types/database";

export async function getIntelligenceClient(request: Request) {
  if (!isSupabaseConfigured()) return { error: NextResponse.json({ error: supabaseConfigMessage() }, { status: 503 }) };
  const supabase = await createClient();
  const { data: cookieAuth, error: cookieAuthError } = await supabase.auth.getUser();
  const bearerToken = request.headers.get("authorization")?.replace(/^Bearer\s+/i, "").trim();
  const useBearerClient = Boolean(!cookieAuth.user && bearerToken);
  const { data: auth, error: authError } =
    useBearerClient && bearerToken ? await supabase.auth.getUser(bearerToken) : { data: cookieAuth, error: cookieAuthError };
  if (authError) return { error: NextResponse.json({ error: `Unable to verify session: ${authError.message}` }, { status: 401 }) };
  if (!auth.user) return { error: NextResponse.json({ error: "Unauthorized." }, { status: 401 }) };
  const dataClient =
    useBearerClient && bearerToken
      ? createSupabaseClient(getSupabaseUrl(), getSupabasePublishableKey(), {
          global: { headers: { Authorization: `Bearer ${bearerToken}` } },
          auth: { persistSession: false, autoRefreshToken: false }
        })
      : supabase;
  return { dataClient, user: auth.user };
}

export async function loadIntelligenceContext(dataClient: Awaited<ReturnType<typeof getIntelligenceClient>>["dataClient"], userId: string) {
  if (!dataClient) throw new Error("Supabase client is unavailable.");
  const [
    { data: onboarding, error: onboardingError },
    { data: latestBiomarkers, error: biomarkerError },
    { data: storedPillars, error: pillarError },
    { data: latestLabReport, error: labError }
  ] = await Promise.all([
    dataClient.from("onboarding_data").select("*").eq("user_id", userId).maybeSingle<OnboardingData>(),
    dataClient.from("biomarker_entries").select("*").eq("user_id", userId).order("created_at", { ascending: false }).limit(1).maybeSingle<BiomarkerEntry>(),
    dataClient.from("pillar_scores").select("pillar,score,status,metrics,suggested_next_action").eq("user_id", userId).returns<Array<{ pillar: PillarScore["pillar"]; score: number; status: string; metrics: string[]; suggested_next_action: string }>>(),
    dataClient.from("lab_reports").select("*").eq("user_id", userId).eq("processing_status", "completed").order("created_at", { ascending: false }).limit(1).maybeSingle<LabReport>()
  ]);
  const readError = onboardingError ?? biomarkerError ?? pillarError ?? labError;
  if (readError) throw new Error(`Unable to load biological intelligence context: ${readError.message}`);
  const calculated = calculatePillars(onboarding ?? null, latestBiomarkers ?? null);
  const pillarByName = new Map(calculated.map((pillar) => [pillar.pillar, pillar]));
  const pillarScores = storedPillars?.length
    ? storedPillars.map((stored) => ({
        ...(pillarByName.get(stored.pillar) ?? calculated[0]),
        pillar: stored.pillar,
        score: stored.score,
        status: stored.status,
        metrics: stored.metrics,
        nextAction: stored.suggested_next_action
      }))
    : calculated;
  return {
    userId,
    onboarding: onboarding ?? null,
    latestBiomarkers: latestBiomarkers ?? null,
    latestLabReport: latestLabReport ?? null,
    pillarScores
  };
}

export function buildIntelligence(context: Awaited<ReturnType<typeof loadIntelligenceContext>>) {
  return generateBiologicalIntelligence(context);
}

export async function readStoredInsights(dataClient: NonNullable<Awaited<ReturnType<typeof getIntelligenceClient>>["dataClient"]>, userId: string) {
  const { data, error } = await dataClient
    .from("biological_insights")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .returns<BiologicalInsightRecord[]>();
  if (error) {
    const hint = isMissingSchemaError(error) ? " Run supabase/phase10_biological_intelligence.sql in Supabase SQL Editor." : "";
    throw new Error(`Unable to load biological insights: ${error.message}.${hint}`);
  }
  return data ?? [];
}

export async function upsertInsights(dataClient: NonNullable<Awaited<ReturnType<typeof getIntelligenceClient>>["dataClient"]>, insights: BiologicalInsight[]) {
  if (!insights.length) return [];
  const payload = insights.map((insight) => ({
    ...insight,
    source_id: insight.source_id ?? null,
    evidence: insight.evidence,
    recommended_actions: insight.recommended_actions
  }));
  const { data, error } = await dataClient
    .from("biological_insights")
    .upsert(payload, { onConflict: "user_id,source_type,insight_type,pillar,title" })
    .select("*")
    .returns<BiologicalInsightRecord[]>();
  if (error) {
    const hint = isMissingSchemaError(error) ? " Run supabase/phase10_biological_intelligence.sql in Supabase SQL Editor." : "";
    throw new Error(`Unable to persist biological insights: ${error.message}.${hint}`);
  }
  return data ?? [];
}
