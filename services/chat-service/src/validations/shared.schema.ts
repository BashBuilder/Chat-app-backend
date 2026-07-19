import { z } from '@chatapp/common';

export const conversationIdSchema = z.object({ id: z.string().uuid() });
