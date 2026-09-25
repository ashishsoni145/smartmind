import { createApp } from './app';
import { config } from './config';
import { logger } from './lib/logger';

export const app = createApp();

let server: ReturnType<typeof app.listen> | undefined;

if (require.main === module) {
  server = app.listen(config.port, () => {
    logger.info(
      {
        port: config.port,
        env: config.env,
        apiPrefix: config.apiPrefix,
      },
      `🚀 SharpMind Backend API server started on http://localhost:${config.port}`
    );
  });

  const handleGracefulShutdown = (signal: string) => {
    logger.info(`Received ${signal}. Gracefully shutting down...`);
    if (server) {
      server.close(() => {
        logger.info('HTTP server closed successfully');
        process.exit(0);
      });
    }

    setTimeout(() => {
      logger.error('Could not close connections in time, forcefully shutting down');
      process.exit(1);
    }, 10000);
  };

  process.on('SIGTERM', () => handleGracefulShutdown('SIGTERM'));
  process.on('SIGINT', () => handleGracefulShutdown('SIGINT'));
}

export default app;
