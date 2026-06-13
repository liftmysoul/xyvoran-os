import { cn } from "@/lib/format";

export function MetricRing({ value, label, size = "lg" }: { value: number; label: string; size?: "sm" | "lg" }) {
  const clamped = Math.max(0, Math.min(100, value));
  const dimension = size === "lg" ? "h-36 w-36" : "h-16 w-16";
  return (
    <div
      className={cn("relative grid shrink-0 place-items-center rounded-full", dimension)}
      style={{ background: `conic-gradient(#00F5D4 ${clamped * 3.6}deg, rgba(76,201,240,0.09) 0deg)` }}
      role="img"
      aria-label={`${label}: ${clamped}/100`}
    >
      <div className="absolute inset-[5px] rounded-full border border-white/[0.06] bg-obsidian" />
      <div className="relative z-10 text-center">
        <span className={cn("metric-glow block font-display font-semibold text-white", size === "lg" ? "text-4xl" : "text-lg")}>{clamped}</span>
        {size === "lg" && <span className="mt-1 block text-[10px] uppercase text-chrome">/ 100</span>}
      </div>
    </div>
  );
}
