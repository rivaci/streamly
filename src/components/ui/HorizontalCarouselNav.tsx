"use client";

import { useI18n } from "@/i18n/client";

interface HorizontalCarouselNavProps {
  canLeft: boolean;
  canRight: boolean;
  onScrollDir: (dir: -1 | 1) => void;
}

const btnOuter =
  "pointer-events-auto absolute top-[28%] z-10 flex h-11 w-11 touch-manipulation items-center justify-center rounded-full border border-border/60 bg-background/95 text-foreground shadow-md backdrop-blur transition-opacity hover:bg-background active:bg-background md:h-10 md:w-10";

export function HorizontalCarouselNav({
  canLeft,
  canRight,
  onScrollDir,
}: HorizontalCarouselNavProps) {
  const { t } = useI18n();

  return (
    <>
      {canLeft && (
        <button
          type="button"
          aria-label={t("common.carouselPrev")}
          onClick={() => onScrollDir(-1)}
          className={`${btnOuter} left-1 md:left-[-0.375rem]`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-5 w-5"
            aria-hidden="true"
          >
            <path d="m15 18-6-6 6-6" />
          </svg>
        </button>
      )}
      {canRight && (
        <button
          type="button"
          aria-label={t("common.carouselNext")}
          onClick={() => onScrollDir(1)}
          className={`${btnOuter} right-1 md:right-[-0.375rem]`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-5 w-5"
            aria-hidden="true"
          >
            <path d="m9 18 6-6-6-6" />
          </svg>
        </button>
      )}
    </>
  );
}
