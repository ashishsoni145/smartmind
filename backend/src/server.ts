import { createApp } from './app';
import { config } from './config';
import { logger } from './lib/logger';

const app = createApp();

const server = app.listen(config.port, () => {
  logger.info(
    {
      port: config.port,
      env: config.env,
      apiPrefix: config.apiPrefix,
    },
    `🚀 SharpMind Backend API server started on http://localhost:${config.port}`
  );
});

// Graceful shutdown handling
const handleGracefulShutdown = (signal: string) => {
  logger.info(`Received ${signal}. Gracefully shutting down...`);
  server.close(() => {
    logger.info('HTTP server closed successfully');
    process.exit(0);
  });

  // Force close after 10s if dangling connections exist
  setTimeout(() => {
    logger.error('Could not close connections in time, forcefully shutting down');
    process.exit(1);
  }, 10000);
};

process.on('SIGTERM', () => handleGracefulShutdown('SIGTERM'));
process.on('SIGINT', () => handleGracefulShutdown('SIGINT'));

export default server;
