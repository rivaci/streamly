"use client";

import { useSyncExternalStore } from "react";
import {
  read,
  RECENTLY_VIEWED_EVENT,
  type RecentlyViewedItem,
} from "@/lib/recently-viewed";

let cache: RecentlyViewedItem[] = [];
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
  window.addEventListener(RECENTLY_VIEWED_EVENT, handler);
  window.addEventListener("storage", handler);
  return () => {
    window.removeEventListener(RECENTLY_VIEWED_EVENT, handler);
    window.removeEventListener("storage", handler);
  };
}

function getSnapshot(): RecentlyViewedItem[] {
  if (cacheVersion !== version) {
    cache = read();
    cacheVersion = version;
  }
  return cache;
}

const serverSnapshot: RecentlyViewedItem[] = [];

export function useRecentlyViewed(): RecentlyViewedItem[] {
  return useSyncExternalStore(subscribe, getSnapshot, () => serverSnapshot);
}
