import { AuthenticatedUser } from '@chatapp/common';

declare global {
  namespace Express {
    interface Request {
      user?: AuthenticatedUser;
      validated?: {
        query?: Record<string, unknown>;
        body?: Record<string, unknown>;
        params?: Record<string, unknown>;
      };
    }
  }
}

export {};
