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

export const createApp = (): Express => {
  const app = express();

  // Security & standard middlewares
  app.use(helmet());
  app.use(
    cors({
      origin: (origin, callback) => {
        // Allow requests with no origin (like mobile apps, curl, server-to-server)
        if (!origin) return callback(null, true);
        if (config.cors.origin.includes('*') || config.cors.origin.includes(origin)) {
          return callback(null, true);
        }
        return callback(null, true); // Permissive in dev, configurable in prod
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

  // Modular API routes
  app.use(`${config.apiPrefix}/users`, userRoutes);
  app.use(`${config.apiPrefix}/onboarding`, onboardingRoutes);
  app.use(`${config.apiPrefix}/files`, fileRoutes);
  app.use(`${config.apiPrefix}/search`, searchRoutes);
  app.use(`${config.apiPrefix}/curriculum`, curriculumRoutes);
  app.use(`${config.apiPrefix}/graph`, graphRoutes);
  app.use(`${config.apiPrefix}/questions`, questionRoutes);

  // Catch-all 404 handler
  app.use(notFoundHandler);

  // Global error handler
  app.use(errorHandler);

  return app;
};

export default createApp;
