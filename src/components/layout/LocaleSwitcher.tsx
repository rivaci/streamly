"use client";

import { useI18n } from "@/i18n/client";
import {
  LOCALE_LABEL,
  type Locale,
  SUPPORTED_LOCALES,
} from "@/i18n/config";

export function LocaleSwitcher() {
  const { locale, setLocale, t } = useI18n();
  return (
    <label className="flex items-center gap-2 text-sm">
      <span className="sr-only">{t("nav.languageLabel")}</span>
      <select
        aria-label={t("nav.languageLabel")}
        value={locale}
        onChange={(e) => setLocale(e.target.value as Locale)}
        className="h-9 rounded-md border border-border bg-card px-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
      >
        {SUPPORTED_LOCALES.map((l) => (
          <option key={l} value={l}>
            {LOCALE_LABEL[l]}
          </option>
        ))}
      </select>
    </label>
  );
}
