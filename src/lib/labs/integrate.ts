import type { BiomarkerEntry, LabAnalysis, PillarScore } from "@/types/database";

const manualKeys: Record<string, keyof BiomarkerEntry> = {
  glucose: "fasting_glucose",
  hba1c: "hba1c",
  insulin: "insulin",
  crp: "crp",
  vitamin_d: "vitamin_d",
  testosterone: "testosterone"
};

export function mergeLabsIntoBiomarkers(entry: BiomarkerEntry | null, analysis?: LabAnalysis | null): BiomarkerEntry | null {
  if (!analysis) return entry;
  const merged: BiomarkerEntry = { ...(entry ?? {}) };
  for (const marker of analysis.biomarkers) {
    const key = manualKeys[marker.key];
    if (key) (merged as Record<string, unknown>)[key] = marker.value;
  }
  return merged;
}

export function applyLabScoreImpacts(pillars: PillarScore[], analysis?: LabAnalysis | null) {
  if (!analysis) return pillars;
  return pillars.map((pillar) => {
    const impact = analysis.scoreImpacts[pillar.pillar] ?? 0;
    const related = analysis.biomarkers.filter((marker) => marker.pillarImpacts?.[pillar.pillar]);
    const score = Math.max(0, Math.min(100, pillar.score + impact));
    return {
      ...pillar,
      score,
      status: score >= 82 ? "Optimized" : score >= 66 ? "Stable" : score >= 48 ? "Needs attention" : "Foundation first",
      metrics: [...pillar.metrics, ...related.slice(0, 3).map((marker) => `${marker.name}: ${marker.value} ${marker.unit ?? ""}`.trim())],
      keyDrivers: [...pillar.keyDrivers, ...related.filter((marker) => marker.status === "Optimal").map((marker) => `${marker.name} is within the configured optimization range.`)],
      limitingFactors: [...pillar.limitingFactors, ...related.filter((marker) => marker.status !== "Optimal").map((marker) => `${marker.name} is ${marker.status?.toLowerCase()}.`)],
      riskFlags: [...pillar.riskFlags, ...related.filter((marker) => marker.status === "Priority Area").map((marker) => `${marker.name} should be reviewed with a licensed healthcare provider.`)]
    };
  });
}
