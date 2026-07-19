import { createUser, getAllUsers, getUser, searchUsers } from '@/controllers/user.controller';
import { userIdParamsSchema, searchUsersSchema, createUserSchema } from '@/validation/user.schema';
import { asyncHandler, validateRequest } from '@chatapp/common';
import { Router } from 'express';

export const userRouter: Router = Router();

userRouter.get('/', asyncHandler(getAllUsers));
userRouter.get('/search', validateRequest({ query: searchUsersSchema }), asyncHandler(searchUsers));
userRouter.get('/:id', validateRequest({ params: userIdParamsSchema }), asyncHandler(getUser));
userRouter.post('/', validateRequest({ body: createUserSchema }), asyncHandler(createUser));
