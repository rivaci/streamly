"use client";

import { useWatchlist } from "@/hooks/useWatchlist";
import { useI18n } from "@/i18n/client";
import { Container } from "@/components/ui/Container";
import { TitleCard } from "@/components/catalog/TitleCard";
import type { StreamingTitle } from "@/lib/tmdb";

function toStreamingTitle(item: {
  id: number;
  type: "movie" | "tv";
  title: string;
  poster_url: string | null;
  year: number | null;
}): StreamingTitle {
  return {
    id: item.id,
    type: item.type,
    title: item.title,
    original_title: item.title,
    overview: "",
    poster_url: item.poster_url,
    backdrop_url: null,
    release_date: "",
    year: item.year,
    vote_average: 0,
    vote_count: 0,
    genres: [],
    popularity: 0,
  };
}

export default function WatchlistPage() {
  const items = useWatchlist();
  const { t } = useI18n();

  return (
    <Container className="py-8">
      <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
        {t("watchlist.pageTitle")}
      </h1>
      <div className="mt-6">
        {items.length === 0 ? (
          <p className="py-8 text-center text-sm text-muted-foreground">
            {t("watchlist.empty")}
          </p>
        ) : (
          <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
            {items.map((item) => (
              <li key={`${item.type}-${item.id}`}>
                <TitleCard title={toStreamingTitle(item)} />
              </li>
            ))}
          </ul>
        )}
      </div>
    </Container>
  );
}
