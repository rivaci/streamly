"use client";

import { useCallback, useSyncExternalStore } from "react";
import {
  isMuted as getMuted,
  setMuted as writeMuted,
  subscribe,
} from "@/lib/sound-preference";

const serverSnapshot = () => true;

export function useSoundPreference(): [boolean, (muted: boolean) => void] {
  const muted = useSyncExternalStore(subscribe, getMuted, serverSnapshot);
  const toggle = useCallback((val: boolean) => writeMuted(val), []);
  return [muted, toggle];
}
