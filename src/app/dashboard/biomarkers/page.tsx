import { BiomarkerForm } from "@/components/dashboard/BiomarkerForm";
import { Card } from "@/components/ui/Card";
import { formatDate } from "@/lib/format";
import { createClient } from "@/lib/supabase-server";
import type { BiomarkerEntry } from "@/types/database";

const columns: Array<keyof BiomarkerEntry> = ["fasting_glucose", "hba1c", "insulin", "crp", "vitamin_d", "testosterone", "cortisol", "hrv", "resting_heart_rate", "sleep_duration", "deep_sleep", "rem_sleep"];

export default async function BiomarkersPage() {
  const supabase = await createClient();
  const { data: auth } = await supabase.auth.getUser();
  const { data, error } = await supabase.from("biomarker_entries").select("*").eq("user_id", auth.user?.id).order("created_at", { ascending: false }).limit(20).returns<BiomarkerEntry[]>();
  const entries = data ?? [];

  return (
    <div className="space-y-6">
      <BiomarkerForm />
      {error && (
        <Card className="border-amber-300/30 bg-amber-300/10">
          <p className="text-sm text-amber-100">Biomarker history could not be loaded: {error.message}</p>
        </Card>
      )}
      <Card>
        <h2 className="text-xl font-semibold text-white">Biomarker History</h2>
        <div className="mt-5 overflow-x-auto">
          <table className="w-full min-w-[960px] text-left text-sm">
            <thead className="text-emeraldx">
              <tr><th className="pb-3">Date</th>{columns.map((column) => <th className="pb-3" key={column}>{String(column).replaceAll("_", " ")}</th>)}</tr>
            </thead>
            <tbody className="divide-y divide-white/10 text-chrome">
              {entries.map((entry) => (
                <tr key={entry.id}>
                  <td className="py-3 text-white">{formatDate(entry.created_at)}</td>
                  {columns.map((column) => <td className="py-3" key={column}>{entry[column] ?? "-"}</td>)}
                </tr>
              ))}
              {!entries.length && <tr><td className="py-6 text-chrome" colSpan={columns.length + 1}>No biomarker entries yet.</td></tr>}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
