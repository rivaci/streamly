import { describe, expect, it } from "vitest";
import { getGenreBySlug, getAllSlugs, GENRES } from "@/lib/genre-slugs";

describe("genre-slugs", () => {
  it("getAllSlugs returns all genre slugs", () => {
    const slugs = getAllSlugs();
    expect(slugs.length).toBe(GENRES.length);
    expect(slugs).toContain("action");
    expect(slugs).toContain("comedy");
    expect(slugs).toContain("drama");
  });

  it("getGenreBySlug returns correct genre", () => {
    const action = getGenreBySlug("action");
    expect(action).toBeDefined();
    expect(action!.id).toBe(28);
    expect(action!.labelEn).toBe("Action");
    expect(action!.labelFr).toBe("Action");
  });

  it("getGenreBySlug returns undefined for unknown slug", () => {
    expect(getGenreBySlug("nonexistent")).toBeUndefined();
  });

  it("every genre has unique slug and id", () => {
    const slugs = new Set(GENRES.map((g) => g.slug));
    const ids = new Set(GENRES.map((g) => g.id));
    expect(slugs.size).toBe(GENRES.length);
    expect(ids.size).toBe(GENRES.length);
  });
});
