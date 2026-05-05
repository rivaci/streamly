"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useI18n } from "@/i18n/client";
import { useSoundPreference } from "@/hooks/useSoundPreference";
import {
  registerActiveVideo,
  unregisterActiveVideo,
  observeVisibility,
} from "@/lib/video-manager";

interface HeroTrailerBackgroundProps {
  videoKey: string | null;
  backdropUrl: string | null;
}

export function HeroTrailerBackground({
  videoKey,
  backdropUrl,
}: HeroTrailerBackgroundProps) {
  const { t } = useI18n();
  const [showVideo, setShowVideo] = useState(false);
  const [muted, setMuted] = useSoundPreference();
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) =>
      setPrefersReducedMotion(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  useEffect(() => {
    if (!videoKey || prefersReducedMotion) return;
    const timer = setTimeout(() => setShowVideo(true), 1500);
    return () => clearTimeout(timer);
  }, [videoKey, prefersReducedMotion]);

  useEffect(() => {
    const iframe = iframeRef.current;
    const container = containerRef.current;
    if (!showVideo || !iframe || !container) return;

    registerActiveVideo(iframe);
    const stopObserving = observeVisibility(container, iframe);

    return () => {
      unregisterActiveVideo(iframe);
      stopObserving();
    };
  }, [showVideo]);

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

  const initialMute = muted ? 1 : 0;
  const embedUrl = videoKey
    ? `https://www.youtube.com/embed/${videoKey}?autoplay=1&mute=${initialMute}&controls=0&loop=1&playlist=${videoKey}&modestbranding=1&showinfo=0&rel=0&iv_load_policy=3&disablekb=1&enablejsapi=1&origin=${typeof window !== "undefined" ? window.location.origin : ""}`
    : null;

  return (
    <>
      {backdropUrl && (
        <Image
          src={backdropUrl}
          alt=""
          fill
          priority
          sizes="100vw"
          className={`object-cover transition-opacity duration-1000 ${showVideo ? "opacity-0" : "opacity-60"}`}
        />
      )}

      {showVideo && embedUrl && (
        <div ref={containerRef} className="absolute inset-0 overflow-hidden">
          <iframe
            ref={iframeRef}
            src={embedUrl}
            title="Background trailer"
            allow="accelerometer; autoplay; encrypted-media; gyroscope"
            className="h-[120%] w-[120%] origin-center -translate-x-[8.33%] -translate-y-[8.33%] opacity-80 transition-opacity duration-1000"
            style={{ border: 0, pointerEvents: "none" }}
            tabIndex={-1}
            aria-hidden="true"
          />
        </div>
      )}

      {showVideo && videoKey && (
        <button
          type="button"
          onClick={toggleMute}
          aria-pressed={!muted}
          aria-label={muted ? t("player.unmute") : t("player.mute")}
          className="absolute bottom-4 right-4 z-10 flex h-10 w-10 items-center justify-center rounded-full border border-white/30 bg-black/50 text-white/80 backdrop-blur-sm transition-colors hover:bg-black/70 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
        >
          {muted ? (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5" aria-hidden="true">
              <path d="M11 5 6 9H2v6h4l5 4V5z" />
              <line x1="23" y1="9" x2="17" y2="15" />
              <line x1="17" y1="9" x2="23" y2="15" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5" aria-hidden="true">
              <path d="M11 5 6 9H2v6h4l5 4V5z" />
              <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
              <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
            </svg>
          )}
        </button>
      )}
    </>
  );
}
