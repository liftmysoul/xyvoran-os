import { Dna } from "lucide-react";
import { cn } from "@/lib/format";

export function BrandMark({ compact = false, responsiveCompact = false, className }: { compact?: boolean; responsiveCompact?: boolean; className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-3", className)}>
      <span className="relative grid h-10 w-10 shrink-0 place-items-center overflow-hidden rounded-md border border-emeraldx/35 bg-emeraldx/[0.07] shadow-[inset_0_0_20px_rgba(0,245,212,0.06),0_0_20px_rgba(0,245,212,0.06)]">
        <span className="absolute inset-x-1 top-1 h-px bg-signal/40" />
        <Dna className="h-5 w-5 text-emeraldx" aria-hidden />
      </span>
      {!compact && (
        <span className={responsiveCompact ? "hidden sm:block" : undefined}>
          <span className="font-display block text-base font-bold text-white">XYVORAN OS</span>
          <span className="system-label mt-1 block text-[9px] text-chrome">Human Optimization Intelligence</span>
        </span>
      )}
    </span>
  );
}
