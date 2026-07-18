import { Router } from 'express';
import { userRouter } from './user.route';

export const registerRoutes = (app: Router) => {
  app.use('/users', userRouter);
};
