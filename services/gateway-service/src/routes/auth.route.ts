import { registerUser } from '@/controllers/auth.controller';
import { registerSchema } from '@/validation/auth.schema';
import { asyncHandler, validateRequest } from '@chatapp/common';
import { Router } from 'express';
import { register } from 'node:module';

export const authRouter: Router = Router();

authRouter.post('/register', validateRequest({ body: registerSchema }), asyncHandler(registerUser));
