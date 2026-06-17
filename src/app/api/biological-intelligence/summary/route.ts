import { NextResponse } from "next/server";
import { buildIntelligence, getIntelligenceClient, loadIntelligenceContext, readStoredInsights } from "@/app/api/biological-intelligence/_utils";

export async function GET(request: Request) {
  try {
    const client = await getIntelligenceClient(request);
    if (client.error) return client.error;
    const context = await loadIntelligenceContext(client.dataClient, client.user.id);
    const generated = buildIntelligence(context);
    let storedInsightCount = 0;
    try {
      storedInsightCount = (await readStoredInsights(client.dataClient, client.user.id)).length;
    } catch {
      storedInsightCount = 0;
    }
    const summary = {
      ...generated.summary,
      missingSignals: generated.summary.missingData
    };
    return NextResponse.json({
      summary,
      primaryConstraint: summary.primaryConstraint,
      topOpportunity: summary.topOpportunity,
      confidenceScore: summary.confidenceScore,
      missingSignals: summary.missingSignals,
      pillarImpacts: summary.pillarImpacts,
      generatedInsightCount: generated.insights.length,
      storedInsightCount,
      safety: "Educational wellness guidance only. XYVORAN OS does not diagnose disease, prescribe medication, or replace licensed medical care."
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to build biological intelligence summary.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
