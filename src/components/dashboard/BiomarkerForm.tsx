"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { createClient } from "@/lib/supabase-browser";
import { isSupabaseConfigured, supabaseConfigMessage } from "@/lib/supabase-config";
import { useI18n } from "@/components/i18n/LanguageProvider";

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
  const { copy, language } = useI18n();
  const labels: Record<string, string> = language === "es" ? { "Fasting glucose": "Glucosa en ayunas", Insulin: "Insulina", "Vitamin D": "Vitamina D", Testosterone: "Testosterona", Cortisol: "Cortisol", "Resting heart rate": "Frecuencia cardiaca en reposo", "Sleep duration": "Duración del sueño", "Deep sleep": "Sueño profundo", "REM sleep": "Sueño REM" } : {};
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
      return setError(`${copy.biomarkers.sessionError}: ${authError.message}`);
    }
    if (!auth.user) {
      setLoading(false);
      return setError(copy.biomarkers.loginAgain);
    }
    const payload = Object.fromEntries(fields.map(([key]) => [key, values[key] ? Number(values[key]) : null]));
    const { error: dbError } = await supabase.from("biomarker_entries").insert({ user_id: auth.user.id, ...payload, notes: values.notes || null });
    setLoading(false);
    if (dbError) return setError(`${copy.biomarkers.saveError}: ${dbError.message}`);
    setValues({});
    router.refresh();
  }

  return (
    <Card className="border-signal/15">
      <p className="system-label flex items-center gap-2"><span className="status-dot" />{copy.nav.biomarkers}</p>
      <h2 className="mt-3 text-xl font-semibold text-white">{copy.biomarkers.input}</h2>
      <form onSubmit={submit} className="mt-5 grid gap-4 md:grid-cols-3">
        {fields.map(([key, label]) => (
          <label key={key} className="block text-xs text-chrome"><span className="mb-2 block">{labels[label] ?? label}</span><input className="field" type="number" step="any" placeholder="--" value={values[key] ?? ""} onChange={(event) => setValues((current) => ({ ...current, [key]: event.target.value }))} /></label>
        ))}
        <label className="block text-xs text-chrome md:col-span-3"><span className="mb-2 block">{copy.biomarkers.notes}</span><textarea className="field" placeholder={copy.biomarkers.notes} value={values.notes ?? ""} onChange={(event) => setValues((current) => ({ ...current, notes: event.target.value }))} /></label>
        {!isSupabaseConfigured() && <p className="md:col-span-3 text-sm text-amber-200">{supabaseConfigMessage()}</p>}
        {error && <p className="md:col-span-3 text-sm text-red-300">{error}</p>}
        <Button className="md:col-span-3" disabled={loading}>{loading ? copy.common.saving : copy.biomarkers.save}</Button>
      </form>
    </Card>
  );
}
