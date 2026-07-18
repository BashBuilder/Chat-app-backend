import { createApp } from './app';
import { createServer } from 'node:http';
import { env } from '@/config/env';
import { logger } from '@/utils/logger';
import { closeMongoClient, getMongoClient } from './clients/mongo.client';
import { closeRedisClient, getRedisClient } from './clients/redis-client';
import { startConsumers, stopConsumers } from './messaging/rabbitmq-consumer';

const main = async () => {
  try {
    await Promise.all([getMongoClient(), getRedisClient(), startConsumers()]);

    const app = createApp();
    const server = createServer(app);

    const port = env.CHAT_SERVICE_PORT;

    server.listen(port, () => {
      logger.info({ port }, 'Chat service is running');
    });

    const shutdown = () => {
      logger.info('Shutting down service ...');

      Promise.all([closeMongoClient(), closeRedisClient(), stopConsumers()])
        .catch((error: unknown) => {
          logger.error({ error }, 'Error during shutdown');
        })
        .finally(() => {
          server.close(() => process.exit(0));
        });
    };

    process.on('SIGINT', shutdown);
    process.on('SIGTERM', shutdown);
  } catch (error) {
    logger.error({ error }, 'Failed to start chat service');
    process.exit(1);
  }
};

void main();
