import type { BiomarkerEntry, LabReport, OnboardingData, PillarName } from "@/types/database";
import type { MissingDataInsight } from "@/lib/biological-intelligence/types";

type MissingRule = {
  key: string;
  title: string;
  summary: string;
  recommendedAction: string;
  pillar: PillarName;
  priority: number;
  isMissing: (input: { onboarding: OnboardingData | null; biomarkers: BiomarkerEntry | null; labReport: LabReport | null }) => boolean;
};

const missingRules: MissingRule[] = [
  {
    key: "hrv",
    title: "HRV signal missing",
    summary: "Recovery intelligence is limited without HRV trend data.",
    recommendedAction: "Add HRV to improve recovery intelligence.",
    pillar: "Recovery",
    priority: 95,
    isMissing: ({ onboarding, biomarkers }) => typeof biomarkers?.hrv !== "number" && typeof onboarding?.hrv !== "number"
  },
  {
    key: "sleep",
    title: "Sleep signal missing",
    summary: "Sleep duration is one of the highest-leverage recovery and cognitive signals.",
    recommendedAction: "Log sleep duration or connect wearable sleep data.",
    pillar: "Recovery",
    priority: 92,
    isMissing: ({ onboarding, biomarkers }) => typeof biomarkers?.sleep_duration !== "number" && typeof onboarding?.sleep_duration !== "number"
  },
  {
    key: "glucose",
    title: "Glucose signal missing",
    summary: "Metabolic intelligence is limited without fasting glucose.",
    recommendedAction: "Add fasting glucose or upload bloodwork to activate metabolic pattern analysis.",
    pillar: "Metabolic",
    priority: 88,
    isMissing: ({ biomarkers, labReport }) => typeof biomarkers?.fasting_glucose !== "number" && !(labReport?.analysis_json?.biomarkers ?? []).some((item) => ["glucose", "fasting_glucose"].includes(item.key))
  },
  {
    key: "hba1c",
    title: "HbA1c missing",
    summary: "Longer-range glucose exposure cannot be estimated without HbA1c.",
    recommendedAction: "Add HbA1c from recent bloodwork for stronger metabolic and longevity intelligence.",
    pillar: "Metabolic",
    priority: 84,
    isMissing: ({ biomarkers, labReport }) => typeof biomarkers?.hba1c !== "number" && !(labReport?.analysis_json?.biomarkers ?? []).some((item) => ["hba1c", "a1c"].includes(item.key))
  },
  {
    key: "crp",
    title: "CRP or hsCRP missing",
    summary: "Inflammation context is incomplete without CRP or hsCRP.",
    recommendedAction: "Upload bloodwork with CRP or hsCRP to improve longevity and recovery intelligence.",
    pillar: "Longevity",
    priority: 80,
    isMissing: ({ biomarkers, labReport }) => typeof biomarkers?.crp !== "number" && !(labReport?.analysis_json?.biomarkers ?? []).some((item) => ["crp", "hscrp", "hs_crp"].includes(item.key))
  },
  {
    key: "vitamin_d",
    title: "Vitamin D missing",
    summary: "Recovery, immune resilience, and wellness context are limited without Vitamin D.",
    recommendedAction: "Add Vitamin D from lab data to improve recovery and longevity recommendations.",
    pillar: "Recovery",
    priority: 72,
    isMissing: ({ biomarkers, labReport }) => typeof biomarkers?.vitamin_d !== "number" && !(labReport?.analysis_json?.biomarkers ?? []).some((item) => item.key === "vitamin_d")
  },
  {
    key: "bloodwork",
    title: "Bloodwork not connected",
    summary: "Lab intelligence is not active without uploaded bloodwork.",
    recommendedAction: "Upload a recent bloodwork PDF or image to activate lab-driven optimization insights.",
    pillar: "Longevity",
    priority: 90,
    isMissing: ({ labReport }) => !labReport?.analysis_json?.biomarkers?.length
  }
];

export function rankMissingData(input: { onboarding: OnboardingData | null; biomarkers: BiomarkerEntry | null; labReport: LabReport | null }): MissingDataInsight[] {
  return missingRules
    .filter((rule) => rule.isMissing(input))
    .sort((a, b) => b.priority - a.priority)
    .map((rule) => ({
      key: rule.key,
      title: rule.title,
      summary: rule.summary,
      recommendedAction: rule.recommendedAction,
      pillar: rule.pillar,
      priority: rule.priority,
      confidenceScore: Math.min(95, Math.round(rule.priority * 0.92))
    }));
}
