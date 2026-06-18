import type { LucideIcon } from "lucide-react";

export function SystemHeader({ eyebrow, title, description, icon: Icon }: { eyebrow: string; title: string; description?: string; icon?: LucideIcon }) {
  return (
    <header className="flex min-w-0 flex-wrap items-start justify-between gap-4 border-b border-signal/10 pb-5 sm:gap-5">
      <div className="min-w-0 flex-1">
        <p className="system-label flex items-center gap-2"><span className="status-dot" />{eyebrow}</p>
        <h2 className="mt-3 break-words text-2xl font-semibold leading-tight text-white sm:text-3xl">{title}</h2>
        {description && <p className="mt-2 max-w-3xl text-sm leading-6 text-chrome">{description}</p>}
      </div>
      {Icon && <span className="hidden h-12 w-12 shrink-0 place-items-center rounded-md border border-signal/20 bg-signal/[0.06] sm:grid"><Icon className="h-5 w-5 text-signal" /></span>}
    </header>
  );
}
