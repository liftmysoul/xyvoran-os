import type { AdaptiveProtocolContext, ProgressState } from "@/lib/adaptive-protocol-engine/types";

export function calculateMissionProgress(context: AdaptiveProtocolContext, confidence: number): { progress: number; state: ProgressState } {
  const hasPriorMission = Boolean(context.previousMissions?.length);
  const hasPriorLab = (context.previousLabReports?.length ?? 0) > 1;
  const signalCoverage = Math.max(0, 7 - context.biologicalIntelligence.missingData.length);
  const averageScore = Math.round(context.pillarScores.reduce((sum, item) => sum + item.score, 0) / Math.max(1, context.pillarScores.length));
  const progress = Math.max(8, Math.min(88, Math.round(signalCoverage * 8 + averageScore * 0.28 + confidence * 0.16)));
  if (!hasPriorMission && !hasPriorLab) return { progress, state: "Baseline established" };
  const previousMission = context.previousMissions?.[0];
  if (previousMission && progress > Number(previousMission.progress ?? 0) + 4) return { progress, state: "Improving" };
  if (previousMission && progress < Number(previousMission.progress ?? 0) - 4) return { progress, state: "Declining" };
  return { progress, state: hasPriorLab ? "Stable" : "Unknown due missing data" };
}
