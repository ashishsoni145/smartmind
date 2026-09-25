import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import express from 'express';
import request from 'supertest';
import pino from 'pino';
import { SlidingWindowRateLimiter, createRateLimiter } from '../middleware/rate-limit';
import { REDACT_PATHS } from '../lib/logger';
import { TooManyRequestsError } from '../lib/errors';
import { GeminiAiAdapter } from '../ai/providers/gemini.adapter';

/**
 * Backend API security hardening:
 *   - the transport rate limiter really limits, and limits the right identity;
 *   - credentials are redacted from logs;
 *   - the Gemini provider key travels in a header and never in a URL.
 *
 * Provider keys stay server-side; these tests assert that the server does not leak them through the
 * two channels that are easy to get wrong (logs and outbound URLs).
 */

function buildApp(handler: ReturnType<typeof createRateLimiter>) {
  const app = express();
  app.use(express.json());
  app.get('/health', (_req, res) => {
    res.json({ ok: true });
  });
  app.use('/api/v1', handler);
  app.get('/api/v1/thing', (_req, res) => {
    res.json({ ok: true });
  });
  // Mirrors the real error handler's contract for AppError.
  app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
    res.status(err.statusCode ?? 500).json({
      success: false,
      error: { code: err.code ?? 'INTERNAL_SERVER_ERROR', message: err.message, details: err.details },
    });
  });
  return app;
}

describe('SlidingWindowRateLimiter', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-09-25T12:00:00Z'));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('allows up to max requests and then denies within the same window', () => {
    const limiter = new SlidingWindowRateLimiter({ name: 'test', windowMs: 60_000, max: 3 });
    expect(limiter.consume('user:a', Date.now()).allowed).toBe(true);
    expect(limiter.consume('user:a', Date.now()).allowed).toBe(true);
    const third = limiter.consume('user:a', Date.now());
    expect(third.allowed).toBe(true);
    expect(third.remaining).toBe(0);
    const fourth = limiter.consume('user:a', Date.now());
    expect(fourth.allowed).toBe(false);
    expect(fourth.remaining).toBe(0);
    expect(fourth.resetInMs).toBeGreaterThan(0);
  });

  it('counts each identity separately', () => {
    const limiter = new SlidingWindowRateLimiter({ name: 'test', windowMs: 60_000, max: 1 });
    expect(limiter.consume('user:a', Date.now()).allowed).toBe(true);
    expect(limiter.consume('user:a', Date.now()).allowed).toBe(false);
    expect(limiter.consume('user:b', Date.now()).allowed).toBe(true);
  });

  it('lets the window slide instead of resetting it wholesale', () => {
    const limiter = new SlidingWindowRateLimiter({ name: 'test', windowMs: 1_000, max: 2 });
    const t0 = Date.now();
    expect(limiter.consume('user:a', t0).allowed).toBe(true);
    expect(limiter.consume('user:a', t0 + 100).allowed).toBe(true);
    expect(limiter.consume('user:a', t0 + 200).allowed).toBe(false);
    // Only the first hit has aged out of the 1 s window.
    expect(limiter.consume('user:a', t0 + 1_001).allowed).toBe(true);
    expect(limiter.consume('user:a', t0 + 1_002).allowed).toBe(false);
  });

  it('stays within its memory cap when flooded with distinct identities', () => {
    const limiter = new SlidingWindowRateLimiter({ name: 'test', windowMs: 60_000, max: 5 });
    for (let index = 0; index < 600; index += 1) {
      limiter.consume(`ip:10.0.${index % 256}.${index}`, Date.now());
      if (index % 512 === 0) vi.advanceTimersByTime(61_000);
    }
    expect(limiter.size).toBeLessThanOrEqual(20_000);
  });
});

describe('rate limiting over HTTP', () => {
  it('returns 429 with RATE_LIMITED and a Retry-After header once the cap is hit', async () => {
    const app = buildApp(createRateLimiter({ name: 'api', windowMs: 60_000, max: 2 }));
    const first = await request(app).get('/api/v1/thing');
    expect(first.status).toBe(200);
    expect(first.headers['ratelimit-limit']).toBe('2');
    expect(first.headers['ratelimit-remaining']).toBe('1');

    const second = await request(app).get('/api/v1/thing');
    expect(second.status).toBe(200);
    expect(second.headers['ratelimit-remaining']).toBe('0');

    const third = await request(app).get('/api/v1/thing');
    expect(third.status).toBe(429);
    expect(third.body.error.code).toBe('RATE_LIMITED');
    expect(Number(third.headers['retry-after'])).toBeGreaterThan(0);
    expect(third.body.error.message).toMatch(/too many requests/i);
  });

  it('never throttles the health probe the mobile client uses for its connectivity banner', async () => {
    const app = buildApp(createRateLimiter({ name: 'api', windowMs: 60_000, max: 1 }));
    for (let index = 0; index < 5; index += 1) {
      const res = await request(app).get('/health');
      expect(res.status).toBe(200);
    }
  });

  it('limits an authenticated caller per user, not per shared IP', async () => {
    const app = buildApp(
      createRateLimiter({
        name: 'api',
        windowMs: 60_000,
        max: 1,
        keyGenerator: (req) => `user:${(req.headers['x-user'] as string) ?? 'anonymous'}`,
      })
    );
    expect((await request(app).get('/api/v1/thing').set('x-user', 'alice')).status).toBe(200);
    expect((await request(app).get('/api/v1/thing').set('x-user', 'alice')).status).toBe(429);
    expect((await request(app).get('/api/v1/thing').set('x-user', 'bob')).status).toBe(200);
  });

  it('can skip a request without counting it', async () => {
    const app = buildApp(
      createRateLimiter({
        name: 'api',
        windowMs: 60_000,
        max: 1,
        skip: (req) => req.headers['x-cron'] === '1',
      })
    );
    for (let index = 0; index < 4; index += 1) {
      expect((await request(app).get('/api/v1/thing').set('x-cron', '1')).status).toBe(200);
    }
    expect((await request(app).get('/api/v1/thing')).status).toBe(200);
    expect((await request(app).get('/api/v1/thing')).status).toBe(429);
  });

  it('exposes TooManyRequestsError as a 429 AppError', () => {
    const error = new TooManyRequestsError();
    expect(error.statusCode).toBe(429);
    expect(error.code).toBe('RATE_LIMITED');
    expect(error.isOperational).toBe(true);
  });
});

describe('log redaction', () => {
  function capture() {
    const lines: string[] = [];
    const stream = {
      write(chunk: string) {
        lines.push(chunk);
      },
    };
    const instance = pino({ level: 'info', redact: { paths: REDACT_PATHS, censor: '[redacted]' } }, stream as any);
    return { instance, lines };
  }

  it('redacts a bearer token from a logged request', () => {
    const { instance, lines } = capture();
    instance.info(
      {
        req: {
          method: 'POST',
          url: '/api/v1/tutor/sessions/1/messages',
          headers: {
            authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.session-access-token.signature',
            cookie: 'sb-access-token=eyJhbGciOiJIUzI1NiJ9.cookie-token.signature',
            'content-type': 'application/json',
          },
        },
      },
      'request completed'
    );
    const output = lines.join('');
    expect(output).not.toContain('session-access-token');
    expect(output).not.toContain('cookie-token');
    expect(output).toContain('[redacted]');
    // Non-sensitive context survives, so the log is still useful.
    expect(output).toContain('/api/v1/tutor/sessions/1/messages');
    expect(output).toContain('application/json');
  });

  it('redacts privileged field names wherever they appear', () => {
    const { instance, lines } = capture();
    instance.info(
      {
        config: { service_role_key: 'super-secret-service-role', apiKey: 'AIzaSy-not-a-real-key' },
        user: { password: 'hunter2', email: 'student@example.com' },
      },
      'debug'
    );
    const output = lines.join('');
    expect(output).not.toContain('super-secret-service-role');
    expect(output).not.toContain('AIzaSy-not-a-real-key');
    expect(output).not.toContain('hunter2');
    expect(output).toContain('student@example.com');
  });
});

describe('Gemini provider credential transport', () => {
  const originalFetch = global.fetch;

  afterEach(() => {
    global.fetch = originalFetch;
    vi.restoreAllMocks();
  });

  it('sends the key in the x-goog-api-key header and never in the URL', async () => {
    const calls: { url: string; init: RequestInit }[] = [];
    global.fetch = vi.fn(async (input: any, init: any) => {
      calls.push({ url: String(input), init });
      return {
        ok: true,
        status: 200,
        json: async () => ({
          candidates: [{ content: { parts: [{ text: 'answer' }] }, finishReason: 'STOP' }],
          usageMetadata: { promptTokenCount: 3, candidatesTokenCount: 4 },
        }),
      } as any;
    }) as any;

    const adapter = new GeminiAiAdapter('test-gemini-key-value');
    const response = await adapter.complete({
      messages: [{ role: 'user', content: 'Explain projectile motion' }],
      taskType: 'tutor_explanation' as any,
      studentId: 'student-1',
    } as any);

    expect(calls).toHaveLength(1);
    expect(response.content).toBe('answer');
    // The URL must be loggable without leaking the credential.
    expect(calls[0].url).not.toContain('test-gemini-key-value');
    expect(calls[0].url).not.toContain('key=');
    expect(calls[0].url).toMatch(/models\/[^/]+:generateContent$/);
    const headers = calls[0].init.headers as Record<string, string>;
    expect(headers['x-goog-api-key']).toBe('test-gemini-key-value');
  });

  it('refuses to call the provider with no key configured', async () => {
    const previous = process.env.AI_GEMINI_API_KEY;
    const previousAlt = process.env.GEMINI_API_KEY;
    delete process.env.AI_GEMINI_API_KEY;
    delete process.env.GEMINI_API_KEY;
    try {
      const adapter = new GeminiAiAdapter();
      await expect(
        adapter.complete({ messages: [{ role: 'user', content: 'hi' }], taskType: 'tutor_hint' as any } as any)
      ).rejects.toThrow(/not configured/i);
    } finally {
      if (previous !== undefined) process.env.AI_GEMINI_API_KEY = previous;
      if (previousAlt !== undefined) process.env.GEMINI_API_KEY = previousAlt;
    }
  });
});
