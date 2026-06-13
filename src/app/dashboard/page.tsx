import Link from "next/link";
import Image from "next/image";
import { redirect } from "next/navigation";
import { ArrowRight, BadgeCheck, BrainCircuit, ChartNoAxesCombined, FlaskConical, MessageSquare, Microscope, ShieldCheck, Sparkles, Target, WandSparkles } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { MetricRing } from "@/components/dashboard/MetricRing";
import { PillarGrid } from "@/components/dashboard/PillarGrid";
import { SystemHeader } from "@/components/dashboard/SystemHeader";
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

function clamp(value: number) {
  return Math.max(8, Math.min(100, Math.round(value)));
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
  const recovery = pillars.find((pillar) => pillar.pillar === "Recovery") ?? weakest;
  const longevity = pillars.find((pillar) => pillar.pillar === "Longevity") ?? weakest;
  const estimatedBiologicalAge = onboarding.age ? Math.max(21, onboarding.age + Math.round((70 - average) / 8)) : null;
  const longevityProjection = longevity.score >= 75 ? copy.dashboard.trajectoryStrong : longevity.score >= 55 ? copy.dashboard.trajectoryStable : copy.dashboard.trajectoryBuilding;
  const priorityActions = [weakest.nextAction, ...weakest.limitingFactors.slice(0, 2).map((factor) => `${copy.dashboard.address}: ${factor}`)].slice(0, 3);
  while (priorityActions.length < 3) priorityActions.push(pillars.find((pillar) => pillar.pillar !== weakest.pillar)?.nextAction ?? copy.dashboard.logMetric);

  const localizedWeakest = localizePillar(weakest.pillar, language);
  const localizedGoal = localizeGoal(onboarding.main_goal, language);
  const coachPrompts = [
    copy.dashboard.improvePrompt.replace("{pillar}", localizedWeakest),
    copy.dashboard.planPrompt.replace("{goal}", localizedGoal),
    copy.dashboard.explainPrompt.replace("{pillar}", localizedWeakest)
  ];
  const trendSignals = [
    [copy.dashboard.sleep, biomarkers?.sleep_duration ? clamp((biomarkers.sleep_duration / 8) * 100) : 18, biomarkers?.sleep_duration ? `${biomarkers.sleep_duration}h` : copy.common.notSet],
    ["HRV", biomarkers?.hrv ? clamp(biomarkers.hrv) : 12, biomarkers?.hrv ?? copy.common.notSet],
    [copy.dashboard.restingHeartRate, biomarkers?.resting_heart_rate ? clamp(100 - (biomarkers.resting_heart_rate - 45) * 2) : 10, biomarkers?.resting_heart_rate ?? copy.common.notSet],
    [copy.dashboard.glucose, biomarkers?.fasting_glucose ? clamp(100 - Math.abs(biomarkers.fasting_glucose - 85) * 2) : 8, biomarkers?.fasting_glucose ?? copy.common.notSet]
  ] as const;

  return (
    <div className="space-y-6">
      <SystemHeader eyebrow={copy.dashboard.missionEyebrow} title={copy.dashboard.missionTitle} description={copy.dashboard.missionDescription} icon={BrainCircuit} />

      <section className="grid gap-4 xl:grid-cols-[1.35fr_0.65fr]">
        <Card className="scanline relative border-emeraldx/20 p-6 md:p-7">
          <div className="absolute inset-y-0 right-0 hidden w-[44%] lg:block"><Image src="/images/xyvoran-digital-twin-hero.png" alt="" fill sizes="35vw" className="object-cover object-[72%_center] opacity-42" /><div className="absolute inset-0 bg-[linear-gradient(90deg,#10182B_0%,rgba(16,24,43,0.5)_55%,rgba(16,24,43,0.12))]" /></div>
          <div className="relative z-10 flex flex-col gap-7 md:flex-row md:items-center lg:max-w-[72%]">
            <MetricRing value={average} label={copy.dashboard.healthScore} />
            <div className="min-w-0 flex-1">
              <p className="system-label">{copy.dashboard.healthScore}</p>
              <h3 className="mt-3 text-3xl font-semibold text-white">{copy.dashboard.systemReady}</h3>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-chrome">
                {copy.dashboard.planPrefix} <span className="text-white">{localizedGoal}</span>. {copy.dashboard.weakestPrefix} <span className="text-emeraldx">{localizedWeakest}</span>, {copy.dashboard.currentlyAt} <span className="text-white">{weakest.score}/100</span>.
              </p>
              <div className="mt-5 flex flex-wrap gap-x-6 gap-y-2 border-t border-signal/10 pt-4 text-xs text-chrome">
                <span><span className="text-muted">{copy.dashboard.dataCoverage}:</span> {biomarkers ? copy.dashboard.signalConnected : copy.dashboard.signalPartial}</span>
                <span><span className="text-muted">{copy.dashboard.weakest}:</span> <span className="text-white">{localizedWeakest}</span></span>
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-0">
          <div className="border-b border-signal/10 px-5 py-4"><p className="system-label">{copy.dashboard.optimizationOpportunities}</p></div>
          <div className="divide-y divide-signal/10">
            {priorityActions.map((action, index) => (
              <div key={`${action}-${index}`} className="grid grid-cols-[34px_1fr] gap-3 px-5 py-4 text-sm text-white">
                <span className="font-mono text-xs text-emeraldx">0{index + 1}</span><span>{action}</span>
              </div>
            ))}
          </div>
        </Card>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <Card className="min-h-36"><p className="system-label">{copy.dashboard.biologicalAge}</p><div className="mt-5 flex items-end justify-between gap-4"><p className="metric-glow text-4xl font-semibold text-white">{estimatedBiologicalAge ?? "--"}<span className="ml-2 text-sm font-normal text-chrome">{copy.dashboard.years}</span></p><Sparkles className="h-5 w-5 text-violetx" /></div><p className="mt-3 text-xs text-muted">{copy.dashboard.experimentalEstimate}</p></Card>
        <Card className="min-h-36"><p className="system-label">{copy.dashboard.longevityProjection}</p><div className="mt-5 flex items-end justify-between gap-4"><p className="text-2xl font-semibold text-white">{longevityProjection}</p><ChartNoAxesCombined className="h-5 w-5 text-signal" /></div><div className="mt-4 data-track"><div className="data-fill" style={{ width: `${longevity.score}%` }} /></div></Card>
        <Card className="min-h-36"><p className="system-label">{copy.dashboard.recoveryStatus}</p><div className="mt-5 flex items-end justify-between gap-4"><p className="text-2xl font-semibold text-white">{recovery.status}</p><span className="text-2xl font-semibold text-emeraldx">{recovery.score}</span></div><div className="mt-4 data-track"><div className="data-fill" style={{ width: `${recovery.score}%` }} /></div></Card>
      </section>

      <PillarGrid pillars={pillars} />

      <section className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
        <Card>
          <div className="flex items-center justify-between gap-3"><div><p className="system-label">{copy.dashboard.biomarkerTrends}</p><h3 className="mt-2 font-semibold text-white">{copy.dashboard.latestBiomarkers}</h3></div><p className="text-xs text-muted">{formatDate(biomarkers?.created_at)}</p></div>
          <div className="mt-6 space-y-4">
            {trendSignals.map(([label, value, display]) => <div key={label}><div className="mb-2 flex justify-between text-xs"><span className="text-chrome">{label}</span><span className="font-mono text-white">{display}</span></div><div className="data-track"><div className="data-fill" style={{ width: `${value}%` }} /></div></div>)}
          </div>
          <Link href="/dashboard/biomarkers" className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-emeraldx">{copy.dashboard.logBiomarkers}<ArrowRight className="h-4 w-4" /></Link>
        </Card>

        <Card>
          <div className="flex items-center justify-between"><div><p className="system-label">{copy.dashboard.intelligenceFeed}</p><h3 className="mt-2 font-semibold text-white">{copy.dashboard.coachPrompts}</h3></div><ShieldCheck className="h-5 w-5 text-signal" /></div>
          <div className="mt-5 divide-y divide-signal/10 border-y border-signal/10">
            {coachPrompts.map((prompt) => <Link href="/dashboard/coach" key={prompt} className="flex items-center justify-between gap-4 py-4 text-sm text-chrome transition hover:text-white"><span>{prompt}</span><ArrowRight className="h-4 w-4 shrink-0 text-emeraldx" /></Link>)}
          </div>
        </Card>
      </section>

      <section className="grid gap-4 lg:grid-cols-3">
        <Card>
          <div className="flex items-center justify-between"><h3 className="font-semibold text-white">{copy.dashboard.latestProtocol}</h3><WandSparkles className="h-4 w-4 text-violetx" /></div>
          {latestProtocol ? <div className="mt-4 space-y-3 text-sm text-chrome"><p className="text-white">{latestProtocol.title ?? latestProtocol.goal}</p><p>{copy.common.status}: <span className="text-successx">{latestProtocol.status ?? copy.common.active}</span></p><p>{copy.protocols.intensity}: {localizeIntensity(latestProtocol.intensity ?? "Beginner", language)}</p><Link href="/dashboard/protocols" className="inline-flex items-center gap-2 text-emeraldx">{copy.dashboard.viewProtocol}<ArrowRight className="h-4 w-4" /></Link></div> : <Link href="/dashboard/protocols" className="mt-4 inline-flex items-center gap-2 text-sm text-emeraldx">{copy.dashboard.firstProtocol}<ArrowRight className="h-4 w-4" /></Link>}
        </Card>
        <Card>
          <div className="flex items-center justify-between"><h3 className="font-semibold text-white">{copy.labs.latest}</h3><Microscope className="h-4 w-4 text-signal" /></div>
          {latestLab?.analysis_json ? <div className="mt-4 space-y-3 text-sm"><p className="text-chrome">{copy.labs.weakest}</p><p className="text-xl text-white">{localizeLabCategory(latestLab.analysis_json.weakestCategory, language) ?? copy.common.none}</p><p className="text-chrome">{latestLab.analysis_json.biggestOpportunities[0] ? localizeLabPriorityAction(latestLab.analysis_json.biggestOpportunities[0].name, language) : copy.optimization.labs.maintain}</p></div> : <p className="mt-4 text-sm text-chrome">{copy.dashboard.labConnection}</p>}
          <Link href="/dashboard/labs" className="mt-5 inline-flex items-center gap-2 text-sm text-emeraldx">{copy.dashboard.openLabs}<ArrowRight className="h-4 w-4" /></Link>
        </Card>
        <Card>
          <div className="flex items-center justify-between"><h3 className="font-semibold text-white">{copy.dashboard.nextMoves}</h3><Target className="h-4 w-4 text-emeraldx" /></div>
          <div className="mt-4 grid grid-cols-2 gap-2">
            {[["/dashboard/labs", copy.dashboard.analyzeBloodwork, Microscope], ["/dashboard/coach", copy.dashboard.askCoach, MessageSquare], ["/dashboard/protocols", copy.dashboard.generateProtocol, WandSparkles], ["/dashboard/membership", copy.dashboard.openMembership, BadgeCheck]].map(([href, label, Icon]) => { const ActionIcon = Icon as typeof FlaskConical; return <Link key={String(href)} href={String(href)} className="command-surface flex min-h-20 flex-col justify-between rounded-md p-3 text-xs text-white transition hover:border-emeraldx/25"><ActionIcon className="h-4 w-4 text-emeraldx" />{String(label)}</Link>; })}
          </div>
        </Card>
      </section>

      {pillarError && <Card className="border-warningx/30 bg-warningx/10"><p className="text-sm text-amber-100">{copy.dashboard.pillarSaveError}: {pillarError.message}</p></Card>}
      <p className="text-xs text-muted">{biomarkerSummary(biomarkers, language).join(" · ")}</p>
    </div>
  );
}
