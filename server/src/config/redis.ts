import { Redis } from 'ioredis';
import { env } from './env.js';
import { logger } from './logger.js';

// lazyConnect: nothing connects until connectRedis() is called from server.ts.
export const redis = new Redis(env.REDIS_URL, {
  lazyConnect: true,
  maxRetriesPerRequest: 3,
  enableReadyCheck: true,
});

redis.on('error', (err) => logger.error({ err }, 'redis error'));
redis.on('reconnecting', () => logger.warn('redis reconnecting'));

export async function connectRedis(): Promise<void> {
  await redis.connect();
  logger.info('redis connected');
}

export async function disconnectRedis(): Promise<void> {
  if (redis.status !== 'end') await redis.quit();
}

export function isRedisReady(): boolean {
  return redis.status === 'ready';
}
