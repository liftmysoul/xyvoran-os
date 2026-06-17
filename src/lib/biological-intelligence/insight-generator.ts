import type { PillarName } from "@/types/database";
import { collectMarkerValues, interpretMarkers } from "@/lib/biological-intelligence/biomarker-rules";
import { extractLatestLabMarkers } from "@/lib/biological-intelligence/lab-rules";
import { rankMissingData } from "@/lib/biological-intelligence/missing-data-engine";
import { derivePillarSummary, generatePillarImpacts } from "@/lib/biological-intelligence/pillar-impact";
import type {
  BiologicalInsight,
  BiologicalIntelligenceContext,
  BiologicalIntelligenceSummary,
  InsightType,
  MarkerInterpretation,
  MissingDataInsight,
  PillarImpact
} from "@/lib/biological-intelligence/types";

function cap(value: number) {
  return Math.max(0, Math.min(100, Math.round(value)));
}

function primaryPillar(pillars: PillarName[]) {
  return pillars[0] ?? "Recovery";
}

function sourceTypeFor(item: MarkerInterpretation): BiologicalInsight["source_type"] {
  return item.marker.sourceType;
}

function insightFromInterpretation(userId: string, item: MarkerInterpretation): BiologicalInsight | null {
  if (item.status === "optimal") {
    return {
      user_id: userId,
      source_type: sourceTypeFor(item),
      source_id: item.marker.sourceId ?? null,
      insight_type: "opportunity",
      pillar: primaryPillar(item.associatedPillars),
      severity: "low",
      confidence_score: cap(item.confidenceImpact * 7),
      title: `${item.rule.label} is supporting optimization`,
      summary: `${item.rule.educationalSummary} Current signal appears within the optimization range.`,
      evidence: { marker: item.marker, status: item.status, associatedPillars: item.associatedPillars },
      recommended_actions: item.suggestedActions.slice(0, 2),
      status: "active"
    };
  }
  if (item.status === "acceptable") return null;
  const isRisk = item.severity === "high" || item.severity === "priority";
  return {
    user_id: userId,
    source_type: sourceTypeFor(item),
    source_id: item.marker.sourceId ?? null,
    insight_type: isRisk ? "risk_flag" : "constraint",
    pillar: primaryPillar(item.associatedPillars),
    severity: item.severity,
    confidence_score: cap(55 + item.confidenceImpact * 4),
    title: `${item.rule.label} optimization constraint`,
    summary: `${item.summary} This is educational wellness guidance, not a diagnosis.`,
    evidence: { marker: item.marker, status: item.status, associatedPillars: item.associatedPillars },
    recommended_actions: item.suggestedActions,
    status: "active"
  };
}

function insightFromPillar(userId: string, impact: PillarImpact, type: InsightType): BiologicalInsight | null {
  const primaryText = type === "protocol_priority" ? impact.constraints[0] || impact.riskFlags[0] : impact.opportunities[0];
  if (!primaryText) return null;
  return {
    user_id: userId,
    source_type: "pillar",
    source_id: null,
    insight_type: type,
    pillar: impact.pillar,
    severity: type === "protocol_priority" ? "moderate" : "low",
    confidence_score: impact.confidenceScore,
    title: type === "protocol_priority" ? `${impact.pillar} protocol priority` : `${impact.pillar} optimization opportunity`,
    summary: primaryText,
    evidence: { pillar: impact.pillar, score: impact.score, constraints: impact.constraints, opportunities: impact.opportunities, riskFlags: impact.riskFlags },
    recommended_actions: type === "protocol_priority" ? [`Prioritize a starter protocol targeting ${impact.pillar}.`, "Reassess after 7 days of consistent tracking."] : ["Keep tracking this signal and reinforce the current behavior."],
    status: "active"
  };
}

function insightFromMissing(userId: string, item: MissingDataInsight): BiologicalInsight {
  return {
    user_id: userId,
    source_type: "missing_data",
    source_id: null,
    insight_type: "missing_data",
    pillar: item.pillar,
    severity: item.priority >= 90 ? "high" : item.priority >= 80 ? "moderate" : "low",
    confidence_score: item.confidenceScore,
    title: item.title,
    summary: item.summary,
    evidence: { missingSignal: item.key, priority: item.priority },
    recommended_actions: [item.recommendedAction],
    status: "active"
  };
}

export function generateBiologicalIntelligence(context: BiologicalIntelligenceContext): { insights: BiologicalInsight[]; summary: BiologicalIntelligenceSummary } {
  const markerValues = collectMarkerValues({ onboarding: context.onboarding, biomarkers: context.latestBiomarkers, labReport: context.latestLabReport });
  const interpretations = interpretMarkers(markerValues);
  const pillarImpacts = generatePillarImpacts(interpretations, context.pillarScores);
  const missingData = rankMissingData({ onboarding: context.onboarding, biomarkers: context.latestBiomarkers, labReport: context.latestLabReport });
  const pillarSummary = derivePillarSummary(pillarImpacts);
  const insights = [
    ...interpretations.map((item) => insightFromInterpretation(context.userId, item)).filter((item): item is BiologicalInsight => Boolean(item)),
    ...pillarImpacts.map((impact) => insightFromPillar(context.userId, impact, "protocol_priority")).filter((item): item is BiologicalInsight => Boolean(item)),
    ...pillarImpacts.map((impact) => insightFromPillar(context.userId, impact, "opportunity")).filter((item): item is BiologicalInsight => Boolean(item)),
    ...missingData.slice(0, 6).map((item) => insightFromMissing(context.userId, item))
  ];
  const insightCounts = insights.reduce((counts, insight) => {
    counts[insight.insight_type] = (counts[insight.insight_type] ?? 0) + 1;
    return counts;
  }, {} as BiologicalIntelligenceSummary["insightCounts"]);
  return {
    insights,
    summary: {
      ...pillarSummary,
      pillarImpacts,
      missingData,
      insightCounts,
      latestLabMarkers: extractLatestLabMarkers(context.latestLabReport)
    }
  };
}

export function insightIdentity(insight: Pick<BiologicalInsight, "source_type" | "insight_type" | "pillar" | "title">) {
  return {
    source_type: insight.source_type,
    insight_type: insight.insight_type,
    pillar: insight.pillar,
    title: insight.title
  };
}
