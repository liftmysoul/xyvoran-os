import type { BiomarkerEntry, OnboardingData, PillarScore } from "@/types/database";
import { getDictionary, type Language } from "@/lib/i18n";

const clamp = (value: number) => Math.max(0, Math.min(100, Math.round(value)));

function latestValue(entry: BiomarkerEntry | null | undefined, key: keyof BiomarkerEntry) {
  const value = entry?.[key];
  return typeof value === "number" ? value : null;
}

function status(score: number, copy: ReturnType<typeof getDictionary>["optimization"]["scoring"]) {
  if (score >= 82) return copy.optimized;
  if (score >= 66) return copy.stable;
  if (score >= 48) return copy.needsAttention;
  return copy.foundationFirst;
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
  latestBiomarkers?: BiomarkerEntry | null,
  language: Language = "en"
): PillarScore[] {
  const t = getDictionary(language).optimization.scoring;
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
  addDriver(Boolean(glucose && glucose <= 95), metabolicDrivers, t.glucoseFavorable);
  addDriver(Boolean(hba1c && hba1c <= 5.4), metabolicDrivers, t.hba1cFavorable);
  addDriver(energy >= 7, metabolicDrivers, t.energyStrong);
  addDriver(Boolean(fastingHours && fastingHours >= 12), metabolicDrivers, t.fastingRhythm);
  addDriver(!glucose, metabolicLimits, t.glucoseMissing);
  addDriver(Boolean(glucose && glucose > 100), metabolicLimits, t.glucoseHigh);
  addDriver(Boolean(hba1c && hba1c > 5.7), metabolicRisks, t.hba1cHigh);
  addDriver(Boolean(insulin && insulin > 15), metabolicLimits, t.insulinHigh);
  addDriver(includesAny(cravings, ["often", "daily"]), metabolicLimits, t.cravingsFrequent);
  addDriver(includesAny(crashes, ["often", "daily"]), metabolicLimits, t.crashesFrequent);
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
  addDriver(sleepQuality >= 7, recoveryDrivers, t.sleepSupportive);
  addDriver(Boolean(sleepDuration && sleepDuration >= 7), recoveryDrivers, t.sleepDurationGood);
  addDriver(Boolean(hrv && hrv >= 55), recoveryDrivers, t.hrvReady);
  addDriver(stress >= 7, recoveryLimits, t.stressRecovery);
  addDriver(Boolean(sleepDuration && sleepDuration < 7), recoveryLimits, t.sleepDurationLow);
  addDriver(Boolean(hrv && hrv < 35), recoveryRisks, t.hrvLow);
  addDriver(Boolean(rhr && rhr > 75), recoveryLimits, t.rhrHigh);
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
  addDriver(Boolean(crp && crp <= 1), longevityDrivers, t.crpFavorable);
  addDriver(Boolean(vitaminD && vitaminD >= 35 && vitaminD <= 70), longevityDrivers, t.vitaminDTarget);
  addDriver(exercise.toLowerCase().includes("4") || exercise.toLowerCase().includes("5"), longevityDrivers, t.exerciseLongevity);
  addDriver(!crp, longevityLimits, t.crpMissing);
  addDriver(Boolean(crp && crp > 3), longevityRisks, t.crpHigh);
  addDriver(Boolean(vitaminD && vitaminD < 30), longevityLimits, t.vitaminDLow);
  addDriver(includesAny(alcohol, ["7-14", "15+"]), longevityLimits, t.alcoholHigh);
  addDriver(Boolean(nicotine && !includesAny(nicotine, ["none", "former"])), longevityRisks, t.nicotineRisk);
  addDriver(Boolean(onboarding?.family_history_notes), longevityLimits, t.familyHistory);
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
  addDriver(energy >= 7, cognitiveDrivers, t.energyCognitive);
  addDriver(Boolean(remSleep && remSleep >= 90), cognitiveDrivers, t.remSupportive);
  addDriver(Boolean(focus && focus >= 8), cognitiveDrivers, t.focusStrong);
  addDriver(stress >= 7, cognitiveLimits, t.stressCognitive);
  addDriver(energy <= 5, cognitiveLimits, t.energyLimiting);
  addDriver(Boolean(remSleep && remSleep < 75), cognitiveLimits, t.remLow);
  addDriver(includesAny(brainFog, ["often", "daily"]), cognitiveLimits, t.brainFogFrequent);
  addDriver(includesAny(caffeine, ["3-4", "5+"]), cognitiveLimits, t.caffeineHigh);
  addDriver(Boolean(cortisol && cortisol > 22), cognitiveRisks, t.cortisolHigh);
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
  addDriver(sleepQuality >= 7, beautyDrivers, t.sleepSkin);
  addDriver(Boolean(deepSleep && deepSleep >= 75), beautyDrivers, t.deepSleepRepair);
  addDriver(Boolean(hydration && hydration >= 8), beautyDrivers, t.hydrationSupportive);
  addDriver(stress >= 7, beautyLimits, t.stressBeauty);
  addDriver(Boolean(deepSleep && deepSleep < 60), beautyLimits, t.deepSleepLow);
  addDriver(Boolean(vitaminD && vitaminD < 30), beautyLimits, t.vitaminDWellnessLow);
  addDriver(Boolean(hydration && hydration <= 4), beautyLimits, t.hydrationLow);
  addDriver(Boolean(skinQuality && skinQuality <= 4), beautyLimits, t.skinLow);
  addDriver(Boolean(cortisol && cortisol > 22), beautyRisks, t.hormoneReview);
  const beauty = scoreFrom(66, beautyAdjustments);

  const scores: PillarScore[] = [
    {
      pillar: "Metabolic",
      score: metabolic,
      status: status(metabolic, t),
      metrics: [`${t.glucose}: ${glucose ?? t.notLogged}`, `HbA1c: ${hba1c ?? t.notLogged}`, `${t.sugarCravings}: ${cravings ?? t.notSet}`],
      keyDrivers: metabolicDrivers.length ? metabolicDrivers : [t.metabolicBasis],
      limitingFactors: metabolicLimits,
      riskFlags: metabolicRisks,
      nextAction: includesAny(cravings, ["often", "daily"]) || includesAny(crashes, ["often", "daily"]) ? t.metabolicMeals : glucose && glucose > 100 ? t.postMealWalk : t.proteinBreakfast
    },
    {
      pillar: "Recovery",
      score: recovery,
      status: status(recovery, t),
      metrics: [`${t.sleepQuality}: ${sleepQuality}/10`, `HRV: ${hrv ?? t.notLogged}`, `${t.restingHeartRate}: ${rhr ?? t.notLogged}`],
      keyDrivers: recoveryDrivers.length ? recoveryDrivers : [t.recoveryBasis],
      limitingFactors: recoveryLimits,
      riskFlags: recoveryRisks,
      nextAction: sleepDuration !== null && sleepDuration < 7 ? t.sleepOpportunity : stress >= 7 ? t.downshiftBreaks : t.fixedWake
    },
    {
      pillar: "Longevity",
      score: longevity,
      status: status(longevity, t),
      metrics: [`CRP: ${crp ?? t.notLogged}`, `${t.alcohol}: ${alcohol ?? t.notSet}`, `${t.nicotine}: ${nicotine ?? t.notSet}`],
      keyDrivers: longevityDrivers.length ? longevityDrivers : [t.longevityBasis],
      limitingFactors: longevityLimits,
      riskFlags: longevityRisks,
      nextAction: nicotine && !includesAny(nicotine, ["none", "former"]) ? t.nicotinePlan : includesAny(alcohol, ["7-14", "15+"]) ? t.alcoholFree : t.longevityTraining
    },
    {
      pillar: "Cognitive",
      score: cognitive,
      status: status(cognitive, t),
      metrics: [`${t.focus}: ${focus ?? t.notSet}/10`, `${t.brainFog}: ${brainFog ?? t.notSet}`, `${t.caffeine}: ${caffeine ?? t.notSet}`],
      keyDrivers: cognitiveDrivers.length ? cognitiveDrivers : [t.cognitiveBasis],
      limitingFactors: cognitiveLimits,
      riskFlags: cognitiveRisks,
      nextAction: includesAny(brainFog, ["often", "daily"]) && includesAny(caffeine, ["3-4", "5+"]) ? t.caffeineDelay : t.cognitiveBlock
    },
    {
      pillar: "Beauty",
      score: beauty,
      status: status(beauty, t),
      metrics: [`${t.skinQuality}: ${skinQuality ?? t.notSet}/10`, `${t.hydration}: ${hydration ?? t.notSet}/10`, `${t.sleepQuality}: ${sleepQuality}/10`],
      keyDrivers: beautyDrivers.length ? beautyDrivers : [t.beautyBasis],
      limitingFactors: beautyLimits,
      riskFlags: beautyRisks,
      nextAction: hydration !== null && hydration <= 5 ? t.hydrationAnchors : t.beautyFoundations
    }
  ];
  return scores;
}
