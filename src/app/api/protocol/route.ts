import { NextResponse } from "next/server";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { generateStructuredProtocol } from "@/lib/protocol";
import { calculatePillars } from "@/lib/scoring";
import { createClient } from "@/lib/supabase-server";
import { getSupabaseAnonKey, getSupabaseUrl, isSupabaseConfigured, supabaseConfigMessage } from "@/lib/supabase-config";
import type { BiomarkerEntry, ChatMessage, OnboardingData, PillarScore, ProtocolIntensity } from "@/types/database";

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
    { data: onboarding, error: onboardingError },
    { data: latestBiomarkers, error: biomarkerError },
    { data: storedPillars, error: pillarsError },
    { data: recentMessages, error: messagesError }
  ] = await Promise.all([
    dataClient.from("onboarding_data").select("*").eq("user_id", auth.user.id).maybeSingle<OnboardingData>(),
    dataClient.from("biomarker_entries").select("*").eq("user_id", auth.user.id).order("created_at", { ascending: false }).limit(1).maybeSingle<BiomarkerEntry>(),
    dataClient.from("pillar_scores").select("pillar,score,status,metrics,suggested_next_action").eq("user_id", auth.user.id).returns<StoredPillar[]>(),
    dataClient.from("ai_chat_messages").select("*").eq("user_id", auth.user.id).order("created_at", { ascending: false }).limit(6).returns<ChatMessage[]>()
  ]);
  const readError = onboardingError ?? biomarkerError ?? pillarsError ?? messagesError;
  if (readError) return NextResponse.json({ error: `Unable to load protocol context: ${readError.message}` }, { status: 500 });

  if (!onboarding) return NextResponse.json({ error: "Complete onboarding before generating a protocol." }, { status: 400 });

  const calculatedPillars = calculatePillars(onboarding, latestBiomarkers);
  const pillarByName = new Map(calculatedPillars.map((pillar) => [pillar.pillar, pillar]));
  const pillars = storedPillars?.length
    ? storedPillars.map((pillar) => ({
        ...(pillarByName.get(pillar.pillar) ?? calculatedPillars[0]),
        pillar: pillar.pillar,
        score: pillar.score,
        status: pillar.status,
        metrics: Array.isArray(pillar.metrics) ? pillar.metrics : [],
        nextAction: pillar.suggested_next_action
      }))
    : calculatedPillars;

  const protocol = generateStructuredProtocol({
    onboarding,
    biomarkers: latestBiomarkers,
    pillars,
    recentMessages: (recentMessages ?? []).reverse(),
    requestedIntensity
  });

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
  if (error && error.message.includes("column")) {
    const { error: legacyError } = await dataClient.from("generated_protocols").insert({
      user_id: auth.user.id,
      goal: protocol.primaryGoal,
      protocol
    });
    if (legacyError) return NextResponse.json({ error: `Unable to save generated protocol: ${legacyError.message}` }, { status: 500 });
    return NextResponse.json({
      protocol,
      warning: "Protocol saved in legacy JSON mode. Run the Phase 4 schema migration to enable title, weakest pillar, intensity, status, and protocol_json columns."
    });
  }

  if (error) return NextResponse.json({ error: `Unable to save generated protocol: ${error.message}` }, { status: 500 });
  return NextResponse.json({ protocol });
}
