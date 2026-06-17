import type { PillarName, PillarScore } from "@/types/database";
import type { MarkerInterpretation, PillarImpact } from "@/lib/biological-intelligence/types";

const pillars: PillarName[] = ["Metabolic", "Recovery", "Longevity", "Cognitive", "Beauty"];

function confidenceFor(pillar: PillarName, interpretations: MarkerInterpretation[], score?: PillarScore) {
  const signalStrength = interpretations
    .filter((item) => item.associatedPillars.includes(pillar))
    .reduce((sum, item) => sum + item.confidenceImpact, 0);
  const scoreConfidence = score ? 18 : 0;
  return Math.min(100, Math.round(35 + signalStrength + scoreConfidence));
}

export function generatePillarImpacts(interpretations: MarkerInterpretation[], pillarScores: PillarScore[] = []): PillarImpact[] {
  return pillars.map((pillar) => {
    const score = pillarScores.find((item) => item.pillar === pillar);
    const relevant = interpretations.filter((item) => item.associatedPillars.includes(pillar));
    const constraints = [
      ...(score?.limitingFactors ?? []),
      ...relevant.filter((item) => item.status === "high" || item.status === "low").map((item) => item.summary)
    ].slice(0, 5);
    const opportunities = [
      ...(score?.keyDrivers ?? []),
      ...relevant.filter((item) => item.status === "acceptable").map((item) => `${item.rule.label} is close to target and can be optimized further.`)
    ].slice(0, 5);
    const riskFlags = [
      ...(score?.riskFlags ?? []),
      ...relevant.filter((item) => item.severity === "high" || item.severity === "priority").map((item) => `${item.rule.label}: clinician review recommended for abnormal or persistent values.`)
    ].slice(0, 4);
    return {
      pillar,
      score: score?.score ?? Math.max(35, 78 - constraints.length * 9 - riskFlags.length * 8),
      constraints,
      opportunities,
      riskFlags,
      confidenceScore: confidenceFor(pillar, relevant, score)
    };
  });
}

export function derivePillarSummary(impacts: PillarImpact[]) {
  const sorted = [...impacts].sort((a, b) => {
    const aConstraint = a.constraints.length + a.riskFlags.length * 1.5;
    const bConstraint = b.constraints.length + b.riskFlags.length * 1.5;
    return bConstraint - aConstraint || a.score - b.score;
  });
  const primaryConstraint = sorted[0] && (sorted[0].constraints.length || sorted[0].riskFlags.length) ? sorted[0] : null;
  const secondaryConstraints = sorted.filter((item) => item !== primaryConstraint && (item.constraints.length || item.riskFlags.length)).slice(0, 2);
  const topOpportunity = [...impacts]
    .sort((a, b) => b.opportunities.length - a.opportunities.length || a.score - b.score)
    .flatMap((item) => item.opportunities.map((opportunity) => `${item.pillar}: ${opportunity}`))[0] ?? null;
  const confidenceScore = Math.round(impacts.reduce((sum, item) => sum + item.confidenceScore, 0) / Math.max(impacts.length, 1));
  return { primaryConstraint, secondaryConstraints, topOpportunity, confidenceScore };
}
