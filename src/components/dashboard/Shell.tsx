"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Activity, BadgeCheck, Brain, ChevronRight, Dna, FlaskConical, LayoutDashboard, LogOut, Microscope, Settings, UserRound, WandSparkles } from "lucide-react";
import { createClient } from "@/lib/supabase-browser";
import { cn } from "@/lib/format";
import { LanguageSwitcher } from "@/components/i18n/LanguageSwitcher";
import { useI18n } from "@/components/i18n/LanguageProvider";

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
      <aside className="fixed inset-y-0 left-0 z-20 hidden w-72 border-r border-white/10 bg-black/50 p-5 backdrop-blur xl:block">
        <Link href="/" className="flex items-center gap-3 text-white">
          <span className="grid h-10 w-10 place-items-center rounded-md border border-emeraldx/40 bg-emeraldx/10">
            <Dna className="h-5 w-5 text-emeraldx" />
          </span>
          <span>
            <span className="block text-lg font-bold tracking-wide">XYVORAN OS</span>
            <span className="text-xs uppercase text-emeraldx/80">{copy.nav.layer}</span>
          </span>
        </Link>
        <nav className="mt-10 space-y-2">
          {nav.map((item) => {
            const active = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center justify-between rounded-md px-3 py-3 text-sm transition",
                  active ? "bg-emeraldx text-obsidian" : "text-chrome hover:bg-white/7 hover:text-white"
                )}
              >
                <span className="flex items-center gap-3">
                  <Icon className="h-4 w-4" />
                  {item.label}
                </span>
                {active && <ChevronRight className="h-4 w-4" />}
              </Link>
            );
          })}
        </nav>
      </aside>
      <main className="xl:pl-72">
        <header className="sticky top-0 z-10 border-b border-white/10 bg-obsidian/86 px-4 py-4 backdrop-blur md:px-8">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs uppercase tracking-[0.28em] text-emeraldx/80">{copy.nav.system}</p>
              <h1 className="text-xl font-semibold text-white md:text-2xl">{copy.nav.center}</h1>
            </div>
            <div className="flex items-center gap-3">
              <div className="hidden items-center gap-2 rounded-md border border-white/10 bg-white/5 px-3 py-2 text-sm text-white md:flex">
                <Activity className="h-4 w-4 text-emeraldx" />
                {email ?? copy.nav.athlete}
              </div>
              <LanguageSwitcher compact />
              <button
                onClick={logout}
                className="grid h-10 w-10 place-items-center rounded-md border border-white/10 bg-white/5 text-chrome hover:text-white"
                aria-label={copy.nav.logout}
                title={copy.nav.logout}
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          </div>
          <nav className="mt-4 flex gap-2 overflow-x-auto xl:hidden">
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "shrink-0 rounded-md px-3 py-2 text-sm",
                  pathname === item.href ? "bg-emeraldx text-obsidian" : "bg-white/5 text-chrome"
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </header>
        <div className="p-4 md:p-8">{children}</div>
      </main>
    </div>
  );
}
