"use client";

import { useCallback } from "react";
import { useRouter } from "next/navigation";
import { useI18n } from "@/i18n/client";
import { type DiscoverFilters, serialize } from "@/lib/discover-params";
import { Button } from "@/components/ui/Button";

interface FilterBarProps {
  initialFilters: DiscoverFilters;
  genres: { id: number; name: string }[];
  providers: { id: number; name: string }[];
}

export function FilterBar({
  initialFilters,
  genres,
  providers,
}: FilterBarProps) {
  const router = useRouter();
  const { t } = useI18n();

  const update = useCallback(
    (patch: Partial<DiscoverFilters>) => {
      const next = { ...initialFilters, ...patch };
      const qs = serialize(next);
      router.replace(`/discover${qs ? `?${qs}` : ""}`);
    },
    [initialFilters, router],
  );

  const toggleGenre = useCallback(
    (id: number) => {
      const current = initialFilters.genres;
      const next = current.includes(id)
        ? current.filter((g) => g !== id)
        : [...current, id];
      update({ genres: next });
    },
    [initialFilters.genres, update],
  );

  const toggleProvider = useCallback(
    (id: number) => {
      const current = initialFilters.providers;
      const next = current.includes(id)
        ? current.filter((p) => p !== id)
        : [...current, id];
      update({ providers: next });
    },
    [initialFilters.providers, update],
  );

  const reset = useCallback(() => {
    router.replace("/discover");
  }, [router]);

  return (
    <div className="space-y-4 rounded-lg border border-border bg-card p-4">
      {/* Type + Sort row */}
      <div className="flex flex-wrap gap-4">
        <label className="flex flex-col gap-1 text-sm">
          <span className="font-medium text-muted-foreground">
            {t("discover.type")}
          </span>
          <select
            value={initialFilters.type}
            onChange={(e) =>
              update({ type: e.target.value as "movie" | "tv", genres: [] })
            }
            className="h-9 rounded-md border border-border bg-background px-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
          >
            <option value="movie">{t("discover.typeMovie")}</option>
            <option value="tv">{t("discover.typeTv")}</option>
          </select>
        </label>

        <label className="flex flex-col gap-1 text-sm">
          <span className="font-medium text-muted-foreground">
            {t("discover.sort")}
          </span>
          <select
            value={initialFilters.sort}
            onChange={(e) =>
              update({
                sort: e.target.value as DiscoverFilters["sort"],
              })
            }
            className="h-9 rounded-md border border-border bg-background px-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
          >
            <option value="popularity">{t("discover.sortPopularity")}</option>
            <option value="vote">{t("discover.sortVote")}</option>
            <option value="release_date">{t("discover.sortRelease")}</option>
          </select>
        </label>

        <label className="flex flex-col gap-1 text-sm">
          <span className="font-medium text-muted-foreground">
            {t("discover.yearMin")}
          </span>
          <input
            type="number"
            min={1900}
            max={2030}
            value={initialFilters.yearMin ?? ""}
            onChange={(e) =>
              update({
                yearMin: e.target.value
                  ? Number.parseInt(e.target.value, 10)
                  : undefined,
              })
            }
            placeholder="1900"
            className="h-9 w-24 rounded-md border border-border bg-background px-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
          />
        </label>

        <label className="flex flex-col gap-1 text-sm">
          <span className="font-medium text-muted-foreground">
            {t("discover.yearMax")}
          </span>
          <input
            type="number"
            min={1900}
            max={2030}
            value={initialFilters.yearMax ?? ""}
            onChange={(e) =>
              update({
                yearMax: e.target.value
                  ? Number.parseInt(e.target.value, 10)
                  : undefined,
              })
            }
            placeholder="2026"
            className="h-9 w-24 rounded-md border border-border bg-background px-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
          />
        </label>

        <label className="flex flex-col gap-1 text-sm">
          <span className="font-medium text-muted-foreground">
            {t("discover.voteMin")}
          </span>
          <input
            type="number"
            min={0}
            max={10}
            step={0.5}
            value={initialFilters.voteMin ?? ""}
            onChange={(e) =>
              update({
                voteMin: e.target.value
                  ? Number.parseFloat(e.target.value)
                  : undefined,
              })
            }
            placeholder="0"
            className="h-9 w-20 rounded-md border border-border bg-background px-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
          />
        </label>
      </div>

      {/* Genres chips */}
      <fieldset>
        <legend className="mb-2 text-sm font-medium text-muted-foreground">
          {t("discover.genres")}
        </legend>
        <div className="flex flex-wrap gap-2">
          {genres.map((g) => {
            const active = initialFilters.genres.includes(g.id);
            return (
              <button
                key={g.id}
                type="button"
                aria-pressed={active}
                onClick={() => toggleGenre(g.id)}
                className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand ${
                  active
                    ? "border-brand bg-brand/15 text-brand"
                    : "border-border text-muted-foreground hover:text-foreground"
                }`}
              >
                {g.name}
              </button>
            );
          })}
        </div>
      </fieldset>

      {/* Provider chips */}
      <fieldset>
        <legend className="mb-2 text-sm font-medium text-muted-foreground">
          {t("discover.providers")}
        </legend>
        <div className="flex flex-wrap gap-2">
          {providers.map((p) => {
            const active = initialFilters.providers.includes(p.id);
            return (
              <button
                key={p.id}
                type="button"
                aria-pressed={active}
                onClick={() => toggleProvider(p.id)}
                className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand ${
                  active
                    ? "border-brand bg-brand/15 text-brand"
                    : "border-border text-muted-foreground hover:text-foreground"
                }`}
              >
                {p.name}
              </button>
            );
          })}
        </div>
      </fieldset>

      <Button variant="ghost" size="sm" onClick={reset}>
        {t("discover.reset")}
      </Button>
    </div>
  );
}
