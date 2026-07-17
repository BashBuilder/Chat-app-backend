import { env } from '@/config/env';
import { logger } from '@/utils/logger';
import {
  AUTH_EVENT_EXCHANGE,
  AUTH_USER_REGISTERED_ROUTING_KEY,
  AuthUserRegisteredPayload,
} from '@chatapp/common';
import { Channel, ChannelModel, connect } from 'amqplib';

let connectionRef: ChannelModel | null = null;
let channel: Channel | null = null;

export const initPublisher = async () => {
  if (!env.RABBIT_MQ_URL) logger.warn('RabbitMq_url is not defined. Skipping initialization');

  if (channel) {
    return;
  }

  const connection = await connect(env.RABBIT_MQ_URL);
  connectionRef = connection;
  channel = await connection.createChannel();
  await channel.assertExchange(AUTH_EVENT_EXCHANGE, 'topic', { durable: true });

  connection.on('cloase', () => {
    logger.warn('RabbitMq connection closed');
    channel = null;
    connectionRef = null;
  });

  connection.on('error', (error) => {
    logger.error({ error }, 'RabbitMq connection error');
  });

  logger.info('Auth service RabbitMq publisher initialized');
};

export const publishUserRegisteredPayload = (payload: AuthUserRegisteredPayload) => {
  if (!channel) {
    return logger.warn('RabbitMq channel is not initialized, cannot publish message');
  }
  const event = {
    type: AUTH_USER_REGISTERED_ROUTING_KEY,
    payload,
    occuredAt: new Date().toISOString(),
    metadata: { version: 1 },
  };

  const published = channel.publish(
    AUTH_EVENT_EXCHANGE,
    AUTH_USER_REGISTERED_ROUTING_KEY,
    Buffer.from(JSON.stringify(event)),
    { contentType: 'application/json', persistent: true },
  );

  if (!published) {
    logger.warn({ event }, 'Failed to publish user regiestered event');
  }

  logger.info('User registered event published');
};

export const closePublisher = async () => {
  try {
    const ch = channel;
    if (ch) {
      await ch.close();
      channel = null;
    }

    const conn = connectionRef;
    if (conn) {
      await conn.close();
      connectionRef = null;
    }
  } catch (error) {
    logger.error({ error }, 'Error closing rabbitmq connection/channel');
  }
};
