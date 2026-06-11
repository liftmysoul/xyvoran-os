"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { createClient } from "@/lib/supabase-browser";
import { isSupabaseConfigured, supabaseConfigMessage } from "@/lib/supabase-config";

const fields = [
  ["fasting_glucose", "Fasting glucose"],
  ["hba1c", "HbA1c"],
  ["insulin", "Insulin"],
  ["crp", "CRP"],
  ["vitamin_d", "Vitamin D"],
  ["testosterone", "Testosterone"],
  ["cortisol", "Cortisol"],
  ["hrv", "HRV"],
  ["resting_heart_rate", "Resting heart rate"],
  ["sleep_duration", "Sleep duration"],
  ["deep_sleep", "Deep sleep"],
  ["rem_sleep", "REM sleep"]
] as const;

export function BiomarkerForm() {
  const router = useRouter();
  const supabase = createClient();
  const [values, setValues] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    if (!isSupabaseConfigured()) {
      setError(supabaseConfigMessage());
      return;
    }
    setLoading(true);
    setError("");
    const { data: auth, error: authError } = await supabase.auth.getUser();
    if (authError) {
      setLoading(false);
      return setError(`Unable to verify your session: ${authError.message}`);
    }
    if (!auth.user) {
      setLoading(false);
      return setError("Please log in again before saving biomarkers.");
    }
    const payload = Object.fromEntries(fields.map(([key]) => [key, values[key] ? Number(values[key]) : null]));
    const { error: dbError } = await supabase.from("biomarker_entries").insert({ user_id: auth.user.id, ...payload, notes: values.notes || null });
    setLoading(false);
    if (dbError) return setError(`Unable to save biomarker entry: ${dbError.message}`);
    setValues({});
    router.refresh();
  }

  return (
    <Card>
      <h2 className="text-xl font-semibold text-white">Manual Biomarker Input</h2>
      <form onSubmit={submit} className="mt-5 grid gap-3 md:grid-cols-3">
        {fields.map(([key, label]) => (
          <input
            key={key}
            className="field"
            type="number"
            step="any"
            placeholder={label}
            value={values[key] ?? ""}
            onChange={(event) => setValues((current) => ({ ...current, [key]: event.target.value }))}
          />
        ))}
        <textarea className="field md:col-span-3" placeholder="Notes" value={values.notes ?? ""} onChange={(event) => setValues((current) => ({ ...current, notes: event.target.value }))} />
        {!isSupabaseConfigured() && <p className="md:col-span-3 text-sm text-amber-200">{supabaseConfigMessage()}</p>}
        {error && <p className="md:col-span-3 text-sm text-red-300">{error}</p>}
        <Button className="md:col-span-3" disabled={loading}>{loading ? "Saving..." : "Save Biomarkers"}</Button>
      </form>
    </Card>
  );
}
