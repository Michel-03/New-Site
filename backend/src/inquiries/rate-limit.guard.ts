import { CanActivate, ExecutionContext, HttpException, HttpStatus, Injectable } from "@nestjs/common";

type RequestLike = {
  ip?: string;
  headers: Record<string, string | string[] | undefined>;
};

export const RATE_LIMIT_MAX = 5;
export const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000;

/**
 * Allows a visitor a few enquiries per hour so the form cannot be used to flood the inbox.
 * Counts are kept in memory, so on serverless hosting each running instance keeps its own
 * count. That still stops simple floods; use a shared store if stricter limits are needed.
 */
@Injectable()
export class RateLimitGuard implements CanActivate {
  private readonly hits = new Map<string, number[]>();
  private readonly max = RATE_LIMIT_MAX;
  private readonly windowMs = RATE_LIMIT_WINDOW_MS;

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<RequestLike>();
    return this.allow(this.visitorKey(request));
  }

  allow(key: string, now = Date.now()): boolean {
    const recent = (this.hits.get(key) ?? []).filter((time) => now - time < this.windowMs);
    if (recent.length >= this.max) {
      this.hits.set(key, recent);
      throw new HttpException(
        "Too many enquiries from this connection. Please try again later or email us directly.",
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }
    recent.push(now);
    this.hits.set(key, recent);
    this.prune(now);
    return true;
  }

  private visitorKey(request: RequestLike): string {
    const forwarded = request.headers["x-forwarded-for"];
    const first = (Array.isArray(forwarded) ? forwarded[0] : forwarded)?.split(",")[0]?.trim();
    return first || request.ip || "unknown";
  }

  // Keeps the map from growing without limit.
  private prune(now: number) {
    if (this.hits.size < 1000) return;
    for (const [key, times] of this.hits) {
      if (times.every((time) => now - time >= this.windowMs)) this.hits.delete(key);
    }
  }
}
