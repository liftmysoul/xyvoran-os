"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Dna, LoaderCircle, ShieldCheck } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { LanguageSwitcher } from "@/components/i18n/LanguageSwitcher";
import { useI18n } from "@/components/i18n/LanguageProvider";

export function AgeGate({ denied, nextPath }: { denied: boolean; nextPath: string }) {
  const router = useRouter();
  const { copy } = useI18n();
  const [blocked, setBlocked] = useState(denied);
  const [loading, setLoading] = useState<"confirmed" | "underage" | null>(null);
  const [error, setError] = useState("");

  async function confirm(choice: "confirmed" | "underage") {
    setLoading(choice);
    setError("");
    try {
      const response = await fetch("/api/age-verification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ choice, next: nextPath })
      });
      const body = await response.json();
      if (!response.ok) throw new Error(body.error ?? copy.ageGate.saveError);
      if (!body.allowed) {
        setBlocked(true);
        setLoading(null);
        return;
      }
      router.replace(body.redirectTo);
      router.refresh();
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : copy.ageGate.saveError);
      setLoading(null);
    }
  }

  return (
    <main className="relative grid min-h-[calc(100vh-57px)] place-items-center overflow-hidden px-4 py-10">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-emeraldx/70 to-transparent" />
      <Card className="relative w-full max-w-lg border-emeraldx/20 p-6 md:p-8">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="grid h-11 w-11 place-items-center rounded-md border border-emeraldx/40 bg-emeraldx/10">
              <Dna className="h-5 w-5 text-emeraldx" />
            </span>
            <div>
              <p className="font-semibold tracking-wide text-white">XYVORAN OS</p>
              <p className="text-xs uppercase tracking-[0.2em] text-emeraldx">{copy.ageGate.verification}</p>
            </div>
          </div>
          <div className="flex items-center gap-3"><LanguageSwitcher compact /><ShieldCheck className="hidden h-5 w-5 text-chrome sm:block" /></div>
        </div>

        {blocked ? (
          <div className="mt-8 border-t border-white/10 pt-7">
            <p className="text-xs uppercase tracking-[0.22em] text-emeraldx">{copy.ageGate.restricted}</p>
            <h1 className="mt-3 text-2xl font-semibold text-white">{copy.ageGate.blocked}</h1>
            <p className="mt-4 text-sm leading-6 text-chrome">{copy.ageGate.blockedDetail}</p>
          </div>
        ) : (
          <div className="mt-8 border-t border-white/10 pt-7">
            <p className="text-xs uppercase tracking-[0.22em] text-emeraldx">{copy.ageGate.beta}</p>
            <h1 className="mt-3 text-3xl font-semibold text-white">{copy.ageGate.title}</h1>
            <p className="mt-4 text-base leading-7 text-chrome">{copy.ageGate.confirmation}</p>
            <div className="mt-7 grid gap-3 sm:grid-cols-2">
              <button
                type="button"
                onClick={() => confirm("confirmed")}
                disabled={Boolean(loading)}
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-md bg-emeraldx px-4 text-sm font-semibold text-obsidian transition hover:bg-signal disabled:opacity-55"
              >
                {loading === "confirmed" ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <ArrowRight className="h-4 w-4" />}
                {copy.ageGate.adult}
              </button>
              <button
                type="button"
                onClick={() => confirm("underage")}
                disabled={Boolean(loading)}
                className="min-h-12 rounded-md border border-white/15 bg-white/5 px-4 text-sm font-medium text-chrome transition hover:bg-white/10 hover:text-white disabled:opacity-55"
              >
                {copy.ageGate.underage}
              </button>
            </div>
          </div>
        )}

        {error && <p className="mt-5 rounded-md border border-red-300/20 bg-red-300/10 p-3 text-sm text-red-200">{error}</p>}
      </Card>
    </main>
  );
}
