import { redirect } from "next/navigation";
import { AlertTriangle, CheckCircle2, Clock3, FlaskConical, ScanSearch } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { LabUploadForm } from "@/components/dashboard/LabUploadForm";
import { formatDate } from "@/lib/format";
import { localizeLabStatus } from "@/lib/i18n";
import { getServerI18n } from "@/lib/i18n/server";
import { createClient } from "@/lib/supabase-server";
import type { LabReport } from "@/types/database";

const statusIcon = { completed: CheckCircle2, processing: Clock3, uploaded: Clock3, failed: AlertTriangle };

export default async function LabsPage() {
  const { copy, language } = await getServerI18n();
  const supabase = await createClient();
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) redirect("/auth/login");
  const { data, error } = await supabase.from("lab_reports").select("*").eq("user_id", auth.user.id).order("created_at", { ascending: false }).returns<LabReport[]>();
  const reports = data ?? [];
  const latest = reports.find((report) => report.processing_status === "completed" && report.analysis_json)?.analysis_json;
  const statusLabels: Record<string, string> = language === "es" ? { completed: "completado", processing: "procesando", uploaded: "cargado", failed: "fallido" } : {};

  return (
    <div className="space-y-6">
      <div><p className="text-sm uppercase tracking-[0.24em] text-emeraldx">{copy.labs.eyebrow}</p><h2 className="mt-2 text-3xl font-semibold text-white">{copy.labs.title}</h2><p className="mt-2 max-w-3xl text-sm text-chrome">{copy.labs.intro}</p></div>
      {error && <Card className="border-amber-300/30 bg-amber-300/10"><p className="text-sm text-amber-100">{copy.labs.storageError}: {error.message}. Run <span className="text-white">supabase/phase5_labs_migration.sql</span>.</p></Card>}
      <section className="grid gap-4 lg:grid-cols-[420px_1fr]">
        <Card><h3 className="mb-4 flex items-center gap-2 font-semibold text-white"><FlaskConical className="h-4 w-4 text-emeraldx" /> {copy.labs.upload}</h3><LabUploadForm /></Card>
        <Card>
          <h3 className="flex items-center gap-2 font-semibold text-white"><ScanSearch className="h-4 w-4 text-emeraldx" /> {copy.labs.latest}</h3>
          {latest ? <div className="mt-4 space-y-5"><div className="grid gap-3 sm:grid-cols-3"><div className="rounded-md bg-white/5 p-4"><p className="text-xs uppercase text-chrome">{copy.labs.markers}</p><p className="mt-2 text-2xl text-white">{latest.biomarkers.length}</p></div><div className="rounded-md bg-white/5 p-4"><p className="text-xs uppercase text-chrome">{copy.labs.opportunities}</p><p className="mt-2 text-2xl text-white">{latest.biggestOpportunities.length}</p></div><div className="rounded-md bg-white/5 p-4"><p className="text-xs uppercase text-chrome">{copy.labs.weakest}</p><p className="mt-2 text-lg text-emeraldx">{latest.weakestCategory ?? copy.common.none}</p></div></div><div><p className="text-xs uppercase tracking-[0.18em] text-emeraldx">{copy.labs.priority}</p><ul className="mt-3 space-y-2 text-sm text-chrome">{latest.priorityActions.map((action) => <li key={action}>{action}</li>)}</ul></div></div> : <p className="mt-4 text-sm text-chrome">{copy.labs.noAnalysis}</p>}
        </Card>
      </section>
      {latest && <Card><h3 className="font-semibold text-white">{copy.labs.extracted}</h3><div className="mt-4 overflow-x-auto"><table className="w-full min-w-[720px] text-left text-sm"><thead className="border-b border-white/10 text-xs uppercase text-chrome"><tr><th className="py-3">{copy.labs.biomarker}</th><th>{copy.labs.category}</th><th>{copy.labs.current}</th><th>{copy.labs.range}</th><th>{copy.labs.status}</th></tr></thead><tbody>{latest.biomarkers.map((marker) => <tr key={marker.key} className="border-b border-white/5"><td className="py-3 text-white">{marker.name}</td><td>{marker.category}</td><td>{marker.value} {marker.unit}</td><td>{marker.optimizationRange}</td><td className={marker.status === "Optimal" ? "text-emeraldx" : marker.status === "Priority Area" ? "text-rose-300" : "text-amber-200"}>{localizeLabStatus(marker.status, language)}</td></tr>)}</tbody></table></div></Card>}
      <Card><h3 className="font-semibold text-white">{copy.labs.history}</h3>{reports.length ? <div className="mt-4 space-y-2">{reports.map((report) => { const Icon = statusIcon[report.processing_status]; return <div key={report.id} className="flex flex-wrap items-center justify-between gap-3 rounded-md bg-white/5 p-4 text-sm"><div><p className="text-white">{report.file_name}</p><p className="mt-1 text-xs text-chrome">{formatDate(report.created_at)}</p></div><span className="flex items-center gap-2 capitalize text-chrome"><Icon className="h-4 w-4 text-emeraldx" />{statusLabels[report.processing_status] ?? report.processing_status}</span></div>; })}</div> : <p className="mt-4 text-sm text-chrome">{copy.labs.noUploads}</p>}</Card>
      <p className="text-xs text-chrome">{copy.labs.safety}</p>
    </div>
  );
}
