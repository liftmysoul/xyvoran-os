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
import { Activity, Gauge, Rocket, Target, TimerReset } from "lucide-react";
import { SystemStatus } from "@/components/dashboard/SystemStatus";

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
  const activeProtocol = protocols.find((protocol) => (protocol.status ?? "active") === "active");
  const activeDetails = activeProtocol ? getProtocolDetails(activeProtocol) : null;
  const activeMissionTitle = activeProtocol
    ? (activeDetails ? (language === "es" ? `Protocolo de ${localizeGoal(activeDetails.primaryGoal, language)}: ${localizePillar(activeDetails.weakestPillar, language)}` : `${localizeGoal(activeDetails.primaryGoal, language)} Protocol: ${localizePillar(activeDetails.weakestPillar, language)}`) : activeProtocol.title ?? localizeGoal(activeProtocol.goal, language))
    : copy.protocols.empty;

  return (
    <div className="space-y-6">
      <SystemHeader eyebrow={copy.protocols.missionEyebrow} title={copy.protocols.title} description={copy.protocols.description} icon={Rocket} />
      <Card className="p-0"><div className="grid md:grid-cols-[1fr_auto] md:items-center"><div className="p-5"><p className="system-label">{copy.protocols.executionTimeline}</p><div className="mt-3 flex flex-wrap items-center gap-3"><h3 className="text-xl font-semibold text-white">{activeMissionTitle}</h3>{activeProtocol && <SystemStatus label={copy.protocols.missionActive} tone="intelligence" />}</div></div><div className="border-t border-signal/10 p-5 md:border-l md:border-t-0"><ProtocolGenerator /></div></div></Card>
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
                <div className="mt-2 flex flex-wrap items-center gap-2"><h3 className="text-xl font-semibold text-white">{localizedTitle}</h3><SystemStatus label={statusLabel} tone={status === "completed" ? "active" : status === "archived" ? "muted" : "intelligence"} /></div>
                <p className="mt-2 text-sm text-chrome">{formatDate(protocol.created_at)} | {copy.protocols.goal}: {localizedGoal} | {copy.protocols.weakest}: {localizePillar(String(protocol.weakest_pillar ?? details?.weakestPillar ?? copy.common.notSet), language)} | {copy.protocols.intensity}: {localizeIntensity(String(protocol.intensity ?? details?.intensity ?? "Beginner"), language)}</p>
              </div>
              <ProtocolStatusButton id={protocol.id} status={status} />
            </div>
            {details ? (
              <div className="mt-6 space-y-5 border-t border-signal/10 pt-5">
                <div className="grid gap-3 md:grid-cols-4">
                  <div className="command-surface rounded-md p-4"><Target className="h-4 w-4 text-emeraldx" /><p className="mt-3 system-label">{copy.protocols.primaryGoal}</p><p className="mt-2 text-white">{localizedGoal}</p></div>
                  <div className="command-surface rounded-md p-4"><Gauge className="h-4 w-4 text-signal" /><p className="mt-3 system-label">{copy.protocols.target}</p><p className="mt-2 text-white">{localizePillar(details.weakestPillar, language)}</p></div>
                  <div className="command-surface rounded-md p-4"><Activity className="h-4 w-4 text-warningx" /><p className="mt-3 system-label">{copy.protocols.estimatedImpact}</p><p className="mt-2 text-white">{details.intensity === "Advanced" ? copy.protocols.highImpact : copy.protocols.moderateImpact}</p></div>
                  <div className="command-surface rounded-md p-4"><TimerReset className="h-4 w-4 text-violet-300" /><p className="mt-3 system-label">{copy.protocols.reassess}</p><p className="mt-2 text-white">{localizeProtocolText(details.whenToReassess, language)}</p></div>
                </div>
                {details.contextSummary?.length > 0 && <div className="rounded-md border border-violetx/20 bg-violetx/[0.045] p-4"><h4 className="system-label text-violet-200">{copy.protocols.rationale}</h4><p className="mt-3 text-sm leading-6 text-chrome">{details.contextSummary.slice(0, 3).map((item) => localizeProtocolText(item, language)).join(" | ")}</p></div>}
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
      {!protocols.length && <Card className="border-dashed border-violetx/25 bg-violetx/[0.025]"><Rocket className="h-7 w-7 text-violet-300" /><p className="mt-4 max-w-xl text-sm leading-6 text-chrome">{copy.protocols.empty}</p></Card>}
    </div>
  );
}
