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
}

export function PlayTrailerButton({ videoKey, title, secondary, className }: PlayTrailerButtonProps) {
  const [open, setOpen] = useState(false);
  const { t } = useI18n();

  return (
    <>
      <Button
        variant={secondary ? "outline" : "primary"}
        size="lg"
        onClick={() => setOpen(true)}
        className={`gap-2 ${className ?? ""}`}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="h-5 w-5"
          aria-hidden="true"
        >
          <path d="M8 5v14l11-7z" />
        </svg>
        {t("title.playTrailer")}
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
