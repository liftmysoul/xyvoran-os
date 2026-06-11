"use client";

import { Languages } from "lucide-react";
import { useRouter } from "next/navigation";
import { useI18n } from "./LanguageProvider";
import type { Language } from "@/lib/i18n";

export function LanguageSwitcher({ compact = false }: { compact?: boolean }) {
  const router = useRouter();
  const { language, copy, setLanguage, saving } = useI18n();

  async function change(value: Language) {
    await setLanguage(value);
    router.refresh();
  }

  return (
    <label className="inline-flex items-center gap-2 text-sm text-chrome">
      <Languages className="h-4 w-4 text-emeraldx" aria-hidden />
      {!compact && <span className="sr-only">{copy.language.label}</span>}
      <select
        aria-label={copy.language.label}
        value={language}
        disabled={saving}
        onChange={(event) => change(event.target.value as Language)}
        className="rounded-md border border-white/15 bg-obsidian px-2 py-2 text-sm text-white outline-none focus:border-emeraldx"
      >
        <option value="en">{copy.language.english}</option>
        <option value="es">{copy.language.spanish}</option>
      </select>
    </label>
  );
}

