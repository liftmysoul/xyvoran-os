"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, LoaderCircle, ShieldCheck } from "lucide-react";
import { useI18n } from "@/components/i18n/LanguageProvider";
import { SecureAccessFrame } from "@/components/brand/SecureAccessFrame";

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
    <SecureAccessFrame
      eyebrow={blocked ? copy.ageGate.restricted : copy.ageGate.beta}
      title={blocked ? copy.ageGate.blocked : copy.ageGate.secureTitle}
      description={blocked ? copy.ageGate.blockedDetail : copy.ageGate.secureDescription}
      statusLabel={copy.ageGate.encrypted}
      signalLabels={[copy.auth.signalIdentity, copy.auth.signalBiometrics, copy.auth.signalIntelligence]}
    >
        {blocked ? (
          <div className="flex items-start gap-3 border-l-2 border-dangerx bg-dangerx/[0.04] p-4 text-sm leading-6 text-chrome">
            <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-dangerx" />
            <p>{copy.ageGate.blocked}</p>
          </div>
        ) : (
          <div>
            <div className="command-surface flex items-start gap-3 rounded-md p-4">
              <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-emeraldx" />
              <div><p className="text-sm font-semibold text-white">{copy.ageGate.title}</p><p className="mt-1 text-sm leading-6 text-chrome">{copy.ageGate.confirmation}</p></div>
            </div>
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
                className="min-h-12 rounded-md border border-signal/15 bg-graphite px-4 text-sm font-medium text-chrome transition hover:border-signal/35 hover:text-white disabled:opacity-55"
              >
                {copy.ageGate.underage}
              </button>
            </div>
          </div>
        )}

        {error && <p className="mt-5 rounded-md border border-dangerx/25 bg-dangerx/10 p-3 text-sm text-red-200">{error}</p>}
    </SecureAccessFrame>
  );
}
