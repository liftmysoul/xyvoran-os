import type { AdaptiveProtocolContext, BiologicalConstraint, RootCauseAnalysis } from "@/lib/adaptive-protocol-engine/types";
import { constraintPillars } from "@/lib/adaptive-protocol-engine/optimization-rules";

function clamp(value: number) {
  return Math.max(35, Math.min(96, Math.round(value)));
}

function markerValue(context: AdaptiveProtocolContext, key: string) {
  const lab = context.latestLabReport?.analysis_json?.biomarkers?.find((item) => [key, key.replace("_", "")].includes(item.key));
  return lab?.value ?? null;
}

function hasInsight(context: AdaptiveProtocolContext, text: string) {
  return context.biologicalInsights.some((insight) => `${insight.title} ${insight.summary}`.toLowerCase().includes(text));
}

export function analyzeRootCause(context: AdaptiveProtocolContext): RootCauseAnalysis {
  const evidence: string[] = [];
  const missingCount = context.biologicalIntelligence.missingData.length;
  const weakest = [...context.pillarScores].sort((a, b) => a.score - b.score)[0];
  const testosterone = context.latestBiomarkers?.testosterone ?? markerValue(context, "testosterone");
  const crp = context.latestBiomarkers?.crp ?? markerValue(context, "crp");
  const hrv = context.latestBiomarkers?.hrv ?? context.onboarding?.hrv ?? null;
  const glucose = context.latestBiomarkers?.fasting_glucose ?? markerValue(context, "glucose");
  const hba1c = context.latestBiomarkers?.hba1c ?? markerValue(context, "hba1c");
  const stress = context.onboarding?.stress_level ?? null;
  const sleep = context.latestBiomarkers?.sleep_duration ?? context.onboarding?.sleep_duration ?? null;

  let constraint: BiologicalConstraint = "Lifestyle Consistency";
  let score = 54;

  if (missingCount >= 5) {
    constraint = "Missing Data Limitation";
    evidence.push(`${missingCount} priority biological signals are still missing.`);
    score += 18;
  }
  if ((typeof crp === "number" && crp > 1) || hasInsight(context, "inflammation")) {
    constraint = "Inflammation Load";
    evidence.push("Inflammation marker appears outside the configured optimization target.");
    score += 16;
  }
  if ((typeof glucose === "number" && glucose > 95) || (typeof hba1c === "number" && hba1c > 5.4)) {
    constraint = "Metabolic Flexibility";
    evidence.push("Glucose regulation signal shows an optimization opportunity.");
    score += 16;
  }
  if ((typeof testosterone === "number" && testosterone < 450) || hasInsight(context, "testosterone")) {
    constraint = "Hormonal Optimization";
    evidence.push("Hormonal signal may be limiting readiness and recovery context.");
    score += 14;
  }
  if (weakest?.pillar === "Recovery" || (typeof hrv === "number" && hrv < 45) || (typeof stress === "number" && stress >= 7) || (typeof sleep === "number" && sleep < 7)) {
    constraint = "Recovery Capacity";
    evidence.push("Recovery capacity appears to be the limiting biological pillar.");
    score += 18;
  }
  if (weakest?.pillar === "Cognitive") {
    constraint = "Cognitive Performance";
    evidence.push("Cognitive pillar is currently the lowest operating domain.");
    score += 10;
  }
  if (!evidence.length && weakest) evidence.push(`${weakest.pillar} is currently the lowest pillar score.`);

  const confidence = clamp(score + Math.min(12, context.biologicalInsights.length * 2) - Math.max(0, missingCount - 3) * 3);
  const primaryPillar = constraintPillars[constraint] ?? weakest?.pillar ?? "Recovery";
  return {
    constraint,
    confidence,
    primaryPillar,
    evidence: evidence.slice(0, 5),
    reasoning: `${constraint} is the current biological bottleneck. The mission should improve readiness and signal quality before aggressive optimization expansion.`,
    clinicalContext: "Clinical reference ranges may appear normal and still leave an optimization opportunity. This system does not diagnose or treat disease.",
    optimizationContext: "XYVORAN prioritizes performance signals, biological bottlenecks, and trends to monitor over time."
  };
}
