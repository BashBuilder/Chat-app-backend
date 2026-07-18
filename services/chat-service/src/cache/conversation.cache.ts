import { Conversation } from '@/__types__/conversation';
import { getRedisClient } from '@/clients/redis-client';

const CACHE_KEY_PREFIX = 'conversation';
const CACHE_TTL_SECONDS = 60;

const serialize = (conversation: Conversation): string =>
  JSON.stringify({
    ...conversation,
    createdAt: conversation.createdAt.toISOString(),
    updatedAt: conversation.updatedAt.toISOString(),
    lastMessageAt: conversation.lastMessageAt?.toISOString(),
  });

const deserialize = (value: string): Conversation => {
  const { id, title, participantIds, createdAt, updatedAt, lastMessageAt, lastMessagePreview } =
    JSON.parse(value) as Conversation & {
      lastMessageAt: string | undefined;
      createdAt: string;
      updatedAt: string;
    };
  return {
    id,
    title,
    participantIds,
    createdAt: new Date(createdAt),
    updatedAt: new Date(updatedAt),
    lastMessageAt: lastMessageAt ? new Date(lastMessageAt) : null,
    lastMessagePreview,
  };
};

export const conversationCache = {
  async get(id: string): Promise<Conversation | null> {
    const redis = await getRedisClient();
    const value = localStorage.getItem(`${CACHE_KEY_PREFIX}:${id}`);

    const payload = await redis.get(`${CACHE_KEY_PREFIX}:${id}`);
    return payload ? deserialize(payload) : null;
  },
  async set(conversation: Conversation): Promise<void> {
    const redis = await getRedisClient();
    const payload = serialize(conversation);
    await redis.set(`${CACHE_KEY_PREFIX}:${conversation.id}`, payload, 'EX', CACHE_TTL_SECONDS);
  },
  async delete(id: string): Promise<void> {
    const redis = await getRedisClient();
    await redis.del(`${CACHE_KEY_PREFIX}:${id}`);
  },
};
