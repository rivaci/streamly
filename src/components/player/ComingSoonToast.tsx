"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useI18n } from "@/i18n/client";

interface ComingSoonToastProps {
  onDone: () => void;
}

export function ComingSoonToast({ onDone }: ComingSoonToastProps) {
  const { t } = useI18n();
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const fadeTimer = setTimeout(() => setVisible(false), 2600);
    const removeTimer = setTimeout(onDone, 3000);
    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(removeTimer);
    };
  }, [onDone]);

  return createPortal(
    <div
      role="status"
      aria-live="polite"
      className={`fixed inset-0 z-[95] flex items-center justify-center bg-black/45 px-4 transition-opacity duration-300 ${visible ? "opacity-100" : "opacity-0"}`}
    >
      <div className="rounded-xl border border-white/20 bg-black/70 px-8 py-6 text-center text-lg font-semibold text-white shadow-2xl backdrop-blur-md md:text-xl">
        {t("title.comingSoon")}
      </div>
    </div>,
    document.body,
  );
}
