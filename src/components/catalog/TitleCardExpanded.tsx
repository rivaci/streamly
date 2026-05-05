"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import Link from "next/link";
import type { StreamingTitle } from "@/lib/tmdb";
import { Badge } from "@/components/ui/Badge";
import { WatchButton } from "@/components/player/WatchButton";
import { WatchlistButton } from "@/components/watchlist/WatchlistButton";
import { useI18n } from "@/i18n/client";
import { useSoundPreference } from "@/hooks/useSoundPreference";
import { registerActiveVideo, unregisterActiveVideo } from "@/lib/video-manager";

interface TitlePreview {
  trailer_key: string | null;
  genres: string[];
  runtime: number | null;
  vote_average: number;
  overview: string;
}

interface TitleCardExpandedProps {
  title: StreamingTitle;
  anchorRect: DOMRect;
  onClose: () => void;
}

export function TitleCardExpanded({
  title,
  anchorRect,
  onClose,
}: TitleCardExpandedProps) {
  const { t } = useI18n();
  const [muted, setMuted] = useSoundPreference();
  const [preview, setPreview] = useState<TitlePreview | null>(null);
  const [closing, setClosing] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const leaveTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const expandedWidth = Math.max(anchorRect.width * 2.2, 340);
  const left = Math.max(
    window.scrollX + 8,
    Math.min(
      anchorRect.left + window.scrollX + anchorRect.width / 2 - expandedWidth / 2,
      window.scrollX + window.innerWidth - expandedWidth - 8,
    ),
  );
  const top = Math.max(window.scrollY + 8, anchorRect.top + window.scrollY - 20);

  useEffect(() => {
    const ctrl = new AbortController();
    fetch(`/api/title-preview?type=${title.type}&id=${title.id}`, {
      signal: ctrl.signal,
    })
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (data) setPreview(data as TitlePreview);
      })
      .catch(() => {});
    return () => ctrl.abort();
  }, [title.type, title.id]);

  const handleMouseLeave = useCallback(() => {
    leaveTimer.current = setTimeout(() => {
      setClosing(true);
      setTimeout(onClose, 150);
    }, 200);
  }, [onClose]);

  const handleMouseEnter = useCallback(() => {
    clearTimeout(leaveTimer.current);
  }, []);

  const toggleMute = useCallback(() => {
    const iframe = iframeRef.current;
    if (!iframe?.contentWindow) return;
    const next = !muted;
    setMuted(next);
    const command = next ? "mute" : "unMute";
    iframe.contentWindow.postMessage(
      JSON.stringify({ event: "command", func: command, args: [] }),
      "https://www.youtube.com",
    );
  }, [muted, setMuted]);

  useEffect(() => {
    return () => clearTimeout(leaveTimer.current);
  }, []);

  const href = `/title/${title.type}/${title.id}`;
  const genres = preview?.genres ?? title.genres;
  const runtime = preview?.runtime;
  const videoKey = preview?.trailer_key;
  const initialMute = muted ? 1 : 0;

  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe || !videoKey) return;
    registerActiveVideo(iframe);
    return () => unregisterActiveVideo(iframe);
  }, [videoKey]);

  return createPortal(
    <div
      ref={containerRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`absolute z-[60] overflow-hidden rounded-lg bg-card shadow-2xl ring-1 ring-white/10 transition-all duration-200 ${closing ? "scale-95 opacity-0" : "scale-100 opacity-100"}`}
      style={{
        width: expandedWidth,
        left,
        top,
      }}
    >
      {/* Media section */}
      <div className="relative aspect-video w-full bg-black">
        {videoKey ? (
          <iframe
            ref={iframeRef}
            src={`https://www.youtube.com/embed/${videoKey}?autoplay=1&mute=${initialMute}&controls=0&loop=1&playlist=${videoKey}&modestbranding=1&showinfo=0&rel=0&iv_load_policy=3&disablekb=1&enablejsapi=1`}
            title={title.title}
            allow="accelerometer; autoplay; encrypted-media; gyroscope"
            className="h-full w-full border-0"
            style={{ pointerEvents: "none" }}
            tabIndex={-1}
            aria-hidden="true"
          />
        ) : title.poster_url ? (
          <Image
            src={title.poster_url}
            alt=""
            fill
            sizes="320px"
            className="object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-sm text-muted-foreground">
            {title.title}
          </div>
        )}
        {/* Title overlay + mute button */}
        <div className="absolute inset-x-0 bottom-0 flex items-end justify-between bg-gradient-to-t from-black/80 to-transparent p-3">
          <p className="text-sm font-semibold text-white drop-shadow">{title.title}</p>
          {videoKey && (
            <button
              type="button"
              onClick={toggleMute}
              aria-pressed={!muted}
              aria-label={muted ? t("player.unmute") : t("player.mute")}
              className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-white/30 bg-black/50 text-white/80 transition-colors hover:bg-black/70 hover:text-white"
            >
              {muted ? (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-3.5 w-3.5" aria-hidden="true">
                  <path d="M11 5 6 9H2v6h4l5 4V5z" />
                  <line x1="23" y1="9" x2="17" y2="15" />
                  <line x1="17" y1="9" x2="23" y2="15" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-3.5 w-3.5" aria-hidden="true">
                  <path d="M11 5 6 9H2v6h4l5 4V5z" />
                  <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
                  <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
                </svg>
              )}
            </button>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 px-3 pt-3">
        <WatchButton variant="card" />
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
        <Link
          href={href}
          className="ml-auto inline-flex h-8 items-center gap-1.5 rounded-full border border-border px-3 text-xs font-medium text-foreground transition-colors hover:border-foreground hover:text-foreground"
          aria-label={t("card.moreInfo")}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-3.5 w-3.5"
            aria-hidden="true"
          >
            <path d="m6 9 6 6 6-6" />
          </svg>
          <span>{t("card.viewTitle")}</span>
        </Link>
      </div>

      {/* Metadata */}
      <div className="space-y-2 px-3 pb-3 pt-2">
        <div className="flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground">
          {title.vote_average > 0 && (
            <Badge variant="score">★ {title.vote_average.toFixed(1)}</Badge>
          )}
          {title.year && <span>{title.year}</span>}
          {runtime && <span>{runtime} min</span>}
        </div>
        {genres.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {genres.slice(0, 3).map((g) => (
              <Badge key={g} variant="muted" className="text-[10px]">
                {g}
              </Badge>
            ))}
          </div>
        )}
      </div>
    </div>,
    document.body,
  );
}
