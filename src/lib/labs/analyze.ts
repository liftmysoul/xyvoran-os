import { markerByKey } from "@/lib/labs/markers";
import type { LabAnalysis, LabCategory, LabMarkerStatus, NormalizedLabMarker, PillarName } from "@/types/database";

function markerStatus(marker: NormalizedLabMarker) {
  const definition = markerByKey.get(marker.key);
  if (!definition) return { status: "Needs Attention" as LabMarkerStatus, reason: "No optimization range is configured for this marker.", range: "Review with a licensed clinician." };
  const { value } = marker;
  const optimal = (definition.optimalMin === undefined || value >= definition.optimalMin) && (definition.optimalMax === undefined || value <= definition.optimalMax);
  if (optimal) return { status: "Optimal" as LabMarkerStatus, reason: "Within the configured wellness optimization range.", range: `${definition.optimalMin ?? "-"} to ${definition.optimalMax ?? "-"} ${marker.unit ?? definition.unit ?? ""}`.trim() };
  const priority = (definition.attentionMin !== undefined && value < definition.attentionMin) || (definition.attentionMax !== undefined && value > definition.attentionMax);
  return {
    status: priority ? ("Priority Area" as LabMarkerStatus) : ("Needs Attention" as LabMarkerStatus),
    reason: priority ? "Outside the broader attention range. Discuss abnormal results with a licensed healthcare provider." : "Outside the configured optimization target range.",
    range: `${definition.optimalMin ?? "-"} to ${definition.optimalMax ?? "-"} ${marker.unit ?? definition.unit ?? ""}`.trim()
  };
}

export function analyzeLabMarkers(markers: NormalizedLabMarker[]): LabAnalysis {
  const scoreImpacts: Partial<Record<PillarName, number>> = {};
  const safetyFlags: string[] = [];
  const analyzed = markers.map((marker) => {
    const result = markerStatus(marker);
    const definition = markerByKey.get(marker.key);
    const severity = result.status === "Priority Area" ? 1 : result.status === "Needs Attention" ? 0.5 : 0;
    const pillarImpacts = Object.fromEntries(Object.entries(definition?.impacts ?? {}).map(([pillar, impact]) => [pillar, Math.round(Number(impact) * severity)]));
    for (const [pillar, impact] of Object.entries(pillarImpacts)) {
      scoreImpacts[pillar as PillarName] = (scoreImpacts[pillar as PillarName] ?? 0) + Number(impact);
    }
    if (result.status === "Priority Area") safetyFlags.push(`${marker.name}: ${marker.value} ${marker.unit ?? ""} is outside the configured attention range.`.trim());
    return { ...marker, status: result.status, reason: result.reason, optimizationRange: result.range, pillarImpacts };
  });

  const categoryScores = new Map<LabCategory, number>();
  for (const marker of analyzed) {
    const weight = marker.status === "Priority Area" ? 2 : marker.status === "Needs Attention" ? 1 : 0;
    categoryScores.set(marker.category, (categoryScores.get(marker.category) ?? 0) + weight);
  }
  const weakestCategory = [...categoryScores.entries()].sort((a, b) => b[1] - a[1])[0]?.[0] ?? null;
  const biggestOpportunities = analyzed.filter((marker) => marker.status !== "Optimal").sort((a, b) => (a.status === "Priority Area" ? -1 : 1) - (b.status === "Priority Area" ? -1 : 1)).slice(0, 5);
  const priorityActions = biggestOpportunities.slice(0, 3).map((marker) => `${marker.name}: review the result, repeat or trend it as appropriate, and discuss abnormal values with a licensed healthcare provider.`);

  return {
    biomarkers: analyzed,
    topBiomarkers: analyzed.slice(0, 8),
    biggestOpportunities,
    weakestCategory,
    priorityActions: priorityActions.length ? priorityActions : ["Maintain current foundations and continue trending biomarkers over time."],
    scoreImpacts,
    safetyFlags,
    summary: `${analyzed.length} biomarkers analyzed. ${biggestOpportunities.length} optimization opportunities identified. This is educational wellness guidance, not a diagnosis.`,
    analyzedAt: new Date().toISOString()
  };
}
