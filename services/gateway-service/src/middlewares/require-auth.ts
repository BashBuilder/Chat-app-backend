import { env } from '@/config/env';
import { AuthenticatedUser, HttpError, UnauthorizedError } from '@chatapp/common';
import { RequestHandler } from 'express';
import jwt from 'jsonwebtoken';

interface AccessTokenClaims {
  sub: string;
  email: string;
}

const parseAuthorizationHeader = (authorizationHeader: string | undefined): string | null => {
  if (!authorizationHeader) throw new UnauthorizedError('Unauthorized');

  const [scheme, token] = authorizationHeader.split(' ');

  if (scheme !== 'Bearer') throw new UnauthorizedError('Unauthorized');

  return token;
};

const toAuthenticatedUser = (claims: AccessTokenClaims): AuthenticatedUser => {
  if (!claims.sub) throw new UnauthorizedError('Unauthorized');

  return {
    id: claims.sub,
    email: claims.email,
  };
};

export const requireAuth: RequestHandler = (req, res, next) => {
  try {
    const authorizationHeader = req.headers.authorization;
    const token = parseAuthorizationHeader(authorizationHeader);

    if (!token) {
      throw new UnauthorizedError('Unauthorized');
    }

    const claims = jwt.verify(token, env.JWT_SECRET) as AccessTokenClaims;
    req.user = toAuthenticatedUser(claims);

    next();
  } catch (error) {
    if (error instanceof HttpError) {
      return next(error);
    }
    next(new UnauthorizedError('Unauthorized'));
  }
};
