import {
  Conversation,
  ConversationFilter,
  CreateConversationInput,
} from '@/__types__/conversation';
import { conversationCache } from '@/cache/conversation.cache';
import { conversationRepository } from '@/repositories/conversation.repository';
import { NotFoundError } from '@chatapp/common';

export const conversationService = {
  async createConversation(input: CreateConversationInput): Promise<Conversation> {
    const conversation = await conversationRepository.create(input);
    await conversationCache.set(conversation);
    return conversation;
  },

  async getConversationById(id: string): Promise<Conversation> {
    const cached = await conversationCache.get(id);
    if (cached) {
      return cached;
    }
    const conversation = await conversationRepository.findById(id);
    if (!conversation) throw new NotFoundError("Conversation doesn't exist");

    await conversationCache.set(conversation);
    return conversation;
  },

  async getConversations(filter: ConversationFilter): Promise<Conversation[]> {
    const conversations = await conversationRepository.findSummaries(filter);
    await Promise.all(conversations.map((conversation) => conversationCache.set(conversation)));
    return conversations;
  },

  async touchConversation(id: string, preview: string): Promise<void> {
    const conversation = await conversationRepository.findById(id);
    if (!conversation) throw new NotFoundError("Conversation doesn't exist");
    await conversationRepository.touchConversation(id, preview);
    await conversationCache.delete(id);
  },
};
