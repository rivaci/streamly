"use client";

import { useReportWebVitals } from "next/web-vitals";

declare global {
  interface Window {
    __VITALS__?: { name: string; value: number; rating?: string; id: string }[];
  }
}

export function Vitals() {
  useReportWebVitals((metric) => {
    const entry = {
      name: metric.name,
      value: Math.round(metric.value),
      rating: metric.rating,
      id: metric.id,
    };

    if (process.env.NODE_ENV === "development") {
      console.info("[vitals]", entry.name, entry.value, entry.rating);
      window.__VITALS__ = [...(window.__VITALS__ ?? []).slice(-4), entry];
      window.dispatchEvent(new Event("streamly:vitals"));
    }

    fetch("/api/vitals", {
      method: "POST",
      body: JSON.stringify(metric),
      headers: { "Content-Type": "application/json" },
      keepalive: true,
    }).catch(() => {});
  });

  return null;
}
