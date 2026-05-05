import { cookies, headers } from "next/headers";
import {
  DEFAULT_LOCALE,
  LOCALE_COOKIE,
  type Locale,
  SUPPORTED_LOCALES,
  TMDB_LANGUAGE,
} from "./config";
import { makeT } from "./translate";

function isLocale(v: string | null | undefined): v is Locale {
  return Boolean(v) && (SUPPORTED_LOCALES as readonly string[]).includes(v!);
}

export async function getServerLocale(): Promise<Locale> {
  const c = await cookies();
  const fromCookie = c.get(LOCALE_COOKIE)?.value;
  if (isLocale(fromCookie)) return fromCookie;

  const h = await headers();
  const accept = h.get("accept-language") || "";
  for (const part of accept.split(",")) {
    const code = part.split(";")[0]?.trim().slice(0, 2).toLowerCase();
    if (isLocale(code)) return code;
  }
  return DEFAULT_LOCALE;
}

export async function getServerT() {
  const locale = await getServerLocale();
  return { t: makeT(locale), locale, tmdbLanguage: TMDB_LANGUAGE[locale] };
}
