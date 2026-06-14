import { cn } from "@/lib/format";

export type SystemStatusTone = "active" | "intelligence" | "warning" | "critical" | "muted";

const toneClasses: Record<SystemStatusTone, string> = {
  active: "border-emeraldx/25 bg-emeraldx/[0.08] text-emeraldx",
  intelligence: "border-violetx/30 bg-violetx/[0.09] text-violet-200",
  warning: "border-warningx/30 bg-warningx/[0.08] text-amber-200",
  critical: "border-dangerx/30 bg-dangerx/[0.08] text-rose-200",
  muted: "border-white/10 bg-white/[0.035] text-muted"
};

export function SystemStatus({ label, tone = "active", className }: { label: string; tone?: SystemStatusTone; className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-2 rounded-sm border px-2 py-1 font-mono text-[9px] font-semibold uppercase", toneClasses[tone], className)}>
      <span className={cn("h-1.5 w-1.5 rounded-full", tone === "active" && "bg-successx shadow-[0_0_10px_rgba(0,230,118,0.8)]", tone === "intelligence" && "bg-violet-300 shadow-[0_0_10px_rgba(124,58,237,0.8)]", tone === "warning" && "bg-warningx shadow-[0_0_10px_rgba(255,183,3,0.65)]", tone === "critical" && "bg-dangerx", tone === "muted" && "bg-muted")} />
      {label}
    </span>
  );
}
