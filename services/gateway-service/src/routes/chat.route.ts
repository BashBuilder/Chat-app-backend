import {
  createConversationHandler,
  createMessageHandler,
  getConversationHandler,
  listConversationsHandler,
  listMessagesHandler,
} from '@/controllers/conversation.controller';
import { requireAuth } from '@/middlewares/require-auth';
import {
  conversationIdSchema,
  createConversationSchema,
  listConversationsQuerySchema,
} from '@/validation/conversaton.schema';
import { createMessageBodySchema, listMessagesQuerySchema } from '@/validation/message.schema';
import { validateRequest } from '@chatapp/common';
import { Router } from 'express';

export const chatRouter: Router = Router();

chatRouter.use(requireAuth);

chatRouter.get(
  '/',
  validateRequest({ query: listConversationsQuerySchema }),
  listConversationsHandler,
);
chatRouter.get('/:id', validateRequest({ params: conversationIdSchema }), getConversationHandler);
chatRouter.post(
  '/',
  validateRequest({ body: createConversationSchema }),
  createConversationHandler,
);

chatRouter.post(
  '/:id/messages',
  validateRequest({ params: conversationIdSchema, body: createMessageBodySchema }),
  createMessageHandler,
);

chatRouter.get(
  '/:id/messages',
  validateRequest({ params: conversationIdSchema, query: listMessagesQuerySchema }),
  listMessagesHandler,
);
