import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { LanguageSwitcher } from "@/components/i18n/LanguageSwitcher";
import { getServerI18n } from "@/lib/i18n/server";

export default async function SettingsPage() {
  const { copy } = await getServerI18n();
  return (
    <div className="space-y-6">
      <Card>
        <h2 className="text-xl font-semibold text-white">{copy.settings.title}</h2>
        <p className="mt-3 text-chrome">{copy.settings.description}</p>
      </Card>
      <Card>
        <h3 className="font-semibold text-white">{copy.settings.language}</h3>
        <p className="mb-4 mt-2 text-sm text-chrome">{copy.settings.languageHelp}</p>
        <LanguageSwitcher />
      </Card>
      <Card>
        <h3 className="font-semibold text-white">{copy.settings.safetyTitle}</h3>
        <p className="mt-3 text-sm leading-6 text-chrome">
          {copy.settings.safety}
        </p>
        <Link href="/onboarding" className="mt-5 inline-block rounded-md border border-white/15 px-4 py-2 text-sm text-white hover:bg-white/5">
          {copy.settings.update}
        </Link>
      </Card>
    </div>
  );
}
