import type {
  BiomarkerEntry,
  ChatMessage,
  OnboardingData,
  PillarName,
  PillarScore,
  ProtocolIntensity,
  StructuredProtocol
} from "@/types/database";

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
  return [...pillars].sort((a, b) => a.score - b.score)[0] ?? {
    pillar: "Recovery",
    score: 50,
    status: "Needs attention",
    metrics: [],
    keyDrivers: [],
    limitingFactors: ["Not enough scoring data is available."],
    riskFlags: [],
    nextAction: "Complete onboarding and add biomarkers."
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

function sleepAction(day: number, goal: string, onboarding: OnboardingData | null, biomarkers: BiomarkerEntry | null) {
  const lowSleep = (onboarding?.sleep_quality ?? 6) < 7 || (biomarkers?.sleep_duration ?? onboarding?.sleep_duration ?? 7) < 7;
  if (goal === "Better sleep" || lowSleep) {
    return day <= 2
      ? "Lock a consistent wake time and get 10-15 minutes of outdoor light within 30 minutes of waking."
      : "Begin a 60-minute wind-down: dim lights, reduce screens, cool the room, and keep the sleep window consistent.";
  }
  return "Protect your current sleep window and avoid caffeine within 8 hours of bedtime.";
}

function nutritionAction(day: number, goal: string, onboarding: OnboardingData | null, biomarkers: BiomarkerEntry | null) {
  const glucose = biomarkers?.fasting_glucose ?? null;
  if (goal === "Fat loss" || goal === "Metabolic health" || (glucose && glucose > 100)) {
    return day % 2 === 0
      ? "Use a 12-hour overnight fasting window, then break the fast with protein, fiber, and hydration."
      : "Build each meal around protein, colorful plants, and slow carbohydrates only around training or walks.";
  }
  if (goal === "Beauty / skin optimization") {
    return "Prioritize protein, omega-3 rich foods, mineral hydration, and colorful plants for skin-supportive nutrition.";
  }
  if ((onboarding?.energy_level ?? 5) <= 5) {
    return "Eat protein within 90 minutes of waking and delay caffeine until after hydration and morning light.";
  }
  return "Keep meals protein-forward and avoid large late meals that could suppress recovery.";
}

function movementAction(day: number, goal: string, intensity: ProtocolIntensity, weakestPillar: PillarName) {
  if (weakestPillar === "Recovery" || intensity === "Beginner") {
    return day % 3 === 0
      ? "Complete 20 minutes of easy mobility plus a relaxed walk."
      : "Walk 20-30 minutes in zone 2, preferably after a meal.";
  }
  if (goal === "Cognitive performance") return "Do 25 minutes of zone 2 movement before the deepest work block.";
  if (goal === "Fat loss" || goal === "Metabolic health") return day % 3 === 0 ? "Complete a moderate full-body strength session." : "Walk 10 minutes after two meals.";
  return day % 3 === 0 ? "Complete a strength session with clean technique and long rests." : "Accumulate 7,000-9,000 steps with nasal breathing.";
}

function recoveryAction(day: number, goal: string, onboarding: OnboardingData | null, weakestPillar: PillarName) {
  const highStress = (onboarding?.stress_level ?? 5) >= 7 || goal === "Stress resilience";
  if (weakestPillar === "Recovery" || highStress) {
    return day <= 3 ? "Do 5 minutes of slow nasal breathing, then a short mobility flow." : "Add a 10-minute decompression block after work: walk, breathe, or stretch without screens.";
  }
  if (goal === "Longevity") return "Use a small hormetic dose only if recovered: sauna, brisk walk, or cold finish as tolerated.";
  return "Schedule one deliberate downshift block: breathwork, mobility, or quiet outdoor walking.";
}

function trackingAction(day: number, weakestPillar: PillarName) {
  const focus = weakestPillar === "Recovery" ? "sleep duration, HRV or resting heart rate, stress, and energy" : "energy, hunger, sleep, training readiness, and one biomarker trend";
  return `Log ${focus}. Note one action that improved the day.`;
}

export function generateStructuredProtocol(args: {
  onboarding: OnboardingData | null;
  biomarkers: BiomarkerEntry | null;
  pillars: PillarScore[];
  recentMessages?: ChatMessage[];
  requestedIntensity?: ProtocolIntensity;
}): StructuredProtocol {
  const goal = normalizeGoal(args.onboarding?.main_goal);
  const weakest = findWeakestPillar(args.pillars);
  const intensity = chooseProtocolIntensity(args.onboarding, args.biomarkers, weakest, args.requestedIntensity);
  const recentCoachHint = args.recentMessages?.findLast((message) => message.role === "assistant")?.content.slice(0, 140);

  const sevenDayActionPlan = Array.from({ length: 7 }, (_, index) => {
    const day = index + 1;
    return {
      day,
      sleep: sleepAction(day, goal, args.onboarding, args.biomarkers),
      nutrition: nutritionAction(day, goal, args.onboarding, args.biomarkers),
      movement: movementAction(day, goal, intensity, weakest.pillar),
      recovery: recoveryAction(day, goal, args.onboarding, weakest.pillar),
      tracking: trackingAction(day, weakest.pillar)
    };
  });

  const metricsToMonitor = [
    "Sleep duration and sleep quality",
    "Morning energy and afternoon energy dip",
    "Stress level and HRV or resting heart rate",
    "Adherence to sleep, nutrition, movement, and recovery actions",
    ...(goal === "Metabolic health" || goal === "Fat loss" ? ["Fasting glucose trend and post-meal walk completion"] : []),
    ...(goal === "Beauty / skin optimization" ? ["Deep sleep, hydration, and skin recovery notes"] : [])
  ];

  return {
    title: `${goal} Starter Protocol: ${weakest.pillar} Reset`,
    primaryGoal: goal,
    weakestPillar: weakest.pillar,
    intensity,
    sevenDayActionPlan,
    safetyDisclaimer:
      "This protocol is educational wellness guidance only. It does not diagnose disease, prescribe medication, provide peptide dosing, recommend stopping prescribed medications, or replace professional care. Consult a licensed healthcare provider for abnormal biomarkers, symptoms, hormonal concerns, chronic disease, or prescription decisions.",
    metricsToMonitor,
    whenToReassess: "Reassess after 7 days, or sooner if sleep worsens, HRV drops sharply, symptoms appear, or biomarkers are abnormal.",
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
}
