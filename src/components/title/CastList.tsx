"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import type { CastMember } from "@/lib/tmdb";

interface CastListProps {
  cast: CastMember[];
}

export function CastList({ cast }: CastListProps) {
  const scrollRef = useRef<HTMLUListElement>(null);
  const [canLeft, setCanLeft] = useState(false);
  const [canRight, setCanRight] = useState(false);

  const check = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setCanLeft(el.scrollLeft > 2);
    setCanRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 2);
  }, []);

  useEffect(() => {
    check();
    const el = scrollRef.current;
    if (!el) return;
    el.addEventListener("scroll", check, { passive: true });
    const ro = new ResizeObserver(check);
    ro.observe(el);
    return () => {
      el.removeEventListener("scroll", check);
      ro.disconnect();
    };
  }, [check]);

  const scroll = useCallback((dir: -1 | 1) => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * el.clientWidth * 0.75, behavior: "smooth" });
  }, []);

  if (!cast.length) return null;

  return (
    <div className="group/cast relative">
      {canLeft && (
        <button
          type="button"
          aria-label="Scroll left"
          onClick={() => scroll(-1)}
          className="absolute -left-2 top-1/3 z-10 hidden h-10 w-10 items-center justify-center rounded-full bg-background/80 text-foreground shadow-md backdrop-blur transition-opacity hover:bg-background md:flex"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5" aria-hidden="true">
            <path d="m15 18-6-6 6-6" />
          </svg>
        </button>
      )}
      {canRight && (
        <button
          type="button"
          aria-label="Scroll right"
          onClick={() => scroll(1)}
          className="absolute -right-2 top-1/3 z-10 hidden h-10 w-10 items-center justify-center rounded-full bg-background/80 text-foreground shadow-md backdrop-blur transition-opacity hover:bg-background md:flex"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5" aria-hidden="true">
            <path d="m9 18 6-6-6-6" />
          </svg>
        </button>
      )}
      <ul
        ref={scrollRef}
        className="-mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-2 scrollbar-none"
      >
        {cast.map((member) => (
          <li
            key={member.person_id}
            className="w-28 shrink-0 snap-start sm:w-32"
          >
            <Link
              href={`/person/${member.person_id}`}
              aria-label={member.name}
              className="group block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded-md"
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
