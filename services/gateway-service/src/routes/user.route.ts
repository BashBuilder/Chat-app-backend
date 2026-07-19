import { createUser, getAllUsers, getUser, searchUsers } from '@/controllers/user.controller';
import { requireAuth } from '@/middlewares/require-auth';
import { createUserSchema, searchUsersSchema, userIdParamsSchema } from '@/validation/user.schema';
import { asyncHandler, validateRequest } from '@chatapp/common';
import { Router } from 'express';

export const userRouter: Router = Router();

userRouter.use(requireAuth);

userRouter.get('/', asyncHandler(getAllUsers));
userRouter.get('/:id', validateRequest({ query: userIdParamsSchema }), asyncHandler(getUser));
userRouter.post('/', validateRequest({ body: createUserSchema }), asyncHandler(createUser));
userRouter.get('/search', validateRequest({ query: searchUsersSchema }), asyncHandler(searchUsers));
