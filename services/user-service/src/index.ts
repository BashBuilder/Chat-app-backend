import { createApp } from './app';
import { createServer } from 'node:http';
import { env } from '@/config/env';
import { logger } from '@/utils/logger';
// import { closeDatabase, connectToDatabase } from '@/db/sequelize';
// import { initModels } from '@/models';
// import { closePublisher, initPublisher } from '@/messaging/event-publishing';

const main = async () => {
  try {
    // await connectToDatabase();
    // await initModels();
    // await initPublisher();

    const app = createApp();
    const server = createServer(app);

    const port = env.USER_SERVICE_PORT;

    server.listen(port, () => {
      logger.info({ port }, 'User service is running');
    });

    const shutdown = () => {
      logger.info('Shutting down service ...');

      Promise.all([
        // closeDatabase(), closePublisher()
      ])
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
    logger.error({ error }, 'Failed to start user service');
    process.exit(1);
  }
};

void main();
