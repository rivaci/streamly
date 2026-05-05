/**
 * TMDB API client (v3 + v4).
 *
 * Ported and simplified from butler2 src/butler/tv/providers/tmdb.py.
 * Uses Next.js fetch cache directives to enable ISR transparently.
 */

const TMDB_BASE = "https://api.themoviedb.org/3";
const IMAGE_BASE_W500 = "https://image.tmdb.org/t/p/w500";
const IMAGE_BASE_W342 = "https://image.tmdb.org/t/p/w342";
const IMAGE_BASE_W780 = "https://image.tmdb.org/t/p/w780";
const IMAGE_BASE_ORIGINAL = "https://image.tmdb.org/t/p/original";

export type TitleType = "movie" | "tv";

export interface StreamingTitle {
  id: number;
  type: TitleType;
  title: string;
  original_title: string;
  overview: string;
  poster_url: string | null;
  backdrop_url: string | null;
  release_date: string;
  year: number | null;
  vote_average: number;
  vote_count: number;
  genres: string[];
  popularity: number;
}

export interface CastMember {
  person_id: number;
  name: string;
  character: string;
  profile_url: string | null;
  order: number;
}

export interface Person {
  id: number;
  name: string;
  biography: string;
  birthday: string | null;
  place_of_birth: string | null;
  profile_url: string | null;
  known_for_department: string;
}

export interface Video {
  key: string;
  site: string;
  type: string;
  name: string;
  official: boolean;
}

export interface WatchProvider {
  provider_id: number;
  provider_name: string;
  logo_url: string | null;
}

export interface WatchProviders {
  link: string | null;
  flatrate: WatchProvider[];
  rent: WatchProvider[];
  buy: WatchProvider[];
}

export interface TitleDetail extends StreamingTitle {
  runtime: number | null;
  tagline: string;
  status: string;
  homepage: string;
  number_of_seasons?: number;
  number_of_episodes?: number;
  trailer_key: string | null;
  watch_providers: WatchProviders;
}

// ──────────────────────────────────────────────────────────────────────
// HTTP layer
// ──────────────────────────────────────────────────────────────────────

interface FetchOptions {
  /** Next.js cache: seconds to revalidate. Defaults to 1h. */
  revalidate?: number;
  /** Bypass cache. */
  noStore?: boolean;
}

async function tmdbGet<T>(
  path: string,
  params: Record<string, string | number | undefined> = {},
  opts: FetchOptions = {},
): Promise<T> {
  const accessToken = process.env.TMDB_ACCESS_TOKEN?.trim();
  const apiKey = process.env.TMDB_API_KEY?.trim();

  const search = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) {
    if (v !== undefined && v !== "") search.set(k, String(v));
  }
  if (!accessToken && apiKey) search.set("api_key", apiKey);

  const url = `${TMDB_BASE}${path}${search.toString() ? `?${search}` : ""}`;
  const headers: Record<string, string> = { Accept: "application/json" };
  if (accessToken) headers.Authorization = `Bearer ${accessToken}`;

  const cache: RequestInit["cache"] = opts.noStore ? "no-store" : undefined;
  const next = opts.noStore
    ? undefined
    : { revalidate: opts.revalidate ?? 3600 };

  const res = await fetch(url, { headers, cache, next });
  if (!res.ok) {
    throw new Error(`TMDB ${res.status} ${res.statusText} on ${path}`);
  }
  return (await res.json()) as T;
}

// ──────────────────────────────────────────────────────────────────────
// Image helpers
// ──────────────────────────────────────────────────────────────────────

export const tmdbImage = {
  poster: (path: string | null | undefined): string | null =>
    path ? `${IMAGE_BASE_W342}${path}` : null,
  posterLarge: (path: string | null | undefined): string | null =>
    path ? `${IMAGE_BASE_W500}${path}` : null,
  backdrop: (path: string | null | undefined): string | null =>
    path ? `${IMAGE_BASE_W780}${path}` : null,
  backdropOriginal: (path: string | null | undefined): string | null =>
    path ? `${IMAGE_BASE_ORIGINAL}${path}` : null,
  profile: (path: string | null | undefined): string | null =>
    path ? `${IMAGE_BASE_W342}${path}` : null,
  providerLogo: (path: string | null | undefined): string | null =>
    path ? `https://image.tmdb.org/t/p/w92${path}` : null,
};

// ──────────────────────────────────────────────────────────────────────
// Mappers
// ──────────────────────────────────────────────────────────────────────

interface TmdbItem {
  id: number;
  title?: string;
  name?: string;
  original_title?: string;
  original_name?: string;
  overview?: string;
  poster_path?: string | null;
  backdrop_path?: string | null;
  release_date?: string;
  first_air_date?: string;
  vote_average?: number;
  vote_count?: number;
  popularity?: number;
  media_type?: string;
  genre_ids?: number[];
  genres?: { id: number; name: string }[];
}

function pickType(item: TmdbItem, fallback: TitleType): TitleType {
  if (item.media_type === "movie" || item.media_type === "tv") {
    return item.media_type;
  }
  return fallback;
}

function toStreamingTitle(
  item: TmdbItem,
  type: TitleType,
  genresMap?: Map<number, string>,
): StreamingTitle {
  const date = item.release_date || item.first_air_date || "";
  const year = date ? Number.parseInt(date.slice(0, 4), 10) || null : null;
  const genres = item.genres
    ? item.genres.map((g) => g.name)
    : (item.genre_ids ?? [])
        .map((id) => genresMap?.get(id))
        .filter((n): n is string => Boolean(n));

  return {
    id: item.id,
    type,
    title: item.title || item.name || "",
    original_title: item.original_title || item.original_name || "",
    overview: item.overview || "",
    poster_url: tmdbImage.poster(item.poster_path),
    backdrop_url: tmdbImage.backdrop(item.backdrop_path),
    release_date: date,
    year,
    vote_average: item.vote_average ?? 0,
    vote_count: item.vote_count ?? 0,
    genres,
    popularity: item.popularity ?? 0,
  };
}

// ──────────────────────────────────────────────────────────────────────
// Genres (cached)
// ──────────────────────────────────────────────────────────────────────

let _movieGenresCache: Map<number, string> | null = null;
let _tvGenresCache: Map<number, string> | null = null;

export async function loadGenres(
  type: TitleType,
  language: string,
): Promise<Map<number, string>> {
  if (type === "movie" && _movieGenresCache) return _movieGenresCache;
  if (type === "tv" && _tvGenresCache) return _tvGenresCache;

  const data = await tmdbGet<{ genres: { id: number; name: string }[] }>(
    `/genre/${type}/list`,
    { language },
    { revalidate: 60 * 60 * 24 },
  );
  const map = new Map<number, string>(
    data.genres.map((g) => [g.id, g.name]),
  );
  if (type === "movie") _movieGenresCache = map;
  else _tvGenresCache = map;
  return map;
}

// ──────────────────────────────────────────────────────────────────────
// Public API
// ──────────────────────────────────────────────────────────────────────

export interface TmdbOptions {
  language?: string;
  region?: string;
}

export const STREAMING_PROVIDERS = [
  { id: 8, name: "Netflix" },
  { id: 9, name: "Prime Video" },
  { id: 337, name: "Disney+" },
  { id: 350, name: "Apple TV+" },
  { id: 339, name: "Canal+" },
] as const;

const DEFAULT_LANG = "fr-FR";
const DEFAULT_REGION = process.env.NEXT_PUBLIC_PROVIDER_REGION || "FR";

export async function getTrending(
  type: "all" | "movie" | "tv" = "all",
  window: "day" | "week" = "week",
  opts: TmdbOptions = {},
): Promise<StreamingTitle[]> {
  const language = opts.language || DEFAULT_LANG;
  const data = await tmdbGet<{ results: TmdbItem[] }>(
    `/trending/${type}/${window}`,
    { language },
    { revalidate: 60 * 30 }, // 30 min ISR
  );

  // Lazy genre maps for media_type variants.
  const [movieGenres, tvGenres] =
    type === "all"
      ? await Promise.all([
          loadGenres("movie", language),
          loadGenres("tv", language),
        ])
      : [
          type === "movie" ? await loadGenres("movie", language) : new Map(),
          type === "tv" ? await loadGenres("tv", language) : new Map(),
        ];

  return data.results
    .map((item) => {
      const t =
        type === "all" ? pickType(item, "movie") : (type as TitleType);
      const g = t === "movie" ? movieGenres : tvGenres;
      return toStreamingTitle(item, t, g);
    })
    .filter((t) => t.title);
}

export async function searchMulti(
  query: string,
  opts: TmdbOptions = {},
): Promise<StreamingTitle[]> {
  if (!query.trim()) return [];
  const language = opts.language || DEFAULT_LANG;
  const data = await tmdbGet<{ results: TmdbItem[] }>(
    `/search/multi`,
    { query, language, include_adult: "false" },
    { revalidate: 60 * 5 },
  );
  const movieGenres = await loadGenres("movie", language);
  const tvGenres = await loadGenres("tv", language);
  return data.results
    .filter(
      (it) => it.media_type === "movie" || it.media_type === "tv",
    )
    .map((it) => {
      const t = it.media_type as TitleType;
      const g = t === "movie" ? movieGenres : tvGenres;
      return toStreamingTitle(it, t, g);
    })
    .filter((t) => t.title);
}

export async function discover(
  type: TitleType,
  params: {
    genres?: number[];
    yearMin?: number;
    yearMax?: number;
    voteMin?: number;
    sortBy?: "popularity" | "vote" | "release_date";
    providers?: number[];
    region?: string;
  } = {},
  opts: TmdbOptions = {},
): Promise<StreamingTitle[]> {
  const language = opts.language || DEFAULT_LANG;
  const region = params.region || opts.region || DEFAULT_REGION;
  const sort: Record<string, string> = {
    popularity: "popularity.desc",
    vote: "vote_average.desc",
    release_date: type === "movie" ? "release_date.desc" : "first_air_date.desc",
  };
  const q: Record<string, string | number> = {
    language,
    sort_by: sort[params.sortBy ?? "popularity"]!,
    include_adult: "false",
    "vote_count.gte": params.voteMin ? 50 : 100,
  };
  if (params.genres?.length)
    q.with_genres = params.genres.join(",");
  if (params.voteMin) q["vote_average.gte"] = params.voteMin;
  if (params.providers?.length) {
    q.with_watch_providers = params.providers.join("|");
    q.watch_region = region;
  }
  if (type === "movie") {
    if (params.yearMin) q["primary_release_date.gte"] = `${params.yearMin}-01-01`;
    if (params.yearMax) q["primary_release_date.lte"] = `${params.yearMax}-12-31`;
  } else {
    if (params.yearMin) q["first_air_date.gte"] = `${params.yearMin}-01-01`;
    if (params.yearMax) q["first_air_date.lte"] = `${params.yearMax}-12-31`;
  }

  const data = await tmdbGet<{ results: TmdbItem[] }>(
    `/discover/${type}`,
    q,
    { revalidate: 60 * 30 },
  );
  const genres = await loadGenres(type, language);
  return data.results.map((it) => toStreamingTitle(it, type, genres));
}

interface RawTitleDetail extends TmdbItem {
  runtime?: number | null;
  episode_run_time?: number[];
  tagline?: string;
  status?: string;
  homepage?: string;
  number_of_seasons?: number;
  number_of_episodes?: number;
  videos?: { results: { key: string; site: string; type: string; name: string; official: boolean }[] };
  "watch/providers"?: {
    results: Record<
      string,
      {
        link?: string;
        flatrate?: { provider_id: number; provider_name: string; logo_path?: string }[];
        rent?: { provider_id: number; provider_name: string; logo_path?: string }[];
        buy?: { provider_id: number; provider_name: string; logo_path?: string }[];
      }
    >;
  };
}

function pickTrailer(
  videos: { key: string; site: string; type: string; official: boolean }[],
): string | null {
  if (!videos?.length) return null;
  const youtube = videos.filter((v) => v.site === "YouTube" && v.key);
  const trailer =
    youtube.find((v) => v.type === "Trailer" && v.official) ||
    youtube.find((v) => v.type === "Trailer") ||
    youtube.find((v) => v.type === "Teaser") ||
    youtube[0];
  return trailer?.key ?? null;
}

function mapWatchProviders(
  raw: RawTitleDetail["watch/providers"],
  region: string,
): WatchProviders {
  const r = raw?.results?.[region];
  const map = (
    list?: { provider_id: number; provider_name: string; logo_path?: string }[],
  ): WatchProvider[] =>
    (list ?? []).map((p) => ({
      provider_id: p.provider_id,
      provider_name: p.provider_name,
      logo_url: tmdbImage.providerLogo(p.logo_path),
    }));
  return {
    link: r?.link ?? null,
    flatrate: map(r?.flatrate),
    rent: map(r?.rent),
    buy: map(r?.buy),
  };
}

export async function getTitleDetail(
  type: TitleType,
  id: number,
  opts: TmdbOptions = {},
): Promise<TitleDetail> {
  const language = opts.language || DEFAULT_LANG;
  const region = opts.region || DEFAULT_REGION;
  const data = await tmdbGet<RawTitleDetail>(
    `/${type}/${id}`,
    {
      language,
      append_to_response: "videos,watch/providers",
    },
    { revalidate: 60 * 60 * 6 },
  );

  const base = toStreamingTitle(data, type);
  const runtime =
    data.runtime ??
    (data.episode_run_time && data.episode_run_time[0]) ??
    null;

  return {
    ...base,
    runtime,
    tagline: data.tagline ?? "",
    status: data.status ?? "",
    homepage: data.homepage ?? "",
    number_of_seasons: data.number_of_seasons,
    number_of_episodes: data.number_of_episodes,
    trailer_key: pickTrailer(data.videos?.results ?? []),
    watch_providers: mapWatchProviders(data["watch/providers"], region),
  };
}

interface RawCredits {
  cast: {
    id: number;
    name: string;
    character: string;
    profile_path: string | null;
    order: number;
  }[];
}

export async function getCredits(
  type: TitleType,
  id: number,
  opts: TmdbOptions = {},
): Promise<CastMember[]> {
  const language = opts.language || DEFAULT_LANG;
  const data = await tmdbGet<RawCredits>(
    `/${type}/${id}/credits`,
    { language },
    { revalidate: 60 * 60 * 24 },
  );
  return (data.cast ?? [])
    .slice(0, 20)
    .map((c) => ({
      person_id: c.id,
      name: c.name,
      character: c.character,
      profile_url: tmdbImage.profile(c.profile_path),
      order: c.order,
    }));
}

export async function getSimilar(
  type: TitleType,
  id: number,
  opts: TmdbOptions = {},
): Promise<StreamingTitle[]> {
  const language = opts.language || DEFAULT_LANG;
  const data = await tmdbGet<{ results: TmdbItem[] }>(
    `/${type}/${id}/recommendations`,
    { language },
    { revalidate: 60 * 60 * 6 },
  );
  const genres = await loadGenres(type, language);
  return data.results
    .slice(0, 12)
    .map((it) => toStreamingTitle(it, type, genres));
}

export async function getPerson(
  id: number,
  opts: TmdbOptions = {},
): Promise<Person> {
  const language = opts.language || DEFAULT_LANG;
  const data = await tmdbGet<{
    id: number;
    name: string;
    biography: string;
    birthday: string | null;
    deathday: string | null;
    place_of_birth: string | null;
    profile_path: string | null;
    known_for_department: string;
  }>(`/person/${id}`, { language }, { revalidate: 60 * 60 * 24 });
  return {
    id: data.id,
    name: data.name,
    biography: data.biography,
    birthday: data.birthday,
    place_of_birth: data.place_of_birth,
    profile_url: tmdbImage.profile(data.profile_path),
    known_for_department: data.known_for_department,
  };
}

interface RawCombinedCredit extends TmdbItem {
  character?: string;
  job?: string;
  department?: string;
  media_type: "movie" | "tv";
}

export interface PersonCredit extends StreamingTitle {
  character: string;
  /** "acting" or job name (Director, Writer…). */
  role: string;
}

export async function getPersonCredits(
  id: number,
  opts: TmdbOptions = {},
): Promise<{ cast: PersonCredit[]; crew: PersonCredit[] }> {
  const language = opts.language || DEFAULT_LANG;
  const data = await tmdbGet<{
    cast: RawCombinedCredit[];
    crew: RawCombinedCredit[];
  }>(
    `/person/${id}/combined_credits`,
    { language },
    { revalidate: 60 * 60 * 24 },
  );

  const movieGenres = await loadGenres("movie", language);
  const tvGenres = await loadGenres("tv", language);

  const toCredit = (item: RawCombinedCredit, role: string): PersonCredit => {
    const t = item.media_type;
    const g = t === "movie" ? movieGenres : tvGenres;
    return {
      ...toStreamingTitle(item, t, g),
      character: item.character ?? "",
      role,
    };
  };

  const cast = (data.cast ?? [])
    .filter((c) => c.media_type === "movie" || c.media_type === "tv")
    .map((c) => toCredit(c, "acting"))
    .filter((c) => c.title)
    // Sort: most recent first, then by popularity.
    .sort((a, b) => {
      const ay = a.year ?? 0;
      const by = b.year ?? 0;
      if (ay !== by) return by - ay;
      return b.popularity - a.popularity;
    });

  const crew = (data.crew ?? [])
    .filter((c) => c.media_type === "movie" || c.media_type === "tv")
    .map((c) => toCredit(c, c.job || c.department || "crew"))
    .filter((c) => c.title)
    .sort((a, b) => (b.year ?? 0) - (a.year ?? 0));

  // Deduplicate cast by id (a person can appear multiple times in cast).
  const seen = new Set<string>();
  const uniqueCast = cast.filter((c) => {
    const key = `${c.type}-${c.id}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  return { cast: uniqueCast, crew };
}

// ---------------------------------------------------------------------------
// TV Season Detail
// ---------------------------------------------------------------------------

export interface Episode {
  id: number;
  episode_number: number;
  name: string;
  overview: string;
  air_date: string | null;
  still_url: string | null;
  runtime: number | null;
  vote_average: number;
}

export interface SeasonDetail {
  id: number;
  season_number: number;
  name: string;
  overview: string;
  poster_url: string | null;
  air_date: string | null;
  episodes: Episode[];
}

export async function getSeasonDetail(
  tvId: number,
  seasonNumber: number,
  opts: TmdbOptions = {},
): Promise<SeasonDetail> {
  const language = opts.language || DEFAULT_LANG;

  const data = await tmdbGet<{
    id: number;
    season_number: number;
    name: string;
    overview: string;
    poster_path: string | null;
    air_date: string | null;
    episodes: {
      id: number;
      episode_number: number;
      name: string;
      overview: string;
      air_date: string | null;
      still_path: string | null;
      runtime: number | null;
      vote_average: number;
    }[];
  }>(`/tv/${tvId}/season/${seasonNumber}`, { language }, { revalidate: 60 * 60 });

  return {
    id: data.id,
    season_number: data.season_number,
    name: data.name,
    overview: data.overview || "",
    poster_url: tmdbImage.poster(data.poster_path),
    air_date: data.air_date,
    episodes: (data.episodes ?? []).map((ep) => ({
      id: ep.id,
      episode_number: ep.episode_number,
      name: ep.name,
      overview: ep.overview || "",
      air_date: ep.air_date,
      still_url: ep.still_path
        ? `${IMAGE_BASE_W500}${ep.still_path}`
        : null,
      runtime: ep.runtime,
      vote_average: ep.vote_average,
    })),
  };
}
