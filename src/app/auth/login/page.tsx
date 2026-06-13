"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { createClient } from "@/lib/supabase-browser";
import { isSupabaseConfigured, supabaseConfigMessage } from "@/lib/supabase-config";
import { useI18n } from "@/components/i18n/LanguageProvider";
import { SecureAccessFrame } from "@/components/brand/SecureAccessFrame";

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
    <SecureAccessFrame eyebrow={copy.auth.secureAccess} title={copy.auth.loginTitle} description={copy.auth.loginDescription} statusLabel={copy.auth.encryptedSession} signalLabels={[copy.auth.signalIdentity, copy.auth.signalBiometrics, copy.auth.signalIntelligence]}>
        <form onSubmit={submit} className="space-y-4">
          <label className="block text-sm text-chrome"><span className="mb-2 block">{copy.auth.email}</span><input className="field" type="email" placeholder={copy.auth.email} value={email} onChange={(e) => setEmail(e.target.value)} required /></label>
          <label className="block text-sm text-chrome"><span className="mb-2 block">{copy.auth.password}</span><input className="field" type="password" placeholder={copy.auth.password} value={password} onChange={(e) => setPassword(e.target.value)} required /></label>
          {!isSupabaseConfigured() && <p className="text-sm text-amber-200">{supabaseConfigMessage()}</p>}
          {error && <p className="text-sm text-red-300">{error}</p>}
          <Button className="w-full" disabled={loading}>{loading ? copy.auth.authenticating : copy.auth.login}</Button>
        </form>
        <p className="mt-5 text-sm text-chrome">{copy.auth.newHere} <Link className="font-semibold text-emeraldx" href="/auth/signup">{copy.auth.createProfile}</Link></p>
    </SecureAccessFrame>
  );
}
