import type { AdaptiveMission, AdaptiveProtocolContext } from "@/lib/adaptive-protocol-engine/types";
import { missionNames, nextSignals, phasesForConstraint, safetyNote } from "@/lib/adaptive-protocol-engine/optimization-rules";
import { analyzeRootCause } from "@/lib/adaptive-protocol-engine/root-cause-engine";
import { calculateMissionProgress } from "@/lib/adaptive-protocol-engine/progress-engine";
import { recommendedNextAction, selectPrioritySignals } from "@/lib/adaptive-protocol-engine/priority-engine";

export function generateAdaptiveMission(context: AdaptiveProtocolContext): AdaptiveMission {
  const rootCause = analyzeRootCause(context);
  const progress = calculateMissionProgress(context, rootCause.confidence);
  const nextAction = recommendedNextAction(rootCause);
  return {
    missionName: missionNames[rootCause.constraint],
    duration: "8 weeks",
    primaryPillar: rootCause.primaryPillar,
    constraint: rootCause.constraint,
    confidence: rootCause.confidence,
    progress: progress.progress,
    reason: rootCause.reasoning,
    phases: phasesForConstraint(rootCause.constraint),
    actions: [nextAction, ...rootCause.evidence.slice(0, 2)],
    trackingSignals: selectPrioritySignals(context, rootCause),
    nextUpgrade: nextAction,
    nextSignalNeeded: nextSignals[rootCause.constraint],
    prioritySignals: selectPrioritySignals(context, rootCause),
    progressState: progress.state,
    safetyNote
  };
}
