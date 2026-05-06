"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { useI18n } from "@/i18n/client";

// Lazy-load the iframe modal — keeps initial bundle small.
const TrailerModal = dynamic(() => import("./TrailerModal"), {
  ssr: false,
  loading: () => null,
});

interface PlayTrailerButtonProps {
  videoKey: string;
  title: string;
  secondary?: boolean;
  className?: string;
  iconOnlyOnMobile?: boolean;
}

export function PlayTrailerButton({
  videoKey,
  title,
  secondary,
  className,
  iconOnlyOnMobile = false,
}: PlayTrailerButtonProps) {
  const [open, setOpen] = useState(false);
  const { t } = useI18n();

  return (
    <>
      <Button
        variant={secondary ? "outline" : "primary"}
        size="lg"
        onClick={() => setOpen(true)}
        className={`gap-2 ${className ?? ""}`}
        aria-label={t("title.playTrailer")}
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
          <path d="M4 7h16" />
          <path d="M4 7l2-3h14l-2 3" />
          <rect x="4" y="7" width="16" height="13" rx="2" />
          <path d="M10 11l5 3-5 3z" />
        </svg>
        <span className={iconOnlyOnMobile ? "hidden sm:inline" : ""}>
          {t("title.playTrailer")}
        </span>
      </Button>
      {open && (
        <TrailerModal
          videoKey={videoKey}
          title={title}
          onClose={() => setOpen(false)}
        />
      )}
    </>
  );
}
