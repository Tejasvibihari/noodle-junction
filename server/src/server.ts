import http from 'node:http';
import { createApp } from './app.js';
import { connectDb, disconnectDb } from './config/db.js';
import { env } from './config/env.js';
import { logger } from './config/logger.js';
import { connectRedis, disconnectRedis } from './config/redis.js';

async function main(): Promise<void> {
  await connectDb();
  await connectRedis();

  const app = createApp();
  // Plain http server so Socket.IO can attach to it in M8.
  const server = http.createServer(app);
  server.listen(env.PORT, () =>
    logger.info({ port: env.PORT, env: env.NODE_ENV }, 'api listening'),
  );

  let shuttingDown = false;
  const shutdown = (signal: string): void => {
    if (shuttingDown) return;
    shuttingDown = true;
    logger.info({ signal }, 'shutting down');
    // Hard stop if connections refuse to drain.
    setTimeout(() => process.exit(1), 10_000).unref();
    server.close(() => {
      Promise.allSettled([disconnectRedis(), disconnectDb()]).then(() => process.exit(0));
    });
  };
  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT', () => shutdown('SIGINT'));
  process.on('unhandledRejection', (reason) =>
    logger.error({ err: reason }, 'unhandled rejection'),
  );
}

main().catch((err) => {
  logger.fatal({ err }, 'failed to start');
  process.exit(1);
});
