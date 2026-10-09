import { describe, expect, it } from "vitest";
import { countValue, easeOutCubic } from "./count";
import { stats } from "./content";

describe("stat counter", () => {
  it("starts at the from value and lands exactly on the target", () => {
    expect(countValue(2000, 2019, 0)).toBe(2000);
    expect(countValue(2000, 2019, 1)).toBe(2019);
    expect(countValue(0, 24, 1)).toBe(24);
  });

  it("never overshoots when the animation runs long", () => {
    expect(countValue(0, 6, 1.4)).toBe(6);
    expect(easeOutCubic(-0.5)).toBe(0);
  });

  it("moves quickly at first and settles at the end", () => {
    expect(easeOutCubic(0.5)).toBeGreaterThan(0.5);
  });

  it("keeps the four headline figures from the existing site", () => {
    expect(stats.map((stat) => `${stat.value}${stat.suffix}`)).toEqual(["2019", "6", "5", "24h"]);
  });
});
