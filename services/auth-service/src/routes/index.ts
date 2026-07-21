import { Router } from 'express';
import { authRouter } from '@/routes/auth.route';

export const registerRoutes = (app: Router) => {
  // health
  app.get('/health', (_, res) => {
    res.json({ status: 'Healthy', services: 'auth-service' });
  });
  app.use('/auth', authRouter);
};
