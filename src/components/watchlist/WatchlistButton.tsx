"use client";

import { useCallback, type MouseEvent } from "react";
import { useWatchlist } from "@/hooks/useWatchlist";
import { add, remove, type WatchlistItem } from "@/lib/watchlist";
import { useI18n } from "@/i18n/client";
import { cn } from "@/lib/cn";

interface WatchlistButtonProps {
  item: WatchlistItem;
  variant?: "overlay" | "inline";
  className?: string;
}

export function WatchlistButton({
  item,
  variant = "overlay",
  className: extraClassName,
}: WatchlistButtonProps) {
  const list = useWatchlist();
  const isIn = list.some((i) => i.type === item.type && i.id === item.id);
  const { t } = useI18n();

  const toggle = useCallback(
    (e: MouseEvent) => {
      e.stopPropagation();
      e.preventDefault();
      if (isIn) {
        remove(item.type, item.id);
      } else {
        add(item);
      }
    },
    [isIn, item],
  );

  const label = isIn ? t("watchlist.remove") : t("watchlist.add");

  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={isIn}
      aria-label={label}
      title={label}
      className={cn(
        "inline-flex items-center justify-center rounded-full transition-colors",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        variant === "overlay" &&
          "absolute left-1.5 top-1.5 z-10 h-8 w-8 bg-black/60 text-white hover:bg-black/80",
        variant === "inline" &&
          "h-10 gap-2 border border-border bg-foreground/10 px-4 text-sm font-medium text-foreground hover:bg-foreground/20",
        extraClassName,
      )}
    >
      {isIn ? (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="h-4 w-4"
          aria-hidden="true"
        >
          <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
        </svg>
      ) : (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="h-4 w-4"
          aria-hidden="true"
        >
          <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
        </svg>
      )}
      {variant === "inline" && (
        <span>{isIn ? t("watchlist.remove") : t("watchlist.add")}</span>
      )}
    </button>
  );
}
