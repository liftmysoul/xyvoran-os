import { Card } from "@/components/ui/Card";
import { createClient } from "@/lib/supabase-server";
import type { OnboardingData } from "@/types/database";
import { getServerI18n } from "@/lib/i18n/server";

export default async function ProfilePage() {
  const { copy, language } = await getServerI18n();
  const label = (en: string, es: string) => language === "es" ? es : en;
  const supabase = await createClient();
  const { data: auth } = await supabase.auth.getUser();
  const { data: profile } = await supabase.from("onboarding_data").select("*").eq("user_id", auth.user?.id).maybeSingle<OnboardingData>();

  const rows = profile
    ? [
        [label("Name", "Nombre"), profile.full_name],
        [label("Age", "Edad"), profile.age],
        [label("Sex", "Sexo"), profile.sex],
        ["Height", `${profile.height_cm} cm`],
        ["Weight", `${profile.weight_kg} kg`],
        [label("Main goal", "Objetivo principal"), profile.main_goal],
        [label("Secondary goals", "Objetivos secundarios"), profile.secondary_goals?.join(", ") || copy.profile.noneSelected],
        [label("Sleep duration", "Duración del sueño"), profile.sleep_duration ? `${profile.sleep_duration} ${copy.profile.hours}` : copy.common.notSet],
        [label("Sleep quality", "Calidad del sueño"), `${profile.sleep_quality}/10`],
        [label("Stress level", "Nivel de estrés"), `${profile.stress_level}/10`],
        [label("Energy level", "Nivel de energía"), `${profile.energy_level}/10`],
        ["Exercise", profile.exercise_frequency],
        ["Diet", profile.diet_style],
        ["Sugar cravings", profile.sugar_craving_frequency || "Not set"],
        ["Afternoon crashes", profile.afternoon_energy_crash_frequency || "Not set"],
        ["Focus", profile.focus_level ? `${profile.focus_level}/10` : "Not set"],
        ["Brain fog", profile.brain_fog_frequency || "Not set"],
        ["Caffeine", profile.caffeine_intake || "Not set"],
        ["Hydration", profile.hydration_level ? `${profile.hydration_level}/10` : "Not set"],
        ["Skin quality", profile.skin_quality ? `${profile.skin_quality}/10` : "Not set"],
        [label("Supplements", "Suplementos"), profile.supplements || copy.profile.noneListed],
        [label("Wearables", "Dispositivos"), profile.wearables_used || copy.profile.noneListed]
      ]
    : [];

  return (
    <Card>
      <h2 className="text-xl font-semibold text-white">{copy.profile.title}</h2>
      <div className="mt-5 grid gap-3 md:grid-cols-2">
        {rows.map(([label, value]) => (
          <div key={String(label)} className="rounded-md border border-white/10 bg-white/5 p-4">
            <p className="text-xs uppercase tracking-[0.2em] text-emeraldx">{label}</p>
            <p className="mt-2 text-white">{value}</p>
          </div>
        ))}
      </div>
    </Card>
  );
}
