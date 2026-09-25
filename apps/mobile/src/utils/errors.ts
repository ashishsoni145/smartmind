import { ApiClientError } from '@sharpmind/api-client';

export type ErrorKind =
  | 'offline'
  | 'timeout'
  | 'unauthorized'
  | 'forbidden'
  | 'not_found'
  | 'conflict'
  | 'validation'
  | 'rate_limited'
  | 'server'
  | 'not_configured'
  | 'native_unavailable'
  | 'client'
  | 'unknown';

export type UserFacingError = {
  message: string;
  code: string;
  kind: ErrorKind;
  /** Safe to retry the same request without side effects (reads). Mutations must still be guarded by the caller. */
  retryable: boolean;
  unauthorized: boolean;
  offline: boolean;
  statusCode: number | null;
};

export class TimeoutError extends Error {
  constructor(message = 'The server did not answer in time.') {
    super(message);
    this.name = 'TimeoutError';
  }
}

const NETWORK_PATTERN = /network request failed|failed to fetch|networkerror|network error|internet|offline|econnrefused|enotfound|socket|unable to resolve host/i;

function fromStatus(status: number, code: string, serverMessage: string | undefined): UserFacingError {
  const base = { code, statusCode: status, unauthorized: false, offline: false };
  if (status === 401 || code === 'UNAUTHORIZED') {
    return { ...base, kind: 'unauthorized', unauthorized: true, retryable: false, message: 'Your session expired. Sign in again to continue.' };
  }
  if (status === 403) {
    return { ...base, kind: 'forbidden', retryable: false, message: serverMessage || 'Your account is not allowed to do that.' };
  }
  if (status === 404) {
    return { ...base, kind: 'not_found', retryable: false, message: serverMessage || 'That item no longer exists on the server.' };
  }
  if (status === 409) {
    return { ...base, kind: 'conflict', retryable: false, message: serverMessage || 'The server already has a newer version of this. Refresh before trying again.' };
  }
  if (status === 422 || status === 400) {
    return { ...base, kind: 'validation', retryable: false, message: serverMessage || 'The server rejected the request as invalid.' };
  }
  if (status === 429) {
    return { ...base, kind: 'rate_limited', retryable: true, message: 'Too many requests. Wait a moment and try again.' };
  }
  if (status >= 500) {
    return { ...base, kind: 'server', retryable: true, message: 'SharpMind\u2019s server hit an error. Your data was not changed on this device. Try again shortly.' };
  }
  if (status === 0 && code === 'API_NOT_CONFIGURED') {
    return { ...base, kind: 'not_configured', retryable: false, message: serverMessage || 'This build has no API URL configured.' };
  }
  if (code === 'PARSE_ERROR') {
    return { ...base, kind: 'server', retryable: true, message: 'The server sent a malformed response. Nothing was assumed from it.' };
  }
  return { ...base, kind: 'client', retryable: false, message: serverMessage || 'The server rejected the request.' };
}

export function toUserError(error: unknown): UserFacingError {
  if (error instanceof ApiClientError) {
    return fromStatus(error.statusCode, error.code, error.message || undefined);
  }
  if (error instanceof TimeoutError || (error instanceof Error && error.name === 'TimeoutError')) {
    return {
      message: 'The server did not answer in time. Check your connection and try again.',
      code: 'TIMEOUT',
      kind: 'timeout',
      retryable: true,
      unauthorized: false,
      offline: true,
      statusCode: null,
    };
  }
  if (error instanceof Error && error.name === 'AbortError') {
    return { message: 'Request cancelled.', code: 'ABORTED', kind: 'client', retryable: true, unauthorized: false, offline: false, statusCode: null };
  }
  if (error instanceof Error && error.name === 'NativeUnavailableError') {
    return { message: error.message, code: 'NATIVE_UNAVAILABLE', kind: 'native_unavailable', retryable: false, unauthorized: false, offline: false, statusCode: null };
  }
  if (error instanceof Error) {
    const offline = NETWORK_PATTERN.test(error.message);
    return {
      message: offline
        ? 'SharpMind cannot reach the server. Nothing was saved or invented. Reconnect and retry.'
        : error.message || 'Something went wrong.',
      code: offline ? 'NETWORK' : 'CLIENT',
      kind: offline ? 'offline' : 'client',
      retryable: offline,
      unauthorized: false,
      offline,
      statusCode: null,
    };
  }
  return {
    message: 'Something went wrong.',
    code: 'UNKNOWN',
    kind: 'unknown',
    retryable: false,
    unauthorized: false,
    offline: false,
    statusCode: null,
  };
}

/** Short label for status chips; never uses color alone. */
export function errorKindLabel(kind: ErrorKind): string {
  switch (kind) {
    case 'offline':
    case 'timeout':
      return 'Offline';
    case 'unauthorized':
      return 'Session expired';
    case 'server':
      return 'Server error';
    case 'not_configured':
      return 'Not configured';
    case 'native_unavailable':
      return 'Unavailable on this build';
    default:
      return 'Error';
  }
}
