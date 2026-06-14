import { redirect } from "next/navigation";
import { AlertTriangle, CheckCircle2, Clock3, Dna, FileUp, FlaskConical, Orbit, ScanSearch } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { LabUploadForm } from "@/components/dashboard/LabUploadForm";
import { formatDate } from "@/lib/format";
import { localizeLabCategory, localizeLabPriorityAction, localizeLabStatus, localizePillar } from "@/lib/i18n";
import { getServerI18n } from "@/lib/i18n/server";
import { createClient } from "@/lib/supabase-server";
import type { LabReport } from "@/types/database";
import { SystemHeader } from "@/components/dashboard/SystemHeader";
import { SystemStatus } from "@/components/dashboard/SystemStatus";

const statusIcon = { completed: CheckCircle2, processing: Clock3, uploaded: Clock3, failed: AlertTriangle };

export default async function LabsPage() {
  const { copy, language } = await getServerI18n();
  const supabase = await createClient();
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) redirect("/auth/login");
  const { data, error } = await supabase.from("lab_reports").select("*").eq("user_id", auth.user.id).order("created_at", { ascending: false }).returns<LabReport[]>();
  const reports = data ?? [];
  const latest = reports.find((report) => report.processing_status === "completed" && report.analysis_json)?.analysis_json;
  const statusLabels: Record<string, string> = { completed: copy.labs.completed, processing: copy.labs.processing, uploaded: copy.labs.uploaded, failed: copy.labs.failed };
  const criticalSignals = [{ key: "glucose", label: language === "es" ? "Glucosa" : "Glucose" }, { key: "hba1c", label: "HbA1c" }, { key: "crp", label: "CRP" }, { key: "vitamin_d", label: language === "es" ? "Vitamina D" : "Vitamin D" }, { key: "ferritin", label: language === "es" ? "Ferritina" : "Ferritin" }];
  const presentKeys = new Set(latest?.biomarkers.map((marker) => marker.key) ?? []);
  const missingSignals = criticalSignals.filter((marker) => !presentKeys.has(marker.key));

  return (
    <div className="space-y-6">
      <SystemHeader eyebrow={copy.labs.eyebrow} title={copy.labs.title} description={copy.labs.intro} icon={ScanSearch} />
      {error && <Card className="border-amber-300/30 bg-amber-300/10"><p className="text-sm text-amber-100">{copy.labs.loadError}: {error.message}</p></Card>}
      <Card className="p-0">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-signal/10 px-5 py-4"><div><p className="system-label">{copy.labs.processingPipeline}</p><h3 className="mt-2 font-semibold text-white">{copy.labs.eyebrow}</h3></div><SystemStatus label={latest ? copy.dashboard.online : copy.dashboard.syncing} tone={latest ? "active" : "warning"} /></div>
        <div className="grid grid-cols-3 divide-x divide-signal/10">
          {[[copy.labs.ingest, FileUp], [copy.labs.extract, Dna], [copy.labs.interpret, Orbit]].map(([label, Icon], index) => { const PipelineIcon = Icon as typeof FileUp; return <div key={String(label)} className="relative px-3 py-5 text-center md:px-5"><PipelineIcon className={`mx-auto h-5 w-5 ${latest || index === 0 ? "text-emeraldx" : "text-muted"}`} /><p className="mt-2 text-[9px] font-semibold uppercase text-chrome">{String(label)}</p><span className={`absolute inset-x-4 bottom-0 h-px ${latest || index === 0 ? "bg-emeraldx shadow-[0_0_8px_rgba(0,245,212,0.65)]" : "bg-white/10"}`} /></div>; })}
        </div>
      </Card>
      <section className="grid gap-4 lg:grid-cols-[420px_1fr]">
        <Card><h3 className="mb-4 flex items-center gap-2 font-semibold text-white"><FlaskConical className="h-4 w-4 text-emeraldx" /> {copy.labs.upload}</h3><LabUploadForm /></Card>
        <Card>
          <h3 className="flex items-center gap-2 font-semibold text-white"><ScanSearch className="h-4 w-4 text-emeraldx" /> {copy.labs.latest}</h3>
          {latest ? <div className="mt-4 space-y-5"><div className="grid gap-3 sm:grid-cols-3"><div className="command-surface rounded-md p-4"><p className="text-xs uppercase text-chrome">{copy.labs.markers}</p><p className="mt-2 text-2xl text-white">{latest.biomarkers.length}</p></div><div className="command-surface rounded-md p-4"><p className="text-xs uppercase text-chrome">{copy.labs.opportunities}</p><p className="mt-2 text-2xl text-warningx">{latest.biggestOpportunities.length}</p></div><div className="command-surface rounded-md p-4"><p className="text-xs uppercase text-chrome">{copy.labs.weakest}</p><p className="mt-2 text-lg text-emeraldx">{localizeLabCategory(latest.weakestCategory, language) ?? copy.common.none}</p></div></div><div><p className="text-xs font-semibold uppercase text-emeraldx">{copy.labs.priority}</p><ul className="mt-3 space-y-2 text-sm text-chrome">{latest.biggestOpportunities.length ? latest.biggestOpportunities.slice(0, 3).map((marker) => <li key={marker.key} className="border-l border-warningx/40 pl-3">{localizeLabPriorityAction(marker.name, language)}</li>) : <li>{copy.optimization.labs.maintain}</li>}</ul></div></div> : <div className="mt-5 rounded-sm border border-dashed border-signal/20 bg-signal/[0.025] p-5"><ScanSearch className="h-6 w-6 text-signal" /><p className="mt-3 text-sm leading-6 text-chrome">{copy.labs.noAnalysis}</p></div>}
        </Card>
      </section>
      {latest && <section className="grid gap-4 lg:grid-cols-2"><Card><div className="flex items-center justify-between"><h3 className="font-semibold text-white">{copy.labs.pillarImpact}</h3><Orbit className="h-4 w-4 text-violet-300" /></div><div className="mt-5 space-y-3">{Object.entries(latest.scoreImpacts).map(([pillar, impact]) => <div key={pillar}><div className="mb-2 flex justify-between text-xs"><span className="text-chrome">{localizePillar(pillar, language)}</span><span className="font-mono text-warningx">{Number(impact) > 0 ? "+" : ""}{impact}</span></div><div className="h-1 bg-white/[0.06]"><div className="h-full bg-gradient-to-r from-violetx to-signal" style={{ width: `${Math.min(100, Math.abs(Number(impact)) * 8)}%` }} /></div></div>)}</div></Card><Card className={missingSignals.length ? "border-warningx/20" : "border-emeraldx/20"}><div className="flex items-center justify-between"><h3 className="font-semibold text-white">{copy.labs.missingSignals}</h3><SystemStatus label={missingSignals.length ? copy.dashboard.needsAttention : copy.dashboard.stable} tone={missingSignals.length ? "warning" : "active"} /></div>{missingSignals.length ? <div className="mt-5 flex flex-wrap gap-2">{missingSignals.map((signal) => <span key={signal.key} className="rounded-sm border border-warningx/20 bg-warningx/[0.05] px-3 py-2 text-xs text-amber-100">{signal.label}</span>)}</div> : <p className="mt-5 text-sm text-chrome">{copy.labs.noMissingSignals}</p>}</Card></section>}
      {latest && <Card><h3 className="font-semibold text-white">{copy.labs.extracted}</h3><div className="mt-4 overflow-x-auto"><table className="w-full min-w-[720px] text-left text-sm"><thead className="border-b border-white/10 text-xs uppercase text-chrome"><tr><th className="py-3">{copy.labs.biomarker}</th><th>{copy.labs.category}</th><th>{copy.labs.current}</th><th>{copy.labs.range}</th><th>{copy.labs.status}</th></tr></thead><tbody>{latest.biomarkers.map((marker) => <tr key={marker.key} className="border-b border-white/5"><td className="py-3 text-white">{marker.name}</td><td>{localizeLabCategory(marker.category, language)}</td><td>{marker.value} {marker.unit}</td><td>{marker.optimizationRange}</td><td className={marker.status === "Optimal" ? "text-emeraldx" : marker.status === "Priority Area" ? "text-rose-300" : "text-amber-200"}>{localizeLabStatus(marker.status, language)}</td></tr>)}</tbody></table></div></Card>}
      <Card><h3 className="font-semibold text-white">{copy.labs.history}</h3>{reports.length ? <div className="mt-4 space-y-2">{reports.map((report) => { const Icon = statusIcon[report.processing_status]; return <div key={report.id} className="flex flex-wrap items-center justify-between gap-3 rounded-md bg-white/5 p-4 text-sm"><div><p className="text-white">{report.file_name}</p><p className="mt-1 text-xs text-chrome">{formatDate(report.created_at)}</p></div><span className="flex items-center gap-2 capitalize text-chrome"><Icon className="h-4 w-4 text-emeraldx" />{statusLabels[report.processing_status] ?? report.processing_status}</span></div>; })}</div> : <p className="mt-4 text-sm text-chrome">{copy.labs.noUploads}</p>}</Card>
      <p className="text-xs text-chrome">{copy.labs.safety}</p>
    </div>
  );
}
