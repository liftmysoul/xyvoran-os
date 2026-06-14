"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Activity, BadgeCheck, Brain, ChevronRight, FlaskConical, LayoutDashboard, LogOut, Microscope, Settings, UserRound, WandSparkles } from "lucide-react";
import { createClient } from "@/lib/supabase-browser";
import { cn } from "@/lib/format";
import { LanguageSwitcher } from "@/components/i18n/LanguageSwitcher";
import { useI18n } from "@/components/i18n/LanguageProvider";
import { BrandMark } from "@/components/brand/BrandMark";

export function DashboardShell({ children, email }: { children: React.ReactNode; email?: string | null }) {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();
  const { copy } = useI18n();
  const nav = [
    { href: "/dashboard", label: copy.nav.dashboard, icon: LayoutDashboard },
    { href: "/dashboard/biomarkers", label: copy.nav.biomarkers, icon: FlaskConical },
    { href: "/dashboard/labs", label: copy.nav.labs, icon: Microscope },
    { href: "/dashboard/coach", label: copy.nav.coach, icon: Brain },
    { href: "/dashboard/protocols", label: copy.nav.protocols, icon: WandSparkles },
    { href: "/dashboard/membership", label: copy.nav.membership, icon: BadgeCheck },
    { href: "/dashboard/profile", label: copy.nav.profile, icon: UserRound },
    { href: "/dashboard/settings", label: copy.nav.settings, icon: Settings }
  ];

  async function logout() {
    await supabase.auth.signOut();
    router.replace("/");
    router.refresh();
  }

  return (
    <div className="min-h-screen bg-obsidian text-chrome">
      <aside className="fixed inset-y-0 left-0 z-20 hidden w-72 border-r border-signal/10 bg-graphite/90 p-5 backdrop-blur-xl xl:block">
        <Link href="/" className="text-white"><BrandMark /></Link>
        <div className="mt-8 flex items-center justify-between border-y border-signal/10 py-3 text-[10px] uppercase text-muted"><span>{copy.nav.layer}</span><span className="flex items-center gap-2 text-successx"><span className="status-dot" />ONLINE</span></div>
        <nav className="mt-6 space-y-1">
          {nav.map((item) => {
            const active = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "relative flex items-center justify-between overflow-hidden rounded-md border px-3 py-3 text-sm transition",
                  active ? "border-emeraldx/30 bg-emeraldx/[0.08] text-white" : "border-transparent text-chrome hover:border-signal/10 hover:bg-white/[0.035] hover:text-white"
                )}
              >
                <span className="flex items-center gap-3">
                  <Icon className={cn("h-4 w-4", active && "text-emeraldx")} />
                  {item.label}
                </span>
                {active && <><span className="absolute inset-y-2 left-0 w-px bg-emeraldx" /><ChevronRight className="h-4 w-4 text-emeraldx" /></>}
              </Link>
            );
          })}
        </nav>
      </aside>
      <main className="xl:pl-72">
        <header className="sticky top-0 z-10 border-b border-signal/10 bg-obsidian/90 px-4 py-4 backdrop-blur-xl md:px-8">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="system-label flex items-center gap-2"><span className="status-dot" />{copy.nav.system}</p>
              <h1 className="mt-1 text-xl font-semibold text-white md:text-2xl">{copy.nav.center}</h1>
            </div>
            <div className="flex items-center gap-3">
              <div className="hidden items-center gap-2 rounded-md border border-signal/10 bg-panel/70 px-3 py-2 text-sm text-white md:flex">
                <Activity className="h-4 w-4 text-emeraldx" />
                {email ?? copy.nav.athlete}
              </div>
              <LanguageSwitcher compact />
              <button
                onClick={logout}
                className="grid h-10 w-10 place-items-center rounded-md border border-signal/10 bg-panel/70 text-chrome transition hover:border-dangerx/30 hover:text-dangerx"
                aria-label={copy.nav.logout}
                title={copy.nav.logout}
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          </div>
          <nav className="mobile-command-dock -mx-4 mt-4 flex gap-2 overflow-x-auto px-4 pb-1 xl:hidden">
            {nav.map((item) => {
              const active = pathname === item.href;
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-label={item.label}
                  className={cn(
                    "mobile-command-item relative flex h-[62px] w-[78px] shrink-0 flex-col items-center justify-center gap-1.5 overflow-hidden rounded-md border px-1.5 text-center text-[9px] font-semibold leading-3 transition",
                    active ? "border-emeraldx/35 bg-emeraldx/[0.09] text-white shadow-[inset_0_0_22px_rgba(0,245,212,0.06)]" : "border-signal/10 bg-panel/60 text-chrome"
                  )}
                >
                  {active && <span className="absolute inset-x-3 top-0 h-px bg-emeraldx shadow-[0_0_10px_rgba(0,245,212,0.8)]" />}
                  <Icon className={cn("h-4 w-4 shrink-0", active ? "text-emeraldx" : "text-signal")} />
                  <span className="line-clamp-2">{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </header>
        <div className="mx-auto max-w-[1600px] p-4 md:p-8">{children}</div>
      </main>
    </div>
  );
}
