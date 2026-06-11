import { en, type Dictionary } from "./en";
import { es } from "./es";

export type Language = "en" | "es";
export type { Dictionary } from "./en";
export const languageCookieName = "xyvoran_language";
export const dictionaries: Record<Language, Dictionary> = { en, es };

export function normalizeLanguage(value?: string | null): Language {
  return value === "es" ? "es" : "en";
}

export function getDictionary(language: Language) {
  return dictionaries[language];
}

export function localizePillar(value: string, language: Language) {
  return dictionaries[language].pillars[value as keyof Dictionary["pillars"]] ?? value;
}

export function localizeIntensity(value: string, language: Language) {
  return dictionaries[language].intensity[value as keyof Dictionary["intensity"]] ?? value;
}

export function localizeLabStatus(value: string | undefined, language: Language) {
  if (!value) return value;
  const copy = dictionaries[language].labs;
  return value === "Optimal" ? copy.optimal : value === "Needs Attention" ? copy.attention : value === "Priority Area" ? copy.priorityArea : value;
}
