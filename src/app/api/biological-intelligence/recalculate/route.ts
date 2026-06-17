import { NextResponse } from "next/server";
import { buildIntelligence, getIntelligenceClient, loadIntelligenceContext, upsertInsights } from "@/app/api/biological-intelligence/_utils";

export async function POST(request: Request) {
  try {
    const client = await getIntelligenceClient(request);
    if (client.error) return client.error;
    const context = await loadIntelligenceContext(client.dataClient, client.user.id);
    const generated = buildIntelligence(context);
    const insights = await upsertInsights(client.dataClient, generated.insights);
    return NextResponse.json({
      summary: generated.summary,
      insights,
      generatedInsightCount: generated.insights.length,
      persistedInsightCount: insights.length,
      safety: "Educational wellness guidance only. Consult a licensed healthcare provider for abnormal biomarkers, symptoms, medical conditions, hormones, medications, or prescription decisions."
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to recalculate biological intelligence.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
