const KEY = "streamly:watchlist:v1";
export const WATCHLIST_EVENT = "streamly:watchlist:changed";

export interface WatchlistItem {
  type: "movie" | "tv";
  id: number;
  title: string;
  poster_url: string | null;
  year: number | null;
  added_at: number;
}

export function read(): WatchlistItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];
    return JSON.parse(raw) as WatchlistItem[];
  } catch {
    return [];
  }
}

export function write(items: WatchlistItem[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(KEY, JSON.stringify(items));
  window.dispatchEvent(new Event(WATCHLIST_EVENT));
}

export function add(item: WatchlistItem): void {
  const items = read();
  const key = `${item.type}-${item.id}`;
  if (items.some((i) => `${i.type}-${i.id}` === key)) return;
  write([{ ...item, added_at: Date.now() }, ...items]);
}

export function remove(type: string, id: number): void {
  const items = read();
  write(items.filter((i) => !(i.type === type && i.id === id)));
}

export function has(type: string, id: number): boolean {
  return read().some((i) => i.type === type && i.id === id);
}

export function clear(): void {
  write([]);
}
