import { BiomarkerForm } from "@/components/dashboard/BiomarkerForm";
import { Card } from "@/components/ui/Card";
import { formatDate } from "@/lib/format";
import { createClient } from "@/lib/supabase-server";
import type { BiomarkerEntry } from "@/types/database";
import { getServerI18n } from "@/lib/i18n/server";

const columns: Array<keyof BiomarkerEntry> = ["fasting_glucose", "hba1c", "insulin", "crp", "vitamin_d", "testosterone", "cortisol", "hrv", "resting_heart_rate", "sleep_duration", "deep_sleep", "rem_sleep"];

export default async function BiomarkersPage() {
  const { copy, language } = await getServerI18n();
  const columnLabels: Record<string, string> = language === "es" ? { fasting_glucose: "glucosa en ayunas", insulin: "insulina", vitamin_d: "vitamina D", testosterone: "testosterona", resting_heart_rate: "frecuencia cardiaca en reposo", sleep_duration: "duración del sueño", deep_sleep: "sueño profundo", rem_sleep: "sueño REM" } : {};
  const supabase = await createClient();
  const { data: auth } = await supabase.auth.getUser();
  const { data, error } = await supabase.from("biomarker_entries").select("*").eq("user_id", auth.user?.id).order("created_at", { ascending: false }).limit(20).returns<BiomarkerEntry[]>();
  const entries = data ?? [];

  return (
    <div className="space-y-6">
      <BiomarkerForm />
      {error && (
        <Card className="border-amber-300/30 bg-amber-300/10">
          <p className="text-sm text-amber-100">{copy.biomarkers.historyError}: {error.message}</p>
        </Card>
      )}
      <Card>
        <h2 className="text-xl font-semibold text-white">{copy.biomarkers.history}</h2>
        <div className="mt-5 overflow-x-auto">
          <table className="w-full min-w-[960px] text-left text-sm">
            <thead className="text-emeraldx">
              <tr><th className="pb-3">{copy.common.date}</th>{columns.map((column) => <th className="pb-3" key={column}>{columnLabels[String(column)] ?? String(column).replaceAll("_", " ")}</th>)}</tr>
            </thead>
            <tbody className="divide-y divide-white/10 text-chrome">
              {entries.map((entry) => (
                <tr key={entry.id}>
                  <td className="py-3 text-white">{formatDate(entry.created_at)}</td>
                  {columns.map((column) => <td className="py-3" key={column}>{entry[column] ?? "-"}</td>)}
                </tr>
              ))}
              {!entries.length && <tr><td className="py-6 text-chrome" colSpan={columns.length + 1}>{copy.biomarkers.noEntries}</td></tr>}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
