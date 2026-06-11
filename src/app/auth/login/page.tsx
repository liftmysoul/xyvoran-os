"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { createClient } from "@/lib/supabase-browser";
import { isSupabaseConfigured, supabaseConfigMessage } from "@/lib/supabase-config";
import { LanguageSwitcher } from "@/components/i18n/LanguageSwitcher";
import { useI18n } from "@/components/i18n/LanguageProvider";

export default function LoginPage() {
  const router = useRouter();
  const { copy, setLanguage } = useI18n();
  const supabase = createClient();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    if (!isSupabaseConfigured()) {
      setError(supabaseConfigMessage());
      return;
    }
    setLoading(true);
    setError("");
    const { error: authError } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (authError) return setError(`${copy.auth.loginFailed}: ${authError.message}`);
    const { data: profile } = await supabase.from("profiles").select("language_preference").maybeSingle<{ language_preference?: "en" | "es" | null }>();
    if (profile?.language_preference) await setLanguage(profile.language_preference);
    router.replace("/dashboard");
    router.refresh();
  }

  return (
    <main className="grid min-h-screen place-items-center px-4">
      <Card className="w-full max-w-md">
        <div className="flex items-start justify-between gap-4"><h1 className="text-2xl font-semibold text-white">{copy.auth.loginTitle}</h1><LanguageSwitcher compact /></div>
        <form onSubmit={submit} className="mt-6 space-y-4">
          <input className="field" type="email" placeholder={copy.auth.email} aria-label={copy.auth.email} value={email} onChange={(e) => setEmail(e.target.value)} required />
          <input className="field" type="password" placeholder={copy.auth.password} aria-label={copy.auth.password} value={password} onChange={(e) => setPassword(e.target.value)} required />
          {!isSupabaseConfigured() && <p className="text-sm text-amber-200">{supabaseConfigMessage()}</p>}
          {error && <p className="text-sm text-red-300">{error}</p>}
          <Button className="w-full" disabled={loading}>{loading ? copy.auth.authenticating : copy.auth.login}</Button>
        </form>
        <p className="mt-5 text-sm text-chrome">{copy.auth.newHere} <Link className="text-emeraldx" href="/auth/signup">{copy.auth.createProfile}</Link></p>
      </Card>
    </main>
  );
}
