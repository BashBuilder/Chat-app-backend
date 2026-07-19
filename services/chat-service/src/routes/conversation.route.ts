import {
  createConversationHandler,
  getConversationHandler,
  listConversationsHandler,
} from '@/controllers/conversation.controller';
import { attachAuthenticatedUser } from '@/middlewares/authenticated-user';
import {
  createConversationSchema,
  listConversationsQuerySchema,
} from '@/validations/conversation.schema';
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

// conversationRouter.patch("/:id", validateRequest({ params : conversationIdSchema }), updateConversationHandler );
// conversationRouter.delete("/:id", validateRequest({ params : conversationIdSchema }), deleteConversationHandler );
