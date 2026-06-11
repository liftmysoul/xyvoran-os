"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Brain, Check, ChevronLeft, ChevronRight, Dna, Droplets, HeartPulse, LoaderCircle, Scale, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { createClient } from "@/lib/supabase-browser";
import { isSupabaseConfigured, supabaseConfigMessage } from "@/lib/supabase-config";
import type { MemberConsent, OnboardingData, Profile, Sex } from "@/types/database";
import { LanguageSwitcher } from "@/components/i18n/LanguageSwitcher";
import { useI18n } from "@/components/i18n/LanguageProvider";
import type { Language } from "@/lib/i18n";
import { calculateAge, isAtLeast21, maximumMemberBirthDate } from "@/lib/membership";

const goals = ["Fat loss", "Better sleep", "More energy", "Cognitive performance", "Recovery", "Longevity", "Metabolic health", "Stress resilience", "Beauty / skin optimization"];
const frequencies = ["Never", "Rarely", "Sometimes", "Often", "Daily"];
const baseSteps = [
  { title: "Personal Profile", subtitle: "Your physical baseline", icon: Dna },
  { title: "Goals", subtitle: "What you want to change", icon: Sparkles },
  { title: "Recovery & Sleep", subtitle: "Readiness and restoration", icon: HeartPulse },
  { title: "Metabolic & Nutrition", subtitle: "Energy regulation", icon: Scale },
  { title: "Cognitive & Longevity", subtitle: "Performance over time", icon: Brain },
  { title: "Beauty, Stack & Safety", subtitle: "Wellness inputs", icon: Droplets }
];

const intakeEs: Record<string, string> = {
  "Personal Profile": "Perfil personal", "Your physical baseline": "Tu línea base física", Goals: "Objetivos", "What you want to change": "Lo que deseas mejorar",
  "Recovery & Sleep": "Recuperación y sueño", "Readiness and restoration": "Preparación y restauración", "Metabolic & Nutrition": "Metabolismo y nutrición", "Energy regulation": "Regulación de energía",
  "Cognitive & Longevity": "Rendimiento cognitivo y longevidad", "Performance over time": "Rendimiento a largo plazo", "Beauty, Stack & Safety": "Belleza, stack y seguridad", "Wellness inputs": "Datos de bienestar",
  "Full Name": "Nombre completo", "Used to personalize your profile and coach experience.": "Se utiliza para personalizar tu perfil y la experiencia con el coach.",
  "Age (years)": "Edad (años)", "Helps calibrate recovery and longevity context.": "Ayuda a calibrar el contexto de recuperación y longevidad.",
  "Biological Sex": "Sexo biológico", "Used only where biological reference context may differ.": "Se utiliza únicamente cuando el contexto biológico de referencia puede variar.",
  Female: "Femenino", Male: "Masculino", Intersex: "Intersexual", "Prefer not to say": "Prefiero no indicarlo",
  "Height (cm)": "Estatura (cm)", "Enter your current height in centimeters.": "Ingresa tu estatura actual en centímetros.", "Weight (kg)": "Peso (kg)", "Enter your current weight in kilograms.": "Ingresa tu peso actual en kilogramos.",
  "Primary Goal": "Objetivo principal", "This becomes the main target for protocols and coaching.": "Será el objetivo central de tus protocolos y orientación.",
  "Secondary Goals": "Objetivos secundarios", "Select any additional outcomes you want XYVORAN OS to consider.": "Selecciona otros resultados que deseas que XYVORAN OS considere.",
  "Exercise Frequency": "Frecuencia de ejercicio", "Include planned strength, conditioning, or sustained movement sessions.": "Incluye sesiones planificadas de fuerza, acondicionamiento o movimiento sostenido.",
  "Average Sleep Duration (hours)": "Duración promedio del sueño (horas)", "Use your typical nightly average, not your best night.": "Usa tu promedio nocturno habitual, no tu mejor noche.",
  "Sleep Quality (1-10)": "Calidad del sueño (1-10)", "How restorative your sleep generally feels.": "Qué tan reparador suele sentirse tu sueño.",
  "Stress Level (1-10)": "Nivel de estrés (1-10)", "Your average perceived daily stress load.": "Tu carga diaria promedio de estrés percibido.",
  "Daily Energy Level (1-10)": "Nivel diario de energía (1-10)", "Your typical usable energy across the day.": "Tu energía utilizable habitual durante el día.",
  "HRV (optional)": "HRV (opcional)", "Enter your recent average in milliseconds if tracked.": "Ingresa tu promedio reciente en milisegundos si lo registras.",
  "Resting Heart Rate (optional)": "Frecuencia cardiaca en reposo (opcional)", "Enter your recent average beats per minute.": "Ingresa tu promedio reciente de latidos por minuto.",
  "Waist Circumference (optional)": "Circunferencia de cintura (opcional)", "Measure at the navel and enter centimeters.": "Mide a la altura del ombligo e ingresa centímetros.",
  "Estimated Body Fat % (optional)": "% estimado de grasa corporal (opcional)", "Use a recent estimate if available.": "Usa una estimación reciente si está disponible.",
  "Fasting Hours": "Horas de ayuno", "Typical hours between your final meal and first meal.": "Horas habituales entre tu última comida y la primera del día siguiente.",
  "Eating Window (hours)": "Ventana de alimentación (horas)", "Typical daily span during which you eat.": "Periodo diario habitual durante el cual consumes alimentos.",
  "Nutrition Style": "Estilo de alimentación", "Choose the pattern that most closely matches your current diet.": "Elige el patrón que más se parece a tu alimentación actual.",
  "Sugar Craving Frequency": "Frecuencia de antojos de azúcar", "How often strong sweet-food cravings occur.": "Con qué frecuencia aparecen antojos intensos de alimentos dulces.",
  "Afternoon Energy Crash Frequency": "Frecuencia de bajones de energía por la tarde", "How often energy drops sharply after lunch or mid-afternoon.": "Con qué frecuencia disminuye notablemente tu energía después del almuerzo o a media tarde.",
  "Focus Level (1-10)": "Nivel de enfoque (1-10)", "Your ability to sustain focused work without distraction.": "Tu capacidad para mantener trabajo concentrado sin distracciones.",
  "Brain Fog Frequency": "Frecuencia de niebla mental", "How often thinking feels slow, cloudy, or effortful.": "Con qué frecuencia sientes el pensamiento lento, nublado o demandante.",
  "Caffeine Intake": "Consumo de cafeína", "Include coffee, tea, energy drinks, and pre-workout.": "Incluye café, té, bebidas energéticas y preentrenos.",
  "Productivity Goal": "Objetivo de productividad", "Describe the cognitive output you want to improve.": "Describe el rendimiento cognitivo que deseas mejorar.",
  "Alcohol Use": "Consumo de alcohol", "Select your typical weekly pattern.": "Selecciona tu patrón semanal habitual.",
  "Nicotine / Tobacco Use": "Consumo de nicotina o tabaco", "Include smoking, vaping, pouches, or other nicotine products.": "Incluye cigarrillos, vapeo, bolsas u otros productos con nicotina.",
  "Family History Notes (optional)": "Notas de antecedentes familiares (opcional)", "Add relevant patterns you want considered without entering a diagnosis.": "Agrega patrones relevantes que quieras considerar sin registrar un diagnóstico.",
  "Main Longevity Concern": "Principal inquietud de longevidad", "What long-term healthspan area matters most to you?": "¿Qué área de salud a largo plazo es más importante para ti?",
  "Skin Quality (1-10)": "Calidad de la piel (1-10)", "Your overall perception of clarity, texture, and resilience.": "Tu percepción general de claridad, textura y resiliencia.",
  "Hydration Level (1-10)": "Nivel de hidratación (1-10)", "How consistently hydrated you feel across the day.": "Qué tan constante es tu sensación de hidratación durante el día.",
  "Hair / Skin / Body Composition Concern": "Inquietud sobre cabello, piel o composición corporal", "Describe the main wellness or appearance outcome you want to support.": "Describe el principal resultado de bienestar o apariencia que deseas apoyar.",
  Supplements: "Suplementos", "List current supplements and typical timing.": "Enumera tus suplementos actuales y horarios habituales.", Medications: "Medicamentos", "Optional context only. XYVORAN OS will not alter prescriptions.": "Contexto opcional. XYVORAN OS no modificará prescripciones.",
  Peptides: "Péptidos", "Optional context only. Dosing advice is outside the platform's scope.": "Contexto opcional. La dosificación está fuera del alcance de la plataforma.",
  "Wearables Used": "Dispositivos utilizados", "List devices supplying sleep, HRV, activity, or glucose data.": "Enumera los dispositivos que aportan datos de sueño, HRV, actividad o glucosa.",
  Never: "Nunca", Rarely: "Rara vez", Sometimes: "A veces", Often: "A menudo", Daily: "Diariamente", None: "Ninguno", Occasional: "Ocasional", "Former user": "Exusuario",
  "Fat loss": "Pérdida de grasa", "Better sleep": "Mejor sueño", "More energy": "Más energía", "Cognitive performance": "Rendimiento cognitivo", Recovery: "Recuperación", Longevity: "Longevidad", "Metabolic health": "Salud metabólica", "Stress resilience": "Resiliencia al estrés", "Beauty / skin optimization": "Optimización de belleza y piel"
  ,"Select nutrition style": "Selecciona un estilo de alimentación", "Balanced whole foods": "Alimentos integrales equilibrados", "High protein": "Alto en proteína", Mediterranean: "Mediterránea", "Low carbohydrate": "Baja en carbohidratos", Ketogenic: "Cetogénica", "Plant-forward": "Con predominio vegetal", Vegan: "Vegana", "Intermittent fasting": "Ayuno intermitente", "No consistent pattern": "Sin patrón constante",
  "1-2 servings/day": "1-2 porciones al día", "3-4 servings/day": "3-4 porciones al día", "5+ servings/day": "5+ porciones al día", "Varies significantly": "Varía considerablemente",
  "1-2 drinks/week": "1-2 bebidas por semana", "3-6 drinks/week": "3-6 bebidas por semana", "7-14 drinks/week": "7-14 bebidas por semana", "15+ drinks/week": "15+ bebidas por semana"
};

function intakeText(text: string, language: Language) { return language === "es" ? intakeEs[text] ?? text : text; }

type FormState = Record<string, string | boolean | string[]> & {
  sex: Sex;
  secondary_goals: string[];
  disclaimer_confirmed: boolean;
  age_certified: boolean;
  educational_content_accepted: boolean;
  terms_accepted: boolean;
  privacy_accepted: boolean;
};

const initialForm: FormState = {
  first_name: "", last_name: "", email: "", phone_number: "", date_of_birth: "", country: "", state_province: "", city: "", address_line: "", occupation: "",
  full_name: "", age: "", sex: "prefer_not_to_say", height_cm: "", weight_kg: "",
  main_goal: "More energy", secondary_goals: [], exercise_frequency: "2-3x/week",
  sleep_duration: "", sleep_quality: "6", stress_level: "5", energy_level: "6", hrv: "", resting_heart_rate: "",
  waist_circumference_cm: "", body_fat_percent: "", fasting_hours: "12", eating_window_hours: "12", diet_style: "", sugar_craving_frequency: "Sometimes", afternoon_energy_crash_frequency: "Sometimes",
  focus_level: "6", brain_fog_frequency: "Sometimes", caffeine_intake: "1-2 servings/day", productivity_goal: "", alcohol_use: "None", nicotine_use: "None", family_history_notes: "", longevity_concern: "",
  skin_quality: "6", hydration_level: "6", beauty_concern: "", supplements: "", medications: "", peptides: "", wearables_used: "", disclaimer_confirmed: false,
  age_certified: false, educational_content_accepted: false, terms_accepted: false, privacy_accepted: false
};

function Field({ label, helper, children }: { label: string; helper: string; children: React.ReactNode }) {
  const { language } = useI18n();
  return <label className="block"><span className="text-sm font-medium text-white">{intakeText(label, language)}</span><span className="mt-1 block text-xs leading-5 text-chrome">{intakeText(helper, language)}</span><span className="mt-2 block">{children}</span></label>;
}

function RangeField({ label, helper, name, value, update }: { label: string; helper: string; name: string; value: string; update: (name: string, value: string) => void }) {
  return <Field label={label} helper={helper}><div className="flex items-center gap-4"><input className="h-2 flex-1 accent-emeraldx" type="range" min="1" max="10" value={value} onChange={(event) => update(name, event.target.value)} /><output className="grid h-10 w-12 place-items-center rounded-md border border-white/10 bg-white/5 font-semibold text-white">{value}</output></div></Field>;
}

function optionalNumber(value: string | boolean | string[]) {
  return typeof value === "string" && value.trim() ? Number(value) : null;
}

export default function OnboardingPage() {
  const router = useRouter();
  const { copy, language } = useI18n();
  const tr = (text: string) => intakeText(text, language);
  const steps = baseSteps.map((item) => ({ ...item, title: tr(item.title), subtitle: tr(item.subtitle) }));
  const [supabase] = useState(() => createClient());
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<FormState>(initialForm);
  const [loading, setLoading] = useState(false);
  const [hydrating, setHydrating] = useState(true);
  const [error, setError] = useState("");
  const [existingConsent, setExistingConsent] = useState<MemberConsent | null>(null);

  useEffect(() => {
    let active = true;
    async function hydrate() {
      const { data: auth } = await supabase.auth.getUser();
      if (!auth.user || !active) return setHydrating(false);
      const [{ data }, { data: memberProfile }, { data: consent }] = await Promise.all([
        supabase.from("onboarding_data").select("*").eq("user_id", auth.user.id).maybeSingle<OnboardingData>(),
        supabase.from("profiles").select("*").eq("id", auth.user.id).maybeSingle<Profile>(),
        supabase.from("member_consents").select("*").eq("user_id", auth.user.id).maybeSingle<MemberConsent>()
      ]);
      if (active) {
        setForm((current) => {
          const next = { ...current };
          for (const record of [data, memberProfile]) {
            if (!record) continue;
            for (const [key, value] of Object.entries(record)) {
              if (key in next && value !== null && value !== undefined) next[key] = Array.isArray(value) ? value.map(String) : typeof value === "boolean" ? value : String(value);
            }
          }
          next.email = memberProfile?.email ?? auth.user.email ?? "";
          if (!next.first_name && data?.full_name) {
            const [firstName, ...lastName] = data.full_name.trim().split(/\s+/);
            next.first_name = firstName ?? "";
            next.last_name = lastName.join(" ");
          }
          next.age_certified = Boolean(consent?.age_certified_at);
          next.educational_content_accepted = Boolean(consent?.educational_content_accepted_at);
          next.terms_accepted = Boolean(consent?.terms_accepted_at);
          next.privacy_accepted = Boolean(consent?.privacy_accepted_at);
          return next;
        });
        setExistingConsent(consent ?? null);
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
      0: [["first_name", copy.onboarding.firstName], ["last_name", copy.onboarding.lastName], ["email", copy.onboarding.email], ["phone_number", copy.onboarding.phone], ["date_of_birth", copy.onboarding.dob], ["country", copy.onboarding.country], ["state_province", copy.onboarding.stateProvince], ["city", copy.onboarding.city], ["address_line", copy.onboarding.address], ["height_cm", "Height"], ["weight_kg", "Weight"]],
      1: [["main_goal", "Primary Goal"]],
      2: [["sleep_duration", "Average Sleep Duration"], ["sleep_quality", "Sleep Quality"], ["stress_level", "Stress Level"], ["energy_level", "Daily Energy Level"]],
      3: [["diet_style", "Nutrition Style"]]
    };
    const missing = (required[currentStep] ?? []).find(([name]) => !String(form[name] ?? "").trim());
    if (missing) { setError(language === "es" ? `${tr(missing[1])} es obligatorio.` : `${missing[1]} is required.`); return false; }
    if (currentStep === 0 && !isAtLeast21(String(form.date_of_birth))) { setError(copy.onboarding.ageError); return false; }
    if (currentStep === 5 && ![form.age_certified, form.educational_content_accepted, form.terms_accepted, form.privacy_accepted].every(Boolean)) { setError(copy.onboarding.consentsRequired); return false; }
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
    if (authError || !auth.user) { setLoading(false); return setError(authError ? `${copy.biomarkers.sessionError}: ${authError.message}` : copy.onboarding.signIn); }
    const age = calculateAge(String(form.date_of_birth));
    if (age === null || age < 21) { setLoading(false); return setError(copy.onboarding.ageError); }
    const profilePayload = {
      id: auth.user.id,
      email: auth.user.email,
      first_name: String(form.first_name).trim(),
      last_name: String(form.last_name).trim(),
      phone_number: String(form.phone_number).trim(),
      date_of_birth: String(form.date_of_birth),
      country: String(form.country).trim(),
      state_province: String(form.state_province).trim(),
      city: String(form.city).trim(),
      address_line: String(form.address_line).trim(),
      gender: form.sex,
      height_cm: optionalNumber(form.height_cm),
      weight_kg: optionalNumber(form.weight_kg),
      occupation: String(form.occupation).trim() || null,
      language_preference: language
    };
    const { error: profileError } = await supabase.from("profiles").upsert(profilePayload, { onConflict: "id" });
    if (profileError) {
      setLoading(false);
      return setError(profileError.message.includes("column") || profileError.message.includes("member_consents") ? `${copy.onboarding.memberMigration} ${profileError.message}` : `${copy.onboarding.saveError}: ${profileError.message}`);
    }
    const now = new Date().toISOString();
    const { error: consentError } = await supabase.from("member_consents").upsert({
      user_id: auth.user.id,
      age_certified_at: existingConsent?.age_certified_at ?? now,
      educational_content_accepted_at: existingConsent?.educational_content_accepted_at ?? now,
      terms_accepted_at: existingConsent?.terms_accepted_at ?? now,
      privacy_accepted_at: existingConsent?.privacy_accepted_at ?? now,
      consent_version: "2026-06"
    }, { onConflict: "user_id" });
    if (consentError) {
      setLoading(false);
      return setError(`${copy.onboarding.memberMigration} ${consentError.message}`);
    }
    const payload = {
      user_id: auth.user.id,
      full_name: `${String(form.first_name).trim()} ${String(form.last_name).trim()}`.trim(), age, sex: form.sex, height_cm: Number(form.height_cm), weight_kg: Number(form.weight_kg),
      main_goal: String(form.main_goal), secondary_goals: form.secondary_goals, exercise_frequency: String(form.exercise_frequency),
      sleep_duration: Number(form.sleep_duration), sleep_quality: Number(form.sleep_quality), stress_level: Number(form.stress_level), energy_level: Number(form.energy_level), hrv: optionalNumber(form.hrv), resting_heart_rate: optionalNumber(form.resting_heart_rate),
      waist_circumference_cm: optionalNumber(form.waist_circumference_cm), body_fat_percent: optionalNumber(form.body_fat_percent), fasting_hours: optionalNumber(form.fasting_hours), eating_window_hours: optionalNumber(form.eating_window_hours), diet_style: String(form.diet_style), sugar_craving_frequency: String(form.sugar_craving_frequency), afternoon_energy_crash_frequency: String(form.afternoon_energy_crash_frequency),
      focus_level: optionalNumber(form.focus_level), brain_fog_frequency: String(form.brain_fog_frequency), caffeine_intake: String(form.caffeine_intake), productivity_goal: String(form.productivity_goal), alcohol_use: String(form.alcohol_use), nicotine_use: String(form.nicotine_use), family_history_notes: String(form.family_history_notes), longevity_concern: String(form.longevity_concern),
      skin_quality: optionalNumber(form.skin_quality), hydration_level: optionalNumber(form.hydration_level), beauty_concern: String(form.beauty_concern), supplements: String(form.supplements), medications: String(form.medications), peptides: String(form.peptides), wearables_used: String(form.wearables_used), disclaimer_confirmed: true
    };
    const { error: dbError } = await supabase.from("onboarding_data").upsert(payload, { onConflict: "user_id" });
    setLoading(false);
    if (dbError) return setError(dbError.message.includes("column") ? `${copy.onboarding.migration}: ${dbError.message}` : `${copy.onboarding.saveError}: ${dbError.message}`);
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
          <div><p className="text-xs uppercase tracking-[0.28em] text-emeraldx">{copy.onboarding.eyebrow}</p><h1 className="mt-2 text-3xl font-semibold text-white">{copy.onboarding.title}</h1><p className="mt-2 max-w-2xl text-sm text-chrome">{copy.onboarding.intro}</p></div>
          <div className="flex items-center gap-4"><p className="text-sm text-chrome">{copy.onboarding.step} <span className="text-white">{step + 1}</span> {copy.onboarding.of} {steps.length}</p><LanguageSwitcher compact /></div>
        </header>

        <div className="mb-6 grid grid-cols-6 gap-2" aria-label={copy.onboarding.progress}>
          {steps.map((item, index) => <button key={item.title} type="button" onClick={() => index <= step && setStep(index)} className={`h-2 rounded-sm ${index <= step ? "bg-emeraldx" : "bg-white/10"}`} aria-label={`Go to ${item.title}`} />)}
        </div>

        <div className="grid gap-6 lg:grid-cols-[250px_1fr]">
          <aside className="hidden lg:block"><div className="space-y-2">{steps.map((item, index) => { const Icon = item.icon; return <div key={item.title} className={`flex items-center gap-3 rounded-md px-3 py-3 ${index === step ? "bg-emeraldx/10 text-white" : "text-chrome"}`}><span className={`grid h-8 w-8 place-items-center rounded-md ${index < step ? "bg-emeraldx text-obsidian" : "border border-white/10"}`}>{index < step ? <Check className="h-4 w-4" /> : <Icon className="h-4 w-4" />}</span><span><span className="block text-sm">{item.title}</span><span className="block text-xs opacity-70">{item.subtitle}</span></span></div>; })}</div></aside>

          <Card className="min-h-[570px]">
            <div className="mb-7 flex items-center gap-3"><span className="grid h-11 w-11 place-items-center rounded-md border border-emeraldx/30 bg-emeraldx/10"><CurrentIcon className="h-5 w-5 text-emeraldx" /></span><div><h2 className="text-xl font-semibold text-white">{steps[step].title}</h2><p className="text-sm text-chrome">{steps[step].subtitle}</p></div></div>

            {step === 0 && <div className="grid gap-5 md:grid-cols-2">
              <Field label={copy.onboarding.firstName} helper={copy.onboarding.identityHelp}><input className={commonInput} autoComplete="given-name" placeholder={language === "es" ? "p. ej. Jordan" : "e.g. Jordan"} value={text("first_name")} onChange={(e) => update("first_name", e.target.value)} /></Field>
              <Field label={copy.onboarding.lastName} helper={copy.onboarding.identityHelp}><input className={commonInput} autoComplete="family-name" placeholder={language === "es" ? "p. ej. Lee" : "e.g. Lee"} value={text("last_name")} onChange={(e) => update("last_name", e.target.value)} /></Field>
              <Field label={copy.onboarding.email} helper={copy.onboarding.identityHelp}><input className={`${commonInput} opacity-70`} type="email" autoComplete="email" value={text("email")} readOnly /></Field>
              <Field label={copy.onboarding.phone} helper={copy.onboarding.identityHelp}><input className={commonInput} type="tel" autoComplete="tel" placeholder="+1 555 555 0100" value={text("phone_number")} onChange={(e) => update("phone_number", e.target.value)} /></Field>
              <Field label={copy.onboarding.dob} helper={copy.onboarding.identityHelp}><input className={commonInput} type="date" max={maximumMemberBirthDate()} value={text("date_of_birth")} onChange={(e) => update("date_of_birth", e.target.value)} /></Field>
              <Field label="Biological Sex" helper="Used only where biological reference context may differ."><select className={commonInput} value={form.sex} onChange={(e) => update("sex", e.target.value)}><option value="female">{tr("Female")}</option><option value="male">{tr("Male")}</option><option value="intersex">{tr("Intersex")}</option><option value="prefer_not_to_say">{tr("Prefer not to say")}</option></select></Field>
              <Field label={copy.onboarding.country} helper={copy.onboarding.addressHelp}><input className={commonInput} autoComplete="country-name" placeholder={language === "es" ? "País" : "Country"} value={text("country")} onChange={(e) => update("country", e.target.value)} /></Field>
              <Field label={copy.onboarding.stateProvince} helper={copy.onboarding.addressHelp}><input className={commonInput} autoComplete="address-level1" placeholder={copy.onboarding.stateProvince} value={text("state_province")} onChange={(e) => update("state_province", e.target.value)} /></Field>
              <Field label={copy.onboarding.city} helper={copy.onboarding.addressHelp}><input className={commonInput} autoComplete="address-level2" placeholder={copy.onboarding.city} value={text("city")} onChange={(e) => update("city", e.target.value)} /></Field>
              <Field label={copy.onboarding.address} helper={copy.onboarding.addressHelp}><input className={commonInput} autoComplete="street-address" placeholder={language === "es" ? "Calle y número" : "Street address"} value={text("address_line")} onChange={(e) => update("address_line", e.target.value)} /></Field>
              <Field label="Height (cm)" helper="Enter your current height in centimeters."><input className={commonInput} type="number" min="100" max="250" placeholder="e.g. 178" value={text("height_cm")} onChange={(e) => update("height_cm", e.target.value)} /></Field>
              <Field label="Weight (kg)" helper="Enter your current weight in kilograms."><input className={commonInput} type="number" min="30" max="350" step="0.1" placeholder="e.g. 78.5" value={text("weight_kg")} onChange={(e) => update("weight_kg", e.target.value)} /></Field>
              <Field label={copy.onboarding.occupation} helper={copy.onboarding.identityHelp}><input className={commonInput} autoComplete="organization-title" placeholder={copy.onboarding.occupation} value={text("occupation")} onChange={(e) => update("occupation", e.target.value)} /></Field>
            </div>}

            {step === 1 && <div className="space-y-6">
              <Field label="Primary Goal" helper="This becomes the main target for protocols and coaching."><select className={commonInput} value={text("main_goal")} onChange={(e) => update("main_goal", e.target.value)}>{goals.map((goal) => <option key={goal} value={goal}>{tr(goal)}</option>)}</select></Field>
              <Field label="Secondary Goals" helper="Select any additional outcomes you want XYVORAN OS to consider."><div className="grid gap-2 sm:grid-cols-2">{goals.filter((goal) => goal !== form.main_goal).map((goal) => <button key={goal} type="button" onClick={() => toggleGoal(goal)} className={`flex min-h-11 items-center justify-between rounded-md border px-3 text-left text-sm ${form.secondary_goals.includes(goal) ? "border-emeraldx bg-emeraldx/10 text-white" : "border-white/10 bg-white/5 text-chrome"}`}>{tr(goal)}{form.secondary_goals.includes(goal) && <Check className="h-4 w-4 text-emeraldx" />}</button>)}</div></Field>
              <Field label="Exercise Frequency" helper="Include planned strength, conditioning, or sustained movement sessions."><select className={commonInput} value={text("exercise_frequency")} onChange={(e) => update("exercise_frequency", e.target.value)}>{["Rarely", "1x/week", "2-3x/week", "4-5x/week", "6+x/week"].map((item) => <option key={item} value={item}>{tr(item)}</option>)}</select></Field>
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
              <Field label="Nutrition Style" helper="Choose the pattern that most closely matches your current diet."><select className={commonInput} value={text("diet_style")} onChange={(e) => update("diet_style", e.target.value)}>{["", "Balanced whole foods", "High protein", "Mediterranean", "Low carbohydrate", "Ketogenic", "Plant-forward", "Vegan", "Intermittent fasting", "No consistent pattern"].map((item) => <option key={item || "empty"} value={item}>{tr(item || "Select nutrition style")}</option>)}</select></Field>
              <Field label="Sugar Craving Frequency" helper="How often strong sweet-food cravings occur."><select className={commonInput} value={text("sugar_craving_frequency")} onChange={(e) => update("sugar_craving_frequency", e.target.value)}>{frequencies.map((item) => <option key={item} value={item}>{tr(item)}</option>)}</select></Field>
              <Field label="Afternoon Energy Crash Frequency" helper="How often energy drops sharply after lunch or mid-afternoon."><select className={commonInput} value={text("afternoon_energy_crash_frequency")} onChange={(e) => update("afternoon_energy_crash_frequency", e.target.value)}>{frequencies.map((item) => <option key={item} value={item}>{tr(item)}</option>)}</select></Field>
            </div>}

            {step === 4 && <div className="grid gap-5 md:grid-cols-2">
              <RangeField label="Focus Level (1-10)" helper="Your ability to sustain focused work without distraction." name="focus_level" value={text("focus_level")} update={update} />
              <Field label="Brain Fog Frequency" helper="How often thinking feels slow, cloudy, or effortful."><select className={commonInput} value={text("brain_fog_frequency")} onChange={(e) => update("brain_fog_frequency", e.target.value)}>{frequencies.map((item) => <option key={item} value={item}>{tr(item)}</option>)}</select></Field>
              <Field label="Caffeine Intake" helper="Include coffee, tea, energy drinks, and pre-workout."><select className={commonInput} value={text("caffeine_intake")} onChange={(e) => update("caffeine_intake", e.target.value)}>{["None", "1-2 servings/day", "3-4 servings/day", "5+ servings/day", "Varies significantly"].map((item) => <option key={item} value={item}>{tr(item)}</option>)}</select></Field>
              <Field label="Productivity Goal" helper="Describe the cognitive output you want to improve."><input className={commonInput} placeholder="e.g. Two focused 90-minute work blocks" value={text("productivity_goal")} onChange={(e) => update("productivity_goal", e.target.value)} /></Field>
              <Field label="Alcohol Use" helper="Select your typical weekly pattern."><select className={commonInput} value={text("alcohol_use")} onChange={(e) => update("alcohol_use", e.target.value)}>{["None", "1-2 drinks/week", "3-6 drinks/week", "7-14 drinks/week", "15+ drinks/week"].map((item) => <option key={item} value={item}>{tr(item)}</option>)}</select></Field>
              <Field label="Nicotine / Tobacco Use" helper="Include smoking, vaping, pouches, or other nicotine products."><select className={commonInput} value={text("nicotine_use")} onChange={(e) => update("nicotine_use", e.target.value)}>{["None", "Occasional", "Daily", "Former user"].map((item) => <option key={item} value={item}>{tr(item)}</option>)}</select></Field>
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
              <div className="space-y-3 border-t border-white/10 pt-5 md:col-span-2">
                <p className="text-sm font-semibold text-white">{copy.onboarding.legalConsents}</p>
                {[
                  ["age_certified", copy.onboarding.ageConsent],
                  ["educational_content_accepted", copy.onboarding.educationConsent],
                  ["terms_accepted", copy.onboarding.termsConsent],
                  ["privacy_accepted", copy.onboarding.privacyConsent]
                ].map(([name, label]) => (
                  <label key={name} className="flex min-h-12 gap-3 rounded-md border border-emeraldx/25 bg-emeraldx/5 p-4 text-sm text-chrome">
                    <input className="mt-1 accent-emeraldx" type="checkbox" checked={Boolean(form[name])} onChange={(e) => update(name, e.target.checked)} />
                    <span className="leading-6 text-white">{label}</span>
                  </label>
                ))}
              </div>
            </div>}

            {error && <p className="mt-6 rounded-md border border-red-300/20 bg-red-300/10 p-3 text-sm text-red-200" role="alert">{error}</p>}
            {!isSupabaseConfigured() && <p className="mt-6 text-sm text-amber-200">{supabaseConfigMessage()}</p>}
            <div className="mt-8 flex items-center justify-between border-t border-white/10 pt-5">
              <button type="button" onClick={() => setStep((current) => Math.max(0, current - 1))} disabled={step === 0} className="inline-flex min-h-11 items-center gap-2 rounded-md px-3 text-sm text-chrome disabled:opacity-30"><ChevronLeft className="h-4 w-4" /> {copy.common.back}</button>
              {step < steps.length - 1 ? <Button type="button" onClick={next}>{copy.common.continue} <ChevronRight className="h-4 w-4" /></Button> : <Button type="button" onClick={submit} disabled={loading}>{loading ? <><LoaderCircle className="h-4 w-4 animate-spin" /> {copy.onboarding.saving}</> : copy.onboarding.complete}</Button>}
            </div>
          </Card>
        </div>
      </div>
    </main>
  );
}
