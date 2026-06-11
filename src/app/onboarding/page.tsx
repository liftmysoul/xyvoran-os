"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Brain, Check, ChevronLeft, ChevronRight, Dna, Droplets, HeartPulse, LoaderCircle, Scale, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { createClient } from "@/lib/supabase-browser";
import { isSupabaseConfigured, supabaseConfigMessage } from "@/lib/supabase-config";
import type { OnboardingData, Sex } from "@/types/database";

const goals = ["Fat loss", "Better sleep", "More energy", "Cognitive performance", "Recovery", "Longevity", "Metabolic health", "Stress resilience", "Beauty / skin optimization"];
const frequencies = ["Never", "Rarely", "Sometimes", "Often", "Daily"];
const steps = [
  { title: "Personal Profile", subtitle: "Your physical baseline", icon: Dna },
  { title: "Goals", subtitle: "What you want to change", icon: Sparkles },
  { title: "Recovery & Sleep", subtitle: "Readiness and restoration", icon: HeartPulse },
  { title: "Metabolic & Nutrition", subtitle: "Energy regulation", icon: Scale },
  { title: "Cognitive & Longevity", subtitle: "Performance over time", icon: Brain },
  { title: "Beauty, Stack & Safety", subtitle: "Wellness inputs", icon: Droplets }
];

type FormState = Record<string, string | boolean | string[]> & { sex: Sex; secondary_goals: string[]; disclaimer_confirmed: boolean };

const initialForm: FormState = {
  full_name: "", age: "", sex: "prefer_not_to_say", height_cm: "", weight_kg: "",
  main_goal: "More energy", secondary_goals: [], exercise_frequency: "2-3x/week",
  sleep_duration: "", sleep_quality: "6", stress_level: "5", energy_level: "6", hrv: "", resting_heart_rate: "",
  waist_circumference_cm: "", body_fat_percent: "", fasting_hours: "12", eating_window_hours: "12", diet_style: "", sugar_craving_frequency: "Sometimes", afternoon_energy_crash_frequency: "Sometimes",
  focus_level: "6", brain_fog_frequency: "Sometimes", caffeine_intake: "1-2 servings/day", productivity_goal: "", alcohol_use: "None", nicotine_use: "None", family_history_notes: "", longevity_concern: "",
  skin_quality: "6", hydration_level: "6", beauty_concern: "", supplements: "", medications: "", peptides: "", wearables_used: "", disclaimer_confirmed: false
};

function Field({ label, helper, children }: { label: string; helper: string; children: React.ReactNode }) {
  return <label className="block"><span className="text-sm font-medium text-white">{label}</span><span className="mt-1 block text-xs leading-5 text-chrome">{helper}</span><span className="mt-2 block">{children}</span></label>;
}

function RangeField({ label, helper, name, value, update }: { label: string; helper: string; name: string; value: string; update: (name: string, value: string) => void }) {
  return <Field label={label} helper={helper}><div className="flex items-center gap-4"><input className="h-2 flex-1 accent-emeraldx" type="range" min="1" max="10" value={value} onChange={(event) => update(name, event.target.value)} /><output className="grid h-10 w-12 place-items-center rounded-md border border-white/10 bg-white/5 font-semibold text-white">{value}</output></div></Field>;
}

function optionalNumber(value: string | boolean | string[]) {
  return typeof value === "string" && value.trim() ? Number(value) : null;
}

export default function OnboardingPage() {
  const router = useRouter();
  const [supabase] = useState(() => createClient());
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<FormState>(initialForm);
  const [loading, setLoading] = useState(false);
  const [hydrating, setHydrating] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    async function hydrate() {
      const { data: auth } = await supabase.auth.getUser();
      if (!auth.user || !active) return setHydrating(false);
      const { data } = await supabase.from("onboarding_data").select("*").eq("user_id", auth.user.id).maybeSingle<OnboardingData>();
      if (data && active) {
        setForm((current) => {
          const next = { ...current };
          for (const [key, value] of Object.entries(data)) {
            if (key in next && value !== null && value !== undefined) next[key] = Array.isArray(value) ? value.map(String) : typeof value === "boolean" ? value : String(value);
          }
          return next;
        });
      }
      if (active) setHydrating(false);
    }
    hydrate();
    return () => { active = false; };
  }, [supabase]);

  function update(name: string, value: string | boolean | string[]) {
    setForm((current) => ({ ...current, [name]: value }));
    setError("");
  }

  function toggleGoal(goal: string) {
    const selected = form.secondary_goals;
    update("secondary_goals", selected.includes(goal) ? selected.filter((item) => item !== goal) : [...selected, goal]);
  }

  function validateStep(currentStep: number) {
    const required: Record<number, Array<[string, string]>> = {
      0: [["full_name", "Full Name"], ["age", "Age"], ["height_cm", "Height"], ["weight_kg", "Weight"]],
      1: [["main_goal", "Primary Goal"]],
      2: [["sleep_duration", "Average Sleep Duration"], ["sleep_quality", "Sleep Quality"], ["stress_level", "Stress Level"], ["energy_level", "Daily Energy Level"]],
      3: [["diet_style", "Nutrition Style"]]
    };
    const missing = (required[currentStep] ?? []).find(([name]) => !String(form[name] ?? "").trim());
    if (missing) { setError(`${missing[1]} is required.`); return false; }
    if (currentStep === 5 && !form.disclaimer_confirmed) { setError("Confirm the educational wellness disclaimer to continue."); return false; }
    return true;
  }

  function next() {
    if (!validateStep(step)) return;
    setStep((current) => Math.min(steps.length - 1, current + 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function submit() {
    if (!validateStep(5)) return;
    if (!isSupabaseConfigured()) return setError(supabaseConfigMessage());
    setLoading(true);
    setError("");
    const { data: auth, error: authError } = await supabase.auth.getUser();
    if (authError || !auth.user) { setLoading(false); return setError(authError ? `Unable to verify your session: ${authError.message}` : "Please sign in before onboarding."); }
    const payload = {
      user_id: auth.user.id,
      full_name: String(form.full_name).trim(), age: Number(form.age), sex: form.sex, height_cm: Number(form.height_cm), weight_kg: Number(form.weight_kg),
      main_goal: String(form.main_goal), secondary_goals: form.secondary_goals, exercise_frequency: String(form.exercise_frequency),
      sleep_duration: Number(form.sleep_duration), sleep_quality: Number(form.sleep_quality), stress_level: Number(form.stress_level), energy_level: Number(form.energy_level), hrv: optionalNumber(form.hrv), resting_heart_rate: optionalNumber(form.resting_heart_rate),
      waist_circumference_cm: optionalNumber(form.waist_circumference_cm), body_fat_percent: optionalNumber(form.body_fat_percent), fasting_hours: optionalNumber(form.fasting_hours), eating_window_hours: optionalNumber(form.eating_window_hours), diet_style: String(form.diet_style), sugar_craving_frequency: String(form.sugar_craving_frequency), afternoon_energy_crash_frequency: String(form.afternoon_energy_crash_frequency),
      focus_level: optionalNumber(form.focus_level), brain_fog_frequency: String(form.brain_fog_frequency), caffeine_intake: String(form.caffeine_intake), productivity_goal: String(form.productivity_goal), alcohol_use: String(form.alcohol_use), nicotine_use: String(form.nicotine_use), family_history_notes: String(form.family_history_notes), longevity_concern: String(form.longevity_concern),
      skin_quality: optionalNumber(form.skin_quality), hydration_level: optionalNumber(form.hydration_level), beauty_concern: String(form.beauty_concern), supplements: String(form.supplements), medications: String(form.medications), peptides: String(form.peptides), wearables_used: String(form.wearables_used), disclaimer_confirmed: true
    };
    const { error: dbError } = await supabase.from("onboarding_data").upsert(payload, { onConflict: "user_id" });
    setLoading(false);
    if (dbError) return setError(dbError.message.includes("column") ? `The Phase 5.5 database migration is required before saving: ${dbError.message}` : `Unable to save onboarding data: ${dbError.message}`);
    router.replace("/dashboard");
    router.refresh();
  }

  const text = (name: string) => String(form[name] ?? "");
  const commonInput = "field w-full";
  const CurrentIcon = steps[step].icon;

  if (hydrating) return <main className="grid min-h-screen place-items-center"><LoaderCircle className="h-7 w-7 animate-spin text-emeraldx" /></main>;

  return (
    <main className="min-h-screen px-4 py-8 md:px-8">
      <div className="mx-auto max-w-6xl">
        <header className="mb-7 flex flex-wrap items-end justify-between gap-4 border-b border-white/10 pb-6">
          <div><p className="text-xs uppercase tracking-[0.28em] text-emeraldx">XYVORAN Optimization Intake</p><h1 className="mt-2 text-3xl font-semibold text-white">Build your operating baseline</h1><p className="mt-2 max-w-2xl text-sm text-chrome">Six focused steps connect your lifestyle inputs directly to the five optimization pillars.</p></div>
          <p className="text-sm text-chrome">Step <span className="text-white">{step + 1}</span> of {steps.length}</p>
        </header>

        <div className="mb-6 grid grid-cols-6 gap-2" aria-label="Onboarding progress">
          {steps.map((item, index) => <button key={item.title} type="button" onClick={() => index <= step && setStep(index)} className={`h-2 rounded-sm ${index <= step ? "bg-emeraldx" : "bg-white/10"}`} aria-label={`Go to ${item.title}`} />)}
        </div>

        <div className="grid gap-6 lg:grid-cols-[250px_1fr]">
          <aside className="hidden lg:block"><div className="space-y-2">{steps.map((item, index) => { const Icon = item.icon; return <div key={item.title} className={`flex items-center gap-3 rounded-md px-3 py-3 ${index === step ? "bg-emeraldx/10 text-white" : "text-chrome"}`}><span className={`grid h-8 w-8 place-items-center rounded-md ${index < step ? "bg-emeraldx text-obsidian" : "border border-white/10"}`}>{index < step ? <Check className="h-4 w-4" /> : <Icon className="h-4 w-4" />}</span><span><span className="block text-sm">{item.title}</span><span className="block text-xs opacity-70">{item.subtitle}</span></span></div>; })}</div></aside>

          <Card className="min-h-[570px]">
            <div className="mb-7 flex items-center gap-3"><span className="grid h-11 w-11 place-items-center rounded-md border border-emeraldx/30 bg-emeraldx/10"><CurrentIcon className="h-5 w-5 text-emeraldx" /></span><div><h2 className="text-xl font-semibold text-white">{steps[step].title}</h2><p className="text-sm text-chrome">{steps[step].subtitle}</p></div></div>

            {step === 0 && <div className="grid gap-5 md:grid-cols-2">
              <Field label="Full Name" helper="Used to personalize your profile and coach experience."><input className={commonInput} placeholder="e.g. Jordan Lee" value={text("full_name")} onChange={(e) => update("full_name", e.target.value)} /></Field>
              <Field label="Age (years)" helper="Helps calibrate recovery and longevity context."><input className={commonInput} type="number" min="13" max="120" placeholder="e.g. 35" value={text("age")} onChange={(e) => update("age", e.target.value)} /></Field>
              <Field label="Biological Sex" helper="Used only where biological reference context may differ."><select className={commonInput} value={form.sex} onChange={(e) => update("sex", e.target.value)}><option value="female">Female</option><option value="male">Male</option><option value="intersex">Intersex</option><option value="prefer_not_to_say">Prefer not to say</option></select></Field>
              <Field label="Height (cm)" helper="Enter your current height in centimeters."><input className={commonInput} type="number" min="100" max="250" placeholder="e.g. 178" value={text("height_cm")} onChange={(e) => update("height_cm", e.target.value)} /></Field>
              <Field label="Weight (kg)" helper="Enter your current weight in kilograms."><input className={commonInput} type="number" min="30" max="350" step="0.1" placeholder="e.g. 78.5" value={text("weight_kg")} onChange={(e) => update("weight_kg", e.target.value)} /></Field>
            </div>}

            {step === 1 && <div className="space-y-6">
              <Field label="Primary Goal" helper="This becomes the main target for protocols and coaching."><select className={commonInput} value={text("main_goal")} onChange={(e) => update("main_goal", e.target.value)}>{goals.map((goal) => <option key={goal}>{goal}</option>)}</select></Field>
              <Field label="Secondary Goals" helper="Select any additional outcomes you want XYVORAN OS to consider."><div className="grid gap-2 sm:grid-cols-2">{goals.filter((goal) => goal !== form.main_goal).map((goal) => <button key={goal} type="button" onClick={() => toggleGoal(goal)} className={`flex min-h-11 items-center justify-between rounded-md border px-3 text-left text-sm ${form.secondary_goals.includes(goal) ? "border-emeraldx bg-emeraldx/10 text-white" : "border-white/10 bg-white/5 text-chrome"}`}>{goal}{form.secondary_goals.includes(goal) && <Check className="h-4 w-4 text-emeraldx" />}</button>)}</div></Field>
              <Field label="Exercise Frequency" helper="Include planned strength, conditioning, or sustained movement sessions."><select className={commonInput} value={text("exercise_frequency")} onChange={(e) => update("exercise_frequency", e.target.value)}><option>Rarely</option><option>1x/week</option><option>2-3x/week</option><option>4-5x/week</option><option>6+x/week</option></select></Field>
            </div>}

            {step === 2 && <div className="grid gap-6 md:grid-cols-2">
              <Field label="Average Sleep Duration (hours)" helper="Use your typical nightly average, not your best night."><input className={commonInput} type="number" min="0" max="14" step="0.1" placeholder="e.g. 7.2" value={text("sleep_duration")} onChange={(e) => update("sleep_duration", e.target.value)} /></Field>
              <RangeField label="Sleep Quality (1-10)" helper="How restorative your sleep generally feels." name="sleep_quality" value={text("sleep_quality")} update={update} />
              <RangeField label="Stress Level (1-10)" helper="Your average perceived daily stress load." name="stress_level" value={text("stress_level")} update={update} />
              <RangeField label="Daily Energy Level (1-10)" helper="Your typical usable energy across the day." name="energy_level" value={text("energy_level")} update={update} />
              <Field label="HRV (optional)" helper="Enter your recent average in milliseconds if tracked."><input className={commonInput} type="number" min="1" placeholder="e.g. 52 ms" value={text("hrv")} onChange={(e) => update("hrv", e.target.value)} /></Field>
              <Field label="Resting Heart Rate (optional)" helper="Enter your recent average beats per minute."><input className={commonInput} type="number" min="30" max="160" placeholder="e.g. 62 bpm" value={text("resting_heart_rate")} onChange={(e) => update("resting_heart_rate", e.target.value)} /></Field>
            </div>}

            {step === 3 && <div className="grid gap-5 md:grid-cols-2">
              <Field label="Waist Circumference (optional)" helper="Measure at the navel and enter centimeters."><input className={commonInput} type="number" step="0.1" placeholder="e.g. 84 cm" value={text("waist_circumference_cm")} onChange={(e) => update("waist_circumference_cm", e.target.value)} /></Field>
              <Field label="Estimated Body Fat % (optional)" helper="Use a recent estimate if available."><input className={commonInput} type="number" min="2" max="70" step="0.1" placeholder="e.g. 18%" value={text("body_fat_percent")} onChange={(e) => update("body_fat_percent", e.target.value)} /></Field>
              <Field label="Fasting Hours" helper="Typical hours between your final meal and first meal."><input className={commonInput} type="number" min="0" max="24" step="0.5" placeholder="e.g. 12" value={text("fasting_hours")} onChange={(e) => update("fasting_hours", e.target.value)} /></Field>
              <Field label="Eating Window (hours)" helper="Typical daily span during which you eat."><input className={commonInput} type="number" min="1" max="24" step="0.5" placeholder="e.g. 10" value={text("eating_window_hours")} onChange={(e) => update("eating_window_hours", e.target.value)} /></Field>
              <Field label="Nutrition Style" helper="Choose the pattern that most closely matches your current diet."><select className={commonInput} value={text("diet_style")} onChange={(e) => update("diet_style", e.target.value)}><option value="">Select nutrition style</option><option>Balanced whole foods</option><option>High protein</option><option>Mediterranean</option><option>Low carbohydrate</option><option>Ketogenic</option><option>Plant-forward</option><option>Vegan</option><option>Intermittent fasting</option><option>No consistent pattern</option></select></Field>
              <Field label="Sugar Craving Frequency" helper="How often strong sweet-food cravings occur."><select className={commonInput} value={text("sugar_craving_frequency")} onChange={(e) => update("sugar_craving_frequency", e.target.value)}>{frequencies.map((item) => <option key={item}>{item}</option>)}</select></Field>
              <Field label="Afternoon Energy Crash Frequency" helper="How often energy drops sharply after lunch or mid-afternoon."><select className={commonInput} value={text("afternoon_energy_crash_frequency")} onChange={(e) => update("afternoon_energy_crash_frequency", e.target.value)}>{frequencies.map((item) => <option key={item}>{item}</option>)}</select></Field>
            </div>}

            {step === 4 && <div className="grid gap-5 md:grid-cols-2">
              <RangeField label="Focus Level (1-10)" helper="Your ability to sustain focused work without distraction." name="focus_level" value={text("focus_level")} update={update} />
              <Field label="Brain Fog Frequency" helper="How often thinking feels slow, cloudy, or effortful."><select className={commonInput} value={text("brain_fog_frequency")} onChange={(e) => update("brain_fog_frequency", e.target.value)}>{frequencies.map((item) => <option key={item}>{item}</option>)}</select></Field>
              <Field label="Caffeine Intake" helper="Include coffee, tea, energy drinks, and pre-workout."><select className={commonInput} value={text("caffeine_intake")} onChange={(e) => update("caffeine_intake", e.target.value)}><option>None</option><option>1-2 servings/day</option><option>3-4 servings/day</option><option>5+ servings/day</option><option>Varies significantly</option></select></Field>
              <Field label="Productivity Goal" helper="Describe the cognitive output you want to improve."><input className={commonInput} placeholder="e.g. Two focused 90-minute work blocks" value={text("productivity_goal")} onChange={(e) => update("productivity_goal", e.target.value)} /></Field>
              <Field label="Alcohol Use" helper="Select your typical weekly pattern."><select className={commonInput} value={text("alcohol_use")} onChange={(e) => update("alcohol_use", e.target.value)}><option>None</option><option>1-2 drinks/week</option><option>3-6 drinks/week</option><option>7-14 drinks/week</option><option>15+ drinks/week</option></select></Field>
              <Field label="Nicotine / Tobacco Use" helper="Include smoking, vaping, pouches, or other nicotine products."><select className={commonInput} value={text("nicotine_use")} onChange={(e) => update("nicotine_use", e.target.value)}><option>None</option><option>Occasional</option><option>Daily</option><option>Former user</option></select></Field>
              <Field label="Family History Notes (optional)" helper="Add relevant patterns you want considered without entering a diagnosis."><textarea className={commonInput} rows={3} placeholder="e.g. Cardiometabolic concerns in immediate family" value={text("family_history_notes")} onChange={(e) => update("family_history_notes", e.target.value)} /></Field>
              <Field label="Main Longevity Concern" helper="What long-term healthspan area matters most to you?"><textarea className={commonInput} rows={3} placeholder="e.g. Maintaining cardiovascular fitness and mobility" value={text("longevity_concern")} onChange={(e) => update("longevity_concern", e.target.value)} /></Field>
            </div>}

            {step === 5 && <div className="grid gap-5 md:grid-cols-2">
              <RangeField label="Skin Quality (1-10)" helper="Your overall perception of clarity, texture, and resilience." name="skin_quality" value={text("skin_quality")} update={update} />
              <RangeField label="Hydration Level (1-10)" helper="How consistently hydrated you feel across the day." name="hydration_level" value={text("hydration_level")} update={update} />
              <Field label="Hair / Skin / Body Composition Concern" helper="Describe the main wellness or appearance outcome you want to support."><input className={commonInput} placeholder="e.g. Skin hydration and lean body composition" value={text("beauty_concern")} onChange={(e) => update("beauty_concern", e.target.value)} /></Field>
              <Field label="Supplements" helper="List current supplements and typical timing."><textarea className={commonInput} rows={3} placeholder="e.g. Magnesium glycinate, omega-3" value={text("supplements")} onChange={(e) => update("supplements", e.target.value)} /></Field>
              <Field label="Medications" helper="Optional context only. XYVORAN OS will not alter prescriptions."><textarea className={commonInput} rows={3} placeholder="List medications or leave blank" value={text("medications")} onChange={(e) => update("medications", e.target.value)} /></Field>
              <Field label="Peptides" helper="Optional context only. Dosing advice is outside the platform's scope."><textarea className={commonInput} rows={3} placeholder="List current peptides or leave blank" value={text("peptides")} onChange={(e) => update("peptides", e.target.value)} /></Field>
              <Field label="Wearables Used" helper="List devices supplying sleep, HRV, activity, or glucose data."><input className={commonInput} placeholder="e.g. Oura Ring, Apple Watch, CGM" value={text("wearables_used")} onChange={(e) => update("wearables_used", e.target.value)} /></Field>
              <label className="flex gap-3 rounded-md border border-emeraldx/25 bg-emeraldx/5 p-4 text-sm text-chrome md:col-span-2"><input className="mt-1 accent-emeraldx" type="checkbox" checked={form.disclaimer_confirmed} onChange={(e) => update("disclaimer_confirmed", e.target.checked)} /><span><span className="block font-medium text-white">Educational wellness disclaimer</span><span className="mt-1 block leading-5">I understand XYVORAN OS provides educational wellness guidance only and does not diagnose disease, prescribe treatment, or replace licensed medical care.</span></span></label>
            </div>}

            {error && <p className="mt-6 rounded-md border border-red-300/20 bg-red-300/10 p-3 text-sm text-red-200" role="alert">{error}</p>}
            {!isSupabaseConfigured() && <p className="mt-6 text-sm text-amber-200">{supabaseConfigMessage()}</p>}
            <div className="mt-8 flex items-center justify-between border-t border-white/10 pt-5">
              <button type="button" onClick={() => setStep((current) => Math.max(0, current - 1))} disabled={step === 0} className="inline-flex min-h-11 items-center gap-2 rounded-md px-3 text-sm text-chrome disabled:opacity-30"><ChevronLeft className="h-4 w-4" /> Back</button>
              {step < steps.length - 1 ? <Button type="button" onClick={next}>Continue <ChevronRight className="h-4 w-4" /></Button> : <Button type="button" onClick={submit} disabled={loading}>{loading ? <><LoaderCircle className="h-4 w-4 animate-spin" /> Saving intake...</> : "Complete Intake"}</Button>}
            </div>
          </Card>
        </div>
      </div>
    </main>
  );
}
