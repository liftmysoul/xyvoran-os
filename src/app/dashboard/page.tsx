import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowRight, BadgeCheck, FlaskConical, MessageSquare, Microscope, ShieldCheck, WandSparkles } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { PillarGrid } from "@/components/dashboard/PillarGrid";
import { findWeakestPillar } from "@/lib/protocol";
import { calculatePillars } from "@/lib/scoring";
import { applyLabScoreImpacts, mergeLabsIntoBiomarkers } from "@/lib/labs/integrate";
import { createClient } from "@/lib/supabase-server";
import { formatDate } from "@/lib/format";
import type { BiomarkerEntry, LabReport, OnboardingData, Protocol } from "@/types/database";
import { getServerI18n } from "@/lib/i18n/server";
import { getDictionary, localizeIntensity, localizeLabCategory, localizeLabPriorityAction, localizePillar } from "@/lib/i18n";
import { localizeGoal } from "@/lib/protocol";

function biomarkerSummary(biomarkers: BiomarkerEntry | null, language: "en" | "es") {
  const dictionary = getDictionary(language);
  if (!biomarkers) return [dictionary.dashboard.noBiomarkers];
  const missing = dictionary.common.notSet;
  return [
    `${dictionary.dashboard.glucose}: ${biomarkers.fasting_glucose ?? missing}`,
    `HbA1c: ${biomarkers.hba1c ?? missing}`,
    `HRV: ${biomarkers.hrv ?? missing}`,
    `${dictionary.dashboard.restingHeartRate}: ${biomarkers.resting_heart_rate ?? missing}`,
    `${dictionary.dashboard.sleep}: ${biomarkers.sleep_duration ?? missing}h`
  ];
}

export default async function DashboardPage() {
  const { copy, language } = await getServerI18n();
  const supabase = await createClient();
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) redirect("/auth/login");

  const [{ data: onboarding }, { data: biomarkers }, { data: latestProtocol }, { data: latestLab }] = await Promise.all([
    supabase.from("onboarding_data").select("*").eq("user_id", auth.user.id).maybeSingle<OnboardingData>(),
    supabase.from("biomarker_entries").select("*").eq("user_id", auth.user.id).order("created_at", { ascending: false }).limit(1).maybeSingle<BiomarkerEntry>(),
    supabase.from("generated_protocols").select("*").eq("user_id", auth.user.id).order("created_at", { ascending: false }).limit(1).maybeSingle<Protocol>(),
    supabase.from("lab_reports").select("*").eq("user_id", auth.user.id).eq("processing_status", "completed").order("created_at", { ascending: false }).limit(1).maybeSingle<LabReport>()
  ]);

  if (!onboarding?.disclaimer_confirmed) redirect("/onboarding");

  const scoreBiomarkers = mergeLabsIntoBiomarkers(biomarkers, latestLab?.analysis_json);
  const pillars = applyLabScoreImpacts(calculatePillars(onboarding, scoreBiomarkers, language), latestLab?.analysis_json, language);
  const { error: pillarError } = await supabase.from("pillar_scores").upsert(
    pillars.map((pillar) => ({
      user_id: auth.user.id,
      pillar: pillar.pillar,
      score: pillar.score,
      status: pillar.status,
      metrics: pillar.metrics,
      suggested_next_action: pillar.nextAction
    })),
    { onConflict: "user_id,pillar" }
  );
  const average = Math.round(pillars.reduce((sum, pillar) => sum + pillar.score, 0) / pillars.length);
  const weakest = findWeakestPillar(pillars);
  const priorityActions = [
    weakest.nextAction,
    ...weakest.limitingFactors.slice(0, 2).map((factor) => `${copy.dashboard.address}: ${factor}`)
  ].slice(0, 3);
  while (priorityActions.length < 3) {
    priorityActions.push(pillars.find((pillar) => pillar.pillar !== weakest.pillar)?.nextAction ?? copy.dashboard.logMetric);
  }

  const localizedWeakest = localizePillar(weakest.pillar, language);
  const localizedGoal = localizeGoal(onboarding.main_goal, language);
  const coachPrompts = [
    copy.dashboard.improvePrompt.replace("{pillar}", localizedWeakest),
    copy.dashboard.planPrompt.replace("{goal}", localizedGoal),
    copy.dashboard.explainPrompt.replace("{pillar}", localizedWeakest)
  ];

  return (
    <div className="space-y-6">
      <section className="grid gap-4 lg:grid-cols-[1fr_380px]">
        <Card>
          <p className="text-sm uppercase tracking-[0.25em] text-emeraldx">{copy.dashboard.overall}</p>
          <h2 className="mt-3 text-4xl font-semibold text-white">{average}/100</h2>
          <p className="mt-3 max-w-2xl text-chrome">
            {copy.dashboard.planPrefix} <span className="text-white">{localizedGoal}</span>. {copy.dashboard.weakestPrefix}{" "}
            <span className="text-white">{localizedWeakest}</span>, {copy.dashboard.currentlyAt} <span className="text-white">{weakest.score}/100</span>.
          </p>
          <div className="mt-5 grid gap-3 md:grid-cols-3">
            {priorityActions.map((action, index) => (
              <div key={`${action}-${index}`} className="rounded-md border border-white/10 bg-white/5 p-4 text-sm text-white">
                <p className="mb-2 text-xs uppercase tracking-[0.18em] text-emeraldx">{copy.dashboard.priority} {index + 1}</p>
                {action}
              </div>
            ))}
          </div>
        </Card>
        <Card>
          <h3 className="font-semibold text-white">{copy.dashboard.nextMoves}</h3>
          <div className="mt-4 space-y-3">
            {[
              ["/dashboard/biomarkers", copy.dashboard.logBiomarkers, FlaskConical],
              ["/dashboard/labs", copy.dashboard.analyzeBloodwork, Microscope],
              ["/dashboard/coach", copy.dashboard.askCoach, MessageSquare],
              ["/dashboard/protocols", copy.dashboard.generateProtocol, WandSparkles],
              ["/dashboard/membership", copy.dashboard.openMembership, BadgeCheck]
            ].map(([href, label, Icon]) => (
              <Link key={String(href)} href={String(href)} className="flex items-center justify-between rounded-md bg-white/5 p-3 text-sm text-white hover:bg-white/10">
                <span className="flex items-center gap-2"><Icon className="h-4 w-4 text-emeraldx" />{String(label)}</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            ))}
          </div>
        </Card>
      </section>

      <section className="grid gap-4 lg:grid-cols-3">
        <Card>
          <h3 className="font-semibold text-white">{copy.dashboard.latestBiomarkers}</h3>
          <p className="mt-1 text-xs text-emeraldx">{formatDate(biomarkers?.created_at)}</p>
          <ul className="mt-4 space-y-2 text-sm text-chrome">
            {biomarkerSummary(biomarkers, language).map((item) => <li key={item}>{item}</li>)}
          </ul>
        </Card>
        <Card>
          <h3 className="font-semibold text-white">{copy.dashboard.latestProtocol}</h3>
          {latestProtocol ? (
            <div className="mt-4 space-y-3 text-sm text-chrome">
              <p className="text-white">{latestProtocol.title ?? latestProtocol.goal}</p>
              <p>{copy.common.status}: <span className="text-emeraldx">{latestProtocol.status ?? copy.common.active}</span></p>
              <p>{copy.protocols.intensity}: {localizeIntensity(latestProtocol.intensity ?? "Beginner", language)}</p>
              <Link href="/dashboard/protocols" className="inline-flex items-center gap-2 text-emeraldx">{copy.dashboard.viewProtocol} <ArrowRight className="h-4 w-4" /></Link>
            </div>
          ) : (
            <Link href="/dashboard/protocols" className="mt-4 inline-flex items-center gap-2 text-sm text-emeraldx">{copy.dashboard.firstProtocol} <ArrowRight className="h-4 w-4" /></Link>
          )}
        </Card>
        <Card>
          <h3 className="flex items-center gap-2 font-semibold text-white"><ShieldCheck className="h-4 w-4 text-emeraldx" /> {copy.dashboard.coachPrompts}</h3>
          <ul className="mt-4 space-y-2 text-sm text-chrome">
            {coachPrompts.map((prompt) => <li key={prompt} className="rounded-md bg-white/5 p-3">{prompt}</li>)}
          </ul>
        </Card>
      </section>

      <Card>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div><h3 className="flex items-center gap-2 font-semibold text-white"><Microscope className="h-4 w-4 text-emeraldx" /> {copy.labs.latest}</h3><p className="mt-1 text-xs text-chrome">{latestLab ? formatDate(latestLab.created_at) : copy.labs.noAnalysis}</p></div>
          <Link href="/dashboard/labs" className="inline-flex items-center gap-2 text-sm text-emeraldx">{copy.dashboard.openLabs} <ArrowRight className="h-4 w-4" /></Link>
        </div>
        {latestLab?.analysis_json ? (
          <div className="mt-4 grid gap-3 md:grid-cols-3">
            <div className="rounded-md bg-white/5 p-4 text-sm"><p className="text-chrome">{copy.labs.weakest}</p><p className="mt-2 text-white">{localizeLabCategory(latestLab.analysis_json.weakestCategory, language) ?? copy.common.none}</p></div>
            <div className="rounded-md bg-white/5 p-4 text-sm"><p className="text-chrome">{copy.labs.opportunities}</p><p className="mt-2 text-white">{latestLab.analysis_json.biggestOpportunities.slice(0, 3).map((marker) => marker.name).join(", ") || copy.dashboard.noPriorityMarkers}</p></div>
            <div className="rounded-md bg-white/5 p-4 text-sm"><p className="text-chrome">{copy.labs.priority}</p><p className="mt-2 text-white">{latestLab.analysis_json.biggestOpportunities[0] ? localizeLabPriorityAction(latestLab.analysis_json.biggestOpportunities[0].name, language) : copy.optimization.labs.maintain}</p></div>
          </div>
        ) : <p className="mt-4 text-sm text-chrome">{copy.dashboard.labConnection}</p>}
      </Card>

      {pillarError && (
        <Card className="border-amber-300/30 bg-amber-300/10">
          <p className="text-sm text-amber-100">{copy.dashboard.pillarSaveError}: {pillarError.message}</p>
        </Card>
      )}
      <PillarGrid pillars={pillars} />
    </div>
  );
}
