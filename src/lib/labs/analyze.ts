import { markerByKey } from "@/lib/labs/markers";
import type { Language } from "@/lib/i18n";
import type { LabAnalysis, LabCategory, LabMarkerStatus, NormalizedLabMarker, PillarName } from "@/types/database";

function markerStatus(marker: NormalizedLabMarker, language: Language) {
  const es = language === "es";
  const definition = markerByKey.get(marker.key);
  if (!definition) return { status: "Needs Attention" as LabMarkerStatus, reason: es ? "No hay un rango de optimización configurado para este biomarcador." : "No optimization range is configured for this marker.", range: es ? "Revisar con un profesional médico autorizado." : "Review with a licensed clinician." };
  const optimal = (definition.optimalMin === undefined || marker.value >= definition.optimalMin) && (definition.optimalMax === undefined || marker.value <= definition.optimalMax);
  const range = `${definition.optimalMin ?? "-"} to ${definition.optimalMax ?? "-"} ${marker.unit ?? definition.unit ?? ""}`.trim();
  if (optimal) return { status: "Optimal" as LabMarkerStatus, reason: es ? "Dentro del rango configurado de optimización de bienestar." : "Within the configured wellness optimization range.", range };
  const priority = (definition.attentionMin !== undefined && marker.value < definition.attentionMin) || (definition.attentionMax !== undefined && marker.value > definition.attentionMax);
  return {
    status: priority ? ("Priority Area" as LabMarkerStatus) : ("Needs Attention" as LabMarkerStatus),
    reason: priority ? (es ? "Fuera del rango amplio de atención. Consulta los resultados anormales con un profesional médico autorizado." : "Outside the broader attention range. Discuss abnormal results with a licensed healthcare provider.") : (es ? "Fuera del rango objetivo configurado de optimización." : "Outside the configured optimization target range."),
    range
  };
}

export function analyzeLabMarkers(markers: NormalizedLabMarker[], language: Language = "en"): LabAnalysis {
  const scoreImpacts: Partial<Record<PillarName, number>> = {};
  const safetyFlags: string[] = [];
  const analyzed = markers.map((marker) => {
    const result = markerStatus(marker, language);
    const definition = markerByKey.get(marker.key);
    const severity = result.status === "Priority Area" ? 1 : result.status === "Needs Attention" ? 0.5 : 0;
    const pillarImpacts = Object.fromEntries(Object.entries(definition?.impacts ?? {}).map(([pillar, impact]) => [pillar, Math.round(Number(impact) * severity)]));
    for (const [pillar, impact] of Object.entries(pillarImpacts)) scoreImpacts[pillar as PillarName] = (scoreImpacts[pillar as PillarName] ?? 0) + Number(impact);
    if (result.status === "Priority Area") safetyFlags.push((language === "es" ? `${marker.name}: ${marker.value} ${marker.unit ?? ""} está fuera del rango configurado de atención.` : `${marker.name}: ${marker.value} ${marker.unit ?? ""} is outside the configured attention range.`).trim());
    return { ...marker, status: result.status, reason: result.reason, optimizationRange: result.range, pillarImpacts };
  });

  const categoryScores = new Map<LabCategory, number>();
  for (const marker of analyzed) categoryScores.set(marker.category, (categoryScores.get(marker.category) ?? 0) + (marker.status === "Priority Area" ? 2 : marker.status === "Needs Attention" ? 1 : 0));
  const weakestCategory = [...categoryScores.entries()].sort((a, b) => b[1] - a[1])[0]?.[0] ?? null;
  const biggestOpportunities = analyzed.filter((marker) => marker.status !== "Optimal").sort((a, b) => (a.status === "Priority Area" ? -1 : 1) - (b.status === "Priority Area" ? -1 : 1)).slice(0, 5);
  const priorityActions = biggestOpportunities.slice(0, 3).map((marker) => language === "es" ? `${marker.name}: revisa el resultado, observa su tendencia y consulta valores anormales con un profesional médico autorizado.` : `${marker.name}: review the result, repeat or trend it as appropriate, and discuss abnormal values with a licensed healthcare provider.`);

  return {
    biomarkers: analyzed,
    topBiomarkers: analyzed.slice(0, 8),
    biggestOpportunities,
    weakestCategory,
    priorityActions: priorityActions.length ? priorityActions : [language === "es" ? "Mantén los fundamentos actuales y continúa observando las tendencias de tus biomarcadores." : "Maintain current foundations and continue trending biomarkers over time."],
    scoreImpacts,
    safetyFlags,
    summary: language === "es" ? `${analyzed.length} biomarcadores analizados. Se identificaron ${biggestOpportunities.length} oportunidades de optimización. Esta es una guía educativa de bienestar, no un diagnóstico.` : `${analyzed.length} biomarkers analyzed. ${biggestOpportunities.length} optimization opportunities identified. This is educational wellness guidance, not a diagnosis.`,
    analyzedAt: new Date().toISOString()
  };
}
