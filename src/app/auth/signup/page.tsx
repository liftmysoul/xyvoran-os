"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { createClient } from "@/lib/supabase-browser";
import { isSupabaseConfigured, supabaseConfigMessage } from "@/lib/supabase-config";

export default function SignupPage() {
  const router = useRouter();
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
    if (authError) return setError(`Signup failed: ${authError.message}`);
    if (!data.session) {
      setError("Signup succeeded. Check your email to confirm your account, then return to onboarding.");
      return;
    }
    router.replace("/onboarding");
    router.refresh();
  }

  return (
    <main className="grid min-h-screen place-items-center px-4">
      <Card className="w-full max-w-md">
        <h1 className="text-2xl font-semibold text-white">Create your optimization profile</h1>
        <form onSubmit={submit} className="mt-6 space-y-4">
          <input className="field" type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <input className="field" type="password" minLength={8} placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          {!isSupabaseConfigured() && <p className="text-sm text-amber-200">{supabaseConfigMessage()}</p>}
          {error && <p className="text-sm text-red-300">{error}</p>}
          <Button className="w-full" disabled={loading}>{loading ? "Creating..." : "Start Optimization"}</Button>
        </form>
        <p className="mt-5 text-sm text-chrome">Already have access? <Link className="text-emeraldx" href="/auth/login">Login</Link></p>
      </Card>
    </main>
  );
}
