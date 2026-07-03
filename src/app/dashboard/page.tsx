import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowRight, BadgeCheck, BrainCircuit, FlaskConical, MessageSquare, Microscope, ShieldCheck, Target, WandSparkles } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { AIHealthTwin } from "@/components/dashboard/AIHealthTwin";
import { PillarRadar } from "@/components/dashboard/PillarRadar";
import { PillarGrid } from "@/components/dashboard/PillarGrid";
import { SystemHeader } from "@/components/dashboard/SystemHeader";
import { SystemStatus } from "@/components/dashboard/SystemStatus";
import { findWeakestPillar } from "@/lib/protocol";
import { calculatePillars } from "@/lib/scoring";
import { applyLabScoreImpacts, mergeLabsIntoBiomarkers } from "@/lib/labs/integrate";
import { generateBiologicalIntelligence } from "@/lib/biological-intelligence";
import { generateAdaptiveMission } from "@/lib/adaptive-protocol-engine";
import { createClient } from "@/lib/supabase-server";
import { formatDate } from "@/lib/format";
import type { AdaptiveMissionRecord, BiomarkerEntry, BiologicalInsightRecord, LabReport, OnboardingData, Protocol } from "@/types/database";
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

  const [{ data: onboarding }, { data: biomarkers }, { data: latestProtocol }, { data: labReports }, { data: storedInsights }, { data: storedMissions, error: missionReadError }] = await Promise.all([
    supabase.from("onboarding_data").select("*").eq("user_id", auth.user.id).maybeSingle<OnboardingData>(),
    supabase.from("biomarker_entries").select("*").eq("user_id", auth.user.id).order("created_at", { ascending: false }).limit(1).maybeSingle<BiomarkerEntry>(),
    supabase.from("generated_protocols").select("*").eq("user_id", auth.user.id).order("created_at", { ascending: false }).limit(1).maybeSingle<Protocol>(),
    supabase.from("lab_reports").select("*").eq("user_id", auth.user.id).eq("processing_status", "completed").order("created_at", { ascending: false }).limit(3).returns<LabReport[]>(),
    supabase.from("biological_insights").select("*").eq("user_id", auth.user.id).eq("status", "active").order("created_at", { ascending: false }).limit(6).returns<BiologicalInsightRecord[]>(),
    supabase.from("adaptive_missions").select("*").eq("user_id", auth.user.id).is("completed_at", null).order("created_at", { ascending: false }).limit(3).returns<AdaptiveMissionRecord[]>()
  ]);

  if (!onboarding?.disclaimer_confirmed) redirect("/onboarding");

  const latestLab = labReports?.[0] ?? null;
  const scoreBiomarkers = mergeLabsIntoBiomarkers(biomarkers, latestLab?.analysis_json);
  const pillars = applyLabScoreImpacts(calculatePillars(onboarding, scoreBiomarkers, language), latestLab?.analysis_json, language);
  const intelligence = generateBiologicalIntelligence({
    userId: auth.user.id,
    onboarding,
    latestBiomarkers: scoreBiomarkers,
    latestLabReport: latestLab ?? null,
    pillarScores: pillars
  });
  const intelligenceSummary = intelligence.summary;
  const activeInsights = storedInsights?.length ? storedInsights : intelligence.insights.slice(0, 6).map((insight, index) => ({
    ...insight,
    id: `generated-${index}`,
    created_at: "",
    updated_at: ""
  }));
  const adaptiveMission = generateAdaptiveMission({
    userId: auth.user.id,
    onboarding,
    latestBiomarkers: scoreBiomarkers,
    latestLabReport: latestLab,
    previousLabReports: labReports ?? [],
    pillarScores: pillars,
    biologicalInsights: activeInsights as BiologicalInsightRecord[],
    biologicalIntelligence: intelligenceSummary,
    previousProtocols: latestProtocol ? [latestProtocol] : [],
    previousMissions: storedMissions ?? []
  });
  const persistedMission = storedMissions?.[0];
  if (!persistedMission && !missionReadError) {
    await supabase.from("adaptive_missions").insert({
      user_id: auth.user.id,
      mission_name: adaptiveMission.missionName,
      primary_pillar: adaptiveMission.primaryPillar,
      constraint: adaptiveMission.constraint,
      confidence: adaptiveMission.confidence,
      progress: adaptiveMission.progress,
      phases: adaptiveMission.phases,
      actions: adaptiveMission.actions,
      tracking_signals: adaptiveMission.trackingSignals
    });
  }
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

      <AIHealthTwin
        score={average}
        biologicalAge={estimatedBiologicalAge}
        recoveryStatus={recovery.status}
        recoveryScore={recovery.score}
        longevityProjection={longevityProjection}
        longevityScore={longevity.score}
        weakestPillar={localizedWeakest}
        primaryGoal={localizedGoal}
        nextUpgrade={weakest.nextAction}
        connected={{ biomarkers: Boolean(biomarkers), labs: Boolean(latestLab?.analysis_json), protocol: Boolean(latestProtocol), coach: Boolean(process.env.OPENAI_API_KEY) }}
        labels={{
          eyebrow: copy.dashboard.twinEyebrow,
          title: copy.dashboard.twinTitle,
          description: copy.dashboard.twinDescription,
          optimizationScore: copy.dashboard.healthScore,
          biologicalAge: copy.dashboard.biologicalAge,
          years: copy.dashboard.years,
          recovery: copy.dashboard.recoveryStatus,
          longevity: copy.dashboard.longevityProjection,
          biometricSync: copy.dashboard.biometricSync,
          intelligenceCore: copy.dashboard.intelligenceCore,
          labIntelligence: copy.dashboard.labIntelligence,
          activeProtocol: copy.dashboard.activeProtocolStatus,
          primaryConstraint: copy.dashboard.primaryConstraint,
          nextUpgrade: copy.dashboard.nextBiologicalUpgrade,
          online: copy.dashboard.online,
          syncing: copy.dashboard.syncing,
          optimizing: copy.dashboard.optimizing,
          stable: copy.dashboard.stable,
          needsAttention: copy.dashboard.needsAttention,
          dataMissing: copy.dashboard.dataMissing,
          directionalEstimate: copy.dashboard.experimentalEstimate,
          nodeHeadTitle: copy.dashboard.nodeHeadTitle,
          nodeHeadDescription: copy.dashboard.nodeHeadDescription,
          nodeHeartTitle: copy.dashboard.nodeHeartTitle,
          nodeHeartDescription: copy.dashboard.nodeHeartDescription,
          nodeMetabolicTitle: copy.dashboard.nodeMetabolicTitle,
          nodeMetabolicDescription: copy.dashboard.nodeMetabolicDescription,
          nodeLabsTitle: copy.dashboard.nodeLabsTitle,
          nodeLabsDescription: copy.dashboard.nodeLabsDescription,
          confidence: copy.dashboard.confidence,
          activeInsights: copy.dashboard.activeInsights,
          missingSignals: copy.dashboard.missingSignals,
          currentMission: copy.dashboard.currentBiologicalMission,
          missionProgress: copy.dashboard.missionProgress,
          nextSignalNeeded: copy.dashboard.nextSignalNeeded,
          currentBottleneck: copy.dashboard.currentBottleneck
        }}
        intelligence={{
          primaryConstraint: adaptiveMission.constraint,
          confidenceScore: adaptiveMission.confidence,
          topOpportunity: adaptiveMission.nextUpgrade,
          activeInsightsCount: activeInsights.length,
          missingSignalsCount: intelligenceSummary.missingData.length,
          activeMission: adaptiveMission.missionName,
          missionProgress: adaptiveMission.progress,
          nextSignalNeeded: adaptiveMission.nextSignalNeeded,
          prioritySignals: adaptiveMission.prioritySignals
        }}
      />

      <section className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
        <Card className="lg:col-span-2">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="system-label">{copy.dashboard.currentBiologicalMission}</p>
              <h3 className="mt-2 text-xl font-semibold text-white">{adaptiveMission.missionName}</h3>
              <p className="mt-2 max-w-3xl text-sm leading-6 text-chrome">{adaptiveMission.reason}</p>
            </div>
            <SystemStatus label={`${adaptiveMission.progress}% ${copy.dashboard.missionProgress}`} tone={adaptiveMission.progress >= 55 ? "active" : "warning"} />
          </div>
          <div className="mt-5 grid gap-3 md:grid-cols-4">
            <div className="command-surface rounded-md p-4"><p className="system-label">{copy.dashboard.currentBottleneck}</p><p className="mt-2 text-white">{adaptiveMission.constraint}</p></div>
            <div className="command-surface rounded-md p-4"><p className="system-label">{copy.dashboard.nextBiologicalUpgrade}</p><p className="mt-2 text-sm leading-5 text-chrome">{adaptiveMission.nextUpgrade}</p></div>
            <div className="command-surface rounded-md p-4"><p className="system-label">{copy.dashboard.nextSignalNeeded}</p><p className="mt-2 text-white">{adaptiveMission.nextSignalNeeded}</p></div>
            <div className="command-surface rounded-md p-4"><p className="system-label">{copy.dashboard.confidence}</p><p className="mt-2 text-white">{adaptiveMission.confidence}%</p></div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center justify-between gap-3">
            <div><p className="system-label">{copy.dashboard.intelligenceLayer}</p><h3 className="mt-2 font-semibold text-white">{copy.dashboard.primaryBiologicalConstraint}</h3></div>
            <SystemStatus label={`${intelligenceSummary.confidenceScore}% ${copy.dashboard.confidence}`} tone={intelligenceSummary.confidenceScore >= 70 ? "active" : "warning"} />
          </div>
          <div className="mt-5 grid gap-3 md:grid-cols-3">
            <div className="command-surface rounded-md p-4"><p className="system-label">{copy.dashboard.primaryBiologicalConstraint}</p><p className="mt-2 text-white">{intelligenceSummary.primaryConstraint ? localizePillar(intelligenceSummary.primaryConstraint.pillar, language) : copy.common.notSet}</p></div>
            <div className="command-surface rounded-md p-4"><p className="system-label">{copy.dashboard.topOpportunity}</p><p className="mt-2 text-sm leading-5 text-chrome">{intelligenceSummary.topOpportunity ?? copy.dashboard.limitedIntelligence}</p></div>
            <div className="command-surface rounded-md p-4"><p className="system-label">{copy.dashboard.missingSignals}</p><p className="mt-2 text-white">{intelligenceSummary.missingData.length}</p></div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center justify-between gap-3"><div><p className="system-label">{copy.dashboard.activeBiologicalInsights}</p><h3 className="mt-2 font-semibold text-white">{activeInsights.length} {copy.dashboard.activeInsights}</h3></div><ShieldCheck className="h-5 w-5 text-signal" /></div>
          <div className="mt-5 space-y-3">
            {activeInsights.length ? activeInsights.slice(0, 3).map((insight) => (
              <div key={insight.id} className="rounded-md border border-signal/10 bg-signal/[0.03] p-3 text-sm">
                <p className="font-semibold text-white">{localizePillar(String(insight.pillar), language)}</p>
                <p className="mt-1 leading-5 text-chrome">{String(insight.summary)}</p>
              </div>
            )) : <p className="text-sm leading-6 text-chrome">{copy.dashboard.limitedIntelligence}</p>}
          </div>
        </Card>
      </section>

      <section className="grid gap-4 xl:grid-cols-[1.4fr_0.6fr]">
        <PillarRadar pillars={pillars} weakest={weakest} />
        <Card className="p-0">
          <div className="border-b border-signal/10 px-5 py-4"><p className="system-label">{copy.dashboard.optimizationOpportunities}</p><h3 className="mt-2 font-semibold text-white">{copy.dashboard.priorityQueue}</h3></div>
          <div className="divide-y divide-signal/10">
            {priorityActions.map((action, index) => (
              <div key={`${action}-${index}`} className="grid grid-cols-[38px_1fr] gap-3 px-5 py-5 text-sm text-white">
                <span className="font-mono text-xs text-warningx">P{index + 1}</span><span>{action}</span>
              </div>
            ))}
          </div>
        </Card>
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
      <p className="text-xs text-muted">{biomarkerSummary(biomarkers, language).join(" | ")}</p>
    </div>
  );
}
