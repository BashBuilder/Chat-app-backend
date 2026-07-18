import { env } from '@/config/env';
import { userRepository } from '@/repositories/user.repository';
import { logger } from '@/utils/logger';
import { USER_CREATED_ROUTING_KEY, USER_EVENTS_EXCHANGE, UserCreatedEvent } from '@chatapp/common';
import { Channel, ChannelModel, connect, ConsumeMessage, Replies } from 'amqplib';

let connection: ChannelModel | null = null;
let channel: Channel | null = null;
let consumerTag: string | null = null;

const QUEUE_NAME = 'chat-service.auth.events';

const closeConnection = async (conn: ChannelModel) => {
  if (!conn) return;
  await conn.close();
  connection = null;
  channel = null;
  consumerTag = null;

  logger.info('RabbitMq connection is closed');
};

const handleUserCreated = async (event: UserCreatedEvent) => {
  await userRepository.upsertUser(event.payload);
};

export const startConsumers = async () => {
  if (!env.RABBIT_MQ_URL) {
    logger.warn('RabbitMq url is not provided, skipping event handling');
    return;
  }

  const conn = await connect(env.RABBIT_MQ_URL);
  connection = conn;

  const ch = await connection.createChannel();
  channel = ch;

  await ch.assertQueue(USER_EVENTS_EXCHANGE, { durable: true });
  const queue = await ch.assertQueue(QUEUE_NAME, { durable: true });

  await ch.bindQueue(queue.queue, USER_EVENTS_EXCHANGE, USER_CREATED_ROUTING_KEY);

  const consumeHandler = (message: ConsumeMessage | null) => {
    if (!message) return;

    void (async () => {
      const payload = message.content.toString('utf-8');
      const event = JSON.parse(payload) as UserCreatedEvent;

      await handleUserCreated(event);
      ch.ack(message);
    })().catch((error) => {
      logger.error({ error }, 'Error while handling user created event');
      ch.nack(message, false, false);
    });
  };

  const result: Replies.Consume = await ch.consume(queue.queue, consumeHandler, { noAck: false });
  consumerTag = result.consumerTag;

  logger.info('RabbitMq consumer is started');
};

export const stopConsumers = async () => {
  try {
    const ch = channel;
    if (ch && consumerTag) {
      await ch.cancel(consumerTag);
    }
    if (ch) {
      await ch.close();
      channel = null;
    }

    const conn = connection;
    if (conn) {
      await closeConnection(conn);
    }
  } catch (error) {
    logger.error({ error }, 'Error while stopping RabbitMq consumer');
  }
};
