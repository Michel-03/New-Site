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

  it("counts down when a result is a reduction", () => {
    expect(countValue(80, 25, 0)).toBe(80);
    expect(countValue(80, 25, 1)).toBe(25);
  });

  it("shows client results instead of company facts", () => {
    expect(stats.map((stat) => `${stat.prefix}${stat.value}${stat.suffix}`)).toEqual(["80→25 min", "30–40%", "50%"]);
  });
});
