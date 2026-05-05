"use client";

import { useEffect, useCallback, useRef, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import { useI18n } from "@/i18n/client";

interface TitleDetailModalProps {
  children: ReactNode;
}

export function TitleDetailModal({ children }: TitleDetailModalProps) {
  const router = useRouter();
  const { t } = useI18n();
  const overlayRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const close = useCallback(() => {
    router.back();
  }, [router]);

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", onKey);

    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [close]);

  const handleOverlayClick = useCallback(
    (e: React.MouseEvent) => {
      if (contentRef.current?.contains(e.target as Node)) return;
      close();
    },
    [close],
  );

  const handleContentClick = useCallback(
    (e: React.MouseEvent) => {
      const anchor = (e.target as HTMLElement).closest("a");
      if (!anchor) return;
      const href = anchor.getAttribute("href");
      if (!href || href.startsWith("#")) return;
      if (href.startsWith("/title/")) return;

      e.preventDefault();
      e.stopPropagation();
      window.location.href = href;
    },
    [],
  );

  return createPortal(
    <div
      ref={overlayRef}
      role="dialog"
      aria-modal="true"
      onClick={handleOverlayClick}
      className="fixed inset-0 z-[80] flex justify-center overflow-y-auto bg-black/70 backdrop-blur-sm"
    >
      <div className="relative my-10 w-full max-w-5xl animate-in fade-in zoom-in-95 duration-200">
        <button
          type="button"
          onClick={close}
          aria-label={t("player.close")}
          className="sticky top-4 z-10 float-right mr-4 flex h-9 w-9 items-center justify-center rounded-full bg-black/60 text-white/80 transition-colors hover:bg-black/80 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
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
            <path d="M18 6 6 18" />
            <path d="m6 6 12 12" />
          </svg>
        </button>
        <div
          ref={contentRef}
          className="overflow-hidden rounded-xl bg-background shadow-2xl"
          onClick={handleContentClick}
        >
          {children}
        </div>
      </div>
    </div>,
    document.body,
  );
}
