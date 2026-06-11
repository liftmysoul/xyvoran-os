export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Sex = "female" | "male" | "intersex" | "prefer_not_to_say";

export type OnboardingData = {
  id?: string;
  user_id?: string;
  full_name: string;
  age: number;
  sex: Sex;
  height_cm: number;
  weight_kg: number;
  main_goal: string;
  secondary_goals?: string[] | null;
  sleep_duration?: number | null;
  sleep_quality: number;
  stress_level: number;
  energy_level: number;
  hrv?: number | null;
  resting_heart_rate?: number | null;
  exercise_frequency: string;
  diet_style: string;
  waist_circumference_cm?: number | null;
  body_fat_percent?: number | null;
  fasting_hours?: number | null;
  eating_window_hours?: number | null;
  sugar_craving_frequency?: string | null;
  afternoon_energy_crash_frequency?: string | null;
  focus_level?: number | null;
  brain_fog_frequency?: string | null;
  caffeine_intake?: string | null;
  productivity_goal?: string | null;
  alcohol_use?: string | null;
  nicotine_use?: string | null;
  family_history_notes?: string | null;
  longevity_concern?: string | null;
  skin_quality?: number | null;
  hydration_level?: number | null;
  beauty_concern?: string | null;
  supplements: string;
  medications?: string | null;
  peptides?: string | null;
  wearables_used?: string | null;
  disclaimer_confirmed: boolean;
  created_at?: string;
  updated_at?: string;
};

export type BiomarkerEntry = {
  id?: string;
  user_id?: string;
  fasting_glucose?: number | null;
  hba1c?: number | null;
  insulin?: number | null;
  crp?: number | null;
  vitamin_d?: number | null;
  testosterone?: number | null;
  cortisol?: number | null;
  hrv?: number | null;
  resting_heart_rate?: number | null;
  sleep_duration?: number | null;
  deep_sleep?: number | null;
  rem_sleep?: number | null;
  notes?: string | null;
  created_at?: string;
};

export type PillarName = "Metabolic" | "Recovery" | "Longevity" | "Cognitive" | "Beauty";

export type PillarScore = {
  pillar: PillarName;
  score: number;
  status: string;
  metrics: string[];
  keyDrivers: string[];
  riskFlags: string[];
  limitingFactors: string[];
  nextAction: string;
};

export type ChatMessage = {
  id?: string;
  user_id?: string;
  role: "user" | "assistant";
  content: string;
  created_at?: string;
};

export type Protocol = {
  id?: string;
  user_id?: string;
  title?: string;
  goal: string;
  weakest_pillar?: PillarName | string | null;
  intensity?: ProtocolIntensity | null;
  protocol?: Json;
  protocol_json?: Json;
  status?: ProtocolStatus;
  created_at?: string;
};

export type ProtocolIntensity = "Beginner" | "Intermediate" | "Advanced";

export type ProtocolStatus = "active" | "completed" | "archived";

export type ProtocolDay = {
  day: number;
  sleep: string;
  nutrition: string;
  movement: string;
  recovery: string;
  tracking: string;
};

export type StructuredProtocol = {
  title: string;
  primaryGoal: string;
  weakestPillar: PillarName;
  intensity: ProtocolIntensity;
  sevenDayActionPlan: ProtocolDay[];
  safetyDisclaimer: string;
  metricsToMonitor: string[];
  whenToReassess: string;
  topPriorityActions: string[];
  contextSummary: string[];
};

export type LabProcessingStatus = "uploaded" | "processing" | "completed" | "failed";
export type LabMarkerStatus = "Optimal" | "Needs Attention" | "Priority Area";
export type LabCategory = "CBC" | "CMP" | "Lipids" | "Hormones" | "Inflammation" | "Nutrients" | "Other";

export type NormalizedLabMarker = {
  key: string;
  name: string;
  value: number;
  unit: string | null;
  referenceRange: string | null;
  category: LabCategory;
  status?: LabMarkerStatus;
  reason?: string;
  optimizationRange?: string;
  pillarImpacts?: Partial<Record<PillarName, number>>;
};

export type LabAnalysis = {
  biomarkers: NormalizedLabMarker[];
  topBiomarkers: NormalizedLabMarker[];
  biggestOpportunities: NormalizedLabMarker[];
  weakestCategory: LabCategory | null;
  priorityActions: string[];
  scoreImpacts: Partial<Record<PillarName, number>>;
  safetyFlags: string[];
  summary: string;
  analyzedAt: string;
};

export type LabReport = {
  id: string;
  user_id: string;
  file_name: string;
  file_type: string;
  file_path?: string | null;
  upload_date: string;
  processing_status: LabProcessingStatus;
  analysis_json: LabAnalysis | null;
  created_at: string;
};
