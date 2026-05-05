import { describe, expect, it } from "vitest";
import { parse, serialize } from "@/lib/discover-params";

describe("discover-params round-trip", () => {
  it("defaults to movie / popularity / empty filters", () => {
    const f = parse({});
    expect(f.type).toBe("movie");
    expect(f.sort).toBe("popularity");
    expect(f.genres).toEqual([]);
    expect(f.providers).toEqual([]);
    expect(f.yearMin).toBeUndefined();
    expect(f.yearMax).toBeUndefined();
    expect(f.voteMin).toBeUndefined();
  });

  it("serializes defaults to empty string", () => {
    const f = parse({});
    expect(serialize(f)).toBe("");
  });

  it("round-trips fully filled filters", () => {
    const input: Record<string, string> = {
      type: "tv",
      genres: "28,12",
      yearMin: "2020",
      yearMax: "2026",
      voteMin: "7",
      providers: "8,337",
      sort: "vote",
    };
    const f = parse(input);
    expect(f.type).toBe("tv");
    expect(f.genres).toEqual([28, 12]);
    expect(f.yearMin).toBe(2020);
    expect(f.yearMax).toBe(2026);
    expect(f.voteMin).toBe(7);
    expect(f.providers).toEqual([8, 337]);
    expect(f.sort).toBe("vote");

    const qs = serialize(f);
    const reparsed = parse(Object.fromEntries(new URLSearchParams(qs)));
    expect(reparsed).toEqual(f);
  });

  it("ignores invalid values gracefully", () => {
    const f = parse({
      type: "invalid",
      genres: "abc,,3",
      yearMin: "not-a-number",
      sort: "unknown",
    });
    expect(f.type).toBe("movie");
    expect(f.genres).toEqual([3]);
    expect(f.yearMin).toBeUndefined();
    expect(f.sort).toBe("popularity");
  });

  it("handles array values from searchParams", () => {
    const f = parse({ type: ["tv", "movie"], genres: ["28,12"] });
    expect(f.type).toBe("tv");
    expect(f.genres).toEqual([28, 12]);
  });
});
