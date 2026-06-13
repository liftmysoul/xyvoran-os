import type { LucideIcon } from "lucide-react";

export function SystemHeader({ eyebrow, title, description, icon: Icon }: { eyebrow: string; title: string; description?: string; icon?: LucideIcon }) {
  return (
    <header className="flex flex-wrap items-start justify-between gap-5 border-b border-signal/10 pb-5">
      <div>
        <p className="system-label flex items-center gap-2"><span className="status-dot" />{eyebrow}</p>
        <h2 className="mt-3 text-3xl font-semibold text-white">{title}</h2>
        {description && <p className="mt-2 max-w-3xl text-sm leading-6 text-chrome">{description}</p>}
      </div>
      {Icon && <span className="grid h-12 w-12 place-items-center rounded-md border border-signal/20 bg-signal/[0.06]"><Icon className="h-5 w-5 text-signal" /></span>}
    </header>
  );
}
