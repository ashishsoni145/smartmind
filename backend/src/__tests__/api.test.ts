import { describe, it, expect, vi, beforeEach } from 'vitest';
import request from 'supertest';
import { createApp } from '../app';
import { supabase } from '../db/client';

vi.mock('../db/client', () => ({
  supabase: {
    from: vi.fn(),
  },
}));

describe('SharpMind Academic OS Backend API Suite', () => {
  const app = createApp();

  beforeEach(() => {
    vi.clearAllMocks();

    (supabase.from as any).mockImplementation(() => {
      const createChain = () => {
        const chain: any = {
          select: vi.fn(() => chain),
          or: vi.fn(() => chain),
          eq: vi.fn(() => chain),
          ilike: vi.fn(() => chain),
          limit: vi.fn(() => chain),
          then: (resolve: any) => resolve({ data: [], error: null }),
        };
        return chain;
      };
      return createChain();
    });
  });

  it('GET /health should return 200 OK with system status', async () => {
    const res = await request(app).get('/health');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.status).toBe('ok');
    expect(res.body.data.version).toBe('0.1.0');
    expect(res.body.data.uptimeSeconds).toBeGreaterThanOrEqual(0);
  });

  it('GET /api/v1/health should also return 200 OK under API prefix', async () => {
    const res = await request(app).get('/api/v1/health');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.status).toBe('ok');
  });

  it('GET /api/v1/health/db should verify live Supabase database connectivity', async () => {
    const res = await request(app).get('/api/v1/health/db');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.status).toBe('ok');
    expect(res.body.data.database).toBe('connected');
    expect(typeof res.body.data.latencyMs).toBe('number');
  });

  it('GET /api/v1/users/me should require authorization and reject unauthenticated requests', async () => {
    const res = await request(app).get('/api/v1/users/me');
    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
    expect(res.body.error.code).toBe('UNAUTHORIZED');
  });

  it('GET /api/v1/files should require authorization and reject unauthenticated requests', async () => {
    const res = await request(app).get('/api/v1/files');
    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
    expect(res.body.error.code).toBe('UNAUTHORIZED');
  });

  it('GET /api/v1/search should allow searching public taxonomy without crash', async () => {
    const res = await request(app).get('/api/v1/search?q=physics&scope=curriculum');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.query).toBe('physics');
    expect(Array.isArray(res.body.data.results)).toBe(true);
  });

  it('GET /api/v1/nonexistent-route should return 404', async () => {
    const res = await request(app).get('/api/v1/nonexistent-route');
    expect(res.status).toBe(404);
    expect(res.body.success).toBe(false);
    expect(res.body.error.code).toBe('ROUTE_NOT_FOUND');
  });
});
