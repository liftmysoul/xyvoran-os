import { CoachChat } from "@/components/dashboard/CoachChat";
import { createClient } from "@/lib/supabase-server";
import type { ChatMessage } from "@/types/database";
import { getServerI18n } from "@/lib/i18n/server";

export default async function CoachPage() {
  const { copy } = await getServerI18n();
  const supabase = await createClient();
  const { data: auth } = await supabase.auth.getUser();
  const { data, error } = await supabase.from("ai_chat_messages").select("*").eq("user_id", auth.user?.id).order("created_at", { ascending: true }).limit(30).returns<ChatMessage[]>();
  const messages = data ?? [];
  return (
    <div className="space-y-6">
      {error && <p className="rounded-md border border-amber-300/30 bg-amber-300/10 p-4 text-sm text-amber-100">{copy.coach.historyError}: {error.message}</p>}
      <CoachChat initialMessages={messages} />
    </div>
  );
}
