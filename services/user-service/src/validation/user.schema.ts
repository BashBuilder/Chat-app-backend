import { z } from '@chatapp/common';

export const createUserSchema = z.object({
  email: z.string().email(),
  displayName: z.string().min(3).max(255),
});

export const userIdParamsSchema = z.object({
  id: z.string().uuid(),
});

const exludeIdsSchema = z.union([
  z.array(z.string().uuid()),
  z
    .string()
    .uuid()
    .transform((val) => [val])
    .optional()
    .transform((val) => val || []),
]);

export const searchUsersSchema = z.object({
  query: z.string().min(3).max(255),
  limit: z
    .union([z.string(), z.number()])
    .transform(Number)
    .refine(
      (val) => Number.isInteger(val) && val! > 0 && val <= 25,
      'limit must be between 1 and 25',
    )
    .optional(),
  excludeIds: exludeIdsSchema.optional(),
});

export type CreateUserBody = z.infer<typeof createUserSchema>;
export type UserIdParams = z.infer<typeof userIdParamsSchema>;
export type SearchUsersQueryParams = z.infer<typeof searchUsersSchema>;
