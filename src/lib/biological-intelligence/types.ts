import type { BiomarkerEntry, LabReport, NormalizedLabMarker, OnboardingData, PillarName, PillarScore } from "@/types/database";

export type InsightSeverity = "low" | "moderate" | "high" | "priority";
export type InsightType = "constraint" | "opportunity" | "trend" | "risk_flag" | "protocol_priority" | "missing_data";
export type InsightStatus = "active" | "resolved" | "dismissed";
export type InsightSourceType = "biomarker" | "lab" | "lifestyle" | "pillar" | "missing_data";

export type MarkerKey =
  | "fasting_glucose"
  | "hba1c"
  | "fasting_insulin"
  | "crp"
  | "hscrp"
  | "vitamin_d"
  | "testosterone"
  | "cortisol"
  | "hrv"
  | "resting_heart_rate"
  | "sleep_duration"
  | "sleep_quality"
  | "caffeine"
  | "alcohol"
  | "nicotine"
  | "exercise_frequency"
  | "strength_training"
  | "zone_2_cardio";

export type MarkerValue = {
  key: MarkerKey;
  label: string;
  value: number | string;
  unit?: string | null;
  sourceType: InsightSourceType;
  sourceId?: string | null;
};

export type BiomarkerRule = {
  key: MarkerKey;
  label: string;
  unit?: string;
  optimalRange?: { min?: number; max?: number };
  acceptableRange?: { min?: number; max?: number };
  lowFlag?: string;
  highFlag?: string;
  associatedPillars: PillarName[];
  confidenceImpact: number;
  suggestedActions: string[];
  educationalSummary: string;
  lowerIsBetter?: boolean;
};

export type MarkerInterpretation = {
  marker: MarkerValue;
  rule: BiomarkerRule;
  status: "optimal" | "acceptable" | "low" | "high" | "unknown";
  severity: InsightSeverity;
  confidenceImpact: number;
  associatedPillars: PillarName[];
  summary: string;
  suggestedActions: string[];
};

export type PillarImpact = {
  pillar: PillarName;
  score: number;
  constraints: string[];
  opportunities: string[];
  riskFlags: string[];
  confidenceScore: number;
};

export type BiologicalIntelligenceContext = {
  userId: string;
  onboarding: OnboardingData | null;
  latestBiomarkers: BiomarkerEntry | null;
  latestLabReport: LabReport | null;
  pillarScores: PillarScore[];
};

export type MissingDataInsight = {
  key: string;
  title: string;
  summary: string;
  recommendedAction: string;
  pillar: PillarName;
  priority: number;
  confidenceScore: number;
};

export type BiologicalInsight = {
  user_id: string;
  source_type: InsightSourceType;
  source_id?: string | null;
  insight_type: InsightType;
  pillar: PillarName | "System";
  severity: InsightSeverity;
  confidence_score: number;
  title: string;
  summary: string;
  evidence: Record<string, unknown>;
  recommended_actions: string[];
  status: InsightStatus;
};

export type StoredBiologicalInsight = BiologicalInsight & {
  id: string;
  created_at: string;
  updated_at: string;
};

export type BiologicalIntelligenceSummary = {
  primaryConstraint: PillarImpact | null;
  secondaryConstraints: PillarImpact[];
  topOpportunity: string | null;
  confidenceScore: number;
  pillarImpacts: PillarImpact[];
  missingData: MissingDataInsight[];
  insightCounts: Record<InsightType, number>;
  latestLabMarkers: NormalizedLabMarker[];
};
