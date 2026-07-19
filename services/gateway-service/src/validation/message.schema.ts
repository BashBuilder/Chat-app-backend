import { z } from '@chatapp/common';

export const createMessageBodySchema = z.object({
  body: z.string().min(1).max(1000),
});

export const listMessagesQuerySchema = z.object({
  // conversationId: z.string().uuid(),
  limit: z
    .union([z.string(), z.number()])
    .transform(Number)
    .refine(
      (val) => Number.isInteger(val) && val! > 0 && val <= 25,
      'limit must be between 1 and 25',
    )
    .optional(),
  before: z.string().uuid().optional(),
  after: z.string().uuid().optional(),
});
