import { env } from '@/config/env';
import { logger } from '@/utils/logger';
import { MongoClient } from 'mongodb';

let client: MongoClient | null = null;

export const getMongoClient = async (): Promise<MongoClient> => {
  if (client) return client;

  const url = env.MONGO_URL;
  client = new MongoClient(url);
  await client.connect();

  logger.info('Mongo client is connected');

  return client;
};

export const closeMongoClient = async () => {
  if (!client) return;

  await client.close();
  client = null;
  logger.info('Mongo client is closed');
};
