import { getMongoClient } from '@/clients/mongo.client';
import { UserCreatedPayload } from '@chatapp/common';
import { Collection } from 'mongodb';

const COLLECTION_NAME = 'users';
interface UserDocument {
  _id: string;
  email: string;
  displayName: string;
  createdAt: string;
  updatedAt: string;
}

const getUserCollection = async (): Promise<Collection<UserDocument>> => {
  const client = await getMongoClient();

  return client.db().collection<UserDocument>(COLLECTION_NAME);
};

export const userRepository = {
  async upsertUser(payload: UserCreatedPayload) {
    const collection = await getUserCollection();
    await collection.updateOne(
      { _id: payload.id },
      {
        $set: {
          _id: payload.id,
          email: payload.email,
          displayName: payload.displayName,
          createdAt: payload.createdAt,
          updatedAt: payload.createdAt,
        },
      },
      { upsert: true },
    );
  },

  async getUserById(id: string): Promise<UserDocument | null> {
    const collection = await getUserCollection();
    const user = await collection.findOne({ _id: id });
    return user;
  },
};
