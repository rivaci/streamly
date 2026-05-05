import { fr } from "./locales/fr";
import { en } from "./locales/en";

export const SUPPORTED_LOCALES = ["fr", "en"] as const;
export type Locale = (typeof SUPPORTED_LOCALES)[number];
export const DEFAULT_LOCALE: Locale =
  (process.env.NEXT_PUBLIC_DEFAULT_LOCALE as Locale) || "fr";

export const LOCALE_COOKIE = "locale";
export const LOCALE_LABEL: Record<Locale, string> = {
  fr: "Français",
  en: "English",
};

type Widen<T> = T extends string ? string : { [K in keyof T]: Widen<T[K]> };

export type Dict = Widen<typeof fr>;

export const dictionaries: Record<Locale, Dict> = { fr, en };

/** Map UI locale → TMDB language tag. */
export const TMDB_LANGUAGE: Record<Locale, string> = {
  fr: "fr-FR",
  en: "en-US",
};
