const STORAGE_KEY = "streamly:sound-muted";
const EVENT_NAME = "streamly:sound:changed";

export function isMuted(): boolean {
  if (typeof window === "undefined") return true;
  try {
    return localStorage.getItem(STORAGE_KEY) !== "false";
  } catch {
    return true;
  }
}

export function setMuted(muted: boolean): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, String(muted));
  } catch {}
  window.dispatchEvent(new CustomEvent(EVENT_NAME, { detail: muted }));
}

export function subscribe(cb: () => void): () => void {
  const handler = () => cb();
  window.addEventListener(EVENT_NAME, handler);
  window.addEventListener("storage", handler);
  return () => {
    window.removeEventListener(EVENT_NAME, handler);
    window.removeEventListener("storage", handler);
  };
}
