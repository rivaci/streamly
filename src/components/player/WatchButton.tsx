"use client";

import { useCallback, useState } from "react";
import { Button } from "@/components/ui/Button";
import { useI18n } from "@/i18n/client";
import { ComingSoonToast } from "./ComingSoonToast";

interface WatchButtonProps {
  variant?: "hero" | "card";
}

export function WatchButton({ variant = "hero" }: WatchButtonProps) {
  const { t } = useI18n();
  const [showToast, setShowToast] = useState(false);
  const dismiss = useCallback(() => setShowToast(false), []);

  const isHero = variant === "hero";

  return (
    <>
      <Button
        variant={isHero ? "ghost" : "primary"}
        size={isHero ? "lg" : "sm"}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setShowToast(true);
        }}
        style={isHero ? { backgroundColor: "white", color: "black" } : undefined}
        className={isHero ? "gap-2 font-semibold hover:opacity-80" : "gap-1.5"}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className={isHero ? "h-5 w-5" : "h-4 w-4"}
          aria-hidden="true"
        >
          <path d="M8 5v14l11-7z" />
        </svg>
        {t("title.watch")}
      </Button>
      {showToast && <ComingSoonToast onDone={dismiss} />}
    </>
  );
}
