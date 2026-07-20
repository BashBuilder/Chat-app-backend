import { conversationService } from '@/services/conversation.service';
import { messageService } from '@/services/message.service';
import { getAuthicatedUser } from '@/utils/auth';
import {
  createConversationSchema,
  listConversationsQuerySchema,
} from '@/validations/conversation.schema';
import {
  createMessageBodySchema,
  createMessageSchema,
  listMessagesQuerySchema,
  messageIdSchema,
} from '@/validations/message.schema';
import { conversationIdSchema } from '@/validations/shared.schema';
import {
  asyncHandler,
  AsyncHandler,
  BadRequestError,
  NotFoundError,
  UnauthorizedError,
} from '@chatapp/common';
import { RequestHandler } from 'express';

const parseConversation = (params: unknown): string => {
  const { id } = conversationIdSchema.parse(params);
  return id;
};

export const createConversationHandler: RequestHandler = asyncHandler(async (req, res, next) => {
  const user = getAuthicatedUser(req);
  const payload = createConversationSchema.parse(req.body);

  const uniqueParticipantIds = Array.from(new Set([...payload.participantIds, user.id]));

  if (uniqueParticipantIds.length < 2)
    throw new BadRequestError('At least two participants are required');

  const conversation = await conversationService.createConversation({
    title: payload.title,
    participantIds: uniqueParticipantIds,
  });

  res.status(201).json(conversation);
});

export const listConversationsHandler: RequestHandler = asyncHandler(async (req, res, next) => {
  const user = getAuthicatedUser(req);
  const filter = listConversationsQuerySchema.parse(req.validated?.query);

  if (!filter.participantId) throw new BadRequestError('Participant id is required');
  if (filter.participantId !== user.id)
    throw new UnauthorizedError('Only the participant can list conversations');

  const conversations = await conversationService.getConversations({
    participantId: filter.participantId,
  });

  res.status(200).json(conversations);
});

export const getConversationHandler: RequestHandler = asyncHandler(async (req, res, next) => {
  const user = getAuthicatedUser(req);
  const conversationId = parseConversation(req.params);
  if (!conversationId) throw new BadRequestError('Conversation id is required');

  const conversation = await conversationService.getConversationById(conversationId);

  if (!conversation.participantIds.includes(user.id) && conversation.participantIds.length > 1)
    throw new UnauthorizedError('Only the participant can get conversation');

  res.status(200).json(conversation);
});

export const createMessageHandler: RequestHandler = asyncHandler(async (req, res, next) => {
  const user = getAuthicatedUser(req);
  const id = parseConversation(req.params);
  const payload = createMessageBodySchema.parse(req.body);

  const message = await messageService.createMessage({
    conversationId: id,
    senderId: user.id,
    body: payload.body,
  });
  res.status(201).json(message);
});

export const listMessagesHandler: RequestHandler = asyncHandler(async (req, res, next) => {
  const user = getAuthicatedUser(req);
  const conversationId = parseConversation(req.params);
  const filter = listMessagesQuerySchema.parse(req.validated?.query);

  if (!filter.limit) throw new BadRequestError('Limit is required');

  const messages = await messageService.getMessages({
    conversationId,
    limit: filter.limit,
    before: filter.before,
    after: filter.after,
  });

  res.status(200).json(messages);
});

export const getMessageHandler: RequestHandler = asyncHandler(async (req, res, next) => {
  const user = getAuthicatedUser(req);
  const { id } = messageIdSchema.parse(req.params);
  if (!id) throw new BadRequestError('Message id is required');

  const message = await messageService.getMessageById(id);

  if (!message.senderId.includes(user.id) && message.senderId !== user.id)
    throw new UnauthorizedError('Only the sender can get message');

  res.status(200).json(message);
});
