import { Card } from "@/components/ui/Card";
import { createClient } from "@/lib/supabase-server";
import type { OnboardingData } from "@/types/database";

export default async function ProfilePage() {
  const supabase = await createClient();
  const { data: auth } = await supabase.auth.getUser();
  const { data: profile } = await supabase.from("onboarding_data").select("*").eq("user_id", auth.user?.id).maybeSingle<OnboardingData>();

  const rows = profile
    ? [
        ["Name", profile.full_name],
        ["Age", profile.age],
        ["Sex", profile.sex],
        ["Height", `${profile.height_cm} cm`],
        ["Weight", `${profile.weight_kg} kg`],
        ["Main goal", profile.main_goal],
        ["Secondary goals", profile.secondary_goals?.join(", ") || "None selected"],
        ["Sleep duration", profile.sleep_duration ? `${profile.sleep_duration} hours` : "Not set"],
        ["Sleep quality", `${profile.sleep_quality}/10`],
        ["Stress level", `${profile.stress_level}/10`],
        ["Energy level", `${profile.energy_level}/10`],
        ["Exercise", profile.exercise_frequency],
        ["Diet", profile.diet_style],
        ["Sugar cravings", profile.sugar_craving_frequency || "Not set"],
        ["Afternoon crashes", profile.afternoon_energy_crash_frequency || "Not set"],
        ["Focus", profile.focus_level ? `${profile.focus_level}/10` : "Not set"],
        ["Brain fog", profile.brain_fog_frequency || "Not set"],
        ["Caffeine", profile.caffeine_intake || "Not set"],
        ["Hydration", profile.hydration_level ? `${profile.hydration_level}/10` : "Not set"],
        ["Skin quality", profile.skin_quality ? `${profile.skin_quality}/10` : "Not set"],
        ["Supplements", profile.supplements || "None listed"],
        ["Wearables", profile.wearables_used || "None listed"]
      ]
    : [];

  return (
    <Card>
      <h2 className="text-xl font-semibold text-white">Profile</h2>
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
