const KEY = "streamly:recently-viewed:v1";
export const RECENTLY_VIEWED_EVENT = "streamly:recently-viewed:changed";
const MAX_ITEMS = 12;

export interface RecentlyViewedItem {
  type: "movie" | "tv";
  id: number;
  title: string;
  poster_url: string | null;
  year: number | null;
  viewed_at: number;
}

export function read(): RecentlyViewedItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];
    return JSON.parse(raw) as RecentlyViewedItem[];
  } catch {
    return [];
  }
}

function write(items: RecentlyViewedItem[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(KEY, JSON.stringify(items));
  window.dispatchEvent(new Event(RECENTLY_VIEWED_EVENT));
}

export function record(item: Omit<RecentlyViewedItem, "viewed_at">): void {
  const items = read().filter(
    (i) => !(i.type === item.type && i.id === item.id),
  );
  write([{ ...item, viewed_at: Date.now() }, ...items].slice(0, MAX_ITEMS));
}

export function subscribe(cb: () => void): () => void {
  window.addEventListener(RECENTLY_VIEWED_EVENT, cb);
  window.addEventListener("storage", cb);
  return () => {
    window.removeEventListener(RECENTLY_VIEWED_EVENT, cb);
    window.removeEventListener("storage", cb);
  };
}
