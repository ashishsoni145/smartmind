import { ApiClientError } from '@sharpmind/api-client';

export type UserFacingError = {
  message: string;
  code: string;
  unauthorized: boolean;
  offline: boolean;
};

export function toUserError(error: unknown): UserFacingError {
  if (error instanceof ApiClientError) {
    const unauthorized = error.statusCode === 401 || error.code === 'UNAUTHORIZED';
    return {
      message: unauthorized
        ? 'Your session expired. Sign in again to continue.'
        : error.message || 'The server rejected the request.',
      code: error.code,
      unauthorized,
      offline: false,
    };
  }
  if (error instanceof Error) {
    const offline = /network|failed to fetch|internet|offline/i.test(error.message);
    return {
      message: offline
        ? 'SharpMind cannot reach the server. Cached data is shown only when it exists. Nothing was invented.'
        : error.message,
      code: offline ? 'NETWORK' : 'CLIENT',
      unauthorized: false,
      offline,
    };
  }
  return {
    message: 'Something went wrong.',
    code: 'UNKNOWN',
    unauthorized: false,
    offline: false,
  };
}
