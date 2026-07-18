import type { Router } from 'express';
import { authRouter } from './auth.route';
import { userRouter } from './user.route';

export const registerRoutes = (app: Router) => {
  app.use('/auth', authRouter);
  app.use('/users', userRouter);
};
