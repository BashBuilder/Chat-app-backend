import 'dotenv/config';
import { createEnv, z } from '@chatapp/common';

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  AUTH_SERVICE_PORT: z.coerce.number().int().min(0).max(65_535).default(4003),
  // AUTH_DB_SSL: z.boolean(),
  AUTH_DB_URL: z.string().url(),
  JWT_SECRET: z.string().min(32),
  JWT_EXPIRES_IN: z.string().default('15min'),
  JWT_REFRESH_SECRET: z.string().min(32),
  JWT_REFRESH_EXPIRES_IN: z.string().default('30d'),
  INTERNAL_API_TOKEN: z.string().min(16),
  RABBIT_MQ_URL: z.string().url(),
});

type envType = z.infer<typeof envSchema>;

export const env: envType = createEnv(envSchema, {
  serviceName: 'auth-service',
});

export type Env = typeof env;
