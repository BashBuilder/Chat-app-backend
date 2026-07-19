import { CreateMessageInput, Message, MessageListOptions } from '@/__types__/messages';
import { getMongoClient } from '@/clients/mongo.client';
import { Document, ObjectId, UUID, WithId } from 'mongodb';

const MESSAGES_COLLECTION_NAME = 'messages';

const toMessage = (doc: WithId<Document>): Message => ({
  id: String(doc._id),
  conversationId: String(doc.conversationId),
  senderId: String(doc.senderId),
  body: String(doc.body),
  createdAt: new Date(doc.createdAt as string | number | Date),
  updatedAt: new Date(doc.updatedAt as string | number | Date),
  reactions: doc.reactions.map((reaction: WithId<Document>) => ({
    emoji: reaction.emoji,
    userId: reaction.userId,
    createdAt: new Date(reaction.createdAt as string | number | Date),
  })),
});

export const messageCollection = async () => {
  const client = await getMongoClient();
  const db = client.db();
  return db.collection(MESSAGES_COLLECTION_NAME);
};

export const messageRepository = {
  async create(input: CreateMessageInput): Promise<Message> {
    const collection = await messageCollection();
    const now = new Date();
    const document = {
      conversationId: input.conversationId,
      senderId: input.senderId,
      body: input.body,
      createdAt: now,
      updatedAt: now,
      reactions: [],
    };
    await collection.insertOne(document as unknown as Document);
    return toMessage(document as unknown as WithId<Document>);
  },

  async findById(id: string): Promise<Message | null> {
    const collection = await messageCollection();
    const document = await collection.findOne({ _id: id as unknown as ObjectId });
    return document ? toMessage(document) : null;
  },

  async findAll(filter: MessageListOptions): Promise<Message[]> {
    const collection = await messageCollection();
    const documents = await collection
      .find({ conversationId: filter.conversationId })
      .limit(Number(filter.limit))
      .sort({ createdAt: -1 })
      .skip(filter.after ? 1 : 0)
      .toArray();
    return documents.map(toMessage);
  },

  async touchMessage(id: string, preview: string): Promise<void> {
    const collection = await messageCollection();
    const document = await collection.updateOne(
      { _id: id as unknown as ObjectId },
      { $set: { updatedAt: new Date(), preview: preview } },
    );
    return;
  },
};
