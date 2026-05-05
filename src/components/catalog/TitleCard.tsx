"use client";

import { useCallback, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import type { StreamingTitle } from "@/lib/tmdb";
import { Badge } from "@/components/ui/Badge";
import { WatchlistButton } from "@/components/watchlist/WatchlistButton";
import { TitleCardExpanded } from "./TitleCardExpanded";

interface TitleCardProps {
  title: StreamingTitle;
  priority?: boolean;
}

const HOVER_DELAY = 500;

function checkHoverSupport() {
  return typeof window !== "undefined" && window.matchMedia("(hover: hover)").matches;
}

export function TitleCard({ title, priority }: TitleCardProps) {
  const href = `/title/${title.type}/${title.id}`;
  const cardRef = useRef<HTMLAnchorElement>(null);
  const hoverTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const [expanded, setExpanded] = useState(false);
  const [rect, setRect] = useState<DOMRect | null>(null);

  const handleMouseEnter = useCallback(() => {
    if (!checkHoverSupport()) return;
    hoverTimer.current = setTimeout(() => {
      const el = cardRef.current;
      if (el) {
        setRect(el.getBoundingClientRect());
        setExpanded(true);
      }
    }, HOVER_DELAY);
  }, []);

  const handleMouseLeave = useCallback(() => {
    clearTimeout(hoverTimer.current);
  }, []);

  const closeExpanded = useCallback(() => {
    setExpanded(false);
    setRect(null);
  }, []);

  return (
    <>
      <Link
        ref={cardRef}
        href={href}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className="group block rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        aria-label={`${title.title}${title.year ? ` (${title.year})` : ""}`}
      >
        <div className="relative aspect-poster w-full overflow-hidden rounded-lg bg-muted">
          <WatchlistButton
            variant="overlay"
            item={{
              type: title.type,
              id: title.id,
              title: title.title,
              poster_url: title.poster_url,
              year: title.year,
              added_at: 0,
            }}
          />
          {title.poster_url ? (
            <Image
              src={title.poster_url}
              alt=""
              fill
              sizes="(max-width: 640px) 45vw, (max-width: 1024px) 25vw, 200px"
              className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
              priority={priority}
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-xs text-muted-foreground">
              {title.title}
            </div>
          )}
          {title.vote_average > 0 && (
            <div className="absolute right-1.5 top-1.5 z-[1]">
              <Badge variant="score">★ {title.vote_average.toFixed(1)}</Badge>
            </div>
          )}
        </div>
        <div className="mt-2 px-0.5">
          <p className="line-clamp-1 text-sm font-medium leading-tight text-foreground">
            {title.title}
          </p>
          <p className="mt-0.5 text-xs text-muted-foreground">
            {[title.year, title.type === "tv" ? "TV" : "Film"]
              .filter(Boolean)
              .join(" · ")}
          </p>
        </div>
      </Link>
      {expanded && rect && (
        <TitleCardExpanded
          title={title}
          anchorRect={rect}
          onClose={closeExpanded}
        />
      )}
    </>
  );
}
