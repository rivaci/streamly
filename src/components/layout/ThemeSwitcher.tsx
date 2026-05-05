"use client";

import { useEffect, useState, useCallback } from "react";
import { useI18n } from "@/i18n/client";

type Theme = "dark" | "light" | "system";

function getStoredTheme(): Theme {
  if (typeof window === "undefined") return "system";
  return (localStorage.getItem("streamly:theme") as Theme) ?? "system";
}

function applyTheme(theme: Theme) {
  const root = document.documentElement;
  if (theme === "system") {
    root.removeAttribute("data-theme");
  } else {
    root.setAttribute("data-theme", theme);
  }
  localStorage.setItem("streamly:theme", theme);
  document.cookie = `streamly-theme=${theme};path=/;max-age=31536000;SameSite=Lax`;
}

export function ThemeSwitcher() {
  const { t } = useI18n();
  const [theme, setTheme] = useState<Theme>("system");

  useEffect(() => {
    setTheme(getStoredTheme());
  }, []);

  const change = useCallback((next: Theme) => {
    setTheme(next);
    applyTheme(next);
  }, []);

  return (
    <div className="relative inline-flex items-center gap-1">
      <label htmlFor="theme-select" className="sr-only">
        {t("nav.theme")}
      </label>
      <select
        id="theme-select"
        value={theme}
        onChange={(e) => change(e.target.value as Theme)}
        className="h-8 appearance-none rounded-md border border-border bg-card px-2 pr-6 text-xs text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
      >
        <option value="system">{t("nav.themeSystem")}</option>
        <option value="dark">{t("nav.themeDark")}</option>
        <option value="light">{t("nav.themeLight")}</option>
      </select>
      <svg
        className="pointer-events-none absolute right-1 top-1/2 h-3 w-3 -translate-y-1/2 text-muted-foreground"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
      </svg>
    </div>
  );
}
