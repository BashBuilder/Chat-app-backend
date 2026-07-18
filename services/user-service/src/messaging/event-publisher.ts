import { logger } from '@/utils/logger';
import { ChannelModel, connect, Channel, Connection } from 'amqplib';
import { env } from '@/config/env';
import {
  USER_CREATED_ROUTING_KEY,
  USER_EVENTS_EXCHANGE,
  UserCreatedEvent,
  UserCreatedPayload,
} from '@chatapp/common';

type ManageConnection = Connection &
  Pick<ChannelModel, 'close' | 'createChannel'> & {
    on: (event: string, cb: (...args: any[]) => void) => void;
  };

let connection: ManageConnection | null = null;
let channel: Channel | null = null;

const messagingEnabled = Boolean(env.RABBIT_MQ_URL);

const ensureChannel = async (): Promise<Channel | null> => {
  if (!messagingEnabled) {
    return null;
  }
  if (channel) return channel;
  if (!env.RABBIT_MQ_URL) return null;

  const connectionRef = (await connect(env.RABBIT_MQ_URL)) as unknown as ManageConnection;
  connection = connectionRef;

  connectionRef.on('close', () => {
    logger.warn('RabbitMq connection closed');
    channel = null;
    connection = null;
  });

  connectionRef.on('error', (error) => {
    logger.error({ error }, 'RabbitMq connection error');
  });

  channel = await connectionRef.createChannel();
  await channel.assertExchange(USER_EVENTS_EXCHANGE, 'topic', { durable: true });

  return channel;
};

export const initMessaging = async () => {
  if (!messagingEnabled) {
    logger.info('RabbitMq url is providded, messaging is enabled');
    return;
  }

  const channel = await ensureChannel();
  if (!channel) {
    logger.info('RabbitMq url is providded, but channel is not ready');
    return;
  }

  logger.info('User service rabbitmq messaging is enabled');
};

export const closeMessaging = async () => {
  try {
    if (!messagingEnabled) {
      return;
    }

    if (channel) {
      const currentChannel = channel;
      channel = null;
      await currentChannel.close();
    }
    logger.info('User service rabbitmq messaging is closed');
  } catch (error) {
    logger.error({ error }, 'Error while closing rabbitmq connection');
  }
};

export const publishUserCreatedEvent = async (payload: UserCreatedPayload) => {
  const channel = await ensureChannel();

  if (!channel) {
    logger.error('Skipping publish user created event, rabbitmq channel is not ready');
    return;
  }

  const event: UserCreatedEvent = {
    type: USER_CREATED_ROUTING_KEY,
    payload,
    occurredAt: new Date().toISOString(),
    metadata: { version: 1 },
  };

  try {
    const success = await channel.publish(
      USER_EVENTS_EXCHANGE,
      USER_CREATED_ROUTING_KEY,
      Buffer.from(JSON.stringify(event)),
      { contentType: 'application/json', persistent: true },
    );
    if (!success) {
      logger.error('Failed to publish user created event');
    }
  } catch (error) {
    logger.error({ error }, 'Error while publishing user created event');
  }
};
