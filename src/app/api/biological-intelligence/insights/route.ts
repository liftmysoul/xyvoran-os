import { NextResponse } from "next/server";
import { getIntelligenceClient, readStoredInsights } from "@/app/api/biological-intelligence/_utils";

export async function GET(request: Request) {
  try {
    const client = await getIntelligenceClient(request);
    if (client.error) return client.error;
    const insights = await readStoredInsights(client.dataClient, client.user.id);
    return NextResponse.json({ insights });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to load biological insights.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
