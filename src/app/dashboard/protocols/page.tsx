import { ProtocolGenerator } from "@/components/dashboard/ProtocolGenerator";
import { ProtocolStatusButton } from "@/components/dashboard/ProtocolStatusButton";
import { Card } from "@/components/ui/Card";
import { formatDate } from "@/lib/format";
import { localizeIntensity, localizePillar } from "@/lib/i18n";
import { localizeGoal, localizeProtocolText } from "@/lib/protocol";
import { getServerI18n } from "@/lib/i18n/server";
import { createClient } from "@/lib/supabase-server";
import type { Protocol, StructuredProtocol } from "@/types/database";
import { SystemHeader } from "@/components/dashboard/SystemHeader";
import { Rocket, Target } from "lucide-react";

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
      <SystemHeader eyebrow={copy.protocols.missionEyebrow} title={copy.protocols.title} description={copy.protocols.description} icon={Rocket} />
      <div className="flex justify-end"><ProtocolGenerator /></div>
      {error && <Card className="border-amber-300/30 bg-amber-300/10"><p className="text-sm text-amber-100">{copy.protocols.loadError}: {error.message}</p></Card>}
      {protocols.map((protocol) => {
        const details = getProtocolDetails(protocol);
        const localizedGoal = localizeGoal(details?.primaryGoal ?? protocol.goal, language);
        const localizedTitle = details
          ? (language === "es" ? `Protocolo de ${localizedGoal}: ${localizePillar(details.weakestPillar, language)}` : `${localizedGoal} Protocol: ${localizePillar(details.weakestPillar, language)}`)
          : protocol.title ?? localizedGoal;
        const status = protocol.status ?? "active";
        const statusLabel = status === "completed" ? copy.common.completed : status === "archived" ? copy.common.archived : copy.common.active;
        return (
          <Card key={protocol.id} className="border-signal/15 p-0">
            <div className="signal-line" />
            <div className="p-5 md:p-6">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="system-label flex items-center gap-2"><Target className="h-3.5 w-3.5" />{copy.protocols.missionPlan}</p>
                <div className="mt-2 flex flex-wrap items-center gap-2"><h3 className="text-xl font-semibold text-white">{localizedTitle}</h3><span className="rounded-md border border-successx/20 bg-successx/[0.06] px-2 py-1 text-xs uppercase text-successx">{statusLabel}</span></div>
                <p className="mt-2 text-sm text-chrome">{formatDate(protocol.created_at)} · {copy.protocols.goal}: {localizedGoal} · {copy.protocols.weakest}: {localizePillar(String(protocol.weakest_pillar ?? details?.weakestPillar ?? copy.common.notSet), language)} · {copy.protocols.intensity}: {localizeIntensity(String(protocol.intensity ?? details?.intensity ?? "Beginner"), language)}</p>
              </div>
              <ProtocolStatusButton id={protocol.id} status={status} />
            </div>
            {details ? (
              <div className="mt-6 space-y-5 border-t border-signal/10 pt-5">
                <div className="grid gap-3 md:grid-cols-3">
                  <div className="command-surface rounded-md p-4"><p className="system-label">{copy.protocols.primaryGoal}</p><p className="mt-2 text-white">{localizedGoal}</p></div>
                  <div className="command-surface rounded-md p-4"><p className="system-label">{copy.protocols.target}</p><p className="mt-2 text-white">{localizePillar(details.weakestPillar, language)}</p></div>
                  <div className="command-surface rounded-md p-4"><p className="system-label">{copy.protocols.reassess}</p><p className="mt-2 text-white">{localizeProtocolText(details.whenToReassess, language)}</p></div>
                </div>
                <div className="grid gap-3 lg:grid-cols-2">
                  {details.sevenDayActionPlan.map((day) => <div key={day.day} className="command-surface rounded-md p-4 text-sm leading-6 text-chrome"><p className="mb-3 flex items-center justify-between font-semibold text-white"><span>{copy.protocols.day} {day.day}</span><span className="font-mono text-[10px] text-emeraldx">D-{String(day.day).padStart(2, "0")}</span></p><p><span className="text-emeraldx">{copy.protocols.sleep}:</span> {localizeProtocolText(day.sleep, language)}</p><p><span className="text-signal">{copy.protocols.nutrition}:</span> {localizeProtocolText(day.nutrition, language)}</p><p><span className="text-emeraldx">{copy.protocols.movement}:</span> {localizeProtocolText(day.movement, language)}</p><p><span className="text-signal">{copy.protocols.recovery}:</span> {localizeProtocolText(day.recovery, language)}</p><p><span className="text-emeraldx">{copy.protocols.tracking}:</span> {localizeProtocolText(day.tracking, language)}</p></div>)}
                </div>
                <div className="grid gap-3 md:grid-cols-2">
                  <div className="rounded-md border border-white/10 bg-black/30 p-4"><h4 className="font-semibold text-white">{copy.protocols.metrics}</h4><ul className="mt-3 space-y-2 text-sm text-chrome">{details.metricsToMonitor.map((metric) => <li key={metric}>{localizeProtocolText(metric, language)}</li>)}</ul></div>
                  <div className="rounded-md border border-white/10 bg-black/30 p-4"><h4 className="font-semibold text-white">{copy.protocols.safety}</h4><p className="mt-3 text-sm leading-6 text-chrome">{localizeProtocolText(details.safetyDisclaimer, language)}</p></div>
                </div>
              </div>
            ) : <p className="mt-5 text-sm text-chrome">{copy.protocols.legacy}</p>}
            </div>
          </Card>
        );
      })}
      {!protocols.length && <Card><p className="text-chrome">{copy.protocols.empty}</p></Card>}
    </div>
  );
}
