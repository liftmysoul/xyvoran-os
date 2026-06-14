"use client";

import { PolarAngleAxis, PolarGrid, PolarRadiusAxis, Radar, RadarChart, ResponsiveContainer } from "recharts";
import { AlertTriangle, ArrowUpRight } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { SystemStatus } from "@/components/dashboard/SystemStatus";
import { useI18n } from "@/components/i18n/LanguageProvider";
import { localizePillar } from "@/lib/i18n";
import type { PillarScore } from "@/types/database";

const colors = ["#00F5D4", "#4CC9F0", "#7C3AED", "#00E676", "#FFB703"];

export function PillarRadar({ pillars, weakest }: { pillars: PillarScore[]; weakest: PillarScore }) {
  const { copy, language } = useI18n();
  const shortLabels = language === "es"
    ? { Metabolic: "Metabólico", Recovery: "Recuperación", Longevity: "Longevidad", Cognitive: "Cognitivo", Beauty: "Belleza" }
    : { Metabolic: "Metabolic", Recovery: "Recovery", Longevity: "Longevity", Cognitive: "Cognitive", Beauty: "Beauty" };
  const data = pillars.map((pillar) => ({ pillar: shortLabels[pillar.pillar], score: pillar.score, fullMark: 100 }));

  return (
    <Card className="p-0">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-signal/10 px-5 py-4">
        <div>
          <p className="system-label">{copy.dashboard.biometricMatrix}</p>
          <h3 className="mt-2 font-semibold text-white">{copy.dashboard.pillarRadar}</h3>
        </div>
        <SystemStatus label={copy.dashboard.optimizing} tone="intelligence" />
      </div>
      <div className="grid lg:grid-cols-[1.15fr_0.85fr]">
        <div className="relative h-[330px] border-b border-signal/10 lg:border-b-0 lg:border-r">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,245,212,0.06),transparent_58%)]" />
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart data={data} outerRadius="72%">
              <PolarGrid stroke="rgba(76,201,240,0.18)" />
              <PolarAngleAxis dataKey="pillar" tick={{ fill: "#A7B0C0", fontSize: 10 }} />
              <PolarRadiusAxis angle={90} domain={[0, 100]} tick={false} axisLine={false} />
              <Radar dataKey="score" stroke="#00F5D4" strokeWidth={2} fill="#00F5D4" fillOpacity={0.16} dot={{ r: 3, fill: "#4CC9F0", strokeWidth: 0 }} />
            </RadarChart>
          </ResponsiveContainer>
        </div>
        <div className="p-5">
          <div className="rounded-sm border border-warningx/20 bg-warningx/[0.045] p-4">
            <div className="flex items-center gap-2 text-warningx"><AlertTriangle className="h-4 w-4" /><span className="text-[10px] font-semibold uppercase">{copy.dashboard.primaryConstraint}</span></div>
            <p className="mt-3 text-xl font-semibold text-white">{localizePillar(weakest.pillar, language)}</p>
            <p className="mt-2 text-xs leading-5 text-chrome">{weakest.limitingFactors[0] ?? weakest.status}</p>
          </div>
          <div className="mt-5 space-y-3">
            {pillars.map((pillar, index) => (
              <div key={pillar.pillar}>
                <div className="mb-1.5 flex items-center justify-between text-xs"><span className="flex items-center gap-2 text-chrome"><span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: colors[index] }} />{localizePillar(pillar.pillar, language)}</span><span className="font-mono text-white">{pillar.score}</span></div>
                <div className="h-1 overflow-hidden bg-white/[0.06]"><div className="h-full" style={{ width: `${pillar.score}%`, backgroundColor: colors[index], boxShadow: `0 0 10px ${colors[index]}` }} /></div>
              </div>
            ))}
          </div>
          <div className="mt-6 border-t border-signal/10 pt-4">
            <p className="flex items-center gap-2 text-[10px] font-semibold uppercase text-emeraldx"><ArrowUpRight className="h-3.5 w-3.5" />{copy.dashboard.nextBiologicalUpgrade}</p>
            <p className="mt-2 text-sm leading-6 text-white">{weakest.nextAction}</p>
          </div>
        </div>
      </div>
    </Card>
  );
}
