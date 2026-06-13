"use client";

import { Card } from "@/components/ui/Card";
import type { PillarScore } from "@/types/database";
import { useI18n } from "@/components/i18n/LanguageProvider";
import { localizePillar } from "@/lib/i18n";
import { BrainCircuit, Dna, Droplets, Gauge, Orbit } from "lucide-react";
import { MetricRing } from "@/components/dashboard/MetricRing";

const pillarIcons = { Metabolic: Gauge, Recovery: Orbit, Longevity: Dna, Cognitive: BrainCircuit, Beauty: Droplets };

export function PillarGrid({ pillars }: { pillars: PillarScore[] }) {
  const { copy, language } = useI18n();
  return (
    <section>
      <div className="mb-4 flex items-center justify-between"><p className="system-label">{copy.dashboard.pillarArray}</p><span className="font-mono text-[10px] text-muted">05 / 05 ONLINE</span></div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
      {pillars.map((pillar, index) => {
        const Icon = pillarIcons[pillar.pillar as keyof typeof pillarIcons] ?? Gauge;
        return (
        <Card key={pillar.pillar} className="min-h-72 p-4">
          <div className="flex items-center justify-between border-b border-signal/10 pb-3"><Icon className="h-4 w-4 text-emeraldx" /><span className="font-mono text-[10px] text-muted">P-0{index + 1}</span></div>
          <div className="flex items-start justify-between gap-4">
            <div className="pt-4">
              <h2 className="font-semibold text-white">{localizePillar(pillar.pillar, language)}</h2>
              <p className="mt-1 text-xs text-chrome">{pillar.status}</p>
            </div>
            <div className="pt-3"><MetricRing value={pillar.score} label={localizePillar(pillar.pillar, language)} size="sm" /></div>
          </div>
          <div className="mt-4 data-track"><div className="data-fill" style={{ width: `${pillar.score}%` }} /></div>
          <ul className="mt-4 space-y-1.5 text-xs leading-5 text-chrome">
            {pillar.metrics.map((metric) => <li key={metric}>{metric}</li>)}
          </ul>
          <p className="mt-4 border-l-2 border-emeraldx pl-3 text-xs leading-5 text-white">{pillar.nextAction}</p>
          <details className="mt-4 border-t border-signal/10 pt-3 text-xs">
            <summary className="cursor-pointer font-semibold text-emeraldx">{copy.dashboard.why}</summary>
            <div className="mt-3 space-y-3 text-chrome">
              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-white">{copy.dashboard.positive}</p>
                <ul className="mt-2 space-y-1">
                  {pillar.keyDrivers.map((driver) => <li key={driver}>{driver}</li>)}
                </ul>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-white">{copy.dashboard.limiting}</p>
                <ul className="mt-2 space-y-1">
                  {(pillar.limitingFactors.length ? pillar.limitingFactors : [copy.dashboard.noLimit]).map((factor) => <li key={factor}>{factor}</li>)}
                </ul>
              </div>
              {pillar.riskFlags.length > 0 && (
                <div>
                  <p className="text-xs uppercase tracking-[0.18em] text-amber-200">{copy.dashboard.risks}</p>
                  <ul className="mt-2 space-y-1 text-amber-100">
                    {pillar.riskFlags.map((flag) => <li key={flag}>{flag}</li>)}
                  </ul>
                </div>
              )}
            </div>
          </details>
        </Card>
      );})}
      </div>
    </section>
  );
}
