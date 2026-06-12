import { markerByKey } from "@/lib/labs/markers";
import { getDictionary, type Language } from "@/lib/i18n";
import type { LabAnalysis, LabCategory, LabMarkerStatus, NormalizedLabMarker, PillarName } from "@/types/database";

function markerStatus(marker: NormalizedLabMarker, language: Language) {
  const copy = getDictionary(language).optimization.labs;
  const definition = markerByKey.get(marker.key);
  if (!definition) return { status: "Needs Attention" as LabMarkerStatus, reason: copy.noRange, range: copy.clinicianRange };
  const optimal = (definition.optimalMin === undefined || marker.value >= definition.optimalMin) && (definition.optimalMax === undefined || marker.value <= definition.optimalMax);
  const range = `${definition.optimalMin ?? "-"} to ${definition.optimalMax ?? "-"} ${marker.unit ?? definition.unit ?? ""}`.trim();
  if (optimal) return { status: "Optimal" as LabMarkerStatus, reason: copy.withinRange, range };
  const priority = (definition.attentionMin !== undefined && marker.value < definition.attentionMin) || (definition.attentionMax !== undefined && marker.value > definition.attentionMax);
  return {
    status: priority ? ("Priority Area" as LabMarkerStatus) : ("Needs Attention" as LabMarkerStatus),
    reason: priority ? copy.outsideAttention : copy.outsideTarget,
    range
  };
}

export function analyzeLabMarkers(markers: NormalizedLabMarker[], language: Language = "en"): LabAnalysis {
  const copy = getDictionary(language).optimization.labs;
  const scoreImpacts: Partial<Record<PillarName, number>> = {};
  const safetyFlags: string[] = [];
  const analyzed = markers.map((marker) => {
    const result = markerStatus(marker, language);
    const definition = markerByKey.get(marker.key);
    const severity = result.status === "Priority Area" ? 1 : result.status === "Needs Attention" ? 0.5 : 0;
    const pillarImpacts = Object.fromEntries(Object.entries(definition?.impacts ?? {}).map(([pillar, impact]) => [pillar, Math.round(Number(impact) * severity)]));
    for (const [pillar, impact] of Object.entries(pillarImpacts)) scoreImpacts[pillar as PillarName] = (scoreImpacts[pillar as PillarName] ?? 0) + Number(impact);
    if (result.status === "Priority Area") safetyFlags.push(copy.safetyFlag.replace("{marker}", marker.name).replace("{value}", `${marker.value} ${marker.unit ?? ""}`.trim()));
    return { ...marker, status: result.status, reason: result.reason, optimizationRange: result.range, pillarImpacts };
  });

  const categoryScores = new Map<LabCategory, number>();
  for (const marker of analyzed) categoryScores.set(marker.category, (categoryScores.get(marker.category) ?? 0) + (marker.status === "Priority Area" ? 2 : marker.status === "Needs Attention" ? 1 : 0));
  const weakestCategory = [...categoryScores.entries()].sort((a, b) => b[1] - a[1])[0]?.[0] ?? null;
  const biggestOpportunities = analyzed.filter((marker) => marker.status !== "Optimal").sort((a, b) => (a.status === "Priority Area" ? -1 : 1) - (b.status === "Priority Area" ? -1 : 1)).slice(0, 5);
  const priorityActions = biggestOpportunities.slice(0, 3).map((marker) => copy.reviewResult.replace("{marker}", marker.name));

  return {
    biomarkers: analyzed,
    topBiomarkers: analyzed.slice(0, 8),
    biggestOpportunities,
    weakestCategory,
    priorityActions: priorityActions.length ? priorityActions : [copy.maintain],
    scoreImpacts,
    safetyFlags,
    summary: copy.summary.replace("{count}", String(analyzed.length)).replace("{opportunities}", String(biggestOpportunities.length)),
    analyzedAt: new Date().toISOString()
  };
}
