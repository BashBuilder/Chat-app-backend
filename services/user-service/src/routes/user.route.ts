import { getAllUsers, getUser, searchUsers } from '@/controllers/user.controller';
import { userIdParamsSchema, searchUsersSchema, createUserSchema } from '@/validation/user.schema';
import { asyncHandler, validateRequest } from '@chatapp/common';
import { Router } from 'express';

export const userRouter: Router = Router();

userRouter.get('/', asyncHandler(getAllUsers));
userRouter.get('/:id', validateRequest({ query: userIdParamsSchema }), asyncHandler(getUser));
userRouter.get('/search', validateRequest({ query: searchUsersSchema }), asyncHandler(searchUsers));
userRouter.post('/', validateRequest({ body: createUserSchema }), asyncHandler(searchUsers));
