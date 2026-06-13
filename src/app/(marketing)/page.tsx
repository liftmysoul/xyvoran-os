import Image from "next/image";
import Link from "next/link";
import { ArrowRight, BrainCircuit, ChartNoAxesCombined, Dna, Fingerprint, Gauge, Orbit, ScanLine, ShieldCheck, Sparkles } from "lucide-react";
import { BrandMark } from "@/components/brand/BrandMark";
import { LanguageSwitcher } from "@/components/i18n/LanguageSwitcher";
import { getServerI18n } from "@/lib/i18n/server";

const pillarIcons = [Gauge, Orbit, Dna, BrainCircuit, Sparkles];

export default async function LandingPage() {
  const { copy } = await getServerI18n();
  const pillarCopy = [
    [copy.pillars.Metabolic, copy.landing.metabolicDescription],
    [copy.pillars.Recovery, copy.landing.recoveryDescription],
    [copy.pillars.Longevity, copy.landing.longevityDescription],
    [copy.pillars.Cognitive, copy.landing.cognitiveDescription],
    [copy.pillars.Beauty, copy.landing.beautyDescription]
  ];

  return (
    <main className="min-h-screen overflow-hidden bg-obsidian text-white">
      <section className="relative min-h-[88vh] overflow-hidden border-b border-signal/10">
        <Image
          src="/images/xyvoran-digital-twin-hero.png"
          alt={copy.landing.heroAlt}
          fill
          priority
          sizes="100vw"
          className="object-cover object-[66%_center]"
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,#050816_0%,rgba(5,8,22,0.96)_35%,rgba(5,8,22,0.38)_67%,rgba(5,8,22,0.18)_100%)]" />
        <div className="absolute inset-0 scanline opacity-40" />

        <nav className="relative z-10 mx-auto flex max-w-7xl items-center justify-between px-5 py-6">
          <BrandMark responsiveCompact />
          <div className="flex items-center gap-2 sm:gap-3">
            <LanguageSwitcher compact />
            <Link href="/auth/login" className="hidden rounded-md px-4 py-2 text-sm text-chrome transition hover:text-white sm:block">
              {copy.landing.login}
            </Link>
            <Link href="/auth/signup" className="whitespace-nowrap rounded-md border border-emeraldx bg-emeraldx px-3 py-2 text-sm font-semibold text-obsidian shadow-[0_0_24px_rgba(0,245,212,0.14)] transition hover:border-signal hover:bg-signal sm:px-4">
              {copy.landing.start}
            </Link>
          </div>
        </nav>

        <div className="relative z-10 mx-auto flex min-h-[calc(88vh-88px)] max-w-7xl flex-col justify-center px-5 pb-24 pt-10 md:pb-28 md:pt-14">
          <div className="max-w-3xl">
            <p className="system-label flex items-center gap-2"><span className="status-dot" />{copy.landing.platform}</p>
            <h1 className="mt-6 max-w-3xl text-4xl font-semibold leading-[1.05] text-white md:text-7xl md:leading-[1.02]">
              {copy.landing.title}
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-chrome md:mt-6 md:text-xl md:leading-8">
              {copy.landing.description}
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <Link href="/auth/signup" className="inline-flex min-h-12 items-center gap-2 rounded-md border border-emeraldx bg-emeraldx px-5 font-semibold text-obsidian shadow-[0_0_28px_rgba(0,245,212,0.16)] transition hover:bg-signal">
                {copy.landing.start} <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="/auth/login" className="inline-flex min-h-12 items-center rounded-md border border-white/15 bg-obsidian/45 px-5 font-semibold text-white backdrop-blur transition hover:border-signal/40 hover:bg-graphite/70">
                {copy.landing.enter}
              </Link>
            </div>
          </div>
        </div>

        <div className="absolute inset-x-0 bottom-0 z-10 border-t border-signal/10 bg-obsidian/70 backdrop-blur-xl">
          <div className="mx-auto grid max-w-7xl grid-cols-2 gap-px px-5 sm:grid-cols-4">
            {[
              [Fingerprint, copy.landing.signalBiomarkers],
              [BrainCircuit, copy.landing.signalAi],
              [ChartNoAxesCombined, copy.landing.signalProtocols],
              [ShieldCheck, copy.landing.signalPrivate]
            ].map(([Icon, label]) => {
              const SignalIcon = Icon as typeof Fingerprint;
              return <div key={String(label)} className="flex min-h-16 items-center gap-3 border-x border-white/[0.04] px-3 text-xs font-semibold text-chrome sm:px-5"><SignalIcon className="h-4 w-4 text-emeraldx" />{String(label)}</div>;
            })}
          </div>
        </div>
      </section>

      <section className="border-b border-signal/10 bg-graphite/70">
        <div className="mx-auto max-w-7xl px-5 py-20">
          <div className="max-w-3xl">
            <p className="system-label">{copy.landing.intelligenceLayer}</p>
            <h2 className="mt-4 text-3xl font-semibold md:text-4xl">{copy.landing.pillarsTitle}</h2>
            <p className="mt-4 text-lg leading-8 text-chrome">{copy.landing.pillarsDescription}</p>
          </div>
          <div className="mt-10 grid border-y border-signal/10 md:grid-cols-2 xl:grid-cols-5">
            {pillarCopy.map(([name, text], index) => {
              const Icon = pillarIcons[index];
              return (
                <article key={name} className="min-h-56 border-b border-signal/10 p-5 md:border-r xl:border-b-0">
                  <div className="flex items-center justify-between"><Icon className="h-5 w-5 text-emeraldx" /><span className="font-mono text-xs text-muted">0{index + 1}</span></div>
                  <h3 className="mt-8 text-lg font-semibold text-white">{name}</h3>
                  <p className="mt-3 text-sm leading-6 text-chrome">{text}</p>
                  <div className="mt-6 data-track"><div className="data-fill" style={{ width: `${88 - index * 5}%` }} /></div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-20">
        <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
          <div>
            <ScanLine className="h-9 w-9 text-signal" />
            <p className="system-label mt-6">{copy.landing.operatingSequence}</p>
            <h2 className="mt-4 text-3xl font-semibold md:text-4xl">{copy.landing.howTitle}</h2>
            <p className="mt-4 text-lg leading-8 text-chrome">{copy.landing.howDescription}</p>
          </div>
          <div className="border-t border-signal/15">
            {[
              ["01", copy.landing.stepProfile, copy.landing.stepProfileDescription],
              ["02", copy.landing.stepSignals, copy.landing.stepSignalsDescription],
              ["03", copy.landing.stepAction, copy.landing.stepActionDescription]
            ].map(([step, title, text]) => (
              <div key={step} className="grid gap-4 border-b border-signal/10 py-7 sm:grid-cols-[56px_180px_1fr] sm:items-start">
                <span className="font-mono text-xs text-emeraldx">{step}</span>
                <h3 className="font-semibold text-white">{title}</h3>
                <p className="text-sm leading-6 text-chrome">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-signal/10 bg-panel/55">
        <div className="mx-auto grid max-w-7xl gap-10 px-5 py-20 lg:grid-cols-2 lg:items-center">
          <div>
            <BrainCircuit className="h-10 w-10 text-emeraldx" />
            <p className="system-label mt-6">{copy.landing.coachSystem}</p>
            <h2 className="mt-4 text-3xl font-semibold md:text-4xl">{copy.landing.coach}</h2>
            <p className="mt-4 text-lg leading-8 text-chrome">{copy.landing.coachDescription}</p>
          </div>
          <div className="command-surface rounded-md p-5">
            <div className="flex items-center justify-between border-b border-signal/10 pb-4"><span className="system-label">XYVORAN INTELLIGENCE</span><span className="flex items-center gap-2 text-xs text-successx"><span className="status-dot" />ONLINE</span></div>
            <p className="mt-5 border-l-2 border-chrome/20 pl-4 text-sm text-chrome">{copy.landing.question}</p>
            <p className="mt-5 border-l-2 border-emeraldx pl-4 text-sm leading-6 text-white">{copy.landing.answer}</p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-20">
        <div className="flex flex-col gap-8 border-y border-emeraldx/25 py-10 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="system-label">{copy.landing.membership}</p>
            <h2 className="mt-3 max-w-3xl text-3xl font-semibold">{copy.landing.membershipTitle}</h2>
          </div>
          <Link href="/auth/signup" className="inline-flex min-h-12 shrink-0 items-center justify-center gap-2 rounded-md bg-emeraldx px-5 font-semibold text-obsidian">
            {copy.landing.start} <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </main>
  );
}
