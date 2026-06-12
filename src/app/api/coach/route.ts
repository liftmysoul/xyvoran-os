import { NextResponse } from "next/server";
import OpenAI from "openai";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import {
  buildCoachContext,
  coachSystemPrompt,
  type PersistedPillarScore,
  type UserProfile
} from "@/lib/ai-coach";
import { createClient } from "@/lib/supabase-server";
import { getSupabaseAnonKey, getSupabaseUrl, isSupabaseConfigured, supabaseConfigMessage } from "@/lib/supabase-config";
import type { BiomarkerEntry, ChatMessage, LabReport, OnboardingData } from "@/types/database";
import { getDictionary, normalizeLanguage } from "@/lib/i18n";
import { getServerLanguage } from "@/lib/i18n/server";

export const maxDuration = 60;

export async function POST(request: Request) {
  try {
    const { message } = await request.json();
    if (!message || typeof message !== "string") {
      return NextResponse.json({ error: "Message is required." }, { status: 400 });
    }
    if (!isSupabaseConfigured()) {
      return NextResponse.json({ error: supabaseConfigMessage() }, { status: 503 });
    }

    const supabase = await createClient();
    const { data: cookieAuth, error: cookieAuthError } = await supabase.auth.getUser();
    const bearerToken = request.headers.get("authorization")?.replace(/^Bearer\s+/i, "").trim();
    const useBearerClient = Boolean(!cookieAuth.user && bearerToken);
    const { data: auth, error: authError } =
      useBearerClient ? await supabase.auth.getUser(bearerToken) : { data: cookieAuth, error: cookieAuthError };
    if (authError) return NextResponse.json({ error: `Unable to verify session: ${authError.message}` }, { status: 401 });
    if (!auth.user) return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    const dataClient =
      useBearerClient && bearerToken
        ? createSupabaseClient(getSupabaseUrl(), getSupabaseAnonKey(), {
            global: {
              headers: {
                Authorization: `Bearer ${bearerToken}`
              }
            },
            auth: {
              persistSession: false,
              autoRefreshToken: false
            }
          })
        : supabase;

    const [
      { data: profile, error: profileError },
      { data: onboarding, error: onboardingError },
      { data: latestBiomarkers, error: biomarkerError },
      { data: pillarScoresResult, error: pillarScoresError },
      { data: historyResult, error: historyError },
      { data: latestLabReport, error: labError }
    ] = await Promise.all([
      dataClient.from("profiles").select("*").eq("id", auth.user.id).maybeSingle<UserProfile>(),
      dataClient.from("onboarding_data").select("*").eq("user_id", auth.user.id).maybeSingle<OnboardingData>(),
      dataClient.from("biomarker_entries").select("*").eq("user_id", auth.user.id).order("created_at", { ascending: false }).limit(1).maybeSingle<BiomarkerEntry>(),
      dataClient.from("pillar_scores").select("pillar,score,status,metrics,suggested_next_action,created_at,updated_at").eq("user_id", auth.user.id).order("updated_at", { ascending: false }).returns<PersistedPillarScore[]>(),
      dataClient.from("ai_chat_messages").select("*").eq("user_id", auth.user.id).order("created_at", { ascending: true }).limit(12).returns<ChatMessage[]>(),
      dataClient.from("lab_reports").select("*").eq("user_id", auth.user.id).eq("processing_status", "completed").order("created_at", { ascending: false }).limit(1).maybeSingle<LabReport>()
    ]);
    const readError = profileError ?? onboardingError ?? biomarkerError ?? pillarScoresError ?? historyError ?? labError;
    if (readError) return NextResponse.json({ error: `Unable to load coach context: ${readError.message}` }, { status: 500 });

    const history = historyResult ?? [];
    const pillarScores = pillarScoresResult ?? [];
    const language = normalizeLanguage(profile?.language_preference ?? await getServerLanguage());
    const copy = getDictionary(language);
    const context = buildCoachContext({ profile, onboarding, latestBiomarkers, latestLabReport, pillarScores, history, language });

    const { error: userMessageError } = await dataClient.from("ai_chat_messages").insert({ user_id: auth.user.id, role: "user", content: message });
    if (userMessageError) return NextResponse.json({ error: `Unable to save your message: ${userMessageError.message}` }, { status: 500 });

    if (!process.env.OPENAI_API_KEY?.trim()) {
      const fallback = copy.coach.notConfigured;
      const { error: fallbackError } = await dataClient.from("ai_chat_messages").insert({ user_id: auth.user.id, role: "assistant", content: fallback });
      if (fallbackError) return NextResponse.json({ error: `Unable to save coach reply: ${fallbackError.message}` }, { status: 500 });
      return NextResponse.json({ reply: fallback, configured: false }, { status: 503 });
    }

    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    let reply: string;
    try {
      const completion = await openai.chat.completions.create({
        model: process.env.OPENAI_MODEL ?? "gpt-4o-mini",
        temperature: 0.55,
        messages: [
          { role: "system", content: coachSystemPrompt(language) },
          { role: "system", content: `User optimization context JSON:\n${JSON.stringify(context, null, 2)}` },
          ...history.slice(-8).map((item) => ({ role: item.role, content: item.content })),
          { role: "user", content: message }
        ],
        max_tokens: 900
      });
      reply = completion.choices[0]?.message.content ?? copy.coach.generatedEmpty;
    } catch (error) {
      const openaiMessage = error instanceof Error ? error.message : "Unknown OpenAI API error.";
      reply = `${copy.coach.apiFailure} OpenAI: ${openaiMessage}`;
      const { error: assistantError } = await dataClient.from("ai_chat_messages").insert({ user_id: auth.user.id, role: "assistant", content: reply });
      if (assistantError) return NextResponse.json({ error: `OpenAI failed and the error reply could not be saved: ${assistantError.message}` }, { status: 500 });
      return NextResponse.json({ error: reply, reply, configured: true }, { status: 502 });
    }

    const { error: assistantMessageError } = await dataClient.from("ai_chat_messages").insert({ user_id: auth.user.id, role: "assistant", content: reply });
    if (assistantMessageError) return NextResponse.json({ error: `Unable to save coach reply: ${assistantMessageError.message}` }, { status: 500 });
    return NextResponse.json({ reply, configured: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unexpected coach error.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
