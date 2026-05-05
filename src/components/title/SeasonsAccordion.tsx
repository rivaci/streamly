"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { useI18n } from "@/i18n/client";
import type { Episode } from "@/lib/tmdb";

interface SeasonsAccordionProps {
  tvId: number;
  numberOfSeasons: number;
}

interface SeasonCache {
  episodes: Episode[];
  loading: boolean;
}

export function SeasonsAccordion({
  tvId,
  numberOfSeasons,
}: SeasonsAccordionProps) {
  const { t } = useI18n();
  const [openSeason, setOpenSeason] = useState(1);
  const [cache, setCache] = useState<Record<number, SeasonCache>>({});

  const fetchSeason = useCallback(
    (n: number) => {
      if (cache[n]?.episodes.length) return;

      setCache((prev) => ({
        ...prev,
        [n]: { episodes: [], loading: true },
      }));

      fetch(`/api/tv/${tvId}/season/${n}`)
        .then((r) => r.json())
        .then((data) => {
          setCache((prev) => ({
            ...prev,
            [n]: { episodes: data.episodes ?? [], loading: false },
          }));
        })
        .catch(() => {
          setCache((prev) => ({
            ...prev,
            [n]: { episodes: [], loading: false },
          }));
        });
    },
    [tvId, cache],
  );

  useEffect(() => {
    fetchSeason(1);
  }, [tvId]); // eslint-disable-line react-hooks/exhaustive-deps

  const toggle = (n: number) => {
    if (openSeason === n) {
      setOpenSeason(-1);
      return;
    }
    setOpenSeason(n);
    fetchSeason(n);
  };

  const seasons = Array.from({ length: numberOfSeasons }, (_, i) => i + 1);

  return (
    <div className="space-y-2">
      {seasons.map((n) => {
        const isOpen = openSeason === n;
        const data = cache[n];
        return (
          <div key={n} className="overflow-hidden rounded-lg border border-border">
            <button
              type="button"
              onClick={() => toggle(n)}
              aria-expanded={isOpen}
              className="flex w-full items-center justify-between px-4 py-3 text-left text-sm font-medium transition-colors hover:bg-accent/50"
            >
              <span>{t("title.seasonNumber", { n })}</span>
              <svg
                className={`h-4 w-4 shrink-0 transition-transform ${isOpen ? "rotate-180" : ""}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {isOpen && (
              <div className="border-t border-border">
                {data?.loading && (
                  <p className="px-4 py-3 text-sm text-muted-foreground">
                    {t("title.loading")}
                  </p>
                )}
                {data?.episodes.map((ep) => (
                  <div
                    key={ep.id}
                    className="flex gap-4 border-b border-border/50 px-4 py-3 last:border-b-0"
                  >
                    {ep.still_url ? (
                      <Image
                        src={ep.still_url}
                        alt=""
                        width={160}
                        height={90}
                        className="hidden shrink-0 rounded object-cover sm:block"
                        unoptimized
                      />
                    ) : (
                      <div className="hidden h-[90px] w-[160px] shrink-0 items-center justify-center rounded bg-muted text-xs text-muted-foreground sm:flex">
                        Ep. {ep.episode_number}
                      </div>
                    )}
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium">
                        {ep.episode_number}. {ep.name}
                      </p>
                      {ep.air_date && (
                        <p className="mt-0.5 text-xs text-muted-foreground">
                          {t("title.episodeAired", { date: ep.air_date })}
                          {ep.runtime ? ` · ${ep.runtime} min` : ""}
                        </p>
                      )}
                      {ep.overview && (
                        <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">
                          {ep.overview}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
                {!data?.loading && data?.episodes.length === 0 && (
                  <p className="px-4 py-3 text-sm text-muted-foreground">—</p>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
