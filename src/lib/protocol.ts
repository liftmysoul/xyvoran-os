import type {
  BiomarkerEntry,
  ChatMessage,
  OnboardingData,
  PillarName,
  PillarScore,
  ProtocolIntensity,
  StructuredProtocol
} from "@/types/database";
import { getDictionary, localizePillar, type Language } from "@/lib/i18n";

type ProtocolCopy = ReturnType<typeof getDictionary>["optimization"]["protocol"];
type ProtocolCopyKey = keyof ProtocolCopy;

const goalCopyKeys: Record<string, ProtocolCopyKey> = {
  "Fat loss": "goalFatLoss", "Better sleep": "goalBetterSleep", "More energy": "goalMoreEnergy",
  "Cognitive performance": "goalCognitive", Recovery: "goalRecovery", Longevity: "goalLongevity",
  "Metabolic health": "goalMetabolic", "Stress resilience": "goalStress", "Beauty / skin optimization": "goalBeauty"
};

export function localizeGoal(goal: string, language: Language) {
  const key = goalCopyKeys[goal] ?? (Object.keys(goalCopyKeys) as string[]).map((canonical) => goalCopyKeys[canonical]).find((candidate) =>
    getDictionary("en").optimization.protocol[candidate] === goal || getDictionary("es").optimization.protocol[candidate] === goal
  );
  return key ? getDictionary(language).optimization.protocol[key] : goal;
}

export function localizeProtocolText(text: string, language: Language) {
  if (language === "en") return text;
  const source = getDictionary("en").optimization.protocol;
  const target = getDictionary(language).optimization.protocol;
  const spanish = getDictionary("es").optimization.protocol;
  const key = (Object.keys(source) as ProtocolCopyKey[]).find((candidate) => source[candidate] === text || spanish[candidate] === text);
  return key ? target[key] : text;
}

const supportedGoals = [
  "Fat loss",
  "Better sleep",
  "More energy",
  "Cognitive performance",
  "Recovery",
  "Longevity",
  "Metabolic health",
  "Stress resilience",
  "Beauty / skin optimization"
];

function normalizeGoal(goal?: string | null) {
  if (!goal) return "More energy";
  const match = supportedGoals.find((item) => item.toLowerCase() === goal.toLowerCase());
  if (match) return match;
  if (goal.toLowerCase().includes("fat")) return "Fat loss";
  if (goal.toLowerCase().includes("sleep")) return "Better sleep";
  if (goal.toLowerCase().includes("cognitive") || goal.toLowerCase().includes("focus")) return "Cognitive performance";
  if (goal.toLowerCase().includes("stress")) return "Stress resilience";
  if (goal.toLowerCase().includes("metabolic") || goal.toLowerCase().includes("glucose")) return "Metabolic health";
  if (goal.toLowerCase().includes("beauty") || goal.toLowerCase().includes("skin")) return "Beauty / skin optimization";
  return goal;
}

export function findWeakestPillar(pillars: PillarScore[]): PillarScore {
  const fallback = getDictionary("en").optimization.protocol;
  return [...pillars].sort((a, b) => a.score - b.score)[0] ?? {
    pillar: "Recovery",
    score: 50,
    status: "Needs attention",
    metrics: [],
    keyDrivers: [],
    limitingFactors: [fallback.noScoringData],
    riskFlags: [],
    nextAction: fallback.completeData
  };
}

export function chooseProtocolIntensity(
  onboarding: OnboardingData | null,
  biomarkers: BiomarkerEntry | null,
  weakest: PillarScore,
  requested?: ProtocolIntensity
): ProtocolIntensity {
  const poorRecovery =
    weakest.pillar === "Recovery" ||
    (onboarding?.stress_level ?? 0) >= 7 ||
    (onboarding?.sleep_quality ?? 10) <= 5 ||
    (biomarkers?.sleep_duration ?? onboarding?.sleep_duration ?? 8) < 6.5 ||
    (biomarkers?.hrv ?? onboarding?.hrv ?? 60) < 35 ||
    weakest.score < 58;

  if (poorRecovery) return "Beginner";
  return requested ?? "Beginner";
}

function sleepAction(day: number, goal: string, onboarding: OnboardingData | null, biomarkers: BiomarkerEntry | null, copy: ProtocolCopy) {
  const lowSleep = (onboarding?.sleep_quality ?? 6) < 7 || (biomarkers?.sleep_duration ?? onboarding?.sleep_duration ?? 7) < 7;
  if (goal === "Better sleep" || lowSleep) {
    return day <= 2
      ? copy.wakeLight
      : copy.windDown;
  }
  return copy.protectSleep;
}

function nutritionAction(day: number, goal: string, onboarding: OnboardingData | null, biomarkers: BiomarkerEntry | null, copy: ProtocolCopy) {
  const glucose = biomarkers?.fasting_glucose ?? null;
  if (goal === "Fat loss" || goal === "Metabolic health" || (glucose && glucose > 100)) {
    return day % 2 === 0
      ? copy.fastingWindow
      : copy.balancedMeals;
  }
  if (goal === "Beauty / skin optimization") {
    return copy.skinNutrition;
  }
  if ((onboarding?.energy_level ?? 5) <= 5) {
    return copy.morningProtein;
  }
  return copy.recoveryMeals;
}

function movementAction(day: number, goal: string, intensity: ProtocolIntensity, weakestPillar: PillarName, copy: ProtocolCopy) {
  if (weakestPillar === "Recovery" || intensity === "Beginner") {
    return day % 3 === 0
      ? copy.mobilityWalk
      : copy.zone2Walk;
  }
  if (goal === "Cognitive performance") return copy.cognitiveZone2;
  if (goal === "Fat loss" || goal === "Metabolic health") return day % 3 === 0 ? copy.strength : copy.twoMealWalks;
  return day % 3 === 0 ? copy.advancedStrength : copy.steps;
}

function recoveryAction(day: number, goal: string, onboarding: OnboardingData | null, weakestPillar: PillarName, copy: ProtocolCopy) {
  const highStress = (onboarding?.stress_level ?? 5) >= 7 || goal === "Stress resilience";
  if (weakestPillar === "Recovery" || highStress) {
    return day <= 3 ? copy.breathing : copy.decompression;
  }
  if (goal === "Longevity") return copy.hormesis;
  return copy.downshift;
}

function trackingAction(_day: number, weakestPillar: PillarName, copy: ProtocolCopy) {
  return weakestPillar === "Recovery" ? copy.trackingRecovery : copy.trackingGeneral;
}

export function generateStructuredProtocol(args: {
  onboarding: OnboardingData | null;
  biomarkers: BiomarkerEntry | null;
  pillars: PillarScore[];
  recentMessages?: ChatMessage[];
  requestedIntensity?: ProtocolIntensity;
  language?: Language;
}): StructuredProtocol {
  const language = args.language ?? "en";
  const copy = getDictionary(language).optimization.protocol;
  const goal = normalizeGoal(args.onboarding?.main_goal);
  const weakest = findWeakestPillar(args.pillars);
  const intensity = chooseProtocolIntensity(args.onboarding, args.biomarkers, weakest, args.requestedIntensity);
  const recentCoachHint = args.recentMessages?.findLast((message) => message.role === "assistant")?.content.slice(0, 140);

  const sevenDayActionPlan = Array.from({ length: 7 }, (_, index) => {
    const day = index + 1;
    return {
      day,
      sleep: sleepAction(day, goal, args.onboarding, args.biomarkers, copy),
      nutrition: nutritionAction(day, goal, args.onboarding, args.biomarkers, copy),
      movement: movementAction(day, goal, intensity, weakest.pillar, copy),
      recovery: recoveryAction(day, goal, args.onboarding, weakest.pillar, copy),
      tracking: trackingAction(day, weakest.pillar, copy)
    };
  });

  const metricsToMonitor = [
    copy.sleepMetric,
    copy.energyMetric,
    copy.stressMetric,
    copy.adherenceMetric,
    ...(goal === "Metabolic health" || goal === "Fat loss" ? [copy.glucoseMetric] : []),
    ...(goal === "Beauty / skin optimization" ? [copy.beautyMetric] : [])
  ];

  const protocol: StructuredProtocol = {
    title: language === "es" ? `Protocolo inicial de ${localizeGoal(goal, language)}: reinicio de ${localizePillar(weakest.pillar, language)}` : `${goal} Starter Protocol: ${weakest.pillar} Reset`,
    primaryGoal: localizeGoal(goal, language),
    weakestPillar: weakest.pillar,
    intensity,
    sevenDayActionPlan,
    safetyDisclaimer: copy.safety,
    metricsToMonitor,
    whenToReassess: copy.reassess,
    topPriorityActions: [
      weakest.nextAction,
      sevenDayActionPlan[0].sleep,
      sevenDayActionPlan[0].tracking
    ],
    contextSummary: [
      `Main goal: ${goal}`,
      `Weakest pillar: ${weakest.pillar} (${weakest.score}/100)`,
      `Sleep quality: ${args.onboarding?.sleep_quality ?? "not set"}/10`,
      `Stress level: ${args.onboarding?.stress_level ?? "not set"}/10`,
      `Energy level: ${args.onboarding?.energy_level ?? "not set"}/10`,
      `Exercise frequency: ${args.onboarding?.exercise_frequency ?? "not set"}`,
      `Diet style: ${args.onboarding?.diet_style ?? "not set"}`,
      `Latest HRV: ${args.biomarkers?.hrv ?? "not logged"}`,
      ...(recentCoachHint ? [`Recent coach context: ${recentCoachHint}`] : [])
    ]
  };
  if (language === "es") {
    protocol.sevenDayActionPlan = protocol.sevenDayActionPlan.map((day) => ({ ...day, sleep: localizeProtocolText(day.sleep, language), nutrition: localizeProtocolText(day.nutrition, language), movement: localizeProtocolText(day.movement, language), recovery: localizeProtocolText(day.recovery, language), tracking: localizeProtocolText(day.tracking, language) }));
    protocol.topPriorityActions = protocol.topPriorityActions.map((item) => localizeProtocolText(item, language));
    protocol.contextSummary = [
      `Objetivo principal: ${localizeGoal(goal, language)}`, `Pilar prioritario: ${localizePillar(weakest.pillar, language)} (${weakest.score}/100)`,
      `Calidad del sueño: ${args.onboarding?.sleep_quality ?? "sin registrar"}/10`, `Nivel de estrés: ${args.onboarding?.stress_level ?? "sin registrar"}/10`, `Nivel de energía: ${args.onboarding?.energy_level ?? "sin registrar"}/10`,
      `Frecuencia de ejercicio: ${args.onboarding?.exercise_frequency ?? "sin registrar"}`, `Estilo de alimentación: ${args.onboarding?.diet_style ?? "sin registrar"}`, `HRV más reciente: ${args.biomarkers?.hrv ?? "sin registrar"}`,
      ...(recentCoachHint ? [`Contexto reciente del coach: ${recentCoachHint}`] : [])
    ];
  }
  return protocol;
}
