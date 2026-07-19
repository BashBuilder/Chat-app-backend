import { Router } from 'express';
import { conversationRouter } from './conversation.route';

export const registerRoutes = (app: Router) => {
  app.use('/api/conversations', conversationRouter);
};
