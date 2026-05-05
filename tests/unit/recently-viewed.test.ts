import { describe, expect, it, beforeEach } from "vitest";
import { read, record } from "@/lib/recently-viewed";

const item1 = { type: "movie" as const, id: 1, title: "Movie 1", poster_url: null, year: 2024 };
const item2 = { type: "tv" as const, id: 2, title: "TV Show 1", poster_url: null, year: 2025 };

describe("recently-viewed pure logic", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("starts empty", () => {
    expect(read()).toEqual([]);
  });

  it("records an item and reads it back", () => {
    record(item1);
    const list = read();
    expect(list).toHaveLength(1);
    expect(list[0]!.id).toBe(1);
    expect(list[0]!.title).toBe("Movie 1");
  });

  it("moves duplicate to front instead of adding twice", () => {
    record(item1);
    record(item2);
    record(item1);
    const list = read();
    expect(list).toHaveLength(2);
    expect(list[0]!.id).toBe(1);
    expect(list[1]!.id).toBe(2);
  });

  it("caps at 12 items", () => {
    for (let i = 0; i < 15; i++) {
      record({ type: "movie", id: i, title: `Movie ${i}`, poster_url: null, year: 2024 });
    }
    expect(read()).toHaveLength(12);
  });

  it("most recent item is first", () => {
    record(item1);
    record(item2);
    const list = read();
    expect(list[0]!.id).toBe(2);
  });

  it("survives corrupt localStorage", () => {
    localStorage.setItem("streamly:recently-viewed:v1", "not json");
    expect(read()).toEqual([]);
  });
});
