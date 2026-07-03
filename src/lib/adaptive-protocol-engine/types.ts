import type { BiomarkerEntry, BiologicalInsightRecord, LabReport, OnboardingData, PillarName, PillarScore, Protocol } from "@/types/database";
import type { BiologicalIntelligenceSummary } from "@/lib/biological-intelligence";

export type BiologicalConstraint =
  | "Recovery Capacity"
  | "Metabolic Flexibility"
  | "Inflammation Load"
  | "Hormonal Optimization"
  | "Cognitive Performance"
  | "Longevity Foundation"
  | "Lifestyle Consistency"
  | "Missing Data Limitation";

export type ProgressState = "Improving" | "Stable" | "Declining" | "Baseline established" | "Unknown due missing data";

export type RootCauseAnalysis = {
  constraint: BiologicalConstraint;
  confidence: number;
  primaryPillar: PillarName;
  evidence: string[];
  reasoning: string;
  clinicalContext: string;
  optimizationContext: string;
};

export type MissionPhase = {
  name: string;
  objective: string;
  actions: string[];
};

export type AdaptiveMission = {
  missionName: string;
  duration: string;
  primaryPillar: PillarName;
  constraint: BiologicalConstraint;
  confidence: number;
  progress: number;
  reason: string;
  phases: MissionPhase[];
  actions: string[];
  trackingSignals: string[];
  nextUpgrade: string;
  nextSignalNeeded: string;
  prioritySignals: string[];
  progressState: ProgressState;
  safetyNote: string;
};

export type AdaptiveProtocolContext = {
  userId: string;
  onboarding: OnboardingData | null;
  latestBiomarkers: BiomarkerEntry | null;
  latestLabReport: LabReport | null;
  previousLabReports?: LabReport[];
  pillarScores: PillarScore[];
  biologicalInsights: BiologicalInsightRecord[];
  biologicalIntelligence: BiologicalIntelligenceSummary;
  previousProtocols?: Protocol[];
  previousMissions?: AdaptiveMissionRecord[];
};

export type AdaptiveMissionRecord = {
  id: string;
  user_id: string;
  mission_name: string;
  primary_pillar: PillarName | string;
  constraint: BiologicalConstraint | string;
  confidence: number;
  progress: number;
  phases: unknown;
  actions: unknown;
  tracking_signals: unknown;
  created_at: string;
  updated_at: string;
  completed_at?: string | null;
};
