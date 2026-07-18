import { env } from '@/config/env';
import { logger } from '@/utils/logger';
import Redis from 'ioredis';

let redis: Redis | null = null;

export const getRedisClient = async (): Promise<Redis> => {
  if (redis) return redis;

  const url = env.REDIS_URL;
  redis = new Redis(url, { lazyConnect: true });

  redis.on('error', (error) => {
    logger.error({ error }, 'Redis client error');
    redis = null;
  });

  redis.on('connect', () => {
    logger.info('Redis client is connected');
  });

  redis.on('reconnect', () => {
    logger.info('Redis client is reconnecting');
  });

  redis.on('end', () => {
    logger.info('Redis client is disconnected');
    redis = null;
  });

  await redis.connect();

  return redis;
};

export const closeRedisClient = async () => {
  if (!redis) return;

  await redis.quit();
  redis = null;
  logger.info('Redis client is closed');
};
