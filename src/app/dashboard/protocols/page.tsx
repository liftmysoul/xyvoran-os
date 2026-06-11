import { ProtocolGenerator } from "@/components/dashboard/ProtocolGenerator";
import { ProtocolStatusButton } from "@/components/dashboard/ProtocolStatusButton";
import { Card } from "@/components/ui/Card";
import { formatDate } from "@/lib/format";
import { createClient } from "@/lib/supabase-server";
import type { Protocol, StructuredProtocol } from "@/types/database";

function getProtocolDetails(protocol: Protocol): StructuredProtocol | null {
  const value = protocol.protocol_json ?? protocol.protocol;
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  if (!("sevenDayActionPlan" in value)) return null;
  return value as unknown as StructuredProtocol;
}

export default async function ProtocolsPage() {
  const supabase = await createClient();
  const { data: auth } = await supabase.auth.getUser();
  const { data, error } = await supabase
    .from("generated_protocols")
    .select("*")
    .eq("user_id", auth.user?.id)
    .order("created_at", { ascending: false })
    .limit(10)
    .returns<Protocol[]>();
  const protocols = data ?? [];

  return (
    <div className="space-y-6">
      <Card className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-xl font-semibold text-white">Protocol Engine</h2>
          <p className="mt-2 text-sm text-chrome">Structured 7-day protocols generated from your goal, biomarkers, lifestyle inputs, and weakest pillar.</p>
        </div>
        <ProtocolGenerator />
      </Card>
      {error && (
        <Card className="border-amber-300/30 bg-amber-300/10">
          <p className="text-sm text-amber-100">Generated protocols could not be loaded: {error.message}</p>
        </Card>
      )}
      {protocols.map((protocol) => {
        const details = getProtocolDetails(protocol);
        const status = protocol.status ?? "active";
        return (
          <Card key={protocol.id}>
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-lg font-semibold text-white">{protocol.title ?? details?.title ?? protocol.goal}</h3>
                  <span className="rounded-md border border-white/10 bg-white/5 px-2 py-1 text-xs uppercase tracking-[0.18em] text-emeraldx">{status}</span>
                </div>
                <p className="mt-2 text-sm text-chrome">
                  {formatDate(protocol.created_at)} · Goal: {protocol.goal} · Weakest pillar: {protocol.weakest_pillar ?? details?.weakestPillar ?? "not set"} · Intensity: {protocol.intensity ?? details?.intensity ?? "Beginner"}
                </p>
              </div>
              <ProtocolStatusButton id={protocol.id} status={status} />
            </div>

            {details ? (
              <div className="mt-6 space-y-5">
                <div className="grid gap-3 md:grid-cols-3">
                  <div className="rounded-md border border-white/10 bg-white/5 p-4">
                    <p className="text-xs uppercase tracking-[0.2em] text-emeraldx">Primary Goal</p>
                    <p className="mt-2 text-white">{details.primaryGoal}</p>
                  </div>
                  <div className="rounded-md border border-white/10 bg-white/5 p-4">
                    <p className="text-xs uppercase tracking-[0.2em] text-emeraldx">Target</p>
                    <p className="mt-2 text-white">{details.weakestPillar}</p>
                  </div>
                  <div className="rounded-md border border-white/10 bg-white/5 p-4">
                    <p className="text-xs uppercase tracking-[0.2em] text-emeraldx">Reassess</p>
                    <p className="mt-2 text-white">{details.whenToReassess}</p>
                  </div>
                </div>

                <div className="grid gap-3 lg:grid-cols-2">
                  {details.sevenDayActionPlan.map((day) => (
                    <div key={day.day} className="rounded-md border border-white/10 bg-white/5 p-4 text-sm text-chrome">
                      <p className="mb-3 font-semibold text-white">Day {day.day}</p>
                      <p><span className="text-emeraldx">Sleep:</span> {day.sleep}</p>
                      <p><span className="text-emeraldx">Nutrition:</span> {day.nutrition}</p>
                      <p><span className="text-emeraldx">Movement:</span> {day.movement}</p>
                      <p><span className="text-emeraldx">Recovery:</span> {day.recovery}</p>
                      <p><span className="text-emeraldx">Tracking:</span> {day.tracking}</p>
                    </div>
                  ))}
                </div>

                <div className="grid gap-3 md:grid-cols-2">
                  <div className="rounded-md border border-white/10 bg-black/30 p-4">
                    <h4 className="font-semibold text-white">Metrics to Monitor</h4>
                    <ul className="mt-3 space-y-2 text-sm text-chrome">
                      {details.metricsToMonitor.map((metric) => <li key={metric}>{metric}</li>)}
                    </ul>
                  </div>
                  <div className="rounded-md border border-white/10 bg-black/30 p-4">
                    <h4 className="font-semibold text-white">Safety Boundary</h4>
                    <p className="mt-3 text-sm leading-6 text-chrome">{details.safetyDisclaimer}</p>
                  </div>
                </div>
              </div>
            ) : (
              <p className="mt-5 text-sm text-chrome">This protocol uses the legacy MVP format. Generate a new protocol for structured details.</p>
            )}
          </Card>
        );
      })}
      {!protocols.length && <Card><p className="text-chrome">No protocols generated yet.</p></Card>}
    </div>
  );
}
