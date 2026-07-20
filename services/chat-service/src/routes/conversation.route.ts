import {
  createConversationHandler,
  createMessageHandler,
  getConversationHandler,
  getMessageHandler,
  listConversationsHandler,
  listMessagesHandler,
} from '@/controllers/conversation.controller';
import { attachAuthenticatedUser } from '@/middlewares/authenticated-user';
import {
  createConversationSchema,
  listConversationsQuerySchema,
} from '@/validations/conversation.schema';
import { createMessageSchema, listMessagesQuerySchema } from '@/validations/message.schema';
import { conversationIdSchema } from '@/validations/shared.schema';
import { validateRequest } from '@chatapp/common';
import { Router } from 'express';

export const conversationRouter: Router = Router();

conversationRouter.use(attachAuthenticatedUser);

conversationRouter.post(
  '/',
  validateRequest({ body: createConversationSchema }),
  createConversationHandler,
);
conversationRouter.get(
  '/',
  validateRequest({ query: listConversationsQuerySchema }),
  listConversationsHandler,
);
conversationRouter.get(
  '/:id',
  validateRequest({ params: conversationIdSchema }),
  getConversationHandler,
);

conversationRouter.get(
  '/:id/messages',
  validateRequest({ params: conversationIdSchema, query: listMessagesQuerySchema }),
  listMessagesHandler,
);

conversationRouter.post(
  '/:id/messages',
  validateRequest({ params: conversationIdSchema, body: createMessageSchema }),
  createMessageHandler,
);

// conversationRouter.get(
//   '/:id/messages/:messageId',
//   validateRequest({ params: conversationIdSchema, params: messageIdSchema }),
//   getMessageHandler,
// );
