import { describe, expect, it } from "vitest";
import { makeT } from "@/i18n/translate";

describe("i18n translator", () => {
  it("returns the matching string in fr", () => {
    const t = makeT("fr");
    expect(t("nav.home")).toBe("Accueil");
  });

  it("returns the matching string in en", () => {
    const t = makeT("en");
    expect(t("nav.home")).toBe("Home");
  });

  it("interpolates {{value}} placeholders", () => {
    const t = makeT("fr");
    expect(t("title.runtime", { minutes: 123 })).toBe("123 min");
  });

  it("handles plural forms via count", () => {
    const t = makeT("en");
    expect(t("title.seasons", { count: 1 })).toBe("1 season");
    expect(t("title.seasons", { count: 4 })).toBe("4 seasons");
  });

  it("falls back to the key when missing", () => {
    const t = makeT("fr");
    // @ts-expect-error testing fallback path on unknown key
    expect(t("unknown.key")).toBe("unknown.key");
  });
});
