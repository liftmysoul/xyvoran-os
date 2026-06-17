import type { LabReport, NormalizedLabMarker, PillarName } from "@/types/database";
import type { MarkerKey } from "@/lib/biological-intelligence/types";

export type LabRuleMapping = {
  labKeys: string[];
  markerKey: MarkerKey;
  pillarWeights: Partial<Record<PillarName, number>>;
};

export const labRuleMappings: LabRuleMapping[] = [
  { labKeys: ["glucose", "fasting_glucose"], markerKey: "fasting_glucose", pillarWeights: { Metabolic: 1, Cognitive: 0.4, Longevity: 0.4 } },
  { labKeys: ["hba1c", "a1c"], markerKey: "hba1c", pillarWeights: { Metabolic: 1, Longevity: 0.6 } },
  { labKeys: ["insulin", "fasting_insulin"], markerKey: "fasting_insulin", pillarWeights: { Metabolic: 1, Beauty: 0.3 } },
  { labKeys: ["crp"], markerKey: "crp", pillarWeights: { Longevity: 1, Recovery: 0.6, Beauty: 0.3 } },
  { labKeys: ["hscrp", "hs_crp", "hs-crp"], markerKey: "hscrp", pillarWeights: { Longevity: 1, Recovery: 0.7, Cognitive: 0.4 } },
  { labKeys: ["vitamin_d", "25_oh_vitamin_d"], markerKey: "vitamin_d", pillarWeights: { Recovery: 0.8, Longevity: 0.6, Beauty: 0.5 } },
  { labKeys: ["testosterone", "total_testosterone", "free_testosterone"], markerKey: "testosterone", pillarWeights: { Recovery: 0.7, Cognitive: 0.5, Beauty: 0.4 } },
  { labKeys: ["cortisol"], markerKey: "cortisol", pillarWeights: { Recovery: 0.8, Cognitive: 0.6, Beauty: 0.3 } }
];

export function mapLabMarkerToRule(marker: NormalizedLabMarker) {
  const normalized = marker.key.toLowerCase().replace(/[^a-z0-9]+/g, "_");
  return labRuleMappings.find((rule) => rule.labKeys.includes(normalized));
}

export function extractLatestLabMarkers(report: LabReport | null) {
  return report?.analysis_json?.biomarkers ?? [];
}

export function labPillarCoverage(report: LabReport | null) {
  const coverage: Partial<Record<PillarName, number>> = {};
  for (const marker of extractLatestLabMarkers(report)) {
    const mapping = mapLabMarkerToRule(marker);
    if (!mapping) continue;
    for (const [pillar, weight] of Object.entries(mapping.pillarWeights)) {
      coverage[pillar as PillarName] = (coverage[pillar as PillarName] ?? 0) + Number(weight);
    }
  }
  return coverage;
}
