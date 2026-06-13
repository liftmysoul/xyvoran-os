import Image from "next/image";
import { Activity, Binary, Fingerprint, ShieldCheck } from "lucide-react";
import { BrandMark } from "@/components/brand/BrandMark";
import { LanguageSwitcher } from "@/components/i18n/LanguageSwitcher";

export function SecureAccessFrame({
  eyebrow,
  title,
  description,
  children,
  statusLabel,
  signalLabels
}: {
  eyebrow: string;
  title: string;
  description: string;
  children: React.ReactNode;
  statusLabel: string;
  signalLabels: [string, string, string];
}) {
  return (
    <main className="relative min-h-[calc(100vh-57px)] overflow-hidden bg-obsidian text-white">
      <div className="absolute inset-0 bg-bio-grid bg-[length:64px_64px] opacity-35" />
      <div className="relative mx-auto grid min-h-[calc(100vh-57px)] max-w-[1600px] lg:grid-cols-[minmax(440px,0.82fr)_1.18fr]">
        <section className="relative z-10 flex flex-col border-r border-signal/10 bg-obsidian/96 px-5 py-6 sm:px-10 lg:px-14 lg:py-10">
          <div className="flex items-center justify-between gap-4">
            <BrandMark />
            <LanguageSwitcher compact />
          </div>
          <div className="my-auto max-w-xl py-14">
            <p className="system-label flex items-center gap-2"><span className="status-dot" />{eyebrow}</p>
            <h1 className="mt-5 text-4xl font-semibold leading-tight text-white sm:text-5xl">{title}</h1>
            <p className="mt-4 max-w-lg text-sm leading-7 text-chrome">{description}</p>
            <div className="mt-8 border-y border-signal/10 py-6">{children}</div>
          </div>
          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-signal/10 pt-4 text-[10px] uppercase text-muted">
            <span className="flex items-center gap-2"><ShieldCheck className="h-3.5 w-3.5 text-emeraldx" />{statusLabel}</span>
            <span className="font-mono">XYV // ACCESS NODE 01</span>
          </div>
        </section>

        <section className="relative hidden min-h-[calc(100vh-57px)] overflow-hidden lg:block">
          <Image src="/images/xyvoran-digital-twin-hero.png" alt="" fill priority sizes="60vw" className="object-cover object-center" />
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(5,8,22,0.62),rgba(5,8,22,0.05)_45%,rgba(5,8,22,0.18))]" />
          <div className="absolute inset-0 scanline opacity-50" />
          <div className="absolute left-8 top-8 border-l border-emeraldx/50 pl-4">
            <p className="system-label">DIGITAL TWIN INTERFACE</p>
            <p className="mt-2 max-w-xs text-xs leading-5 text-chrome">{signalLabels[0]}</p>
          </div>
          <div className="absolute bottom-8 left-8 right-8 grid grid-cols-3 border border-signal/15 bg-obsidian/68 backdrop-blur-xl">
            {[
              [Fingerprint, signalLabels[0]],
              [Activity, signalLabels[1]],
              [Binary, signalLabels[2]]
            ].map(([Icon, label]) => {
              const SignalIcon = Icon as typeof Fingerprint;
              return <div key={String(label)} className="flex min-h-24 flex-col justify-between border-r border-signal/10 p-4 last:border-r-0"><SignalIcon className="h-4 w-4 text-emeraldx" /><span className="text-[10px] uppercase leading-4 text-chrome">{String(label)}</span></div>;
            })}
          </div>
        </section>
      </div>
    </main>
  );
}
