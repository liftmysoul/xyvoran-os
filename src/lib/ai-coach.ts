import type { AdaptiveMissionRecord, BiomarkerEntry, BiologicalInsightRecord, ChatMessage, Json, LabReport, LanguagePreference, OnboardingData, PillarName, Protocol } from "@/types/database";
import type { AdaptiveMission } from "@/lib/adaptive-protocol-engine";
import type { Language } from "@/lib/i18n";
import type { BiologicalIntelligenceSummary } from "@/lib/biological-intelligence";

export type PersistedPillarScore = {
  pillar: PillarName;
  score: number;
  status: string;
  metrics: Json;
  suggested_next_action: string;
  updated_at?: string;
  created_at?: string;
};

export type UserProfile = {
  id: string;
  email: string | null;
  language_preference?: LanguagePreference | null;
  created_at?: string;
  updated_at?: string;
};

export const coachNotConfiguredMessage = "AI Coach is not configured yet. Add OPENAI_API_KEY to enable real responses.";

const coachSystemPromptBase = `You are XYVORAN OS - Elite Human Optimization Coach.

Your role:
- Provide personalized, practical, non-medical wellness guidance based on the user's profile, onboarding data, biomarkers, pillar scores, goals, and recent conversation.
- Focus on sleep, HRV, recovery, nutrition, fasting, stress resilience, metabolic health, cognitive performance, longevity, and beauty/wellness optimization.
- Reference the user's main goal, sleep quality, stress level, energy level, relevant biomarkers, pillar scores, and previous chat context when available.
- Use pillar-specific intake signals when available, including sleep duration, HRV, resting heart rate, sugar cravings, afternoon energy crashes, fasting pattern, focus, brain fog, caffeine, alcohol, nicotine, hydration, skin quality, current stack, and secondary goals.
- When a completed lab report is provided, reference actual measured values and their configured optimization status. Distinguish wellness optimization targets from clinical reference ranges.
- When biological intelligence is provided, use the primary constraint, top opportunity, active insights, missing signals, and latest protocol to answer what to prioritize first and why the score may be limited.
- When an adaptive biological mission is provided, treat it as the current strategic plan. Explain the current biological bottleneck, mission progress, next signal needed, and why the next action is prioritized.
- Use clear reasoning, prioritize low-risk foundations, and recommend measurable tracking over time.
- Be direct, elite, calm, ethical, and actionable. Make advice realistic for the next 24 hours and the next 7 days.

Safety boundaries:
- Do not diagnose disease or claim the user has a medical condition.
- Do not prescribe medication or tell users to start, stop, or change prescribed drugs.
- Do not provide dangerous peptide, hormone, drug, or experimental compound dosing instructions.
- Do not interpret abnormal labs as definitive medical findings.
- For abnormal labs, symptoms, medical conditions, pregnancy, eating disorders, medications, supplements that may interact with medications, or prescription decisions, recommend consultation with a licensed healthcare provider.
- Frame responses as educational wellness guidance, not medical advice.

Response style:
- Personalize using the provided context.
- If data is missing, state what would improve precision.
- Use concise sections, clear priorities, and specific action steps.
- Include a brief safety note when labs or medical topics are involved.`;

export function coachSystemPrompt(language: Language) {
  return `${coachSystemPromptBase}\n\nLanguage directive:\n${language === "es" ? "Respond entirely in polished, professional, natural Latin American Spanish. Do not mix English except for standard technical terms such as HRV, HbA1c, REM, or established biomarker names. Use the safety language: orientación educativa de bienestar; no sustituye asesoría médica profesional." : "Respond entirely in polished professional English."}`;
}

export function buildCoachContext(args: {
  profile: UserProfile | null;
  onboarding: OnboardingData | null;
  latestBiomarkers: BiomarkerEntry | null;
  latestLabReport?: LabReport | null;
  latestProtocol?: Protocol | null;
  biologicalIntelligence?: BiologicalIntelligenceSummary | null;
  adaptiveMission?: AdaptiveMission | null;
  storedAdaptiveMission?: AdaptiveMissionRecord | null;
  activeInsights?: BiologicalInsightRecord[];
  pillarScores: PersistedPillarScore[];
  history: ChatMessage[];
  language?: Language;
}) {
  const onboarding = args.onboarding;
  const latestBiomarkers = args.latestBiomarkers;
  const pillarSummary = args.pillarScores.map((pillar) => ({
    pillar: pillar.pillar,
    score: pillar.score,
    status: pillar.status,
    metrics: pillar.metrics,
    nextAction: pillar.suggested_next_action
  }));

  return {
    selectedLanguage: args.language ?? "en",
    userProfile: args.profile,
    onboarding,
    contextQuality: {
      hasProfile: Boolean(args.profile),
      hasOnboarding: Boolean(onboarding),
      hasLatestBiomarkers: Boolean(latestBiomarkers),
      hasLatestLabReport: Boolean(args.latestLabReport?.analysis_json),
      hasBiologicalIntelligence: Boolean(args.biologicalIntelligence),
      hasAdaptiveMission: Boolean(args.adaptiveMission ?? args.storedAdaptiveMission),
      activeInsightCount: args.activeInsights?.length ?? 0,
      pillarScoreCount: args.pillarScores.length,
      recentMessageCount: args.history.length
    },
    personalizationAnchors: {
      mainGoal: onboarding?.main_goal ?? null,
      sleepQuality: onboarding?.sleep_quality ?? null,
      stressLevel: onboarding?.stress_level ?? null,
      energyLevel: onboarding?.energy_level ?? null,
      exerciseFrequency: onboarding?.exercise_frequency ?? null,
      dietStyle: onboarding?.diet_style ?? null,
      secondaryGoals: onboarding?.secondary_goals ?? [],
      recovery: onboarding ? {
        sleepDuration: onboarding.sleep_duration ?? null,
        hrv: onboarding.hrv ?? null,
        restingHeartRate: onboarding.resting_heart_rate ?? null
      } : null,
      metabolic: onboarding ? {
        waistCircumferenceCm: onboarding.waist_circumference_cm ?? null,
        bodyFatPercent: onboarding.body_fat_percent ?? null,
        fastingHours: onboarding.fasting_hours ?? null,
        eatingWindowHours: onboarding.eating_window_hours ?? null,
        sugarCravingFrequency: onboarding.sugar_craving_frequency ?? null,
        afternoonEnergyCrashFrequency: onboarding.afternoon_energy_crash_frequency ?? null
      } : null,
      cognitive: onboarding ? {
        focusLevel: onboarding.focus_level ?? null,
        brainFogFrequency: onboarding.brain_fog_frequency ?? null,
        caffeineIntake: onboarding.caffeine_intake ?? null,
        productivityGoal: onboarding.productivity_goal ?? null
      } : null,
      longevity: onboarding ? {
        alcoholUse: onboarding.alcohol_use ?? null,
        nicotineUse: onboarding.nicotine_use ?? null,
        familyHistoryNotes: onboarding.family_history_notes ?? null,
        mainConcern: onboarding.longevity_concern ?? null
      } : null,
      beautyAndStack: onboarding ? {
        skinQuality: onboarding.skin_quality ?? null,
        hydrationLevel: onboarding.hydration_level ?? null,
        beautyConcern: onboarding.beauty_concern ?? null,
        supplements: onboarding.supplements ?? null,
        medications: onboarding.medications ?? null,
        peptides: onboarding.peptides ?? null,
        wearables: onboarding.wearables_used ?? null
      } : null,
      relevantBiomarkers: latestBiomarkers
        ? {
            fastingGlucose: latestBiomarkers.fasting_glucose ?? null,
            hba1c: latestBiomarkers.hba1c ?? null,
            insulin: latestBiomarkers.insulin ?? null,
            crp: latestBiomarkers.crp ?? null,
            vitaminD: latestBiomarkers.vitamin_d ?? null,
            testosterone: latestBiomarkers.testosterone ?? null,
            cortisol: latestBiomarkers.cortisol ?? null,
            hrv: latestBiomarkers.hrv ?? null,
            restingHeartRate: latestBiomarkers.resting_heart_rate ?? null,
            sleepDuration: latestBiomarkers.sleep_duration ?? null,
            deepSleep: latestBiomarkers.deep_sleep ?? null,
            remSleep: latestBiomarkers.rem_sleep ?? null
          }
        : null
    },
    latestBiomarkers,
    latestLabReport: args.latestLabReport ? {
      fileName: args.latestLabReport.file_name,
      analyzedAt: args.latestLabReport.analysis_json?.analyzedAt,
      biomarkers: args.latestLabReport.analysis_json?.biomarkers,
      biggestOpportunities: args.latestLabReport.analysis_json?.biggestOpportunities,
      scoreImpacts: args.latestLabReport.analysis_json?.scoreImpacts,
      safetyFlags: args.latestLabReport.analysis_json?.safetyFlags
    } : null,
    biologicalIntelligence: args.biologicalIntelligence ? {
      primaryConstraint: args.biologicalIntelligence.primaryConstraint,
      secondaryConstraints: args.biologicalIntelligence.secondaryConstraints,
      topOpportunity: args.biologicalIntelligence.topOpportunity,
      confidenceScore: args.biologicalIntelligence.confidenceScore,
      missingSignals: args.biologicalIntelligence.missingData,
      pillarImpacts: args.biologicalIntelligence.pillarImpacts
    } : null,
    activeBiologicalInsights: (args.activeInsights ?? []).slice(0, 8).map((insight) => ({
      type: insight.insight_type,
      pillar: insight.pillar,
      severity: insight.severity,
      confidence: insight.confidence_score,
      title: insight.title,
      summary: insight.summary,
      recommendedActions: insight.recommended_actions
    })),
    adaptiveMission: args.adaptiveMission ? {
      missionName: args.adaptiveMission.missionName,
      primaryPillar: args.adaptiveMission.primaryPillar,
      constraint: args.adaptiveMission.constraint,
      confidence: args.adaptiveMission.confidence,
      progress: args.adaptiveMission.progress,
      progressState: args.adaptiveMission.progressState,
      reason: args.adaptiveMission.reason,
      nextUpgrade: args.adaptiveMission.nextUpgrade,
      nextSignalNeeded: args.adaptiveMission.nextSignalNeeded,
      prioritySignals: args.adaptiveMission.prioritySignals,
      phases: args.adaptiveMission.phases,
      safetyNote: args.adaptiveMission.safetyNote
    } : args.storedAdaptiveMission ? {
      missionName: args.storedAdaptiveMission.mission_name,
      primaryPillar: args.storedAdaptiveMission.primary_pillar,
      constraint: args.storedAdaptiveMission.constraint,
      confidence: args.storedAdaptiveMission.confidence,
      progress: args.storedAdaptiveMission.progress,
      phases: args.storedAdaptiveMission.phases,
      actions: args.storedAdaptiveMission.actions,
      trackingSignals: args.storedAdaptiveMission.tracking_signals
    } : null,
    latestProtocol: args.latestProtocol ? {
      title: args.latestProtocol.title,
      goal: args.latestProtocol.goal,
      weakestPillar: args.latestProtocol.weakest_pillar,
      intensity: args.latestProtocol.intensity,
      status: args.latestProtocol.status,
      protocol: args.latestProtocol.protocol_json ?? args.latestProtocol.protocol
    } : null,
    pillarScores: pillarSummary,
    recentConversation: args.history.slice(-8)
  };
}
