import { Card } from "@/components/ui/Card";
import { createClient } from "@/lib/supabase-server";
import type { OnboardingData, Profile } from "@/types/database";
import { getServerI18n } from "@/lib/i18n/server";
import { SystemHeader } from "@/components/dashboard/SystemHeader";
import { UserRound } from "lucide-react";

export default async function ProfilePage() {
  const { copy, language } = await getServerI18n();
  const label = (en: string, es: string) => language === "es" ? es : en;
  const supabase = await createClient();
  const { data: auth } = await supabase.auth.getUser();
  const [{ data: profile }, { data: memberProfile }] = await Promise.all([
    supabase.from("onboarding_data").select("*").eq("user_id", auth.user?.id).maybeSingle<OnboardingData>(),
    supabase.from("profiles").select("*").eq("id", auth.user?.id).maybeSingle<Profile>()
  ]);

  const rows = profile
    ? [
        [label("Member ID", "ID de miembro"), memberProfile?.member_id ?? copy.common.notSet],
        [label("Name", "Nombre"), memberProfile?.first_name && memberProfile?.last_name ? `${memberProfile.first_name} ${memberProfile.last_name}` : profile.full_name],
        [label("Email", "Correo electrónico"), memberProfile?.email ?? copy.common.notSet],
        [label("Phone", "Teléfono"), memberProfile?.phone_number ?? copy.common.notSet],
        [label("Date of birth", "Fecha de nacimiento"), memberProfile?.date_of_birth ?? copy.common.notSet],
        [label("Address", "Dirección"), [memberProfile?.address_line, memberProfile?.city, memberProfile?.state_province, memberProfile?.country].filter(Boolean).join(", ") || copy.common.notSet],
        [label("Occupation", "Ocupación"), memberProfile?.occupation ?? copy.common.notSet],
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
    <div className="space-y-6">
      <SystemHeader eyebrow={copy.nav.layer} title={copy.profile.title} icon={UserRound} />
    <Card>
      <div className="mt-5 grid gap-3 md:grid-cols-2">
        {rows.map(([label, value]) => (
          <div key={String(label)} className="command-surface rounded-md p-4">
            <p className="system-label">{label}</p>
            <p className="mt-2 text-white">{value}</p>
          </div>
        ))}
      </div>
    </Card>
    </div>
  );
}
