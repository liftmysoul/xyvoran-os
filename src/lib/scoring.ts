import type { BiomarkerEntry, OnboardingData, PillarScore } from "@/types/database";

const clamp = (value: number) => Math.max(0, Math.min(100, Math.round(value)));

function latestValue(entry: BiomarkerEntry | null | undefined, key: keyof BiomarkerEntry) {
  const value = entry?.[key];
  return typeof value === "number" ? value : null;
}

function status(score: number) {
  if (score >= 82) return "Optimized";
  if (score >= 66) return "Stable";
  if (score >= 48) return "Needs attention";
  return "Foundation first";
}

function addDriver(condition: boolean, target: string[], message: string) {
  if (condition) target.push(message);
}

function scoreFrom(base: number, adjustments: number[]) {
  return clamp(base + adjustments.reduce((sum, value) => sum + value, 0));
}

function frequencyPenalty(value?: string | null, scale = 3) {
  const rank: Record<string, number> = { never: 0, rarely: 1, sometimes: 2, often: 3, daily: 4 };
  return -(rank[value?.toLowerCase() ?? ""] ?? 0) * scale;
}

function includesAny(value: string | null | undefined, terms: string[]) {
  const normalized = value?.toLowerCase() ?? "";
  return terms.some((term) => normalized.includes(term));
}

export function calculatePillars(
  onboarding: OnboardingData | null,
  latestBiomarkers?: BiomarkerEntry | null
): PillarScore[] {
  const sleepQuality = onboarding?.sleep_quality ?? 5;
  const stress = onboarding?.stress_level ?? 5;
  const energy = onboarding?.energy_level ?? 5;
  const exercise = onboarding?.exercise_frequency ?? "not set";
  const hrv = latestValue(latestBiomarkers, "hrv") ?? onboarding?.hrv ?? null;
  const rhr = latestValue(latestBiomarkers, "resting_heart_rate") ?? onboarding?.resting_heart_rate ?? null;
  const glucose = latestValue(latestBiomarkers, "fasting_glucose");
  const hba1c = latestValue(latestBiomarkers, "hba1c");
  const insulin = latestValue(latestBiomarkers, "insulin");
  const crp = latestValue(latestBiomarkers, "crp");
  const vitaminD = latestValue(latestBiomarkers, "vitamin_d");
  const cortisol = latestValue(latestBiomarkers, "cortisol");
  const sleepDuration = latestValue(latestBiomarkers, "sleep_duration") ?? onboarding?.sleep_duration ?? null;
  const deepSleep = latestValue(latestBiomarkers, "deep_sleep");
  const remSleep = latestValue(latestBiomarkers, "rem_sleep");
  const fastingHours = onboarding?.fasting_hours ?? null;
  const cravings = onboarding?.sugar_craving_frequency ?? null;
  const crashes = onboarding?.afternoon_energy_crash_frequency ?? null;
  const focus = onboarding?.focus_level ?? null;
  const brainFog = onboarding?.brain_fog_frequency ?? null;
  const caffeine = onboarding?.caffeine_intake ?? null;
  const alcohol = onboarding?.alcohol_use ?? null;
  const nicotine = onboarding?.nicotine_use ?? null;
  const skinQuality = onboarding?.skin_quality ?? null;
  const hydration = onboarding?.hydration_level ?? null;

  const metabolicDrivers: string[] = [];
  const metabolicLimits: string[] = [];
  const metabolicRisks: string[] = [];
  const metabolicAdjustments = [
    glucose ? (glucose <= 95 ? 10 : glucose <= 105 ? 0 : -14) : -3,
    hba1c ? (hba1c <= 5.4 ? 8 : hba1c <= 5.7 ? 0 : -12) : -2,
    insulin ? (insulin <= 8 ? 5 : insulin <= 15 ? 0 : -8) : 0,
    (energy - 5) * 3,
    frequencyPenalty(cravings, 2),
    frequencyPenalty(crashes, 2),
    fastingHours !== null ? (fastingHours >= 12 ? 4 : fastingHours < 10 ? -4 : 0) : 0
  ];
  addDriver(Boolean(glucose && glucose <= 95), metabolicDrivers, "Fasting glucose is in a favorable wellness range.");
  addDriver(Boolean(hba1c && hba1c <= 5.4), metabolicDrivers, "HbA1c supports stable metabolic trend tracking.");
  addDriver(energy >= 7, metabolicDrivers, "Energy input is strong.");
  addDriver(Boolean(fastingHours && fastingHours >= 12), metabolicDrivers, "A consistent 12-hour overnight fasting interval supports metabolic rhythm.");
  addDriver(!glucose, metabolicLimits, "Fasting glucose has not been logged.");
  addDriver(Boolean(glucose && glucose > 100), metabolicLimits, "Fasting glucose is above the ideal optimization target.");
  addDriver(Boolean(hba1c && hba1c > 5.7), metabolicRisks, "HbA1c is elevated; discuss abnormal labs with a licensed clinician.");
  addDriver(Boolean(insulin && insulin > 15), metabolicLimits, "Insulin is above the desired optimization range.");
  addDriver(includesAny(cravings, ["often", "daily"]), metabolicLimits, "Frequent sugar cravings may signal inconsistent satiety or meal composition.");
  addDriver(includesAny(crashes, ["often", "daily"]), metabolicLimits, "Frequent afternoon energy crashes are limiting metabolic flexibility.");
  const metabolic = scoreFrom(70, metabolicAdjustments);

  const recoveryDrivers: string[] = [];
  const recoveryLimits: string[] = [];
  const recoveryRisks: string[] = [];
  const recoveryAdjustments = [
    (sleepQuality - 5) * 4,
    sleepDuration ? (sleepDuration >= 7 ? 10 : sleepDuration >= 6 ? -4 : -10) : -4,
    hrv ? (hrv >= 55 ? 8 : hrv >= 35 ? 0 : -10) : -3,
    rhr ? (rhr <= 62 ? 7 : rhr <= 75 ? 0 : -8) : 0,
    -stress * 2,
    sleepDuration !== null && sleepDuration < 6 ? -4 : 0
  ];
  addDriver(sleepQuality >= 7, recoveryDrivers, "Sleep quality input is supportive.");
  addDriver(Boolean(sleepDuration && sleepDuration >= 7), recoveryDrivers, "Sleep duration is at or above 7 hours.");
  addDriver(Boolean(hrv && hrv >= 55), recoveryDrivers, "HRV suggests solid readiness.");
  addDriver(stress >= 7, recoveryLimits, "Stress input is high and likely suppressing recovery.");
  addDriver(Boolean(sleepDuration && sleepDuration < 7), recoveryLimits, "Sleep duration is below the recovery target.");
  addDriver(Boolean(hrv && hrv < 35), recoveryRisks, "HRV is low; reduce intensity and prioritize recovery.");
  addDriver(Boolean(rhr && rhr > 75), recoveryLimits, "Resting heart rate is elevated relative to the optimization target.");
  const recovery = scoreFrom(62, recoveryAdjustments);

  const longevityDrivers: string[] = [];
  const longevityLimits: string[] = [];
  const longevityRisks: string[] = [];
  const longevityAdjustments = [
    crp ? (crp <= 1 ? 10 : crp <= 3 ? 0 : -12) : -2,
    vitaminD ? (vitaminD >= 35 && vitaminD <= 70 ? 8 : -4) : -2,
    exercise.toLowerCase().includes("4") || exercise.toLowerCase().includes("5") ? 7 : 0,
    includesAny(alcohol, ["7-14", "15+"]) ? -8 : includesAny(alcohol, ["3-6"]) ? -3 : 0,
    nicotine && !includesAny(nicotine, ["none", "former"]) ? -12 : 0
  ];
  addDriver(Boolean(crp && crp <= 1), longevityDrivers, "CRP is in a favorable wellness range.");
  addDriver(Boolean(vitaminD && vitaminD >= 35 && vitaminD <= 70), longevityDrivers, "Vitamin D is in the target optimization band.");
  addDriver(exercise.toLowerCase().includes("4") || exercise.toLowerCase().includes("5"), longevityDrivers, "Exercise frequency supports longevity fundamentals.");
  addDriver(!crp, longevityLimits, "CRP has not been logged.");
  addDriver(Boolean(crp && crp > 3), longevityRisks, "CRP is elevated; consult a licensed clinician for abnormal inflammatory markers.");
  addDriver(Boolean(vitaminD && vitaminD < 30), longevityLimits, "Vitamin D is below the desired optimization band.");
  addDriver(includesAny(alcohol, ["7-14", "15+"]), longevityLimits, "Current alcohol frequency works against recovery and longevity fundamentals.");
  addDriver(Boolean(nicotine && !includesAny(nicotine, ["none", "former"])), longevityRisks, "Nicotine or tobacco use is a high-priority longevity risk factor.");
  addDriver(Boolean(onboarding?.family_history_notes), longevityLimits, "Family history context supports proactive screening conversations with a licensed clinician.");
  const longevity = scoreFrom(68, longevityAdjustments);

  const cognitiveDrivers: string[] = [];
  const cognitiveLimits: string[] = [];
  const cognitiveRisks: string[] = [];
  const cognitiveAdjustments = [
    (energy - 5) * 4,
    (sleepQuality - 5) * 3,
    remSleep ? (remSleep >= 90 ? 7 : -4) : -2,
    -stress * 1.5,
    focus !== null ? (focus - 5) * 3 : 0,
    frequencyPenalty(brainFog, 2),
    includesAny(caffeine, ["3-4", "5+"]) ? -6 : 0
  ];
  addDriver(energy >= 7, cognitiveDrivers, "Energy input supports cognitive output.");
  addDriver(Boolean(remSleep && remSleep >= 90), cognitiveDrivers, "REM sleep supports cognitive recovery.");
  addDriver(Boolean(focus && focus >= 8), cognitiveDrivers, "Reported focus capacity is strong.");
  addDriver(stress >= 7, cognitiveLimits, "High stress may impair focus and working memory.");
  addDriver(energy <= 5, cognitiveLimits, "Energy input is limiting cognitive performance.");
  addDriver(Boolean(remSleep && remSleep < 75), cognitiveLimits, "REM sleep is below the preferred optimization target.");
  addDriver(includesAny(brainFog, ["often", "daily"]), cognitiveLimits, "Frequent brain fog is limiting cognitive consistency.");
  addDriver(includesAny(caffeine, ["3-4", "5+"]), cognitiveLimits, "High caffeine intake may be masking sleep pressure or unstable energy.");
  addDriver(Boolean(cortisol && cortisol > 22), cognitiveRisks, "Cortisol appears elevated; discuss hormone concerns with a licensed clinician.");
  const cognitive = scoreFrom(64, cognitiveAdjustments);

  const beautyDrivers: string[] = [];
  const beautyLimits: string[] = [];
  const beautyRisks: string[] = [];
  const beautyAdjustments = [
    (sleepQuality - 5) * 3,
    deepSleep ? (deepSleep >= 75 ? 8 : -4) : -2,
    vitaminD ? (vitaminD >= 35 ? 5 : -5) : -2,
    -stress,
    skinQuality !== null ? (skinQuality - 5) * 2 : 0,
    hydration !== null ? (hydration - 5) * 2 : 0
  ];
  addDriver(sleepQuality >= 7, beautyDrivers, "Sleep quality supports skin and recovery rhythms.");
  addDriver(Boolean(deepSleep && deepSleep >= 75), beautyDrivers, "Deep sleep supports tissue repair and recovery.");
  addDriver(Boolean(hydration && hydration >= 8), beautyDrivers, "Reported hydration consistency supports skin and tissue wellness.");
  addDriver(stress >= 7, beautyLimits, "High stress may work against skin and wellness optimization.");
  addDriver(Boolean(deepSleep && deepSleep < 60), beautyLimits, "Deep sleep is below the preferred recovery target.");
  addDriver(Boolean(vitaminD && vitaminD < 30), beautyLimits, "Vitamin D is below the desired wellness band.");
  addDriver(Boolean(hydration && hydration <= 4), beautyLimits, "Low reported hydration is limiting Beauty pillar fundamentals.");
  addDriver(Boolean(skinQuality && skinQuality <= 4), beautyLimits, "Skin quality is below the user's desired wellness baseline.");
  addDriver(Boolean(cortisol && cortisol > 22), beautyRisks, "Hormonal concerns should be reviewed with a licensed clinician.");
  const beauty = scoreFrom(66, beautyAdjustments);

  return [
    {
      pillar: "Metabolic",
      score: metabolic,
      status: status(metabolic),
      metrics: [`Glucose: ${glucose ?? "not logged"}`, `HbA1c: ${hba1c ?? "not logged"}`, `Sugar cravings: ${cravings ?? "not set"}`],
      keyDrivers: metabolicDrivers.length ? metabolicDrivers : ["Metabolic score is based on glucose, HbA1c, insulin, and energy inputs."],
      limitingFactors: metabolicLimits,
      riskFlags: metabolicRisks,
      nextAction: includesAny(cravings, ["often", "daily"]) || includesAny(crashes, ["often", "daily"]) ? "Build the first two meals around protein, fiber, and a 10-minute post-meal walk." : glucose && glucose > 100 ? "Add a 10-minute walk after your largest meal." : "Anchor protein and fiber at breakfast."
    },
    {
      pillar: "Recovery",
      score: recovery,
      status: status(recovery),
      metrics: [`Sleep quality: ${sleepQuality}/10`, `HRV: ${hrv ?? "not logged"}`, `RHR: ${rhr ?? "not logged"}`],
      keyDrivers: recoveryDrivers.length ? recoveryDrivers : ["Recovery score is driven by sleep, HRV, resting heart rate, and stress load."],
      limitingFactors: recoveryLimits,
      riskFlags: recoveryRisks,
      nextAction: sleepDuration !== null && sleepDuration < 7 ? "Protect an 8-hour sleep opportunity with a fixed wake time and low-light wind-down." : stress >= 7 ? "Add two five-minute downshift breaks and keep training intensity submaximal today." : "Set a fixed wake time and a 60-minute low-light wind-down."
    },
    {
      pillar: "Longevity",
      score: longevity,
      status: status(longevity),
      metrics: [`CRP: ${crp ?? "not logged"}`, `Alcohol: ${alcohol ?? "not set"}`, `Nicotine: ${nicotine ?? "not set"}`],
      keyDrivers: longevityDrivers.length ? longevityDrivers : ["Longevity score is based on inflammation, vitamin D, and exercise consistency."],
      limitingFactors: longevityLimits,
      riskFlags: longevityRisks,
      nextAction: nicotine && !includesAny(nicotine, ["none", "former"]) ? "Discuss a supported nicotine cessation plan with a licensed healthcare provider." : includesAny(alcohol, ["7-14", "15+"]) ? "Choose three alcohol-free recovery nights this week and track sleep quality." : "Schedule two zone-2 sessions and one strength session this week."
    },
    {
      pillar: "Cognitive",
      score: cognitive,
      status: status(cognitive),
      metrics: [`Focus: ${focus ?? "not set"}/10`, `Brain fog: ${brainFog ?? "not set"}`, `Caffeine: ${caffeine ?? "not set"}`],
      keyDrivers: cognitiveDrivers.length ? cognitiveDrivers : ["Cognitive score reflects energy, stress, sleep quality, and REM sleep."],
      limitingFactors: cognitiveLimits,
      riskFlags: cognitiveRisks,
      nextAction: includesAny(brainFog, ["often", "daily"]) && includesAny(caffeine, ["3-4", "5+"]) ? "Delay caffeine 60-90 minutes after waking and track focus before adding another serving." : "Do your hardest cognitive block before caffeine dose two."
    },
    {
      pillar: "Beauty",
      score: beauty,
      status: status(beauty),
      metrics: [`Skin quality: ${skinQuality ?? "not set"}/10`, `Hydration: ${hydration ?? "not set"}/10`, `Sleep quality: ${sleepQuality}/10`],
      keyDrivers: beautyDrivers.length ? beautyDrivers : ["Beauty score is based on sleep quality, deep sleep, vitamin D, and stress."],
      limitingFactors: beautyLimits,
      riskFlags: beautyRisks,
      nextAction: hydration !== null && hydration <= 5 ? "Set three hydration anchors: waking, midday, and with your final meal." : "Prioritize hydration, evening light hygiene, and consistent sleep timing."
    }
  ];
}
