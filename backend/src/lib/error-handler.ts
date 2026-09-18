import { Request, Response, NextFunction, ErrorRequestHandler } from 'express';
import { ZodError } from 'zod';
import { AppError } from './errors';
import { sendError } from './api-response';
import { logger } from './logger';
import { config } from '../config';

export const errorHandler: ErrorRequestHandler = (
  err: Error | AppError | ZodError,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _next: NextFunction
): void => {
  if (err instanceof AppError) {
    if (!err.isOperational) {
      logger.error({ err, url: req.url, method: req.method }, 'Non-operational AppError occurred');
    }
    sendError(res, err.message, err.statusCode, err.code, err.details);
    return;
  }

  if (err instanceof ZodError) {
    const details = err.errors.map((e) => ({
      path: e.path.join('.'),
      message: e.message,
      code: e.code,
    }));
    sendError(res, 'Validation error', 422, 'VALIDATION_ERROR', details);
    return;
  }

  // Supabase postgrest errors often have code and message
  const supabaseErr = err as { code?: string; message?: string; details?: string };
  if (supabaseErr.code && supabaseErr.message) {
    logger.error({ err, url: req.url }, 'Supabase PostgREST Error');
    sendError(res, supabaseErr.message, 400, `DB_${supabaseErr.code}`, supabaseErr.details);
    return;
  }

  // Unexpected unhandled error
  logger.error(
    {
      err: {
        name: err.name,
        message: err.message,
        stack: config.isDevelopment ? err.stack : undefined,
      },
      url: req.url,
      method: req.method,
    },
    'Unhandled server error'
  );

  sendError(
    res,
    config.isProduction ? 'Internal Server Error' : err.message,
    500,
    'INTERNAL_SERVER_ERROR',
    config.isDevelopment ? { stack: err.stack } : undefined
  );
};

export const notFoundHandler = (req: Request, res: Response): void => {
  sendError(res, `Cannot ${req.method} ${req.url}`, 404, 'ROUTE_NOT_FOUND');
};
