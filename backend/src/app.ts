import express, { Express } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import { config } from './config';
import { httpLogger } from './lib/logger';
import { errorHandler, notFoundHandler } from './lib/error-handler';
import { healthRoutes } from './modules/health/health.routes';
import { userRoutes } from './modules/users/user.routes';
import { onboardingRoutes } from './modules/onboarding/onboarding.routes';
import { fileRoutes } from './modules/files/file.routes';
import { searchRoutes } from './modules/search/search.routes';
import { curriculumRoutes } from './modules/curriculum/curriculum.routes';
import { graphRoutes } from './modules/knowledge-graph/graph.routes';
import { questionRoutes } from './modules/questions/question.routes';
import { studentModelRoutes } from './modules/student-model/student-model.routes';
import { diagnosticRoutes } from './modules/diagnostic/diagnostic.routes';
import { backlogRoutes } from './modules/backlog/backlog.routes';
import { plannerRoutes } from './modules/planner/planner.routes';
import { revisionRoutes } from './modules/revision/revision.routes';
import { assessmentRoutes } from './modules/assessments/assessment.routes';
import { mistakeRoutes } from './modules/mistakes/mistake.routes';
import { readinessRoutes } from './modules/readiness/readiness.routes';
import { tutorRoutes } from './modules/tutor/tutor.routes';
import { materialRoutes } from './modules/materials/material.routes';
import { focusRoutes } from './modules/focus/focus.routes';
import { analyticsRoutes } from './modules/analytics/analytics.routes';
import { notificationRoutes } from './modules/notifications/notification.routes';
import { createRateLimiter } from './middleware/rate-limit';

export const createApp = (): Express => {
  const app = express();

  // Security & standard middlewares
  app.use(helmet());
  app.use(
    cors({
      origin: (origin, callback) => {
        // Allow requests with no origin (like mobile apps, curl, server-to-server)
        if (!origin) return callback(null, true);

        // Check configured allowlist (wildcard strictly prohibited in production unless patterned)
        if (!config.isProduction && config.cors.origin.includes('*')) {
          return callback(null, true);
        }

        const isAllowed = config.cors.origin.some((allowedPattern) => {
          if (allowedPattern === origin) return true;
          if (allowedPattern.includes('*')) {
            // e.g. https://*.vercel.app or *.vercel.app
            const regexStr = '^' + allowedPattern.replace(/[.+?^${}()|[\]\\]/g, '\\$&').replace(/\*/g, '.*') + '$';
            return new RegExp(regexStr).test(origin);
          }
          return false;
        });

        if (isAllowed) {
          return callback(null, true);
        }

        // In development or test, allow local dev servers
        if (!config.isProduction) {
          if (/^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin)) {
            return callback(null, true);
          }
        }

        // Disallowed origin
        return callback(new Error(`CORS policy violation: origin ${origin} is not allowed`));
      },
      credentials: config.cors.credentials,
    })
  );
  app.use(compression());
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));

  // Request logger
  app.use(httpLogger);

  // Health checks mounted at root and api prefix
  app.use('/health', healthRoutes);
  app.use(`${config.apiPrefix}/health`, healthRoutes);

  /**
   * Transport-level rate limiting for the versioned API.
   *
   * Mounted AFTER the health routes on purpose: the Android client probes /health to draw its
   * connectivity banner, and a throttled health probe would report a false outage. Authenticated
   * callers are counted per user id, anonymous callers per IP. AI-heavy routes get a much tighter
   * second cap (see middleware/ai-rate-limit.ts).
   *
   * This is process-local state, so on a serverless deployment it bounds per-instance bursts rather
   * than providing an exact global quota. It is a coarse abuse brake, not the entitlement check -
   * authorisation, ownership and the per-student AI token budget remain authoritative elsewhere.
   */
  if (config.rateLimit.enabled) {
    app.use(
      config.apiPrefix,
      createRateLimiter({
        name: 'api',
        windowMs: config.rateLimit.windowMs,
        max: config.rateLimit.max,
      })
    );
  }

  // Modular API routes
  app.use(`${config.apiPrefix}/users`, userRoutes);
  app.use(`${config.apiPrefix}/onboarding`, onboardingRoutes);
  app.use(`${config.apiPrefix}/files`, fileRoutes);
  app.use(`${config.apiPrefix}/search`, searchRoutes);
  app.use(`${config.apiPrefix}/curriculum`, curriculumRoutes);
  app.use(`${config.apiPrefix}/graph`, graphRoutes);
  app.use(`${config.apiPrefix}/questions`, questionRoutes);

  // Phase 04: Intelligence Layer
  app.use(`${config.apiPrefix}/student-model`, studentModelRoutes);
  app.use(`${config.apiPrefix}/diagnostic`, diagnosticRoutes);
  app.use(`${config.apiPrefix}/backlog`, backlogRoutes);
  app.use(`${config.apiPrefix}/planner`, plannerRoutes);
  app.use(`${config.apiPrefix}/revision`, revisionRoutes);

  // Phase 05: Assessment, Mistakes & Exam Readiness
  app.use(`${config.apiPrefix}/assessments`, assessmentRoutes);
  app.use(`${config.apiPrefix}/mistakes`, mistakeRoutes);
  app.use(`${config.apiPrefix}/readiness`, readinessRoutes);

  // Phase 06: AI Orchestration & Socratic Tutor
  app.use(`${config.apiPrefix}/tutor`, tutorRoutes);

  // Phase 07: Study Material Intelligence, Focus Mode, Analytics & Notifications
  app.use(`${config.apiPrefix}/materials`, materialRoutes);
  app.use(`${config.apiPrefix}/focus`, focusRoutes);
  app.use(`${config.apiPrefix}/analytics`, analyticsRoutes);
  app.use(`${config.apiPrefix}/notifications`, notificationRoutes);

  // Catch-all 404 handler
  app.use(notFoundHandler);

  // Global error handler
  app.use(errorHandler);

  return app;
};

export default createApp;

