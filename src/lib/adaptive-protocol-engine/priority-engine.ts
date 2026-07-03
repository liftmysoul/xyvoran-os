import type { AdaptiveProtocolContext, RootCauseAnalysis } from "@/lib/adaptive-protocol-engine/types";
import { nextSignals } from "@/lib/adaptive-protocol-engine/optimization-rules";

export function selectPrioritySignals(context: AdaptiveProtocolContext, rootCause: RootCauseAnalysis) {
  const missing = context.biologicalIntelligence.missingData.map((item) => item.title);
  const insightSignals = context.biologicalInsights
    .filter((insight) => insight.severity === "high" || insight.severity === "priority" || insight.insight_type === "constraint")
    .map((insight) => `${insight.pillar}: ${insight.title}`);
  return [...rootCause.evidence, ...insightSignals, ...missing, nextSignals[rootCause.constraint]].slice(0, 5);
}

export function recommendedNextAction(rootCause: RootCauseAnalysis) {
  if (rootCause.constraint === "Metabolic Flexibility") return "Prioritize protein, fiber, and post-meal walking before increasing fasting intensity.";
  if (rootCause.constraint === "Missing Data Limitation") return "Add the next missing signal before making aggressive optimization changes.";
  if (rootCause.constraint === "Inflammation Load") return "Prioritize sleep consistency, recovery load management, and clinician discussion for abnormal inflammatory markers.";
  return "Prioritize sleep rhythm, HRV trend, and controlled training progression before increasing performance load.";
}
