import { describe, expect, it, beforeEach } from "vitest";
import { isMuted, setMuted } from "@/lib/sound-preference";

describe("sound-preference", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("defaults to muted when no preference stored", () => {
    expect(isMuted()).toBe(true);
  });

  it("stores and reads muted=false", () => {
    setMuted(false);
    expect(isMuted()).toBe(false);
  });

  it("stores and reads muted=true", () => {
    setMuted(false);
    setMuted(true);
    expect(isMuted()).toBe(true);
  });
});
