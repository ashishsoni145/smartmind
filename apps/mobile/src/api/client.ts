import { ApiClientError, SharpMindApiClient } from '@sharpmind/api-client';
import { resolveApiUrl } from '../config/public-env';
import { TimeoutError } from '../utils/errors';

type TokenGetter = () => Promise<string | null>;

/** Default per-request timeout. Tutor replies get a longer budget via `authorizedFetch`. */
export const DEFAULT_TIMEOUT_MS = 20_000;
export const LONG_TIMEOUT_MS = 90_000;

let tokenGetter: TokenGetter = async () => null;
let client: SharpMindApiClient | null = null;
let unauthorizedHandler: (() => void) | null = null;
let lastUnauthorizedAt = 0;

export function setApiTokenGetter(getter: TokenGetter) {
  tokenGetter = getter;
  client = null;
}

export function setUnauthorizedHandler(handler: (() => void) | null) {
  unauthorizedHandler = handler;
}

function notifyUnauthorized() {
  // Several queries can fail at once after an expiry; collapse them into one handler call.
  const now = Date.now();
  if (now - lastUnauthorizedAt < 2_000) return;
  lastUnauthorizedAt = now;
  unauthorizedHandler?.();
}

/**
 * fetch with a hard timeout. React Native's fetch has none, so a dead network would
 * otherwise leave a spinner forever.
 */
export async function fetchWithTimeout(input: string, init: RequestInit = {}, timeoutMs = DEFAULT_TIMEOUT_MS): Promise<Response> {
  const controller = new AbortController();
  const outer = init.signal;
  if (outer) {
    if (outer.aborted) controller.abort();
    else outer.addEventListener('abort', () => controller.abort(), { once: true });
  }
  let timedOut = false;
  const timer = setTimeout(() => {
    timedOut = true;
    controller.abort();
  }, timeoutMs);
  try {
    return await fetch(input, { ...init, signal: controller.signal });
  } catch (error) {
    if (timedOut) throw new TimeoutError();
    throw error;
  } finally {
    clearTimeout(timer);
  }
}

function unconfiguredError(resolved: { reason?: string }): ApiClientError {
  return new ApiClientError(resolved.reason || 'The API URL is not configured for this build.', 0, 'API_NOT_CONFIGURED');
}

export function getApi(): SharpMindApiClient {
  if (!client) {
    const resolved = resolveApiUrl();
    if (!resolved.url) {
      // No fake data and no silent retarget: the call fails with the real reason.
      throw unconfiguredError(resolved);
    }
    client = new SharpMindApiClient({
      baseUrl: resolved.url,
      getToken: async () => tokenGetter(),
    });
  }
  return client;
}

/**
 * Runs a shared-client call with a timeout and 401 propagation. The shared client uses
 * the global fetch; we wrap the whole call rather than patching globals.
 */
export async function withApi<T>(work: (api: SharpMindApiClient) => Promise<T>, timeoutMs = DEFAULT_TIMEOUT_MS): Promise<T> {
  let timer: ReturnType<typeof setTimeout> | null = null;
  const timeout = new Promise<never>((_, reject) => {
    timer = setTimeout(() => reject(new TimeoutError()), timeoutMs);
  });
  try {
    return await Promise.race([work(getApi()), timeout]);
  } catch (error) {
    if (error instanceof ApiClientError && error.statusCode === 401) {
      notifyUnauthorized();
    }
    throw error;
  } finally {
    if (timer) clearTimeout(timer);
  }
}

export async function authorizedFetch(path: string, init: RequestInit = {}, timeoutMs = LONG_TIMEOUT_MS): Promise<Response> {
  const resolved = resolveApiUrl();
  if (!resolved.url) {
    throw unconfiguredError(resolved);
  }
  const token = await tokenGetter();
  const headers = new Headers(init.headers);
  if (!headers.has('Content-Type') && init.body) headers.set('Content-Type', 'application/json');
  if (token) headers.set('Authorization', `Bearer ${token}`);
  const response = await fetchWithTimeout(`${resolved.url}${path.startsWith('/') ? path : `/${path}`}`, { ...init, headers }, timeoutMs);
  if (response.status === 401) notifyUnauthorized();
  return response;
}

/** Unauthenticated reachability probe against the backend health route. */
export async function probeServer(timeoutMs = 6_000): Promise<'online' | 'server_error' | 'offline' | 'not_configured'> {
  const resolved = resolveApiUrl();
  if (!resolved.url) return 'not_configured';
  const healthUrl = resolved.url.replace(/\/api\/v1$/, '') + '/health';
  try {
    const response = await fetchWithTimeout(healthUrl, { method: 'GET' }, timeoutMs);
    if (response.ok || response.status === 404) return 'online';
    return response.status >= 500 ? 'server_error' : 'online';
  } catch {
    return 'offline';
  }
}

export { ApiClientError };
