import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowRight, FlaskConical, MessageSquare, Microscope, ShieldCheck, WandSparkles } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { PillarGrid } from "@/components/dashboard/PillarGrid";
import { findWeakestPillar } from "@/lib/protocol";
import { calculatePillars } from "@/lib/scoring";
import { applyLabScoreImpacts, mergeLabsIntoBiomarkers } from "@/lib/labs/integrate";
import { createClient } from "@/lib/supabase-server";
import { formatDate } from "@/lib/format";
import type { BiomarkerEntry, LabReport, OnboardingData, Protocol } from "@/types/database";
import { getServerI18n } from "@/lib/i18n/server";
import { localizeIntensity, localizePillar } from "@/lib/i18n";

function biomarkerSummary(biomarkers: BiomarkerEntry | null, language: "en" | "es") {
  if (!biomarkers) return [language === "es" ? "Aún no hay biomarcadores registrados." : "No biomarker entry yet."];
  const missing = language === "es" ? "sin registrar" : "not logged";
  return [
    `${language === "es" ? "Glucosa" : "Glucose"}: ${biomarkers.fasting_glucose ?? missing}`,
    `HbA1c: ${biomarkers.hba1c ?? missing}`,
    `HRV: ${biomarkers.hrv ?? missing}`,
    `${language === "es" ? "FC reposo" : "RHR"}: ${biomarkers.resting_heart_rate ?? missing}`,
    `${language === "es" ? "Sueño" : "Sleep"}: ${biomarkers.sleep_duration ?? missing}h`
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
  const pillars = applyLabScoreImpacts(calculatePillars(onboarding, scoreBiomarkers, language), latestLab?.analysis_json);
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
    ...weakest.limitingFactors.slice(0, 2).map((factor) => `${language === "es" ? "Abordar" : "Address"}: ${factor}`)
  ].slice(0, 3);
  while (priorityActions.length < 3) {
    priorityActions.push(pillars.find((pillar) => pillar.pillar !== weakest.pillar)?.nextAction ?? (language === "es" ? "Registra un nuevo biomarcador o métrica de sueño." : "Log one new biomarker or sleep metric."));
  }

  const coachPrompts = language === "es" ? [
    `Ayúdame a mejorar mi puntuación de ${localizePillar(weakest.pillar, language)} esta semana.`,
    `Crea un plan de 24 horas para ${onboarding.main_goal} usando mis biomarcadores recientes.`,
    `Explica qué limita mi pilar de ${localizePillar(weakest.pillar, language)} y qué debo hacer primero.`
  ] : [`Help me improve my ${weakest.pillar} score this week.`, `Build a 24-hour plan for ${onboarding.main_goal} using my latest biomarkers.`, `Explain what is limiting my ${weakest.pillar} pillar and what to do first.`];

  return (
    <div className="space-y-6">
      <section className="grid gap-4 lg:grid-cols-[1fr_380px]">
        <Card>
          <p className="text-sm uppercase tracking-[0.25em] text-emeraldx">{copy.dashboard.overall}</p>
          <h2 className="mt-3 text-4xl font-semibold text-white">{average}/100</h2>
          <p className="mt-3 max-w-2xl text-chrome">
            {language === "es" ? "Tu plan actual está orientado a" : "Your current plan is tuned for"} <span className="text-white">{onboarding.main_goal}</span>. {language === "es" ? "El pilar prioritario es" : "The weakest pillar is"}{" "}
            <span className="text-white">{localizePillar(weakest.pillar, language)}</span>, {language === "es" ? "actualmente en" : "currently at"} <span className="text-white">{weakest.score}/100</span>.
          </p>
          <div className="mt-5 grid gap-3 md:grid-cols-3">
            {priorityActions.map((action, index) => (
              <div key={`${action}-${index}`} className="rounded-md border border-white/10 bg-white/5 p-4 text-sm text-white">
                <p className="mb-2 text-xs uppercase tracking-[0.18em] text-emeraldx">{language === "es" ? "Prioridad" : "Priority"} {index + 1}</p>
                {action}
              </div>
            ))}
          </div>
        </Card>
        <Card>
          <h3 className="font-semibold text-white">{language === "es" ? "Siguientes acciones" : "Next Moves"}</h3>
          <div className="mt-4 space-y-3">
            {[
              ["/dashboard/biomarkers", language === "es" ? "Registrar biomarcadores" : "Log biomarkers", FlaskConical],
              ["/dashboard/labs", language === "es" ? "Analizar laboratorio" : "Analyze bloodwork", Microscope],
              ["/dashboard/coach", language === "es" ? "Consultar al Coach de IA" : "Ask the AI Coach", MessageSquare],
              ["/dashboard/protocols", language === "es" ? "Generar protocolo" : "Generate protocol", WandSparkles]
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
              <Link href="/dashboard/protocols" className="inline-flex items-center gap-2 text-emeraldx">{language === "es" ? "Ver protocolo" : "View protocol"} <ArrowRight className="h-4 w-4" /></Link>
            </div>
          ) : (
            <Link href="/dashboard/protocols" className="mt-4 inline-flex items-center gap-2 text-sm text-emeraldx">{language === "es" ? "Genera tu primer protocolo" : "Generate your first protocol"} <ArrowRight className="h-4 w-4" /></Link>
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
          <Link href="/dashboard/labs" className="inline-flex items-center gap-2 text-sm text-emeraldx">{language === "es" ? "Abrir laboratorios" : "Open labs"} <ArrowRight className="h-4 w-4" /></Link>
        </div>
        {latestLab?.analysis_json ? (
          <div className="mt-4 grid gap-3 md:grid-cols-3">
            <div className="rounded-md bg-white/5 p-4 text-sm"><p className="text-chrome">{copy.labs.weakest}</p><p className="mt-2 text-white">{latestLab.analysis_json.weakestCategory ?? copy.common.none}</p></div>
            <div className="rounded-md bg-white/5 p-4 text-sm"><p className="text-chrome">{copy.labs.opportunities}</p><p className="mt-2 text-white">{latestLab.analysis_json.biggestOpportunities.slice(0, 3).map((marker) => marker.name).join(", ") || (language === "es" ? "Sin biomarcadores prioritarios" : "No priority markers")}</p></div>
            <div className="rounded-md bg-white/5 p-4 text-sm"><p className="text-chrome">{copy.labs.priority}</p><p className="mt-2 text-white">{latestLab.analysis_json.priorityActions[0]}</p></div>
          </div>
        ) : <p className="mt-4 text-sm text-chrome">{language === "es" ? "Carga análisis de sangre para conectar las señales de laboratorio con las puntuaciones por pilar y el contexto del Coach de IA." : "Upload bloodwork to connect lab signals to pillar scores and AI Coach context."}</p>}
      </Card>

      {pillarError && (
        <Card className="border-amber-300/30 bg-amber-300/10">
          <p className="text-sm text-amber-100">{language === "es" ? "No se pudieron guardar las puntuaciones por pilar en Supabase" : "Pillar scores could not be saved to Supabase"}: {pillarError.message}</p>
        </Card>
      )}
      <PillarGrid pillars={pillars} />
    </div>
  );
}
