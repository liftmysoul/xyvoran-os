import { CoachChat } from "@/components/dashboard/CoachChat";
import { createClient } from "@/lib/supabase-server";
import type { ChatMessage } from "@/types/database";
import { getServerI18n } from "@/lib/i18n/server";

export default async function CoachPage() {
  const { copy } = await getServerI18n();
  const supabase = await createClient();
  const { data: auth } = await supabase.auth.getUser();
  const [{ data, error }, { data: profile }, { data: biomarker }, { data: lab }, { data: protocol }] = await Promise.all([
    supabase.from("ai_chat_messages").select("*").eq("user_id", auth.user?.id).order("created_at", { ascending: true }).limit(30).returns<ChatMessage[]>(),
    supabase.from("onboarding_data").select("id").eq("user_id", auth.user?.id).maybeSingle(),
    supabase.from("biomarker_entries").select("id").eq("user_id", auth.user?.id).order("created_at", { ascending: false }).limit(1).maybeSingle(),
    supabase.from("lab_reports").select("id").eq("user_id", auth.user?.id).eq("processing_status", "completed").limit(1).maybeSingle(),
    supabase.from("generated_protocols").select("id").eq("user_id", auth.user?.id).order("created_at", { ascending: false }).limit(1).maybeSingle()
  ]);
  const messages = data ?? [];
  return (
    <div className="space-y-6">
      {error && <p className="rounded-md border border-amber-300/30 bg-amber-300/10 p-4 text-sm text-amber-100">{copy.coach.historyError}: {error.message}</p>}
      <CoachChat initialMessages={messages} contextSources={{ profile: Boolean(profile), biomarkers: Boolean(biomarker), labs: Boolean(lab), protocols: Boolean(protocol) }} />
    </div>
  );
}
