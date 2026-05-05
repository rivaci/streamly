"use client";

import { useSyncExternalStore } from "react";

type VitalEntry = {
  name: string;
  value: number;
  rating?: string;
  id: string;
};

let cache: VitalEntry[] = [];
let ver = 0;
let cacheVer = -1;

function subscribe(cb: () => void) {
  const handler = () => {
    ver += 1;
    cb();
  };
  window.addEventListener("streamly:vitals", handler);
  return () => window.removeEventListener("streamly:vitals", handler);
}

function getSnapshot(): VitalEntry[] {
  if (cacheVer !== ver) {
    cache = [...(window.__VITALS__ ?? [])];
    cacheVer = ver;
  }
  return cache;
}

function getServerSnapshot(): VitalEntry[] {
  return [];
}

const ratingColor: Record<string, string> = {
  good: "text-green-400",
  "needs-improvement": "text-yellow-400",
  poor: "text-red-400",
};

export function VitalsPanel() {
  const vitals = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  if (process.env.NODE_ENV !== "development") return null;
  if (vitals.length === 0) return null;

  return (
    <div className="fixed bottom-2 right-2 z-50 max-w-xs rounded-lg border border-border bg-card/95 p-3 text-xs shadow-lg backdrop-blur">
      <p className="mb-1 font-semibold text-foreground">Web Vitals</p>
      <ul className="space-y-0.5">
        {vitals.map((v) => (
          <li key={v.id} className="flex justify-between gap-3">
            <span className="text-muted-foreground">{v.name}</span>
            <span className={ratingColor[v.rating ?? ""] ?? "text-foreground"}>
              {v.value}
              {v.rating ? ` (${v.rating})` : ""}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
