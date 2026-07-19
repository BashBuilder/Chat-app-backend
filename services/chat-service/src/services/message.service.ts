import { CreateMessageInput, Message, MessageListOptions } from '@/__types__/messages';
import { messageRepository } from '@/repositories/message.repository';
import { BadRequestError, NotFoundError } from '@chatapp/common';
import { conversationService } from './conversation.service';

export const messageService = {
  async createMessage(input: CreateMessageInput): Promise<Message> {
    const conversation = await conversationService.getConversationById(input.conversationId);
    if (!conversation) throw new NotFoundError("Conversation doesn't exist");

    const message = await messageRepository.create(input);
    if (!message) throw new BadRequestError('Unable to create message');

    await conversationService.touchConversation(message.conversationId, input.body.slice(0, 100));

    return message;
  },

  async getMessageById(id: string): Promise<Message> {
    const message = await messageRepository.findById(id);
    if (!message) throw new NotFoundError("Message doesn't exist");

    return message;
  },

  async getMessages(filter: MessageListOptions): Promise<Message[]> {
    const messages = await messageRepository.findAll(filter);
    return messages;
  },

  async touchMessage(id: string, preview: string): Promise<void> {
    const message = await messageRepository.findById(id);
    if (!message) throw new NotFoundError("Message doesn't exist");
    await messageRepository.touchMessage(id, preview);
  },
};
