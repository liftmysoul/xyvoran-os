import type { AdaptiveMission } from "@/lib/adaptive-protocol-engine/types";
import type { StructuredProtocol } from "@/types/database";

export function adaptProtocolToMission(protocol: StructuredProtocol, mission: AdaptiveMission): StructuredProtocol {
  return {
    ...protocol,
    biologicalRationale: mission.reason,
    expectedImpact: `${mission.missionName}: ${mission.progress}% mission progress with ${mission.confidence}% confidence.`,
    confidenceLevel: mission.confidence >= 76 ? "High confidence" : mission.confidence >= 56 ? "Moderate confidence" : "Limited confidence",
    metricsToMonitor: [...new Set([...protocol.metricsToMonitor, ...mission.trackingSignals.slice(0, 3)])],
    topPriorityActions: [...new Set([mission.nextUpgrade, ...protocol.topPriorityActions])].slice(0, 4)
  };
}
