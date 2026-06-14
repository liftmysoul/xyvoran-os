import Image from "next/image";
import { Activity, BrainCircuit, RadioTower, ScanSearch, ShieldCheck, WandSparkles } from "lucide-react";
import { SystemStatus, type SystemStatusTone } from "@/components/dashboard/SystemStatus";

type TwinSignal = {
  label: string;
  value: string;
  status: string;
  tone: SystemStatusTone;
  icon: typeof Activity;
};

type AIHealthTwinProps = {
  score: number;
  biologicalAge: number | null;
  recoveryStatus: string;
  recoveryScore: number;
  longevityProjection: string;
  longevityScore: number;
  weakestPillar: string;
  primaryGoal: string;
  nextUpgrade: string;
  labels: {
    eyebrow: string;
    title: string;
    description: string;
    optimizationScore: string;
    biologicalAge: string;
    years: string;
    recovery: string;
    longevity: string;
    biometricSync: string;
    intelligenceCore: string;
    labIntelligence: string;
    activeProtocol: string;
    primaryConstraint: string;
    nextUpgrade: string;
    online: string;
    syncing: string;
    optimizing: string;
    stable: string;
    needsAttention: string;
    dataMissing: string;
    directionalEstimate: string;
  };
  connected: {
    biomarkers: boolean;
    labs: boolean;
    protocol: boolean;
    coach: boolean;
  };
};

function SignalTile({ signal }: { signal: TwinSignal }) {
  const Icon = signal.icon;
  return (
    <div className="twin-signal group">
      <div className="flex items-center justify-between gap-3">
        <Icon className="h-4 w-4 text-signal transition group-hover:text-emeraldx" />
        <SystemStatus label={signal.status} tone={signal.tone} />
      </div>
      <p className="mt-4 text-[10px] font-semibold uppercase text-muted">{signal.label}</p>
      <p className="mt-1 truncate text-sm font-semibold text-white">{signal.value}</p>
    </div>
  );
}

export function AIHealthTwin({ score, biologicalAge, recoveryStatus, recoveryScore, longevityProjection, longevityScore, weakestPillar, primaryGoal, nextUpgrade, labels, connected }: AIHealthTwinProps) {
  const signals: TwinSignal[] = [
    { label: labels.biometricSync, value: connected.biomarkers ? `${score}% ${labels.stable}` : labels.dataMissing, status: connected.biomarkers ? labels.online : labels.syncing, tone: connected.biomarkers ? "active" : "warning", icon: RadioTower },
    { label: labels.intelligenceCore, value: primaryGoal, status: connected.coach ? labels.online : labels.dataMissing, tone: connected.coach ? "intelligence" : "muted", icon: BrainCircuit },
    { label: labels.labIntelligence, value: connected.labs ? labels.stable : labels.dataMissing, status: connected.labs ? labels.online : labels.syncing, tone: connected.labs ? "active" : "warning", icon: ScanSearch },
    { label: labels.activeProtocol, value: connected.protocol ? labels.optimizing : labels.dataMissing, status: connected.protocol ? labels.optimizing : labels.syncing, tone: connected.protocol ? "intelligence" : "warning", icon: WandSparkles }
  ];

  return (
    <section className="health-twin-shell scanline">
      <div className="health-twin-grid" />
      <div className="twin-orbit twin-orbit-one" />
      <div className="twin-orbit twin-orbit-two" />
      <div className="relative z-10 border-b border-signal/10 px-4 py-4 md:px-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="system-label flex items-center gap-2"><span className="status-dot signal-pulse" />{labels.eyebrow}</p>
            <h3 className="mt-2 text-xl font-semibold text-white md:text-2xl">{labels.title}</h3>
            <p className="mt-2 max-w-2xl text-xs leading-5 text-chrome md:text-sm">{labels.description}</p>
          </div>
          <SystemStatus label={labels.online} tone="active" />
        </div>
      </div>

      <div className="relative z-10 grid min-h-[680px] lg:min-h-[590px] lg:grid-cols-[0.75fr_1.3fr_0.75fr]">
        <div className="order-2 grid grid-cols-2 gap-2 p-4 lg:order-1 lg:grid-cols-1 lg:content-center lg:gap-3 lg:p-6">
          <SignalTile signal={signals[0]} />
          <SignalTile signal={signals[1]} />
          <div className="twin-signal col-span-2 lg:col-span-1">
            <div className="flex items-center justify-between"><Activity className="h-4 w-4 text-emeraldx" /><span className="font-mono text-xs text-emeraldx">{recoveryScore}/100</span></div>
            <p className="mt-4 text-[10px] font-semibold uppercase text-muted">{labels.recovery}</p>
            <p className="mt-1 text-sm font-semibold text-white">{recoveryStatus}</p>
            <div className="mt-3 data-track"><div className="data-fill" style={{ width: `${recoveryScore}%` }} /></div>
          </div>
        </div>

        <div className="order-1 relative min-h-[410px] overflow-hidden lg:order-2 lg:min-h-0">
          <div className="absolute inset-x-[8%] inset-y-0">
            <Image src="/images/xyvoran-digital-twin-hero.png" alt="" fill priority sizes="(max-width: 1024px) 92vw, 45vw" className="object-cover object-[62%_center] opacity-70 mix-blend-screen" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_24%,rgba(5,8,22,0.28)_58%,#050816_86%)]" />
          </div>
          <div className="absolute left-1/2 top-1/2 grid h-48 w-48 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border border-emeraldx/25 bg-obsidian/45 shadow-[0_0_80px_rgba(0,245,212,0.16)] backdrop-blur-sm md:h-56 md:w-56">
            <div className="absolute inset-3 rounded-full border border-dashed border-signal/25 twin-spin" />
            <div className="absolute inset-8 rounded-full border border-violetx/25 twin-spin-reverse" />
            <div className="text-center">
              <p className="metric-glow text-6xl font-semibold text-white md:text-7xl">{score}</p>
              <p className="mt-1 text-[10px] font-semibold uppercase text-emeraldx">{labels.optimizationScore}</p>
              <p className="mt-1 font-mono text-[9px] text-muted">/ 100</p>
            </div>
          </div>
          <div className="absolute left-3 top-5 rounded-sm border border-signal/15 bg-obsidian/65 px-3 py-2 backdrop-blur-md md:left-8">
            <p className="text-[9px] uppercase text-muted">{labels.biologicalAge}</p>
            <p className="mt-1 font-mono text-lg text-signal">{biologicalAge ?? "--"} <span className="text-[9px] text-muted">{labels.years}</span></p>
          </div>
          <div className="absolute bottom-5 right-3 max-w-[190px] rounded-sm border border-violetx/25 bg-obsidian/70 px-3 py-2 text-right backdrop-blur-md md:right-8">
            <p className="text-[9px] uppercase text-muted">{labels.longevity}</p>
            <p className="mt-1 text-sm font-semibold text-violet-200">{longevityProjection}</p>
            <p className="mt-1 font-mono text-[9px] text-muted">{longevityScore}/100</p>
          </div>
          <p className="absolute bottom-4 left-4 max-w-[180px] text-[9px] leading-4 text-muted md:left-8">{labels.directionalEstimate}</p>
        </div>

        <div className="order-3 grid grid-cols-2 gap-2 p-4 pt-0 lg:grid-cols-1 lg:content-center lg:gap-3 lg:p-6">
          <SignalTile signal={signals[2]} />
          <SignalTile signal={signals[3]} />
          <div className="twin-signal col-span-2 border-warningx/20 bg-warningx/[0.035] lg:col-span-1">
            <div className="flex items-center gap-2 text-warningx"><ShieldCheck className="h-4 w-4" /><span className="text-[9px] font-semibold uppercase">{labels.primaryConstraint}</span></div>
            <p className="mt-3 text-lg font-semibold text-white">{weakestPillar}</p>
            <p className="mt-3 text-[9px] font-semibold uppercase text-muted">{labels.nextUpgrade}</p>
            <p className="mt-1 text-xs leading-5 text-chrome">{nextUpgrade}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
