"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useI18n } from "@/i18n/client";

export function TrendingToggle() {
  const { t } = useI18n();
  const router = useRouter();
  const params = useSearchParams();
  const current = params.get("trending") === "day" ? "day" : "week";

  const toggle = (value: "day" | "week") => {
    const next = new URLSearchParams(params.toString());
    next.set("trending", value);
    router.replace(`/?${next.toString()}`, { scroll: false });
  };

  return (
    <div className="inline-flex rounded-lg border border-border p-0.5 text-sm">
      <button
        type="button"
        onClick={() => toggle("day")}
        className={`rounded-md px-3 py-1 font-medium transition-colors ${current === "day" ? "bg-brand text-white" : "text-muted-foreground hover:text-foreground"}`}
        aria-pressed={current === "day"}
      >
        {t("home.trendingDay")}
      </button>
      <button
        type="button"
        onClick={() => toggle("week")}
        className={`rounded-md px-3 py-1 font-medium transition-colors ${current === "week" ? "bg-brand text-white" : "text-muted-foreground hover:text-foreground"}`}
        aria-pressed={current === "week"}
      >
        {t("home.trendingWeek")}
      </button>
    </div>
  );
}
