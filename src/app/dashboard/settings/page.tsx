import Link from "next/link";
import { Card } from "@/components/ui/Card";

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <Card>
        <h2 className="text-xl font-semibold text-white">Settings</h2>
        <p className="mt-3 text-chrome">MVP configuration is managed through Supabase Auth, environment variables, and Row Level Security.</p>
      </Card>
      <Card>
        <h3 className="font-semibold text-white">Medical Safety Boundary</h3>
        <p className="mt-3 text-sm leading-6 text-chrome">
          XYVORAN OS provides educational wellness guidance only. It does not diagnose, prescribe, or replace licensed medical care.
        </p>
        <Link href="/onboarding" className="mt-5 inline-block rounded-md border border-white/15 px-4 py-2 text-sm text-white hover:bg-white/5">
          Update Onboarding
        </Link>
      </Card>
    </div>
  );
}
