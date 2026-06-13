"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { createClient } from "@/lib/supabase-browser";
import { isSupabaseConfigured, supabaseConfigMessage } from "@/lib/supabase-config";
import { useI18n } from "@/components/i18n/LanguageProvider";
import { SecureAccessFrame } from "@/components/brand/SecureAccessFrame";

export default function SignupPage() {
  const router = useRouter();
  const { copy, language } = useI18n();
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
    const { data, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`
      }
    });
    setLoading(false);
    if (authError) return setError(`${copy.auth.signupFailed}: ${authError.message}`);
    if (!data.session) {
      setError(copy.auth.confirmEmail);
      return;
    }
    await fetch("/api/language", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ language }) });
    router.replace("/onboarding");
    router.refresh();
  }

  return (
    <SecureAccessFrame eyebrow={copy.auth.privateEnrollment} title={copy.auth.signupTitle} description={copy.auth.signupDescription} statusLabel={copy.auth.encryptedSession} signalLabels={[copy.auth.signalIdentity, copy.auth.signalBiometrics, copy.auth.signalIntelligence]}>
        <form onSubmit={submit} className="space-y-4">
          <label className="block text-sm text-chrome"><span className="mb-2 block">{copy.auth.email}</span><input className="field" type="email" placeholder={copy.auth.email} value={email} onChange={(e) => setEmail(e.target.value)} required /></label>
          <label className="block text-sm text-chrome"><span className="mb-2 block">{copy.auth.password}</span><input className="field" type="password" minLength={8} placeholder={copy.auth.password} value={password} onChange={(e) => setPassword(e.target.value)} required /></label>
          {!isSupabaseConfigured() && <p className="text-sm text-amber-200">{supabaseConfigMessage()}</p>}
          {error && <p className="text-sm text-red-300">{error}</p>}
          <Button className="w-full" disabled={loading}>{loading ? copy.auth.creating : copy.landing.start}</Button>
        </form>
        <p className="mt-5 text-sm text-chrome">{copy.auth.already} <Link className="font-semibold text-emeraldx" href="/auth/login">{copy.auth.login}</Link></p>
    </SecureAccessFrame>
  );
}
