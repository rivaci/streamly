"use client";

import { useSyncExternalStore } from "react";
import { read, WATCHLIST_EVENT, type WatchlistItem } from "@/lib/watchlist";

let cache: WatchlistItem[] = [];
let cacheVersion = -1;
let version = 0;

function bump() {
  version += 1;
}

function subscribe(cb: () => void) {
  const handler = () => {
    bump();
    cb();
  };
  window.addEventListener(WATCHLIST_EVENT, handler);
  window.addEventListener("storage", handler);
  return () => {
    window.removeEventListener(WATCHLIST_EVENT, handler);
    window.removeEventListener("storage", handler);
  };
}

function getSnapshot(): WatchlistItem[] {
  if (cacheVersion !== version) {
    cache = read();
    cacheVersion = version;
  }
  return cache;
}

function getServerSnapshot(): WatchlistItem[] {
  return [];
}

export function useWatchlist(): WatchlistItem[] {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
