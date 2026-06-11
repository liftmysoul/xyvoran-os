import { ProtocolGenerator } from "@/components/dashboard/ProtocolGenerator";
import { ProtocolStatusButton } from "@/components/dashboard/ProtocolStatusButton";
import { Card } from "@/components/ui/Card";
import { formatDate } from "@/lib/format";
import { localizeIntensity, localizePillar } from "@/lib/i18n";
import { getServerI18n } from "@/lib/i18n/server";
import { createClient } from "@/lib/supabase-server";
import type { Protocol, StructuredProtocol } from "@/types/database";

function getProtocolDetails(protocol: Protocol): StructuredProtocol | null {
  const value = protocol.protocol_json ?? protocol.protocol;
  if (!value || typeof value !== "object" || Array.isArray(value) || !("sevenDayActionPlan" in value)) return null;
  return value as unknown as StructuredProtocol;
}

export default async function ProtocolsPage() {
  const { copy, language } = await getServerI18n();
  const supabase = await createClient();
  const { data: auth } = await supabase.auth.getUser();
  const { data, error } = await supabase.from("generated_protocols").select("*").eq("user_id", auth.user?.id).order("created_at", { ascending: false }).limit(10).returns<Protocol[]>();
  const protocols = data ?? [];

  return (
    <div className="space-y-6">
      <Card className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div><h2 className="text-xl font-semibold text-white">{copy.protocols.title}</h2><p className="mt-2 text-sm text-chrome">{copy.protocols.description}</p></div>
        <ProtocolGenerator />
      </Card>
      {error && <Card className="border-amber-300/30 bg-amber-300/10"><p className="text-sm text-amber-100">{copy.protocols.loadError}: {error.message}</p></Card>}
      {protocols.map((protocol) => {
        const details = getProtocolDetails(protocol);
        const status = protocol.status ?? "active";
        const statusLabel = status === "completed" ? copy.common.completed : status === "archived" ? copy.common.archived : copy.common.active;
        return (
          <Card key={protocol.id}>
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <div className="flex flex-wrap items-center gap-2"><h3 className="text-lg font-semibold text-white">{protocol.title ?? details?.title ?? protocol.goal}</h3><span className="rounded-md border border-white/10 bg-white/5 px-2 py-1 text-xs uppercase tracking-[0.18em] text-emeraldx">{statusLabel}</span></div>
                <p className="mt-2 text-sm text-chrome">{formatDate(protocol.created_at)} · {copy.protocols.goal}: {protocol.goal} · {copy.protocols.weakest}: {localizePillar(String(protocol.weakest_pillar ?? details?.weakestPillar ?? copy.common.notSet), language)} · {copy.protocols.intensity}: {localizeIntensity(String(protocol.intensity ?? details?.intensity ?? "Beginner"), language)}</p>
              </div>
              <ProtocolStatusButton id={protocol.id} status={status} />
            </div>
            {details ? (
              <div className="mt-6 space-y-5">
                <div className="grid gap-3 md:grid-cols-3">
                  <div className="rounded-md border border-white/10 bg-white/5 p-4"><p className="text-xs uppercase tracking-[0.2em] text-emeraldx">{copy.protocols.primaryGoal}</p><p className="mt-2 text-white">{details.primaryGoal}</p></div>
                  <div className="rounded-md border border-white/10 bg-white/5 p-4"><p className="text-xs uppercase tracking-[0.2em] text-emeraldx">{copy.protocols.target}</p><p className="mt-2 text-white">{localizePillar(details.weakestPillar, language)}</p></div>
                  <div className="rounded-md border border-white/10 bg-white/5 p-4"><p className="text-xs uppercase tracking-[0.2em] text-emeraldx">{copy.protocols.reassess}</p><p className="mt-2 text-white">{details.whenToReassess}</p></div>
                </div>
                <div className="grid gap-3 lg:grid-cols-2">
                  {details.sevenDayActionPlan.map((day) => <div key={day.day} className="rounded-md border border-white/10 bg-white/5 p-4 text-sm text-chrome"><p className="mb-3 font-semibold text-white">{copy.protocols.day} {day.day}</p><p><span className="text-emeraldx">{copy.protocols.sleep}:</span> {day.sleep}</p><p><span className="text-emeraldx">{copy.protocols.nutrition}:</span> {day.nutrition}</p><p><span className="text-emeraldx">{copy.protocols.movement}:</span> {day.movement}</p><p><span className="text-emeraldx">{copy.protocols.recovery}:</span> {day.recovery}</p><p><span className="text-emeraldx">{copy.protocols.tracking}:</span> {day.tracking}</p></div>)}
                </div>
                <div className="grid gap-3 md:grid-cols-2">
                  <div className="rounded-md border border-white/10 bg-black/30 p-4"><h4 className="font-semibold text-white">{copy.protocols.metrics}</h4><ul className="mt-3 space-y-2 text-sm text-chrome">{details.metricsToMonitor.map((metric) => <li key={metric}>{metric}</li>)}</ul></div>
                  <div className="rounded-md border border-white/10 bg-black/30 p-4"><h4 className="font-semibold text-white">{copy.protocols.safety}</h4><p className="mt-3 text-sm leading-6 text-chrome">{details.safetyDisclaimer}</p></div>
                </div>
              </div>
            ) : <p className="mt-5 text-sm text-chrome">{copy.protocols.legacy}</p>}
          </Card>
        );
      })}
      {!protocols.length && <Card><p className="text-chrome">{copy.protocols.empty}</p></Card>}
    </div>
  );
}
