import { env } from '@/config/env';
import { userService } from '@/services/user.service';
import { logger } from '@/utils/logger';
import {
  AUTH_EVENT_EXCHANGE,
  AUTH_USER_REGISTERED_ROUTING_KEY,
  AuthRegisteredEvent,
} from '@chatapp/common';
import { Connection, ChannelModel, Channel, ConsumeMessage, connect, Replies } from 'amqplib';

type ManageConnection = Connection & ChannelModel;

let connectionRef: ManageConnection | null = null;
let channel: Channel | null = null;
let consumerTag: string | null = null;

const QUEUE_NAME = 'auth-service.auth-events';

export const closeConnection = async (conn: ManageConnection) => {
  await conn.close();
  connectionRef = null;
  channel = null;
  consumerTag = null;
};

const handleMessage = async (message: ConsumeMessage, ch: Channel) => {
  const raw = message.content.toString('utf-8');
  const event = JSON.parse(raw) as AuthRegisteredEvent;

  await userService.syncFromAuthUser(event.payload);

  ch.ack(message);
};

export const startAuthEventConsumer = async () => {
  if (!env.RABBIT_MQ_URL) {
    return logger.warn('RabbitMq url is not configured');
  }

  if (channel) return;

  const connection = (await connect(env.RABBIT_MQ_URL)) as ManageConnection;
  connectionRef = connection;
  const ch = await connection.createChannel();
  channel = ch;

  await ch.assertExchange(AUTH_EVENT_EXCHANGE, 'topic', { durable: true });
  const queue = await ch.assertQueue(QUEUE_NAME, { durable: true });

  await ch.bindQueue(queue.queue, AUTH_EVENT_EXCHANGE, AUTH_USER_REGISTERED_ROUTING_KEY);

  const consumeHandler = (msg: ConsumeMessage | null): void => {
    if (!msg) return;
    void handleMessage(msg, ch).catch((error) => {
      logger.error({ error }, 'Failed go process auth event');
    });
  };

  const result: Replies.Consume = await ch.consume(queue.queue, consumeHandler);

  consumerTag = result.consumerTag;

  connection.on('close', () => {
    logger.warn('Auth Consumer connection closed');
    connectionRef = null;
    channel = null;
    consumerTag = null;
  });

  connection.on('error', () => {
    logger.warn('Auth Consumer connection error');
    connectionRef = null;
    channel = null;
    consumerTag = null;
  });

  logger.info('Auth event consumer started');
};

export const stopAuthEventConsumer = async () => {
  try {
    const ch = channel;
    if (ch && consumerTag) {
      await ch.cancel(consumerTag);
    }
    if (ch) {
      await ch.close();
      channel = null;
    }

    const conn = connectionRef;
    if (conn) {
      await closeConnection(conn);
      connectionRef = null;
    }
  } catch (error) {
    logger.error({ error }, 'Failed to stop auth even consumer');
  }
};
