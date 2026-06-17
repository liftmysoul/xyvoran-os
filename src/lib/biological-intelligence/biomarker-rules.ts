import type { BiomarkerEntry, LabReport, OnboardingData } from "@/types/database";
import type { BiomarkerRule, InsightSourceType, MarkerInterpretation, MarkerKey, MarkerValue } from "@/lib/biological-intelligence/types";

export const biomarkerRules: Record<MarkerKey, BiomarkerRule> = {
  fasting_glucose: {
    key: "fasting_glucose",
    label: "Fasting glucose",
    unit: "mg/dL",
    optimalRange: { min: 75, max: 95 },
    acceptableRange: { min: 70, max: 105 },
    lowFlag: "Fasting glucose is below the optimization range.",
    highFlag: "Fasting glucose is above the optimization range.",
    associatedPillars: ["Metabolic", "Cognitive", "Longevity"],
    confidenceImpact: 10,
    suggestedActions: ["Prioritize protein and fiber at the first meal.", "Add a 10-minute walk after higher-carbohydrate meals.", "Review abnormal glucose values with a licensed clinician."],
    educationalSummary: "Fasting glucose helps estimate metabolic flexibility and morning glucose regulation."
  },
  hba1c: {
    key: "hba1c",
    label: "HbA1c",
    unit: "%",
    optimalRange: { min: 4.8, max: 5.4 },
    acceptableRange: { min: 4.6, max: 5.7 },
    lowFlag: "HbA1c is below the expected optimization range.",
    highFlag: "HbA1c is above the optimization range.",
    associatedPillars: ["Metabolic", "Longevity"],
    confidenceImpact: 12,
    suggestedActions: ["Pair carbohydrates with protein, fiber, and movement.", "Track fasting and post-meal glucose patterns.", "Consult a healthcare professional for abnormal glycemic labs."],
    educationalSummary: "HbA1c provides a longer-range view of glucose exposure."
  },
  fasting_insulin: {
    key: "fasting_insulin",
    label: "Fasting insulin",
    unit: "uIU/mL",
    optimalRange: { min: 2, max: 8 },
    acceptableRange: { min: 2, max: 15 },
    lowFlag: "Fasting insulin is below the optimization context range.",
    highFlag: "Fasting insulin is above the optimization range.",
    associatedPillars: ["Metabolic", "Beauty", "Longevity"],
    confidenceImpact: 9,
    suggestedActions: ["Build meals around protein, plants, and minimally processed carbohydrates.", "Use resistance training to improve glucose disposal.", "Review abnormal insulin results with a clinician."],
    educationalSummary: "Fasting insulin helps contextualize metabolic efficiency and energy stability."
  },
  crp: {
    key: "crp",
    label: "CRP",
    unit: "mg/L",
    optimalRange: { min: 0, max: 1 },
    acceptableRange: { min: 0, max: 3 },
    highFlag: "CRP is above the optimization range.",
    associatedPillars: ["Longevity", "Recovery", "Beauty"],
    confidenceImpact: 10,
    suggestedActions: ["Emphasize sleep consistency and recovery days.", "Increase colorful plants and omega-3-rich foods.", "Discuss elevated inflammatory markers with a licensed clinician."],
    educationalSummary: "CRP is a general inflammation signal and is not diagnostic by itself.",
    lowerIsBetter: true
  },
  hscrp: {
    key: "hscrp",
    label: "hsCRP",
    unit: "mg/L",
    optimalRange: { min: 0, max: 1 },
    acceptableRange: { min: 0, max: 3 },
    highFlag: "hsCRP is above the optimization range.",
    associatedPillars: ["Longevity", "Recovery", "Cognitive"],
    confidenceImpact: 11,
    suggestedActions: ["Prioritize recovery, oral health, and anti-inflammatory nutrition patterns.", "Avoid interpreting one value in isolation.", "Consult a clinician for persistently elevated hsCRP."],
    educationalSummary: "hsCRP is a sensitive inflammation signal used for wellness context, not diagnosis.",
    lowerIsBetter: true
  },
  vitamin_d: {
    key: "vitamin_d",
    label: "Vitamin D",
    unit: "ng/mL",
    optimalRange: { min: 35, max: 70 },
    acceptableRange: { min: 30, max: 80 },
    lowFlag: "Vitamin D is below the optimization range.",
    highFlag: "Vitamin D is above the broad optimization range.",
    associatedPillars: ["Recovery", "Longevity", "Beauty"],
    confidenceImpact: 8,
    suggestedActions: ["Consider safe sunlight exposure and dietary sources.", "Retest after lifestyle or clinician-guided supplementation changes.", "Consult a licensed professional before high-dose supplementation."],
    educationalSummary: "Vitamin D contributes to recovery, immune resilience, and general wellness context."
  },
  testosterone: {
    key: "testosterone",
    label: "Testosterone",
    unit: "ng/dL",
    optimalRange: { min: 450, max: 900 },
    acceptableRange: { min: 300, max: 1000 },
    lowFlag: "Testosterone is below the general optimization range.",
    highFlag: "Testosterone is above the general optimization range.",
    associatedPillars: ["Recovery", "Cognitive", "Beauty"],
    confidenceImpact: 7,
    suggestedActions: ["Prioritize sleep, resistance training, adequate energy intake, and stress regulation.", "Interpret hormones with symptoms, sex, age, and clinician guidance.", "Do not change prescribed medications without medical supervision."],
    educationalSummary: "Hormone values need individualized clinical interpretation and are not diagnostic here."
  },
  cortisol: {
    key: "cortisol",
    label: "Cortisol",
    unit: "ug/dL",
    optimalRange: { min: 6, max: 18 },
    acceptableRange: { min: 4, max: 22 },
    lowFlag: "Cortisol is below the broad optimization context range.",
    highFlag: "Cortisol is above the broad optimization context range.",
    associatedPillars: ["Recovery", "Cognitive", "Beauty"],
    confidenceImpact: 7,
    suggestedActions: ["Use morning light, consistent meals, and planned downshift breaks.", "Interpret cortisol timing carefully.", "Consult a licensed clinician for hormonal concerns."],
    educationalSummary: "Cortisol is time-sensitive and should be interpreted cautiously."
  },
  hrv: {
    key: "hrv",
    label: "HRV",
    unit: "ms",
    optimalRange: { min: 55 },
    acceptableRange: { min: 35 },
    lowFlag: "HRV is below the recovery optimization range.",
    associatedPillars: ["Recovery", "Cognitive", "Longevity"],
    confidenceImpact: 10,
    suggestedActions: ["Protect sleep timing and reduce late alcohol or heavy meals.", "Use zone 2 movement or breathwork on low-readiness days.", "Track trends instead of judging one reading."],
    educationalSummary: "HRV helps estimate autonomic recovery and readiness."
  },
  resting_heart_rate: {
    key: "resting_heart_rate",
    label: "Resting heart rate",
    unit: "bpm",
    optimalRange: { min: 45, max: 62 },
    acceptableRange: { min: 40, max: 75 },
    lowFlag: "Resting heart rate is below the broad wellness context range.",
    highFlag: "Resting heart rate is above the recovery optimization range.",
    associatedPillars: ["Recovery", "Longevity"],
    confidenceImpact: 8,
    suggestedActions: ["Improve aerobic base with easy zone 2 sessions.", "Review sleep, hydration, heat, alcohol, and stress context.", "Seek medical care for symptoms or abnormal readings."],
    educationalSummary: "Resting heart rate is a practical recovery and aerobic fitness signal."
  },
  sleep_duration: {
    key: "sleep_duration",
    label: "Sleep duration",
    unit: "hours",
    optimalRange: { min: 7, max: 9 },
    acceptableRange: { min: 6, max: 10 },
    lowFlag: "Sleep duration is below the optimization range.",
    highFlag: "Sleep duration is above the broad expected range.",
    associatedPillars: ["Recovery", "Cognitive", "Beauty"],
    confidenceImpact: 10,
    suggestedActions: ["Protect an 8-hour sleep opportunity.", "Anchor a consistent wake time.", "Reduce bright light and heavy stimulation before bed."],
    educationalSummary: "Sleep duration is a foundational recovery signal."
  },
  sleep_quality: {
    key: "sleep_quality",
    label: "Sleep quality",
    optimalRange: { min: 8, max: 10 },
    acceptableRange: { min: 6, max: 10 },
    lowFlag: "Sleep quality is below the optimization range.",
    associatedPillars: ["Recovery", "Cognitive", "Beauty"],
    confidenceImpact: 8,
    suggestedActions: ["Stabilize bedtime, wake time, room temperature, and wind-down rhythm.", "Track caffeine and alcohol effects on sleep quality."],
    educationalSummary: "Subjective sleep quality helps explain recovery and energy patterns."
  },
  caffeine: {
    key: "caffeine",
    label: "Caffeine",
    acceptableRange: { min: 0, max: 2 },
    highFlag: "Caffeine intake may be high for recovery or sleep quality.",
    associatedPillars: ["Cognitive", "Recovery"],
    confidenceImpact: 5,
    suggestedActions: ["Delay caffeine 60-90 minutes after waking.", "Set a caffeine cutoff 8-10 hours before sleep.", "Reduce gradually if intake is high."],
    educationalSummary: "Caffeine timing can influence focus, stress perception, and sleep quality."
  },
  alcohol: {
    key: "alcohol",
    label: "Alcohol",
    acceptableRange: { min: 0, max: 2 },
    highFlag: "Alcohol frequency may limit recovery and HRV.",
    associatedPillars: ["Recovery", "Longevity", "Beauty"],
    confidenceImpact: 7,
    suggestedActions: ["Experiment with alcohol-free recovery windows.", "Avoid alcohol close to bedtime.", "Track HRV and sleep response."],
    educationalSummary: "Alcohol can reduce sleep quality and recovery even when calories are controlled."
  },
  nicotine: {
    key: "nicotine",
    label: "Nicotine / tobacco",
    acceptableRange: { min: 0, max: 0 },
    highFlag: "Nicotine or tobacco use is a high-priority longevity constraint.",
    associatedPillars: ["Longevity", "Beauty", "Recovery"],
    confidenceImpact: 9,
    suggestedActions: ["Consider a clinician-supported cessation plan.", "Track triggers and replacement behaviors.", "Do not stop prescribed therapies without medical guidance."],
    educationalSummary: "Nicotine and tobacco exposure are major wellness and longevity constraints."
  },
  exercise_frequency: {
    key: "exercise_frequency",
    label: "Exercise frequency",
    optimalRange: { min: 4 },
    acceptableRange: { min: 2 },
    lowFlag: "Exercise frequency may be too low for optimization.",
    associatedPillars: ["Metabolic", "Longevity", "Cognitive"],
    confidenceImpact: 7,
    suggestedActions: ["Build toward 3-5 weekly movement sessions.", "Include easy aerobic work and resistance training.", "Progress gradually if recovery is limited."],
    educationalSummary: "Consistent movement supports metabolic health, cognition, and longevity."
  },
  strength_training: {
    key: "strength_training",
    label: "Strength training",
    optimalRange: { min: 2 },
    acceptableRange: { min: 1 },
    lowFlag: "Strength training signal is low or missing.",
    associatedPillars: ["Metabolic", "Longevity", "Beauty"],
    confidenceImpact: 6,
    suggestedActions: ["Add 2 full-body resistance sessions weekly.", "Prioritize form and progressive overload.", "Match intensity to recovery capacity."],
    educationalSummary: "Strength training supports glucose disposal, lean mass, and body composition."
  },
  zone_2_cardio: {
    key: "zone_2_cardio",
    label: "Zone 2 cardio",
    optimalRange: { min: 2 },
    acceptableRange: { min: 1 },
    lowFlag: "Zone 2 cardio signal is low or missing.",
    associatedPillars: ["Recovery", "Metabolic", "Longevity"],
    confidenceImpact: 6,
    suggestedActions: ["Add 1-3 easy conversational cardio sessions weekly.", "Keep intensity sustainable.", "Use HRV and fatigue to adjust volume."],
    educationalSummary: "Zone 2 work supports aerobic base and metabolic flexibility."
  }
};

function numericStatus(value: number, rule: BiomarkerRule): MarkerInterpretation["status"] {
  const optimal = (!rule.optimalRange?.min || value >= rule.optimalRange.min) && (!rule.optimalRange?.max || value <= rule.optimalRange.max);
  if (optimal) return "optimal";
  const low = rule.acceptableRange?.min !== undefined && value < rule.acceptableRange.min;
  const high = rule.acceptableRange?.max !== undefined && value > rule.acceptableRange.max;
  if (low) return "low";
  if (high) return "high";
  return "acceptable";
}

function severityFor(status: MarkerInterpretation["status"], confidence: number) {
  if (status === "high" || status === "low") return confidence >= 9 ? "high" : "moderate";
  if (status === "acceptable") return "low";
  return "low";
}

function rankText(value: string | null | undefined) {
  const text = value?.toLowerCase() ?? "";
  if (text.includes("daily") || text.includes("15+") || text.includes("5+")) return 4;
  if (text.includes("often") || text.includes("7-14") || text.includes("3-4")) return 3;
  if (text.includes("sometimes") || text.includes("3-6") || text.includes("1-2")) return 2;
  if (text.includes("rare") || text.includes("former")) return 1;
  if (text.includes("none") || text.includes("never")) return 0;
  return Number.NaN;
}

function exerciseRank(value: string | null | undefined) {
  const text = value?.toLowerCase() ?? "";
  const number = Number.parseInt(text.match(/\d+/)?.[0] ?? "", 10);
  if (Number.isFinite(number)) return number;
  if (text.includes("daily")) return 5;
  if (text.includes("none") || text.includes("never")) return 0;
  return Number.NaN;
}

export function collectMarkerValues(input: { onboarding: OnboardingData | null; biomarkers: BiomarkerEntry | null; labReport: LabReport | null }): MarkerValue[] {
  const values: MarkerValue[] = [];
  const { onboarding, biomarkers, labReport } = input;
  const pushNumber = (key: MarkerKey, value: unknown, unit?: string | null, sourceType: InsightSourceType = "biomarker", sourceId?: string | null) => {
    if (typeof value === "number" && Number.isFinite(value)) values.push({ key, label: biomarkerRules[key].label, value, unit, sourceType, sourceId });
  };
  pushNumber("fasting_glucose", biomarkers?.fasting_glucose, "mg/dL");
  pushNumber("hba1c", biomarkers?.hba1c, "%");
  pushNumber("fasting_insulin", biomarkers?.insulin, "uIU/mL");
  pushNumber("crp", biomarkers?.crp, "mg/L");
  pushNumber("vitamin_d", biomarkers?.vitamin_d, "ng/mL");
  pushNumber("testosterone", biomarkers?.testosterone, "ng/dL");
  pushNumber("cortisol", biomarkers?.cortisol, "ug/dL");
  pushNumber("hrv", biomarkers?.hrv ?? onboarding?.hrv, "ms");
  pushNumber("resting_heart_rate", biomarkers?.resting_heart_rate ?? onboarding?.resting_heart_rate, "bpm");
  pushNumber("sleep_duration", biomarkers?.sleep_duration ?? onboarding?.sleep_duration, "hours");
  pushNumber("sleep_quality", onboarding?.sleep_quality, null, "lifestyle");
  const lifestyle: Array<[MarkerKey, string | null | undefined, number]> = [
    ["caffeine", onboarding?.caffeine_intake, rankText(onboarding?.caffeine_intake)],
    ["alcohol", onboarding?.alcohol_use, rankText(onboarding?.alcohol_use)],
    ["nicotine", onboarding?.nicotine_use, rankText(onboarding?.nicotine_use)],
    ["exercise_frequency", onboarding?.exercise_frequency, exerciseRank(onboarding?.exercise_frequency)],
    ["strength_training", onboarding?.exercise_frequency, onboarding?.exercise_frequency?.toLowerCase().includes("strength") ? 2 : Number.NaN],
    ["zone_2_cardio", onboarding?.exercise_frequency, onboarding?.exercise_frequency?.toLowerCase().includes("zone") || onboarding?.exercise_frequency?.toLowerCase().includes("cardio") ? 2 : Number.NaN]
  ];
  for (const [key, original, rank] of lifestyle) {
    if (Number.isFinite(rank)) values.push({ key, label: biomarkerRules[key].label, value: rank, unit: original ?? null, sourceType: "lifestyle" });
  }
  const labMarkers = labReport?.analysis_json?.biomarkers ?? [];
  for (const marker of labMarkers) {
    const normalizedKey = marker.key === "insulin" ? "fasting_insulin" : marker.key === "hs_crp" ? "hscrp" : marker.key;
    if (normalizedKey in biomarkerRules) values.push({ key: normalizedKey as MarkerKey, label: marker.name, value: marker.value, unit: marker.unit, sourceType: "lab", sourceId: labReport?.id ?? null });
  }
  return values;
}

export function interpretMarker(marker: MarkerValue): MarkerInterpretation {
  const rule = biomarkerRules[marker.key];
  const status = typeof marker.value === "number" ? numericStatus(marker.value, rule) : "unknown";
  const flag = status === "low" ? rule.lowFlag : status === "high" ? rule.highFlag : undefined;
  return {
    marker,
    rule,
    status,
    severity: severityFor(status, rule.confidenceImpact),
    confidenceImpact: status === "optimal" ? Math.round(rule.confidenceImpact * 0.6) : rule.confidenceImpact,
    associatedPillars: rule.associatedPillars,
    summary: flag ?? (status === "optimal" ? `${rule.label} is within the optimization range.` : `${rule.label} is near the optimization range.`),
    suggestedActions: rule.suggestedActions
  };
}

export function interpretMarkers(markers: MarkerValue[]) {
  const latestByKey = new Map<MarkerKey, MarkerValue>();
  for (const marker of markers) latestByKey.set(marker.key, marker);
  return [...latestByKey.values()].map(interpretMarker);
}
