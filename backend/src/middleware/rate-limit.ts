import { NextFunction, Request, RequestHandler, Response } from 'express';
import { TooManyRequestsError } from '../lib/errors';
import { logger } from '../lib/logger';

/**
 * Dependency-free sliding-window rate limiter.
 *
 * WHY THIS EXISTS
 * Hiding provider keys in the backend stops the keys from leaking, but it does not stop the public
 * API from being abused: anyone can download the APK, read the backend URL out of it and call the
 * authenticated endpoints with a real student session. The authoritative per-student AI budget
 * already lives in `ai/router/model-router.ts`; this adds a coarse transport-level cap so a runaway
 * or malicious client cannot hammer every other route.
 *
 * HONEST LIMITATION
 * State is in process memory. On Vercel each function instance has its own counters, so this bounds
 * per-instance bursts rather than providing a globally exact quota. A real global quota needs shared
 * state (Upstash/Redis) or an edge layer, which is tracked as a follow-up rather than pretended to
 * be solved here.
 */

export interface RateLimitOptions {
  /** Human-readable bucket name, used in the log line and the 429 detail. */
  name: string;
  /** Window length in milliseconds. Defaults to 60 s. */
  windowMs?: number;
  /** Maximum requests per window per identity. Defaults to 120. */
  max?: number;
  /**
   * Identity for the counter. Authenticated callers are limited per user so one abusive device
   * cannot exhaust a shared NAT address for everyone behind it; anonymous callers fall back to IP.
   */
  keyGenerator?: (req: Request) => string;
  /** Return true to bypass the limiter (health probes, cron with a valid secret, tests). */
  skip?: (req: Request) => boolean;
}

interface Bucket {
  /** Request timestamps inside the current window, oldest first. */
  hits: number[];
}

/** Hard cap on tracked identities so a flood of distinct IPs cannot exhaust memory. */
const MAX_TRACKED_KEYS = 20_000;

export class SlidingWindowRateLimiter {
  private readonly buckets = new Map<string, Bucket>();
  private readonly name: string;
  private readonly windowMs: number;
  private readonly max: number;
  private readonly keyGenerator?: (req: Request) => string;
  private readonly skip?: (req: Request) => boolean;
  private pruneCounter = 0;

  constructor(options: RateLimitOptions) {
    this.name = options.name;
    this.windowMs = options.windowMs ?? 60_000;
    this.max = options.max ?? 120;
    this.keyGenerator = options.keyGenerator;
    this.skip = options.skip;
  }

  private keyFor(req: Request): string {
    if (this.keyGenerator) return this.keyGenerator(req);
    const userId = req.user?.id;
    if (userId) return `user:${userId}`;
    const forwarded = req.headers['x-forwarded-for'];
    const ip = (Array.isArray(forwarded) ? forwarded[0] : forwarded)?.split(',')[0].trim() || req.ip || req.socket?.remoteAddress || 'unknown';
    return `ip:${ip}`;
  }

  private prune(now: number): void {
    // Amortised: a full sweep at most every 512 requests, plus an emergency sweep at the cap.
    this.pruneCounter += 1;
    if (this.pruneCounter < 512 && this.buckets.size < MAX_TRACKED_KEYS) return;
    this.pruneCounter = 0;
    const cutoff = now - this.windowMs;
    for (const [key, bucket] of this.buckets) {
      while (bucket.hits.length > 0 && bucket.hits[0] <= cutoff) bucket.hits.shift();
      if (bucket.hits.length === 0) this.buckets.delete(key);
    }
    if (this.buckets.size >= MAX_TRACKED_KEYS) {
      // Still full: drop the least recently active identities rather than growing without bound.
      const entries = [...this.buckets.entries()].sort((a, b) => (a[1].hits[0] ?? 0) - (b[1].hits[0] ?? 0));
      for (const [key] of entries.slice(0, Math.ceil(entries.length / 4))) this.buckets.delete(key);
      logger.warn({ limiter: this.name, tracked: this.buckets.size }, 'Rate limiter evicted idle identities to stay within its memory cap');
    }
  }

  /** Pure decision function, exported for tests. */
  consume(key: string, now: number): { allowed: boolean; remaining: number; resetInMs: number; limit: number } {
    const { windowMs, max } = this;
    const cutoff = now - windowMs;
    let bucket = this.buckets.get(key);
    if (!bucket) {
      bucket = { hits: [] };
      this.buckets.set(key, bucket);
    }
    while (bucket.hits.length > 0 && bucket.hits[0] <= cutoff) bucket.hits.shift();

    if (bucket.hits.length >= max) {
      const oldest = bucket.hits[0];
      return { allowed: false, remaining: 0, resetInMs: Math.max(1_000, oldest + windowMs - now), limit: max };
    }
    bucket.hits.push(now);
    return { allowed: true, remaining: max - bucket.hits.length, resetInMs: windowMs, limit: max };
  }

  get size(): number {
    return this.buckets.size;
  }

  reset(): void {
    this.buckets.clear();
    this.pruneCounter = 0;
  }

  middleware(): RequestHandler {
    return (req: Request, res: Response, next: NextFunction): void => {
      if (this.skip?.(req)) {
        next();
        return;
      }
      const now = Date.now();
      this.prune(now);
      const key = this.keyFor(req);
      const decision = this.consume(key, now);

      res.setHeader('RateLimit-Limit', String(decision.limit));
      res.setHeader('RateLimit-Remaining', String(Math.max(0, decision.remaining)));
      res.setHeader('RateLimit-Reset', String(Math.ceil(decision.resetInMs / 1000)));

      if (!decision.allowed) {
        const retryAfterSeconds = Math.ceil(decision.resetInMs / 1000);
        res.setHeader('Retry-After', String(retryAfterSeconds));
        // Log the identity class, never a token or a header value.
        logger.warn(
          { limiter: this.name, keyPrefix: key.slice(0, key.indexOf(':') + 1), retryAfterSeconds },
          'Rate limit exceeded',
        );
        next(
          new TooManyRequestsError(
            `Too many requests to the ${this.name} endpoints. Try again in ${retryAfterSeconds}s.`,
            { retryAfterSeconds },
          ),
        );
        return;
      }
      next();
    };
  }
}

export function createRateLimiter(options: RateLimitOptions): RequestHandler {
  return new SlidingWindowRateLimiter(options).middleware();
}
