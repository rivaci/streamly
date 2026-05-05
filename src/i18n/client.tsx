"use client";

import { createContext, useCallback, useContext, useMemo } from "react";
import {
  LOCALE_COOKIE,
  type Locale,
  SUPPORTED_LOCALES,
} from "./config";
import { makeT, type Translator } from "./translate";

interface I18nContextValue {
  locale: Locale;
  t: Translator;
  setLocale: (locale: Locale) => void;
}

const I18nContext = createContext<I18nContextValue | null>(null);

export function I18nProvider({
  locale,
  children,
}: {
  locale: Locale;
  children: React.ReactNode;
}) {
  const t = useMemo(() => makeT(locale), [locale]);

  const setLocale = useCallback((next: Locale) => {
    if (!SUPPORTED_LOCALES.includes(next)) return;
    document.cookie = `${LOCALE_COOKIE}=${next}; path=/; max-age=${60 * 60 * 24 * 365}; samesite=lax`;
    window.location.reload();
  }, []);

  const value = useMemo(
    () => ({ locale, t, setLocale }),
    [locale, t, setLocale],
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n(): I18nContextValue {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used within I18nProvider");
  return ctx;
}
