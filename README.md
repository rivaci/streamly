# Streamly — Streaming Platform POC

> Next.js 16 + TypeScript + TMDB. SSR / ISR, i18n FR/EN, accessibility, Core Web Vitals oriented.

## Why this POC

This project is a streaming platform POC: browse movies and TV shows, open rich title details,
watch trailers, search with autocomplete, manage a watchlist, and explore by genres with a
Netflix-style UI.

Content data is powered by [TMDB (The Movie Database)](https://www.themoviedb.org/) through their
official API. The app uses real catalogue metadata (titles, posters, cast, seasons, trailers) so
technical decisions can be discussed with production-like constraints instead of mocked data.

It is intentionally **dependency-light**: no UI kit, no CSS-in-JS runtime, no i18n library.
Every piece is owned in `src/` so trade-offs are explicit and reviewable.

## Live demo

Deployed on Vercel: [streaming-poc-nu.vercel.app](https://streaming-poc-nu.vercel.app)

## Quick start

```bash
cp .env.local.example .env.local
# add a TMDB_ACCESS_TOKEN (free, 5 min on themoviedb.org)

npm install
npm run dev          # http://localhost:3000

npm run typecheck
npm run lint
npm run test         # unit (Vitest)
npm run test:e2e     # end-to-end (Playwright, builds & serves)
```

## Features

### P0 — Core

| Feature | Description |
|---|---|
| **Watchlist** | Add/remove titles from any card or detail page. Persisted in `localStorage`, cross-tab sync. `/watchlist` page. |
| **Discover** | URL-driven filters (genre, year, rating, provider, sort). Server-rendered results, shareable URLs. |
| **Web Vitals** | LCP/CLS/INP/FCP/TTFB reporting. Dev overlay panel + POST to `/api/vitals`. |

### P1 — Enhanced UX

| Feature | Description |
|---|---|
| **Search autocomplete** | WAI-ARIA combobox with debounced suggestions, keyboard navigation, poster thumbnails. |
| **Trending toggle** | Day/week switch on homepage, URL-persisted (`?trending=day`). |
| **Recently viewed** | Horizontal rail on homepage, auto-populated from detail page visits, `localStorage`. |
| **Genre routes** | SEO-friendly `/genre/action`, `/genre/comedy`… 18 genres, statically generated (SSG). Dropdown menu in header. |
| **TV seasons/episodes** | Collapsible accordion on TV show detail pages. Lazy-fetched episodes per season. |
| **Theme switcher** | Dark / Light / System. Cookie + localStorage, anti-FOUC inline script. |

### P2 — Polish

| Feature | Description |
|---|---|
| **Dynamic OG images** | Per-title OpenGraph image via `ImageResponse` (edge runtime). Backdrop + title + metadata. |
| **Sitemap & robots** | Dynamic sitemap (static routes + genres + trending titles). robots.txt blocks `/api/`. |
| **Share button** | Web Share API with clipboard fallback and visual feedback. |
| **PWA** | Web app manifest, service worker (cache-first assets, network-first pages). Installable. |
| **Granular skeletons** | Per-route loading states matching final layout (title detail, person detail). |

### Netflix-style UX

| Feature | Description |
|---|---|
| **Hero video** | Auto-playing muted trailer on homepage and detail page backgrounds. |
| **Expanded card preview** | Hover preview with trailer, action buttons, metadata. Scrolls with page. |
| **Detail modal** | Intercepting routes — detail opens as dialog, URL still works for direct access. |
| **Global sound preference** | Mute/unmute synced across all video components, persisted in `localStorage`. |
| **Video manager** | Only one video plays at a time. IntersectionObserver pauses off-screen videos. |

## Architecture

```
src/
  app/
    page.tsx                     # ISR home (revalidate=1800)
    title/[type]/[id]/           # Title detail (force-static + revalidate=21600)
      opengraph-image.tsx        # Dynamic OG image (edge)
      loading.tsx                # Granular skeleton
    person/[id]/                 # Person detail (force-static + revalidate=86400)
      loading.tsx                # Granular skeleton
    genre/[slug]/                # Genre page (SSG via generateStaticParams)
    discover/                    # URL-filtered discovery
    search/                      # Dynamic SSR (?q=...)
    watchlist/                   # Client-side watchlist page
    @modal/(.)title/[type]/[id]/ # Intercepting route for modal detail
    api/
      search-suggest/            # Autocomplete endpoint
      title-preview/             # Lightweight preview for expanded cards
      tv/[id]/season/[n]/        # TV season episodes
      trending/, vitals/         # Trending data, Web Vitals collection
    sitemap.ts, robots.ts        # SEO
  components/
    catalog/                     # CatalogGrid, TitleCard, TitleCardExpanded, CatalogSection
    title/                       # TitleHero, CastList, SeasonsAccordion, ShareButton, RecordView
    home/                        # HomepageHero, TrendingToggle, RecentlyViewedSection
    player/                      # PlayTrailerButton, TrailerModal, WatchButton, ComingSoonToast
    watchlist/                   # WatchlistButton
    layout/                      # Header, Footer, SearchBar, LocaleSwitcher, GenresMenu, ThemeSwitcher
    ui/                          # Button, Badge, Skeleton, Container
  hooks/
    useWatchlist.ts              # localStorage + useSyncExternalStore
    useRecentlyViewed.ts         # localStorage + useSyncExternalStore
    useSoundPreference.ts        # Global mute state
    useDebouncedValue.ts         # Generic debounce hook
    useClickOutside.ts           # Generic click-outside hook
  i18n/
    config.ts, translate.ts      # Typed i18n (interpolation + plurals)
    server.ts, client.tsx        # SSR + client hooks
    locales/{fr,en}.ts           # Strongly-typed dictionaries
  lib/
    tmdb.ts                      # TMDB client (Bearer token, ISR-aware)
    watchlist.ts                 # Watchlist localStorage logic
    recently-viewed.ts           # Recently viewed localStorage logic
    sound-preference.ts          # Sound preference persistence
    video-manager.ts             # Single active video + IntersectionObserver
    genre-slugs.ts               # Genre slug ↔ TMDB ID lookup table
    discover-params.ts           # URL filter parse/serialize
    cn.ts                        # Tailwind class merge
tests/
  unit/                          # Vitest (7 suites, 32 tests)
  e2e/                           # Playwright (7 specs)
```

### Render strategy per route

| Route | Strategy | Cache TTL |
|---|---|---|
| `/` | ISR | 30 min |
| `/movies`, `/tv` | ISR | 30 min |
| `/title/[type]/[id]` | `force-static` + revalidate | 6 h |
| `/person/[id]` | `force-static` + revalidate | 24 h |
| `/genre/[slug]` | SSG (`generateStaticParams`) | 6 h |
| `/discover` | ISR | 30 min |
| `/search?q=…` | Dynamic SSR | per-request |
| `/watchlist` | Client-only | — |
| `/api/*` | Route Handlers | 30 s – 1 h |

### Performance choices

- **`next/image` everywhere** — AVIF/WebP, responsive `sizes`, `priority` on above-the-fold posters.
- **Dynamic import of player modal** — YouTube iframe (~200 kB) never enters the initial JS bundle.
- **Streaming with `<Suspense>`** — each homepage section streams independently.
- **TMDB client uses Next data cache** — SSR pages render from hot cache on subsequent visits.
- **Video manager** — single active video, IntersectionObserver pauses off-screen playback.
- **No CSS-in-JS runtime** — Tailwind-only, zero JS for styling.
- **Tiny dependency tree** — fast `npm install`, small CI surface.

### Accessibility

- Semantic landmarks (`<header>`, `<main>`, `<nav>`, `<footer>`).
- Skip-to-content link, visible focus rings (`:focus-visible`).
- WAI-ARIA combobox for search autocomplete.
- Every poster has a meaningful link `aria-label` (title + year).
- Modal player traps `Escape`, locks body scroll, `aria-modal="true"`.
- `prefers-reduced-motion` respected globally.
- Dark/light theme supports WCAG AA contrast.

### Internationalization

Tiny home-rolled i18n (`src/i18n/`):

- Strongly typed dictionary (`Path<Dict>` autocompletes every key).
- `{{value}}` interpolation, plural forms via `count`.
- Server-side: `getServerLocale()` reads cookie → `Accept-Language` → default.
- Client-side: `useI18n()` hook, locale switch persists to cookie + reload.
- Locale drives TMDB `language` parameter end-to-end.

### Tests

```bash
npm run test            # Vitest unit (32 tests)
npm run test:e2e        # Playwright (7 specs)
npm run test:e2e:ui     # Playwright UI mode
```

Unit tests cover: i18n translator, TitleCard component, watchlist logic, recently-viewed logic,
discover params round-trip, genre slugs, sound preference.

E2E tests cover: home → detail navigation, watchlist flow, discover filters, search autocomplete,
genre navigation, trending toggle, Web Vitals.

### Docker

```bash
docker build -t streamly-poc .
docker run -p 3000:3000 -e TMDB_ACCESS_TOKEN=... streamly-poc
```

Multi-stage build, non-root runtime user, no telemetry.

## Trade-offs / what would change for production

- **CSS-in-JS:** Tailwind chosen for zero runtime cost. Design tokens map 1:1 to a theme object for migration.
- **i18n:** Home-rolled is fine at this scope; would swap to `next-intl` for ICU messages and per-locale routing.
- **State management:** None. `useReducer` + URL state + `useSyncExternalStore` for `localStorage` is enough at this scale.
- **Monorepo:** Single Next app; `@/` alias and clean separation lift into a `packages/` workspace easily.

## Credits

This product uses the TMDB API but is not endorsed or certified by TMDB.
