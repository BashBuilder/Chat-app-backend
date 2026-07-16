import { env } from '@/config/env';
import bcrypt from 'bcrypt';
import jwt, { Secret, SignOptions } from 'jsonwebtoken';

const ACCESS_TOKEN_SECRET: Secret = env.JWT_SECRET;
const REFRESH_TOKEN_SECRET: Secret = env.JWT_REFRESH_SECRET;
const ACCESS_OPTION: SignOptions = { expiresIn: env.JWT_EXPIRES_IN as SignOptions['expiresIn'] };
const REFRESH_OPTION: SignOptions = {
  expiresIn: env.JWT_REFRESH_EXPIRES_IN as SignOptions['expiresIn'],
};

export const hashPassword = async (password: string): Promise<string> => {
  const saltRounds = 12;
  return bcrypt.hash(password, saltRounds);
};

export const verifyPassword = async (password: string, hash: string): Promise<boolean> => {
  return bcrypt.compare(password, hash);
};

export interface AccessTokenPayload {
  sub: string;
  email: string;
}
export interface RefreshTokenPayload {
  sub: string;
  tokenId: string;
}

export const signAccessToken = (payload: AccessTokenPayload): string => {
  return jwt.sign(payload, ACCESS_TOKEN_SECRET, ACCESS_OPTION);
};

export const signRefreshToken = (payload: RefreshTokenPayload): string => {
  return jwt.sign(payload, REFRESH_TOKEN_SECRET, REFRESH_OPTION);
};

export const verifyRefreshToken = (payload: string): RefreshTokenPayload => {
  return jwt.verify(payload, REFRESH_TOKEN_SECRET) as RefreshTokenPayload;
};
export const verifyAccessToken = (payload: string): AccessTokenPayload => {
  return jwt.verify(payload, ACCESS_TOKEN_SECRET) as AccessTokenPayload;
};
