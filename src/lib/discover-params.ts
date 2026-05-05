import type { TitleType } from "./tmdb";

export interface DiscoverFilters {
  type: TitleType;
  genres: number[];
  yearMin?: number;
  yearMax?: number;
  voteMin?: number;
  providers: number[];
  sort: "popularity" | "vote" | "release_date";
}

const DEFAULTS: DiscoverFilters = {
  type: "movie",
  genres: [],
  providers: [],
  sort: "popularity",
};

function toIntArray(val: string | undefined): number[] {
  if (!val) return [];
  return val
    .split(",")
    .map((s) => Number.parseInt(s, 10))
    .filter((n) => Number.isFinite(n) && n > 0);
}

function toInt(val: string | undefined): number | undefined {
  if (!val) return undefined;
  const n = Number.parseInt(val, 10);
  return Number.isFinite(n) ? n : undefined;
}

export function parse(
  searchParams: Record<string, string | string[] | undefined>,
): DiscoverFilters {
  const get = (key: string): string | undefined => {
    const v = searchParams[key];
    return Array.isArray(v) ? v[0] : v;
  };

  const rawType = get("type");
  const type: TitleType =
    rawType === "movie" || rawType === "tv" ? rawType : DEFAULTS.type;

  const rawSort = get("sort");
  const sort: DiscoverFilters["sort"] =
    rawSort === "popularity" || rawSort === "vote" || rawSort === "release_date"
      ? rawSort
      : DEFAULTS.sort;

  return {
    type,
    genres: toIntArray(get("genres")),
    yearMin: toInt(get("yearMin")),
    yearMax: toInt(get("yearMax")),
    voteMin: toInt(get("voteMin")),
    providers: toIntArray(get("providers")),
    sort,
  };
}

export function serialize(filters: DiscoverFilters): string {
  const params = new URLSearchParams();

  if (filters.type !== DEFAULTS.type) params.set("type", filters.type);
  if (filters.genres.length) params.set("genres", filters.genres.join(","));
  if (filters.yearMin !== undefined)
    params.set("yearMin", String(filters.yearMin));
  if (filters.yearMax !== undefined)
    params.set("yearMax", String(filters.yearMax));
  if (filters.voteMin !== undefined)
    params.set("voteMin", String(filters.voteMin));
  if (filters.providers.length)
    params.set("providers", filters.providers.join(","));
  if (filters.sort !== DEFAULTS.sort) params.set("sort", filters.sort);

  return params.toString();
}
