import { cookies } from "next/headers";
import { getDictionary, languageCookieName, normalizeLanguage } from "./index";

export async function getServerLanguage() {
  return normalizeLanguage((await cookies()).get(languageCookieName)?.value);
}

export async function getServerI18n() {
  const language = await getServerLanguage();
  return { language, copy: getDictionary(language) };
}
