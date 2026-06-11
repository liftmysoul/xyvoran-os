import Link from "next/link";
import { ArrowRight, Brain, Dna, FlaskConical, HeartPulse, Moon, Sparkles } from "lucide-react";

const pillars = [
  ["Metabolic", "Glucose stability, fasting rhythm, body composition signals."],
  ["Recovery", "Sleep quality, HRV, nervous system readiness, stress load."],
  ["Longevity", "Inflammation, nutrient sufficiency, hormesis, zone-2 capacity."],
  ["Cognitive", "Focus, energy, REM quality, stimulant timing, mental resilience."],
  ["Beauty", "Sleep depth, hydration, inflammation, skin-supportive routines."]
];

export default function LandingPage() {
  return (
    <main className="min-h-screen overflow-hidden bg-obsidian text-white">
      <section className="relative min-h-[92vh] border-b border-white/10 bg-bio-grid bg-[length:42px_42px]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_35%,rgba(22,242,164,0.16),transparent_36rem)]" />
        <nav className="relative z-10 mx-auto flex max-w-7xl items-center justify-between px-5 py-6">
          <div className="flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-md border border-emeraldx/40 bg-emeraldx/10">
              <Dna className="h-5 w-5 text-emeraldx" />
            </span>
            <span className="text-lg font-bold tracking-wide">XYVORAN OS</span>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/auth/login" className="hidden rounded-md px-4 py-2 text-sm text-chrome hover:text-white sm:block">
              Login
            </Link>
            <Link href="/auth/signup" className="rounded-md bg-emeraldx px-4 py-2 text-sm font-semibold text-obsidian">
              Start Optimization
            </Link>
          </div>
        </nav>
        <div className="relative z-10 mx-auto grid max-w-7xl gap-10 px-5 pb-20 pt-14 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <div>
            <p className="mb-5 text-sm uppercase tracking-[0.32em] text-emeraldx">Your Human Optimization Operating System.</p>
            <h1 className="max-w-4xl text-5xl font-semibold leading-tight md:text-7xl">
              Turn your biology into a measurable optimization protocol.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-chrome">
              XYVORAN OS unifies lifestyle data, biomarkers, pillar scores, and an AI Biohacking Coach into one premium command center for non-medical wellness guidance.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/auth/signup" className="inline-flex items-center gap-2 rounded-md bg-emeraldx px-5 py-3 font-semibold text-obsidian">
                Start Optimization <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="/auth/login" className="rounded-md border border-white/15 px-5 py-3 font-semibold text-white hover:bg-white/5">
                Enter Dashboard
              </Link>
            </div>
          </div>
          <div className="glass rounded-lg p-5">
            <div className="rounded-lg border border-emeraldx/30 bg-black/50 p-5">
              <div className="mb-5 flex items-center justify-between">
                <span className="text-sm uppercase tracking-[0.25em] text-emeraldx">Live Pillar Matrix</span>
                <Sparkles className="h-5 w-5 text-emeraldx" />
              </div>
              <div className="space-y-4">
                {pillars.map(([name], index) => (
                  <div key={name}>
                    <div className="mb-2 flex justify-between text-sm">
                      <span>{name}</span>
                      <span className="text-emeraldx">{84 - index * 6}</span>
                    </div>
                    <div className="h-2 rounded-full bg-white/10">
                      <div className="h-2 rounded-full bg-emeraldx" style={{ width: `${84 - index * 6}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-20">
        <h2 className="text-3xl font-semibold">Five Optimization Pillars</h2>
        <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-5">
          {pillars.map(([name, text]) => (
            <div key={name} className="glass rounded-lg p-5">
              <h3 className="font-semibold text-emeraldx">{name}</h3>
              <p className="mt-3 text-sm leading-6 text-chrome">{text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="border-y border-white/10 bg-white/[0.03]">
        <div className="mx-auto grid max-w-7xl gap-8 px-5 py-20 md:grid-cols-3">
          {[
            ["01", "Create profile", "Add your goals, lifestyle baselines, and optimization preferences."],
            ["02", "Track signals", "Log biomarkers and sleep metrics to establish a feedback loop."],
            ["03", "Generate action", "Use pillar scores and the AI Coach to create practical protocols."]
          ].map(([step, title, text]) => (
            <div key={step} className="border-l border-emeraldx/50 pl-5">
              <p className="text-sm text-emeraldx">{step}</p>
              <h3 className="mt-2 text-xl font-semibold">{title}</h3>
              <p className="mt-3 text-chrome">{text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-10 px-5 py-20 lg:grid-cols-2">
        <div>
          <Brain className="h-10 w-10 text-emeraldx" />
          <h2 className="mt-5 text-3xl font-semibold">AI Biohacking Coach</h2>
          <p className="mt-4 text-lg leading-8 text-chrome">
            Ask questions about sleep, HRV, fasting, recovery, stress resilience, cognitive performance, and longevity. The coach uses your data while staying inside clear educational wellness boundaries.
          </p>
        </div>
        <div className="glass rounded-lg p-5">
          <div className="space-y-3 text-sm">
            <p className="rounded-md bg-white/8 p-4">What should I focus on this week for more energy?</p>
            <p className="rounded-md bg-emeraldx/12 p-4 text-signal">
              Based on your sleep score and stress load, start with a fixed wake time, morning light, protein-forward breakfast, and two low-intensity movement blocks.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 pb-20">
        <div className="glass flex flex-col gap-6 rounded-lg p-8 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.25em] text-emeraldx">Membership Teaser</p>
            <h2 className="mt-3 text-3xl font-semibold">Private labs, advanced protocols, expert reviews.</h2>
          </div>
          <Link href="/auth/signup" className="inline-flex items-center justify-center gap-2 rounded-md bg-emeraldx px-5 py-3 font-semibold text-obsidian">
            Start Optimization <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </main>
  );
}
