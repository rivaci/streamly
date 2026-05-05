"use client";

import { useCallback, useState } from "react";
import { Button } from "@/components/ui/Button";
import { useI18n } from "@/i18n/client";

interface ShareButtonProps {
  title: string;
  url: string;
  className?: string;
}

export function ShareButton({ title, url, className }: ShareButtonProps) {
  const { t } = useI18n();
  const [copied, setCopied] = useState(false);

  const handleShare = useCallback(async () => {
    const fullUrl = `${window.location.origin}${url}`;

    if (navigator.share) {
      try {
        await navigator.share({ title, url: fullUrl });
        return;
      } catch {
        // User cancelled or API not supported in this context
      }
    }

    try {
      await navigator.clipboard.writeText(fullUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard API not available
    }
  }, [title, url]);

  return (
    <Button
      variant="outline"
      size="lg"
      onClick={handleShare}
      className={`gap-2 ${className ?? ""}`}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-4 w-4"
        aria-hidden="true"
      >
        <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
        <polyline points="16 6 12 2 8 6" />
        <line x1="12" y1="2" x2="12" y2="15" />
      </svg>
      {copied ? t("title.linkCopied") : t("title.share")}
    </Button>
  );
}
