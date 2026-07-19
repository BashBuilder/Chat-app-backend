import {
  Conversation,
  ConversationFilter,
  ConversationSummary,
  CreateConversationInput,
} from '@/__types__/conversation';
import { getMongoClient } from '@/clients/mongo.client';
import { HttpError } from '@chatapp/common';
import { Document, ObjectId, WithId } from 'mongodb';
import { randomUUID } from 'node:crypto';

const CONVERSATIONS_COLLECTION_NAME = 'conversations';
const MESSAGES_COLLECTION_NAME = 'messages';

const toConversation = (doc: WithId<Document>): Conversation => ({
  id: String(doc._id),
  title: typeof doc.title === 'string' ? doc.title : null,
  participantIds: Array.isArray(doc.participantIds) ? doc.participantIds : [],
  createdAt: new Date(doc.createdAt as string | number | Date),
  updatedAt: new Date(doc.updatedAt as string | number | Date),
  lastMessageAt: doc.lastMessageAt ? new Date(doc.lastMessageAt as string | number | Date) : null,
  lastMessagePreview: typeof doc.lastMessagePreview === 'string' ? doc.lastMessagePreview : null,
});

const toConversationSummary = (doc: WithId<Document>): ConversationSummary => toConversation(doc);

const conversationCollection = async () => {
  const client = await getMongoClient();
  const db = client.db();
  return db.collection(CONVERSATIONS_COLLECTION_NAME);
};

const messageCollection = async () => {
  const client = await getMongoClient();
  const db = client.db();
  return db.collection(MESSAGES_COLLECTION_NAME);
};

export const conversationRepository = {
  async create(input: CreateConversationInput): Promise<Conversation> {
    const collection = await conversationCollection();
    const now = new Date();
    const document = {
      _id: randomUUID(),
      title: input.title ?? null,
      participantIds: input.participantIds,
      createdAt: now,
      updatedAt: now,
      lastMessageAt: now,
    };
    await collection.insertOne(document as unknown as Document);
    return toConversation(document as unknown as WithId<Document>);
  },
  async findById(id: string): Promise<Conversation | null> {
    const collection = await conversationCollection();
    const document = await collection.findOne({ _id: new ObjectId(id) });
    return document ? toConversation(document) : null;
  },

  async findSummaries(filter: ConversationFilter): Promise<ConversationSummary[]> {
    const collection = await conversationCollection();
    const documents = await collection
      .find({
        participantIds: filter.participantId,
      })
      .sort({ lastMessageAt: -1, updatedAt: -1 })
      .toArray();
    return documents.map(toConversationSummary);
  },

  async touchConversation(id: string, preview: string): Promise<void> {
    const collection = await conversationCollection();
    const document = await collection.updateOne(
      { _id: new ObjectId(id) },
      { $set: { lastMessageAt: new Date(), lastMessagePreview: preview, updatedAt: new Date() } },
    );
    return;
  },

  async removeAll(): Promise<void> {
    const collection = await conversationCollection();
    const messagesCollection = await messageCollection();
    await collection.deleteMany({});
    await messagesCollection.deleteMany({});
  },
};
