import Image from "next/image";
import { Activity, BrainCircuit, Dna, RadioTower, ScanSearch, ShieldCheck, Sparkles, WandSparkles } from "lucide-react";
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

function OrbitModule({ signal, className }: { signal: TwinSignal; className: string }) {
  const Icon = signal.icon;
  return (
    <div className={`bio-hud-module ${className} group`}>
      <div className="flex items-center justify-between gap-3">
        <Icon className="h-4 w-4 text-signal transition group-hover:text-emeraldx" />
        <SystemStatus label={signal.status} tone={signal.tone} />
      </div>
      <p className="mt-4 text-[10px] font-semibold uppercase text-muted">{signal.label}</p>
      <p className="mt-1 truncate text-sm font-semibold text-white">{signal.value}</p>
    </div>
  );
}

function MetricModule({ className, icon: Icon, label, value, detail, meter }: { className: string; icon: typeof Activity; label: string; value: string; detail?: string; meter?: number }) {
  return (
    <div className={`bio-hud-module ${className}`}>
      <div className="flex items-center justify-between gap-3">
        <Icon className="h-4 w-4 text-signal" />
        {typeof meter === "number" ? <span className="font-mono text-[10px] text-emeraldx">{meter}/100</span> : null}
      </div>
      <p className="mt-4 text-[10px] font-semibold uppercase text-muted">{label}</p>
      <p className="mt-1 text-sm font-semibold text-white">{value}</p>
      {detail ? <p className="mt-1 text-[10px] text-muted">{detail}</p> : null}
      {typeof meter === "number" ? <span className="bio-hud-meter"><span style={{ width: `${meter}%` }} /></span> : null}
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
    <section className="health-twin-shell health-twin-avatar-shell scanline">
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

      <div className="relative z-10 min-h-[760px] overflow-hidden px-4 py-5 md:min-h-[820px] md:px-6 lg:min-h-[720px]">
        <div className="bio-avatar-stage">
          <div className="bio-stage-grid" aria-hidden />
          <div className="bio-dna-rail bio-dna-rail--left" aria-hidden />
          <div className="bio-dna-rail bio-dna-rail--right" aria-hidden />
          <div className="bio-particle-field" aria-hidden />
          <div className="bio-avatar-glow" aria-hidden />
          <div className="bio-neural-field" aria-hidden />
          <svg className="bio-ecg-pulse" viewBox="0 0 260 56" aria-hidden>
            <polyline points="0,31 42,31 51,17 61,42 72,9 88,31 126,31 138,24 148,35 160,31 260,31" />
          </svg>

          <Image
            src="/images/xyvoran-health-twin-avatar.jpg"
            alt=""
            fill
            priority
            sizes="(max-width: 768px) 94vw, (max-width: 1280px) 58vw, 760px"
            className="bio-avatar-image"
          />
          <div className="bio-avatar-spectrum" aria-hidden />
          <div className="bio-avatar-edge-grid" aria-hidden />

          <div className="bio-scanline bio-scanline--one" aria-hidden />
          <div className="bio-scanline bio-scanline--two" aria-hidden />
          <span className="bio-connector bio-connector--age" aria-hidden />
          <span className="bio-connector bio-connector--score" aria-hidden />
          <span className="bio-connector bio-connector--recovery" aria-hidden />
          <span className="bio-connector bio-connector--biomarkers" aria-hidden />
          <span className="bio-connector bio-connector--labs" aria-hidden />
          <span className="bio-connector bio-connector--core" aria-hidden />
          <span className="bio-connector bio-connector--protocol" aria-hidden />
          <span className="bio-connector bio-connector--constraint" aria-hidden />

          <div className="bio-score-core" aria-label={`${labels.optimizationScore}: ${score}/100`}>
            <div className="bio-score-ring twin-spin" />
            <div className="bio-score-ring bio-score-ring--inner twin-spin-reverse" />
            <p className="metric-glow text-5xl font-semibold text-white md:text-6xl">{score}</p>
            <p className="mt-1 text-[9px] font-semibold uppercase text-emeraldx">{labels.optimizationScore}</p>
            <p className="mt-1 font-mono text-[9px] text-muted">/ 100</p>
          </div>

          <span className="bio-node bio-node--head" aria-hidden><Sparkles className="h-3 w-3" /></span>
          <span className="bio-node bio-node--heart" aria-hidden><Activity className="h-3 w-3" /></span>
          <span className="bio-node bio-node--dna" aria-hidden><Dna className="h-3 w-3" /></span>
          <span className="bio-node bio-node--labs" aria-hidden><ScanSearch className="h-3 w-3" /></span>

          <MetricModule className="bio-module--age" icon={Sparkles} label={labels.biologicalAge} value={`${biologicalAge ?? "--"} ${labels.years}`} />
          <MetricModule className="bio-module--recovery" icon={Activity} label={labels.recovery} value={recoveryStatus} meter={recoveryScore} />
          <OrbitModule signal={signals[0]} className="bio-module--biomarkers" />
          <OrbitModule signal={signals[2]} className="bio-module--labs" />
          <OrbitModule signal={signals[1]} className="bio-module--core" />
          <OrbitModule signal={signals[3]} className="bio-module--protocol" />

          <div className="bio-upgrade-console">
            <div className="flex items-center gap-2 text-warningx"><ShieldCheck className="h-4 w-4" /><span className="text-[9px] font-semibold uppercase">{labels.nextUpgrade}</span></div>
            <p className="mt-2 text-xs leading-5 text-chrome">{nextUpgrade}</p>
          </div>

          <div className="bio-hud-module bio-module--constraint">
            <div className="flex items-center justify-center gap-2 text-warningx"><ShieldCheck className="h-4 w-4" /><span className="text-[9px] font-semibold uppercase">{labels.primaryConstraint}</span></div>
            <p className="mt-2 text-center text-lg font-semibold text-white">{weakestPillar}</p>
            <p className="mt-1 text-center text-[10px] text-muted">{labels.longevity}: {longevityProjection} | {longevityScore}/100</p>
          </div>
        </div>

        <p className="relative z-10 mt-3 max-w-xl text-[9px] leading-4 text-muted">{labels.directionalEstimate}</p>
      </div>
    </section>
  );
}
