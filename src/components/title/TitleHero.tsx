import type { TitleDetail } from "@/lib/tmdb";
import { Container } from "@/components/ui/Container";
import { Badge } from "@/components/ui/Badge";
import { PlayTrailerButton } from "@/components/player/PlayTrailerButton";
import { WatchButton } from "@/components/player/WatchButton";
import { WatchlistButton } from "@/components/watchlist/WatchlistButton";
import { ShareButton } from "./ShareButton";
import { HeroTrailerBackground } from "./HeroTrailerBackground";

interface TitleHeroProps {
  title: TitleDetail;
  scoreLabel: string;
  runtimeLabel: (minutes: number) => string;
  seasonsLabel: (count: number) => string;
}

export function TitleHero({
  title,
  scoreLabel,
  runtimeLabel,
  seasonsLabel,
}: TitleHeroProps) {
  const meta = [
    title.year ? String(title.year) : null,
    title.runtime ? runtimeLabel(title.runtime) : null,
    title.type === "tv" && title.number_of_seasons
      ? seasonsLabel(title.number_of_seasons)
      : null,
  ].filter(Boolean);

  return (
    <header className="relative isolate overflow-hidden bg-black" style={{ minHeight: "70vh" }}>
      <HeroTrailerBackground
        videoKey={title.trailer_key}
        backdropUrl={title.backdrop_url}
      />
      <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black via-black/70 to-transparent" />
      <div className="absolute inset-y-0 left-0 w-2/3 bg-gradient-to-r from-black/80 to-transparent" />

      <Container className="relative flex h-full min-h-[70vh] items-end pb-10 md:pb-14">
        <div className="max-w-2xl text-white">
          <h1 className="text-3xl font-bold tracking-tight drop-shadow-lg md:text-5xl">
            {title.title}
          </h1>
          {title.tagline && (
            <p className="mt-2 text-base italic text-white/70">
              {title.tagline}
            </p>
          )}
          <div className="mt-3 flex flex-wrap items-center gap-2 text-sm text-white/70">
            {title.vote_average > 0 && (
              <Badge variant="score">
                ★ {scoreLabel.replace("{{score}}", title.vote_average.toFixed(1))}
              </Badge>
            )}
            {meta.map((m) => (
              <span key={m}>{m}</span>
            ))}
            {title.genres.slice(0, 3).map((g) => (
              <Badge key={g} variant="muted">
                {g}
              </Badge>
            ))}
          </div>
          {title.overview && (
            <p className="mt-4 max-w-xl text-sm leading-relaxed text-white/80 md:text-base">
              {title.overview}
            </p>
          )}
          <div className="mt-6 flex flex-wrap gap-3">
            <WatchButton variant="hero" />
            {title.trailer_key && (
              <PlayTrailerButton
                videoKey={title.trailer_key}
                title={title.title}
                secondary
                className="border-white/30 text-white hover:bg-white/10"
              />
            )}
            <WatchlistButton
              variant="inline"
              item={{
                type: title.type,
                id: title.id,
                title: title.title,
                poster_url: title.poster_url,
                year: title.year,
                added_at: 0,
              }}
              className="border-white/30 text-white hover:bg-white/10"
            />
            <ShareButton
              title={title.title}
              url={`/title/${title.type}/${title.id}`}
              className="border-white/30 text-white hover:bg-white/10"
            />
          </div>
        </div>
      </Container>
    </header>
  );
}
