import pino from 'pino';
import pinoHttp from 'pino-http';
import { config } from '../config';

/**
 * Log redaction.
 *
 * `pino-http`'s request serializer logs the full header map, so without this a student's
 * `Authorization: Bearer <Supabase access token>` and any session cookie would be written to the
 * log stream in clear text. Provider keys are read from the environment and are never attached to a
 * request object, but the field names below are redacted anyway so that no future change can leak
 * them through a log line.
 *
 * Redaction is by path, so the structure of the log stays useful for debugging while the values do
 * not survive.
 */
export const REDACT_PATHS = [
  // Request credentials.
  'req.headers.authorization',
  'req.headers.cookie',
  'req.headers["x-api-key"]',
  'req.headers["x-goog-api-key"]',
  'req.headers["api-key"]',
  // Response credentials.
  'res.headers["set-cookie"]',
  // Server-only secrets, wherever they might be attached.
  '*.service_role_key',
  '*.serviceRoleKey',
  '*.supabase_service_role_key',
  '*.accessToken',
  '*.access_token',
  '*.refreshToken',
  '*.refresh_token',
  '*.apiKey',
  '*.api_key',
  '*.password',
  '*.connectionString',
  '*.databaseUrl',
];

export const logger = pino({
  level: config.logging.level,
  redact: {
    paths: REDACT_PATHS,
    censor: '[redacted]',
  },
  transport: config.isDevelopment
    ? {
        target: 'pino-pretty',
        options: {
          colorize: true,
          translateTime: 'SYS:standard',
          ignore: 'pid,hostname',
        },
      }
    : undefined,
});

export const httpLogger = pinoHttp({
  logger,
  autoLogging: {
    ignore: (req) => {
      // Don't log health check pings repeatedly in logs. The Android client probes /health to draw
      // its connectivity banner, so this would otherwise be the noisiest line in the log.
      return req.url === '/api/v1/health' || req.url === '/health';
    },
  },
  customLogLevel: (_req, res, err) => {
    if (res.statusCode >= 500 || err) return 'error';
    if (res.statusCode >= 400) return 'warn';
    return 'info';
  },
});

export default logger;
