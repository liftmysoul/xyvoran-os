import { NextResponse } from "next/server";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { generateStructuredProtocol } from "@/lib/protocol";
import { adaptProtocolToMission, generateAdaptiveMission } from "@/lib/adaptive-protocol-engine";
import { calculatePillars } from "@/lib/scoring";
import { applyLabScoreImpacts, mergeLabsIntoBiomarkers } from "@/lib/labs/integrate";
import { generateBiologicalIntelligence } from "@/lib/biological-intelligence";
import { createClient } from "@/lib/supabase-server";
import { getSupabaseAnonKey, getSupabaseUrl, isSupabaseConfigured, supabaseConfigMessage } from "@/lib/supabase-config";
import type { AdaptiveMissionRecord, BiomarkerEntry, BiologicalInsightRecord, ChatMessage, LabReport, OnboardingData, PillarScore, ProtocolIntensity } from "@/types/database";
import type { Profile } from "@/types/database";
import { getDictionary, normalizeLanguage } from "@/lib/i18n";
import { getServerLanguage } from "@/lib/i18n/server";
import { isMissingSchemaError } from "@/lib/supabase-errors";

type StoredPillar = {
  pillar: PillarScore["pillar"];
  score: number;
  status: string;
  metrics: string[];
  suggested_next_action: string;
};

export async function POST(request: Request) {
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ error: supabaseConfigMessage() }, { status: 503 });
  }
  const body = await request.json().catch(() => ({}));
  const requestedIntensity = ["Beginner", "Intermediate", "Advanced"].includes(body?.intensity)
    ? (body.intensity as ProtocolIntensity)
    : undefined;

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

  const [
    { data: profile },
    { data: onboarding, error: onboardingError },
    { data: latestBiomarkers, error: biomarkerError },
    { data: storedPillars, error: pillarsError },
    { data: recentMessages, error: messagesError },
    { data: latestLab, error: labError },
    { data: activeInsights, error: insightsError },
    { data: adaptiveMissions }
  ] = await Promise.all([
    dataClient.from("profiles").select("id,email,language_preference").eq("id", auth.user.id).maybeSingle<Profile>(),
    dataClient.from("onboarding_data").select("*").eq("user_id", auth.user.id).maybeSingle<OnboardingData>(),
    dataClient.from("biomarker_entries").select("*").eq("user_id", auth.user.id).order("created_at", { ascending: false }).limit(1).maybeSingle<BiomarkerEntry>(),
    dataClient.from("pillar_scores").select("pillar,score,status,metrics,suggested_next_action").eq("user_id", auth.user.id).returns<StoredPillar[]>(),
    dataClient.from("ai_chat_messages").select("*").eq("user_id", auth.user.id).order("created_at", { ascending: false }).limit(6).returns<ChatMessage[]>(),
    dataClient.from("lab_reports").select("*").eq("user_id", auth.user.id).eq("processing_status", "completed").order("created_at", { ascending: false }).limit(1).maybeSingle<LabReport>(),
    dataClient.from("biological_insights").select("*").eq("user_id", auth.user.id).eq("status", "active").order("created_at", { ascending: false }).limit(10).returns<BiologicalInsightRecord[]>(),
    dataClient.from("adaptive_missions").select("*").eq("user_id", auth.user.id).is("completed_at", null).order("created_at", { ascending: false }).limit(3).returns<AdaptiveMissionRecord[]>()
  ]);
  const readError = onboardingError ?? biomarkerError ?? pillarsError ?? messagesError ?? labError ?? insightsError;
  if (readError) return NextResponse.json({ error: `Unable to load protocol context: ${readError.message}` }, { status: 500 });

  const language = normalizeLanguage(profile?.language_preference ?? await getServerLanguage());
  const copy = getDictionary(language);
  if (!onboarding) return NextResponse.json({ error: copy.protocols.completeOnboarding }, { status: 400 });
  const scoreBiomarkers = mergeLabsIntoBiomarkers(latestBiomarkers, latestLab?.analysis_json);
  const calculatedPillars = applyLabScoreImpacts(calculatePillars(onboarding, scoreBiomarkers, language), latestLab?.analysis_json, language);
  const pillarByName = new Map(calculatedPillars.map((pillar) => [pillar.pillar, pillar]));
  const pillars = storedPillars?.length
    ? storedPillars.map((pillar) => ({
        ...(pillarByName.get(pillar.pillar) ?? calculatedPillars[0]),
        pillar: pillar.pillar,
        score: pillar.score
      }))
    : calculatedPillars;

  const intelligence = generateBiologicalIntelligence({
    userId: auth.user.id,
    onboarding,
    latestBiomarkers: scoreBiomarkers,
    latestLabReport: latestLab ?? null,
    pillarScores: pillars
  });

  const adaptiveMission = generateAdaptiveMission({
    userId: auth.user.id,
    onboarding,
    latestBiomarkers: scoreBiomarkers,
    latestLabReport: latestLab ?? null,
    previousLabReports: latestLab ? [latestLab] : [],
    pillarScores: pillars,
    biologicalInsights: activeInsights ?? [],
    biologicalIntelligence: intelligence.summary,
    previousProtocols: [],
    previousMissions: adaptiveMissions ?? []
  });

  const protocol = adaptProtocolToMission(generateStructuredProtocol({
    onboarding,
    biomarkers: scoreBiomarkers,
    pillars,
    recentMessages: (recentMessages ?? []).reverse(),
    biologicalInsights: activeInsights ?? [],
    intelligenceSummary: intelligence.summary,
    requestedIntensity,
    language
  }), adaptiveMission);

  const insertPayload = {
    user_id: auth.user.id,
    title: protocol.title,
    goal: protocol.primaryGoal,
    weakest_pillar: protocol.weakestPillar,
    intensity: protocol.intensity,
    protocol_json: protocol,
    protocol,
    status: "active"
  };
  const { error } = await dataClient.from("generated_protocols").insert(insertPayload);
  if (error && isMissingSchemaError(error)) {
    const { error: legacyError } = await dataClient.from("generated_protocols").insert({
      user_id: auth.user.id,
      goal: protocol.primaryGoal,
      protocol
    });
    if (legacyError) return NextResponse.json({ error: `Unable to save generated protocol: ${legacyError.message}` }, { status: 500 });
    return NextResponse.json({
      protocol,
      warning: copy.protocols.legacyWarning
    });
  }

  if (error) return NextResponse.json({ error: `Unable to save generated protocol: ${error.message}` }, { status: 500 });
  return NextResponse.json({ protocol });
}
