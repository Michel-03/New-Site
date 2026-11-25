import { HttpException, HttpStatus } from "@nestjs/common";
import { RATE_LIMIT_MAX, RATE_LIMIT_WINDOW_MS, RateLimitGuard } from "./rate-limit.guard";

describe("RateLimitGuard", () => {
  it("allows a few enquiries and then blocks with 429", () => {
    const guard = new RateLimitGuard();
    for (let i = 0; i < RATE_LIMIT_MAX; i += 1) {
      expect(guard.allow("1.2.3.4", 1000 + i)).toBe(true);
    }

    try {
      guard.allow("1.2.3.4", 2000);
      throw new Error("expected the request to be blocked");
    } catch (error) {
      expect(error).toBeInstanceOf(HttpException);
      expect((error as HttpException).getStatus()).toBe(HttpStatus.TOO_MANY_REQUESTS);
    }
  });

  it("counts each visitor separately", () => {
    const guard = new RateLimitGuard();
    for (let i = 0; i < RATE_LIMIT_MAX; i += 1) guard.allow("1.2.3.4", 1000);

    expect(guard.allow("5.6.7.8", 1000)).toBe(true);
  });

  it("allows the visitor again after the window passes", () => {
    const guard = new RateLimitGuard();
    for (let i = 0; i < RATE_LIMIT_MAX; i += 1) guard.allow("1.2.3.4", 1000);

    expect(guard.allow("1.2.3.4", 1000 + RATE_LIMIT_WINDOW_MS + 1)).toBe(true);
  });
});
