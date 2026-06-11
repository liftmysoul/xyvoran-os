import { NextResponse } from "next/server";
import { ageConfirmedValue, ageDeniedValue, ageGateCookieName, safeNextPath } from "@/lib/age-gate";

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  if (body.choice !== "confirmed" && body.choice !== "underage") {
    return NextResponse.json({ error: "A valid age confirmation is required." }, { status: 400 });
  }

  const confirmed = body.choice === "confirmed";
  const response = NextResponse.json({
    allowed: confirmed,
    redirectTo: confirmed ? safeNextPath(body.next) : "/age-gate"
  });
  response.cookies.set(ageGateCookieName, confirmed ? ageConfirmedValue : ageDeniedValue, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 365
  });
  return response;
}
