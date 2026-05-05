import Link from "next/link";
import type { TitleDetail } from "@/lib/tmdb";
import { Container } from "@/components/ui/Container";
import { Badge } from "@/components/ui/Badge";
import { HeroTrailerBackground } from "@/components/title/HeroTrailerBackground";
import { WatchButton } from "@/components/player/WatchButton";
import { PlayTrailerButton } from "@/components/player/PlayTrailerButton";

interface HomepageHeroProps {
  title: TitleDetail;
  scoreLabel: string;
  moreInfoLabel: string;
}

export function HomepageHero({ title, scoreLabel, moreInfoLabel }: HomepageHeroProps) {
  const href = `/title/${title.type}/${title.id}`;

  return (
    <section className="relative isolate overflow-hidden bg-black" style={{ minHeight: "70vh" }}>
      <HeroTrailerBackground
        videoKey={title.trailer_key}
        backdropUrl={title.backdrop_url}
      />
      <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black via-black/70 to-transparent" />
      <div className="absolute inset-y-0 left-0 w-2/3 bg-gradient-to-r from-black/80 to-transparent" />

      <Container className="relative flex h-full min-h-[70vh] items-end pb-12 md:pb-16">
        <div className="max-w-2xl text-white">
          <h2 className="text-3xl font-bold tracking-tight drop-shadow-lg md:text-5xl">
            {title.title}
          </h2>
          {title.tagline && (
            <p className="mt-2 text-base italic text-white/70">{title.tagline}</p>
          )}
          <div className="mt-3 flex flex-wrap items-center gap-2 text-sm text-white/70">
            {title.vote_average > 0 && (
              <Badge variant="score">
                ★ {scoreLabel.replace("{{score}}", title.vote_average.toFixed(1))}
              </Badge>
            )}
            {title.year && <span>{title.year}</span>}
            {title.genres.slice(0, 3).map((g) => (
              <Badge key={g} variant="muted">{g}</Badge>
            ))}
          </div>
          {title.overview && (
            <p className="mt-4 max-w-xl text-sm leading-relaxed text-white/80 line-clamp-3 md:text-base">
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
            <Link
              href={href}
              className="inline-flex h-12 items-center gap-2 rounded-lg border border-white/30 bg-white/10 px-6 text-base font-medium text-white backdrop-blur-sm transition-colors hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5" aria-hidden="true">
                <circle cx="12" cy="12" r="10" />
                <path d="M12 16v-4" />
                <path d="M12 8h.01" />
              </svg>
              {moreInfoLabel}
            </Link>
          </div>
        </div>
      </Container>
    </section>
  );
}
