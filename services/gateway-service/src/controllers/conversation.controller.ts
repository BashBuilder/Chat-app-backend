import { chatProxyService } from '@/services/chat.proxy.service';
import { getAuthicatedUser } from '@/utils/auth';
import {
  conversationIdSchema,
  createConversationSchema,
  listConversationsQuerySchema,
} from '@/validation/conversaton.schema';
import { AsyncHandler, asyncHandler, BadRequestError } from '@chatapp/common';
import { RequestHandler } from 'express';

export const createConversationHandler: RequestHandler = asyncHandler(async (req, res, next) => {
  const user = getAuthicatedUser(req);
  const payload = createConversationSchema.parse(req.body);

  const uniqueParticipantIds = Array.from(new Set([...payload.participantIds, user.id]));

  if (uniqueParticipantIds.length < 2)
    throw new BadRequestError('At least two participants are required');

  const conversation = await chatProxyService.createConversation(user.id, {
    title: payload.title,
    participantIds: uniqueParticipantIds,
  });

  res.status(201).json(conversation);
});

export const listConversationsHandler: RequestHandler = asyncHandler(async (req, res, next) => {
  const user = getAuthicatedUser(req);
  const { participantId } = listConversationsQuerySchema.parse(req.query);
  if (!participantId) throw new BadRequestError('Participant id is required');
  if (participantId !== user.id)
    throw new BadRequestError('Only the participant can list conversations');
  const conversations = await chatProxyService.listConversations(participantId);

  res.status(200).json(conversations);
});

export const getConversationHandler: RequestHandler = asyncHandler(async (req, res, next) => {
  const user = getAuthicatedUser(req);
  const conversationId = conversationIdSchema.parse(req.params);
  if (!conversationId) throw new BadRequestError('Conversation id is required');

  const conversation = await chatProxyService.getConversation(user.id, conversationId.id);

  if (!conversation.participantIds.includes(user.id) && conversation.participantIds.length > 1)
    throw new BadRequestError('Only the participant can get conversation');

  res.status(200).json(conversation);
});
