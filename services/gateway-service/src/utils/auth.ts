import { Request } from 'express';
import { UnauthorizedError, type AuthenticatedUser } from '@chatapp/common';

export const getAuthicatedUser = (req: Request): AuthenticatedUser => {
  if (!req.user) {
    throw new UnauthorizedError('Unauthorized');
  }

  return req.user;
};
