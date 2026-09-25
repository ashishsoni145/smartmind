import { ApiClientError, SharpMindApiClient } from '@sharpmind/api-client';
import { resolveApiUrl } from '../config/public-env';

type TokenGetter = () => Promise<string | null>;

let tokenGetter: TokenGetter = async () => null;
let client: SharpMindApiClient | null = null;
let unauthorizedHandler: (() => void) | null = null;

export function setApiTokenGetter(getter: TokenGetter) {
  tokenGetter = getter;
  client = null;
}

export function setUnauthorizedHandler(handler: () => void) {
  unauthorizedHandler = handler;
}

export function getApi(): SharpMindApiClient {
  if (!client) {
    const resolved = resolveApiUrl();
    if (!resolved.url) {
      throw new ApiClientError('The API URL is not configured for this build.', 0, 'API_NOT_CONFIGURED');
    }
    client = new SharpMindApiClient({
      baseUrl: resolved.url,
      getToken: async () => tokenGetter(),
    });
  }
  return client;
}

export async function authorizedFetch(path: string, init: RequestInit = {}): Promise<Response> {
  const resolved = resolveApiUrl();
  if (!resolved.url) {
    throw new ApiClientError('The API URL is not configured for this build.', 0, 'API_NOT_CONFIGURED');
  }
  const token = await tokenGetter();
  const headers = new Headers(init.headers);
  if (!headers.has('Content-Type') && init.body) headers.set('Content-Type', 'application/json');
  if (token) headers.set('Authorization', `Bearer ${token}`);
  const response = await fetch(`${resolved.url}${path.startsWith('/') ? path : `/${path}`}`, { ...init, headers });
  if (response.status === 401) unauthorizedHandler?.();
  return response;
}

export async function withApi<T>(work: (api: SharpMindApiClient) => Promise<T>): Promise<T> {
  try {
    return await work(getApi());
  } catch (error) {
    if (error instanceof ApiClientError && error.statusCode === 401) {
      unauthorizedHandler?.();
    }
    throw error;
  }
}

export { ApiClientError };
