import { NextFunction, Request, RequestHandler, Response } from 'express';
import { config } from '../config';
import { SlidingWindowRateLimiter } from './rate-limit';

/**
 * One shared limiter for every route that spends money on an AI provider.
 *
 * A single counter is used across the tutor, analytics and materials routes on purpose: three
 * independent limiters would let one client spend three times the intended AI budget by rotating
 * endpoints. This is a transport-level cap; the authoritative per-student token budget is enforced
 * inside `ai/router/model-router.ts`, and entitlements stay server-side.
 *
 * The caller is always authenticated when this runs (it is mounted after `requireAuth`), so the
 * counter is keyed by user id and one abusive account cannot exhaust the budget of everyone behind
 * the same NAT address.
 */
let shared: SlidingWindowRateLimiter | null = null;
let sharedHandler: RequestHandler | null = null;

function handler(): RequestHandler {
  if (!sharedHandler) {
    shared = new SlidingWindowRateLimiter({
      name: 'AI',
      windowMs: config.rateLimit.aiWindowMs,
      max: config.rateLimit.aiMax,
      keyGenerator: (req: Request) => `user:${req.user?.id ?? req.ip ?? 'unknown'}`,
    });
    sharedHandler = shared.middleware();
  }
  return sharedHandler;
}

/** Test hook: drop the counters so suites do not inherit each other's usage. */
export function resetAiRateLimiter(): void {
  shared?.reset();
}

export const aiRateLimit: RequestHandler = (req: Request, res: Response, next: NextFunction): void => {
  if (!config.rateLimit.enabled) {
    next();
    return;
  }
  handler()(req, res, next);
};
