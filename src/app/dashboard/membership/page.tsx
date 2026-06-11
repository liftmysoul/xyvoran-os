import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowRight, BadgeCheck, CalendarDays, CheckCircle2, CircleDashed, Globe2, ShieldCheck, UserRound } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { formatDate } from "@/lib/format";
import { getServerI18n } from "@/lib/i18n/server";
import { calculateProfileCompletion, membershipStatusTone } from "@/lib/membership";
import { createClient } from "@/lib/supabase-server";
import type { MemberConsent, Membership, OnboardingData, Profile } from "@/types/database";

export default async function MembershipPage() {
  const { copy, language } = await getServerI18n();
  const supabase = await createClient();
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) redirect("/auth/login");

  const [
    { data: profile, error: profileError },
    { data: membership, error: membershipError },
    { data: consent },
    { data: onboarding },
    { count: labCount },
    { count: protocolCount }
  ] = await Promise.all([
    supabase.from("profiles").select("*").eq("id", auth.user.id).maybeSingle<Profile>(),
    supabase.from("memberships").select("*").eq("user_id", auth.user.id).maybeSingle<Membership>(),
    supabase.from("member_consents").select("*").eq("user_id", auth.user.id).maybeSingle<MemberConsent>(),
    supabase.from("onboarding_data").select("*").eq("user_id", auth.user.id).maybeSingle<OnboardingData>(),
    supabase.from("lab_reports").select("id", { count: "exact", head: true }).eq("user_id", auth.user.id).eq("processing_status", "completed"),
    supabase.from("generated_protocols").select("id", { count: "exact", head: true }).eq("user_id", auth.user.id)
  ]);

  const completion = calculateProfileCompletion({ profile, onboarding, consent, hasLabData: Boolean(labCount), hasProtocols: Boolean(protocolCount) });
  const status = membership?.status ?? "pending";
  const statusLabel = copy.membership[status];
  const sectionLabels: Record<string, string> = {
    name: copy.membership.profileFoundation,
    phone: copy.onboarding.phone,
    dob: copy.onboarding.dob,
    address: copy.onboarding.address,
    healthMetrics: copy.membership.healthFoundation,
    labData: copy.membership.labFoundation,
    protocols: copy.membership.protocolFoundation
  };
  const nextIncomplete = completion.sections.find((section) => !section.complete);
  const nextHref = nextIncomplete?.key === "labData" ? "/dashboard/labs" : nextIncomplete?.key === "protocols" ? "/dashboard/protocols" : "/onboarding";
  const nextLabel = nextIncomplete?.key === "labData" ? copy.membership.addLabs : nextIncomplete?.key === "protocols" ? copy.membership.generateProtocol : copy.membership.updateProfile;
  const migrationMissing = Boolean(profileError || membershipError);

  return (
    <div className="space-y-6">
      <header>
        <p className="text-xs uppercase tracking-[0.28em] text-emeraldx">{copy.membership.eyebrow}</p>
        <h2 className="mt-2 text-3xl font-semibold text-white">{copy.membership.title}</h2>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-chrome">{copy.membership.description}</p>
      </header>

      {migrationMissing && <Card className="border-amber-300/30 bg-amber-300/10"><p className="text-sm text-amber-100">{copy.membership.architectureError}</p></Card>}

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Card className="min-h-36"><div className="flex items-center justify-between"><p className="text-xs uppercase tracking-[0.18em] text-chrome">{copy.membership.memberId}</p><BadgeCheck className="h-5 w-5 text-emeraldx" /></div><p className="mt-5 font-mono text-2xl font-semibold text-white">{profile?.member_id ?? "XYV------"}</p></Card>
        <Card className="min-h-36"><div className="flex items-center justify-between"><p className="text-xs uppercase tracking-[0.18em] text-chrome">{copy.membership.status}</p><ShieldCheck className="h-5 w-5 text-emeraldx" /></div><span className={`mt-5 inline-flex rounded-md border px-3 py-2 text-sm font-semibold ${membershipStatusTone(status)}`}>{statusLabel}</span></Card>
        <Card className="min-h-36"><div className="flex items-center justify-between"><p className="text-xs uppercase tracking-[0.18em] text-chrome">{copy.membership.joinDate}</p><CalendarDays className="h-5 w-5 text-emeraldx" /></div><p className="mt-5 text-lg font-semibold text-white">{formatDate(membership?.join_date ?? profile?.created_at)}</p></Card>
        <Card className="min-h-36"><div className="flex items-center justify-between"><p className="text-xs uppercase tracking-[0.18em] text-chrome">{copy.membership.language}</p><Globe2 className="h-5 w-5 text-emeraldx" /></div><p className="mt-5 text-lg font-semibold text-white">{language === "es" ? copy.language.spanish : copy.language.english}</p></Card>
      </section>

      <section className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
        <Card>
          <div className="flex flex-wrap items-end justify-between gap-3"><div><p className="text-xs uppercase tracking-[0.2em] text-emeraldx">{copy.membership.completion}</p><p className="mt-2 text-4xl font-semibold text-white">{completion.score}%</p></div><UserRound className="h-8 w-8 text-emeraldx" /></div>
          <div className="mt-5 h-3 overflow-hidden rounded-sm bg-white/10"><div className="h-full bg-emeraldx transition-[width]" style={{ width: `${completion.score}%` }} /></div>
          <div className="mt-5 grid gap-2 sm:grid-cols-2">
            {completion.sections.map((section) => <div key={section.key} className="flex min-h-12 items-center justify-between rounded-md border border-white/10 bg-white/5 px-3 text-sm"><span className="flex items-center gap-2 text-white">{section.complete ? <CheckCircle2 className="h-4 w-4 text-emeraldx" /> : <CircleDashed className="h-4 w-4 text-chrome" />}{sectionLabels[section.key]}</span><span className="text-chrome">{section.weight}%</span></div>)}
          </div>
        </Card>

        <div className="space-y-4">
          <Card>
            <p className="text-xs uppercase tracking-[0.2em] text-emeraldx">{copy.membership.consentStatus}</p>
            <p className="mt-3 text-sm leading-6 text-chrome">{consent ? copy.membership.consentComplete : copy.membership.consentMissing}</p>
            <div className="mt-4 flex items-center gap-2 text-sm text-white">{consent ? <CheckCircle2 className="h-4 w-4 text-emeraldx" /> : <CircleDashed className="h-4 w-4 text-amber-200" />}{consent?.consent_version ?? "2026-06"}</div>
          </Card>
          {nextIncomplete && <Card><p className="text-xs uppercase tracking-[0.2em] text-emeraldx">{copy.membership.nextStep}</p><p className="mt-3 text-white">{sectionLabels[nextIncomplete.key]}</p><Link href={nextHref} className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-emeraldx">{nextLabel}<ArrowRight className="h-4 w-4" /></Link></Card>}
        </div>
      </section>
    </div>
  );
}
