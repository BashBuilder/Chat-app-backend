import { UnauthorizedError, USER_ID_HEADER, z } from '@chatapp/common';
import { RequestHandler } from 'express';

const userIdSchema = z.string().uuid();

export const attachAuthenticatedUser: RequestHandler = (req, res, next) => {
  try {
    const headerValue = req.headers[USER_ID_HEADER];
    const userId = userIdSchema.parse(headerValue);

    req.user = { id: userId };
    next();
  } catch (error) {
    next(new UnauthorizedError('Invalid or missing user context'));
  }
};
