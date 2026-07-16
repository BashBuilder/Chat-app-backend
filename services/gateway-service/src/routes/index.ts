import type { Router } from 'express';
import { authRouter } from './auth.route';

export const registerRoutes = (app: Router) => {
  app.use('/auth', authRouter);
};
