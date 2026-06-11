"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { dictionaries, getDictionary, languageCookieName, normalizeLanguage, type Dictionary, type Language } from "@/lib/i18n";

type LanguageContextValue = { language: Language; copy: Dictionary; setLanguage: (language: Language) => Promise<void>; saving: boolean };
const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({ children, initialLanguage }: { children: React.ReactNode; initialLanguage: Language }) {
  const [language, setCurrentLanguage] = useState(initialLanguage);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const stored = normalizeLanguage(window.localStorage.getItem(languageCookieName));
    if (stored !== language && document.cookie.includes(`${languageCookieName}=${stored}`)) setCurrentLanguage(stored);
  }, [language]);

  async function setLanguage(language: Language) {
    setCurrentLanguage(language);
    document.documentElement.lang = language;
    window.localStorage.setItem(languageCookieName, language);
    document.cookie = `${languageCookieName}=${language}; Path=/; Max-Age=31536000; SameSite=Lax`;
    setSaving(true);
    try {
      await fetch("/api/language", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ language }) });
    } finally {
      setSaving(false);
    }
  }

  const value = useMemo(() => ({ language, copy: getDictionary(language), setLanguage, saving }), [language, saving]);
  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useI18n() {
  const value = useContext(LanguageContext);
  if (!value) throw new Error("useI18n must be used within LanguageProvider");
  return value;
}

