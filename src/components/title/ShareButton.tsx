"use client";

import { useCallback, useState } from "react";
import { Button } from "@/components/ui/Button";
import { useI18n } from "@/i18n/client";
import { cn } from "@/lib/cn";

interface ShareButtonProps {
  title: string;
  url: string;
  className?: string;
  iconOnlyOnMobile?: boolean;
  showText?: boolean;
}

export function ShareButton({
  title,
  url,
  className,
  iconOnlyOnMobile = false,
  showText = true,
}: ShareButtonProps) {
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
      className={cn("gap-2", showText === false && "shrink-0", className)}
      aria-label={copied ? t("title.linkCopied") : t("title.share")}
      title={copied ? t("title.linkCopied") : t("title.share")}
    >
      {/* Filled icon reads better than thin strokes on small dark backgrounds. */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
        className={cn("h-5 w-5 shrink-0", !showText && "h-[1.35rem] w-[1.35rem]")}
        aria-hidden="true"
      >
        <path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.26.81 2.06.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9 4.34 9 3 10.34 3 12s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92s2.92-1.31 2.92-2.92S20.92 17.39 19.61 16.08 18 16.08z" />
      </svg>
      {showText && (
        <span className={iconOnlyOnMobile ? "hidden sm:inline" : ""}>
          {copied ? t("title.linkCopied") : t("title.share")}
        </span>
      )}
    </Button>
  );
}
