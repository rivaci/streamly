"use client";

import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { useI18n } from "@/i18n/client";
import { registerActiveVideo, unregisterActiveVideo } from "@/lib/video-manager";

interface TrailerModalProps {
  videoKey: string;
  title: string;
  onClose: () => void;
}

export default function TrailerModal({
  videoKey,
  title,
  onClose,
}: TrailerModalProps) {
  const { t } = useI18n();
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const embedUrl = `https://www.youtube.com/embed/${videoKey}?autoplay=1&rel=0&modestbranding=1&enablejsapi=1`;
  const youtubeUrl = `https://www.youtube.com/watch?v=${videoKey}`;

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;
    registerActiveVideo(iframe);
    return () => unregisterActiveVideo(iframe);
  }, []);

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-label={title || "Player"}
      className="fixed inset-0 z-[100] flex items-center justify-center"
    >
      <button
        type="button"
        onClick={onClose}
        aria-label={t("player.close")}
        className="absolute inset-0 bg-black/85 backdrop-blur-sm"
      />
      <div className="relative z-10 w-full max-w-5xl px-4">
        <button
          type="button"
          onClick={onClose}
          aria-label={t("player.close")}
          className="absolute -top-10 right-4 rounded-full p-2 text-white/80 transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-6 w-6"
            aria-hidden="true"
          >
            <path d="M18 6 6 18" />
            <path d="m6 6 12 12" />
          </svg>
        </button>
        <div className="aspect-video w-full overflow-hidden rounded-xl shadow-2xl">
          <iframe
            ref={iframeRef}
            src={embedUrl}
            title={title || "YouTube trailer"}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="h-full w-full border-0"
          />
        </div>
        {title && (
          <div className="mt-3 flex items-center justify-between gap-4 text-white">
            <h2 className="line-clamp-1 text-base font-medium">{title}</h2>
            <a
              href={youtubeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-white/60 hover:text-white"
            >
              {t("player.openOnYouTube")}
            </a>
          </div>
        )}
      </div>
    </div>,
    document.body,
  );
}
