import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { AgeGate } from "@/components/AgeGate";
import { ageConfirmedValue, ageDeniedValue, ageGateCookieName, safeNextPath } from "@/lib/age-gate";

export default async function AgeGatePage({ searchParams }: { searchParams: Promise<{ next?: string }> }) {
  const cookieStore = await cookies();
  const status = cookieStore.get(ageGateCookieName)?.value;
  const nextPath = safeNextPath((await searchParams).next);
  if (status === ageConfirmedValue) redirect(nextPath);
  return <AgeGate denied={status === ageDeniedValue} nextPath={nextPath} />;
}
