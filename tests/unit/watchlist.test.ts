import { describe, expect, it, beforeEach } from "vitest";
import { add, remove, has, read, clear, type WatchlistItem } from "@/lib/watchlist";

const movie: WatchlistItem = {
  type: "movie",
  id: 1,
  title: "Test Movie",
  poster_url: null,
  year: 2024,
  added_at: 0,
};

const tv: WatchlistItem = {
  type: "tv",
  id: 2,
  title: "Test TV",
  poster_url: null,
  year: 2025,
  added_at: 0,
};

describe("watchlist pure logic", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("starts empty", () => {
    expect(read()).toEqual([]);
  });

  it("adds an item and reads it back", () => {
    add(movie);
    const list = read();
    expect(list).toHaveLength(1);
    expect(list[0]!.id).toBe(1);
    expect(list[0]!.type).toBe("movie");
  });

  it("deduplicates by type-id", () => {
    add(movie);
    add(movie);
    expect(read()).toHaveLength(1);
  });

  it("allows same id with different type", () => {
    add(movie);
    add({ ...tv, id: 1 });
    expect(read()).toHaveLength(2);
  });

  it("has() returns true for added items", () => {
    add(movie);
    expect(has("movie", 1)).toBe(true);
    expect(has("tv", 1)).toBe(false);
  });

  it("removes an item", () => {
    add(movie);
    add(tv);
    remove("movie", 1);
    expect(read()).toHaveLength(1);
    expect(has("movie", 1)).toBe(false);
    expect(has("tv", 2)).toBe(true);
  });

  it("clear empties the list", () => {
    add(movie);
    add(tv);
    clear();
    expect(read()).toEqual([]);
  });

  it("survives corrupt localStorage", () => {
    localStorage.setItem("streamly:watchlist:v1", "not json");
    expect(read()).toEqual([]);
  });
});
