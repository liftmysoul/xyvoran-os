import type { AdaptiveMission } from "@/lib/adaptive-protocol-engine/types";
import type { Language } from "@/lib/i18n";
import type { StructuredProtocol } from "@/types/database";

export function adaptProtocolToMission(protocol: StructuredProtocol, mission: AdaptiveMission, language: Language = "en"): StructuredProtocol {
  const confidenceLevel =
    mission.confidence >= 76
      ? language === "es" ? "Confianza alta" : "High confidence"
      : mission.confidence >= 56
        ? language === "es" ? "Confianza moderada" : "Moderate confidence"
        : language === "es" ? "Confianza limitada" : "Limited confidence";
  const expectedImpact =
    language === "es"
      ? `${mission.missionName}: ${mission.progress}% de progreso de mision con ${mission.confidence}% de confianza.`
      : `${mission.missionName}: ${mission.progress}% mission progress with ${mission.confidence}% confidence.`;
  return {
    ...protocol,
    biologicalRationale: mission.reason,
    expectedImpact,
    confidenceLevel,
    metricsToMonitor: [...new Set([...protocol.metricsToMonitor, ...mission.trackingSignals.slice(0, 3)])],
    topPriorityActions: [...new Set([mission.nextUpgrade, ...protocol.topPriorityActions])].slice(0, 4)
  };
}
