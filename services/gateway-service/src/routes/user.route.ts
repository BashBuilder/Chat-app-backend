import { createUser, getAllUsers, getUser, searchUsers } from '@/controllers/user.controller';
import { requireAuth } from '@/middlewares/require-auth';
import { createUserSchema, searchUsersSchema, userIdParamsSchema } from '@/validation/user.schema';
import { asyncHandler, validateRequest } from '@chatapp/common';
import { Router } from 'express';

export const userRouter: Router = Router();

userRouter.get('/', requireAuth, asyncHandler(getAllUsers));
userRouter.get(
  '/:id',
  requireAuth,
  validateRequest({ query: userIdParamsSchema }),
  asyncHandler(getUser),
);
userRouter.post(
  '/',
  requireAuth,
  validateRequest({ body: createUserSchema }),
  asyncHandler(createUser),
);
userRouter.get(
  '/search',
  requireAuth,
  validateRequest({ query: searchUsersSchema }),
  asyncHandler(searchUsers),
);
