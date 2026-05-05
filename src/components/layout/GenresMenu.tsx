"use client";

import { useState, useRef, useCallback } from "react";
import Link from "next/link";
import { useI18n } from "@/i18n/client";
import { useClickOutside } from "@/hooks/useClickOutside";
import { GENRES } from "@/lib/genre-slugs";

export function GenresMenu() {
  const { t, locale } = useI18n();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useClickOutside(ref, useCallback(() => setOpen(false), []));

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-haspopup="true"
        className="text-muted-foreground transition-colors hover:text-foreground"
      >
        {t("nav.genres")}
      </button>

      {open && (
        <div className="absolute left-0 top-full z-50 mt-2 w-56 rounded-lg border border-border bg-card p-2 shadow-xl">
          <div className="grid grid-cols-2 gap-0.5">
            {GENRES.map((g) => (
              <Link
                key={g.slug}
                href={`/genre/${g.slug}`}
                onClick={() => setOpen(false)}
                className="rounded-md px-2 py-1.5 text-sm text-foreground transition-colors hover:bg-accent"
              >
                {locale === "fr" ? g.labelFr : g.labelEn}
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
