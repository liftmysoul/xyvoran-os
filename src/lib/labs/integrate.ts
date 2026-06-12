import type { BiomarkerEntry, LabAnalysis, PillarScore } from "@/types/database";
import { getDictionary, type Language } from "@/lib/i18n";

function withMarker(template: string, marker: string) {
  return template.replace("{marker}", marker);
}

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

export function applyLabScoreImpacts(pillars: PillarScore[], analysis?: LabAnalysis | null, language: Language = "en") {
  if (!analysis) return pillars;
  const copy = getDictionary(language).optimization.scoring;
  return pillars.map((pillar) => {
    const impact = analysis.scoreImpacts[pillar.pillar] ?? 0;
    const related = analysis.biomarkers.filter((marker) => marker.pillarImpacts?.[pillar.pillar]);
    const score = Math.max(0, Math.min(100, pillar.score + impact));
    return {
      ...pillar,
      score,
      status: score >= 82 ? copy.optimized : score >= 66 ? copy.stable : score >= 48 ? copy.needsAttention : copy.foundationFirst,
      metrics: [...pillar.metrics, ...related.slice(0, 3).map((marker) => `${marker.name}: ${marker.value} ${marker.unit ?? ""}`.trim())],
      keyDrivers: [...pillar.keyDrivers, ...related.filter((marker) => marker.status === "Optimal").map((marker) => withMarker(copy.labOptimal, marker.name))],
      limitingFactors: [...pillar.limitingFactors, ...related.filter((marker) => marker.status !== "Optimal").map((marker) => withMarker(marker.status === "Priority Area" ? copy.labPriority : copy.labAttention, marker.name))],
      riskFlags: [...pillar.riskFlags, ...related.filter((marker) => marker.status === "Priority Area").map((marker) => withMarker(copy.labClinician, marker.name))]
    };
  });
}
