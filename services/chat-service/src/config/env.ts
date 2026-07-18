import 'dotenv/config';
import { createEnv, z } from '@chatapp/common';

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  CHAT_SERVICE_PORT: z.coerce.number().int().min(0).max(65_535).default(4002),
  CHAT_DB_URL: z.string().url(),
  INTERNAL_API_TOKEN: z.string().min(16),
  RABBIT_MQ_URL: z.string().url(),
});

type envType = z.infer<typeof envSchema>;

export const env: envType = createEnv(envSchema, {
  serviceName: 'Chat-service',
});

export type Env = typeof env;
