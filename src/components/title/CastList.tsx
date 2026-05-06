"use client";

import Image from "next/image";
import Link from "next/link";
import type { CastMember } from "@/lib/tmdb";
import { useHorizontalScrollArrows } from "@/hooks/useHorizontalScrollArrows";
import { HorizontalCarouselNav } from "@/components/ui/HorizontalCarouselNav";

interface CastListProps {
  cast: CastMember[];
}

export function CastList({ cast }: CastListProps) {
  const { scrollRef, canLeft, canRight, scrollByPage } =
    useHorizontalScrollArrows<HTMLUListElement>();

  if (!cast.length) return null;

  return (
    <div className="group/cast relative">
      <HorizontalCarouselNav
        canLeft={canLeft}
        canRight={canRight}
        onScrollDir={scrollByPage}
      />
      <ul
        ref={scrollRef}
        className="-mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto overscroll-x-contain px-4 pb-2 scrollbar-none [-webkit-overflow-scrolling:touch] touch-pan-x"
      >
        {cast.map((member) => (
          <li
            key={member.person_id}
            className="w-28 shrink-0 snap-start sm:w-32"
          >
            <Link
              href={`/person/${member.person_id}`}
              aria-label={member.name}
              className="group block rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              <div className="relative aspect-poster w-full overflow-hidden rounded-md bg-muted">
                {member.profile_url ? (
                  <Image
                    src={member.profile_url}
                    alt=""
                    fill
                    sizes="128px"
                    className="object-cover transition-transform duration-300 group-hover:scale-[1.04]"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-xs text-muted-foreground">
                    {member.name}
                  </div>
                )}
              </div>
              <p className="mt-1.5 line-clamp-1 text-sm font-medium">
                {member.name}
              </p>
              <p className="line-clamp-1 text-xs text-muted-foreground">
                {member.character}
              </p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
