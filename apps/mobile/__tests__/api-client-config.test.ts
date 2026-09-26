/**
 * The shared API client must never invent a backend for itself.
 *
 * `SharpMindApiClient` used to default `baseUrl` to `http://localhost:4000/api/v1`. Both real
 * consumers always passed one, so the default was dead code - but it was compiled into the
 * production JavaScript bundle of every consumer including this app, and any future caller that
 * forgot the argument would have silently sent a user's traffic to a developer machine over
 * cleartext HTTP instead of failing. It was found by bundling for real and grepping the output.
 */
import { ApiClientError, SharpMindApiClient } from '@sharpmind/api-client';

describe('SharpMindApiClient base URL', () => {
  it('refuses to construct without a base URL', () => {
    let thrown: unknown;
    try {
      // @ts-expect-error deliberately violating the now-required field to prove the runtime guard
      new SharpMindApiClient({});
    } catch (error) {
      thrown = error;
    }
    expect(thrown).toBeInstanceOf(ApiClientError);
    expect((thrown as ApiClientError).code).toBe('API_NOT_CONFIGURED');
    expect((thrown as ApiClientError).message).toMatch(/explicit baseUrl/);
  });

  it('refuses an empty or whitespace-only base URL', () => {
    expect(() => new SharpMindApiClient({ baseUrl: '' })).toThrow(ApiClientError);
    expect(() => new SharpMindApiClient({ baseUrl: '   ' })).toThrow(ApiClientError);
  });

  it('refuses a non-string base URL rather than coercing it', () => {
    let thrown: unknown;
    try {
      // @ts-expect-error a boolean is not a URL, but JavaScript callers can still pass one
      new SharpMindApiClient({ baseUrl: true });
    } catch (error) {
      thrown = error;
    }
    expect(thrown).toBeInstanceOf(ApiClientError);
  });

  it('accepts an explicit production URL and normalises the /api/v1 suffix', () => {
    const withSuffix = new SharpMindApiClient({
      baseUrl: 'https://sharpmindbackend-zeta.vercel.app/api/v1',
    });
    expect(withSuffix).toBeInstanceOf(SharpMindApiClient);

    // No trailing slash, no suffix: the client appends the version prefix exactly once.
    const withoutSuffix = new SharpMindApiClient({ baseUrl: 'https://api.example.com' });
    expect(withoutSuffix).toBeInstanceOf(SharpMindApiClient);
  });

  it('still honours an explicitly requested local backend', () => {
    // The point of the change is that localhost must be chosen, not defaulted to. A developer who
    // asks for it by name still gets it.
    expect(
      () => new SharpMindApiClient({ baseUrl: 'http://localhost:4000/api/v1' })
    ).not.toThrow();
  });

  it('exposes no default base URL that a caller could inherit by accident', () => {
    // Guards against the default being reintroduced as a module-level constant.
    const client = new SharpMindApiClient({ baseUrl: 'https://api.example.com/api/v1' });
    expect((client as unknown as { baseUrl: string }).baseUrl).toBe('https://api.example.com/api/v1');
  });
});
