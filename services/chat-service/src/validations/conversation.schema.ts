import { z } from '@chatapp/common';

export const createConversationSchema = z.object({
  title: z.string().min(1).max(100),
  participantIds: z.array(z.string().uuid()).min(1).max(256),
});

export const listConversationsQuerySchema = z.object({
  participantId: z.string().uuid().optional(),
});
