import type { NextRequest } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import type { Secret, SignOptions } from 'jsonwebtoken';
import { prisma } from '@/lib/db';

const JWT_SECRET: Secret = process.env.JWT_SECRET ?? 'dev-secret';
const DEFAULT_EXPIRES_IN = process.env.ACCESS_TOKEN_EXPIRES_IN ?? '1d';

export function signAccessToken(userId: string, options: SignOptions = {}) {
  return jwt.sign({ sub: userId }, JWT_SECRET, { expiresIn: DEFAULT_EXPIRES_IN, ...options });
}

export function verifyToken(token: string) {
  return jwt.verify(token, JWT_SECRET);
}

export function getBearerToken(value?: string | null) {
  if (!value) return null;
  const [type, token] = value.split(' ');
  if (!type || type.toLowerCase() !== 'bearer' || !token) return null;
  return token;
}

export function getTokenFromHeader(value?: string | null) {
  return getBearerToken(value);
}

export async function hashPassword(password: string) {
  return bcrypt.hash(password, 10);
}

export async function verifyPassword(password: string, hash: string) {
  return bcrypt.compare(password, hash);
}

export async function getCurrentUser(request: NextRequest) {
  const token =
    getTokenFromHeader(request.headers.get('authorization')) ??
    request.cookies.get('token')?.value ??
    null;

  if (!token) return null;

  try {
    const payload = verifyToken(token) as jwt.JwtPayload;
    const userId = typeof payload.sub === 'string' ? payload.sub : null;
    if (!userId) return null;
    return prisma.user.findUnique({ where: { id: userId } });
  } catch {
    return null;
  }
}
