import { Card } from "@/components/ui/Card";
import type { PillarScore } from "@/types/database";

export function PillarGrid({ pillars }: { pillars: PillarScore[] }) {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
      {pillars.map((pillar) => (
        <Card key={pillar.pillar} className="min-h-64">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="font-semibold text-white">{pillar.pillar}</h2>
              <p className="mt-1 text-sm text-emeraldx">{pillar.status}</p>
            </div>
            <div className="grid h-16 w-16 place-items-center rounded-full border border-emeraldx/30 bg-emeraldx/10 text-xl font-bold text-emeraldx">
              {pillar.score}
            </div>
          </div>
          <div className="mt-5 h-2 rounded-full bg-white/10">
            <div className="h-2 rounded-full bg-emeraldx" style={{ width: `${pillar.score}%` }} />
          </div>
          <ul className="mt-5 space-y-2 text-sm text-chrome">
            {pillar.metrics.map((metric) => <li key={metric}>{metric}</li>)}
          </ul>
          <p className="mt-5 rounded-md border border-white/10 bg-white/5 p-3 text-sm text-white">{pillar.nextAction}</p>
          <details className="mt-4 rounded-md border border-white/10 bg-black/30 p-3 text-sm">
            <summary className="cursor-pointer font-semibold text-emeraldx">Why this score?</summary>
            <div className="mt-3 space-y-3 text-chrome">
              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-white">Positive drivers</p>
                <ul className="mt-2 space-y-1">
                  {pillar.keyDrivers.map((driver) => <li key={driver}>{driver}</li>)}
                </ul>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-white">Limiting factors</p>
                <ul className="mt-2 space-y-1">
                  {(pillar.limitingFactors.length ? pillar.limitingFactors : ["No major limiting factor identified from current data."]).map((factor) => <li key={factor}>{factor}</li>)}
                </ul>
              </div>
              {pillar.riskFlags.length > 0 && (
                <div>
                  <p className="text-xs uppercase tracking-[0.18em] text-amber-200">Risk flags</p>
                  <ul className="mt-2 space-y-1 text-amber-100">
                    {pillar.riskFlags.map((flag) => <li key={flag}>{flag}</li>)}
                  </ul>
                </div>
              )}
            </div>
          </details>
        </Card>
      ))}
    </div>
  );
}
