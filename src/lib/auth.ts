import jwt from 'jsonwebtoken';
import type { Secret, SignOptions } from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/db';

type JwtPayload = {
  sub?: string;
  userId?: string;
  id?: string;
  email?: string;
  [key: string]: unknown;
};

const JWT_SECRET: Secret = process.env.JWT_SECRET || 'dev-secret';

export function getBearerToken(authorization?: string | null): string | null {
  if (!authorization) return null;
  const [type, token] = authorization.split(' ');
  if (type?.toLowerCase() !== 'bearer') return null;
  return token || null;
}

export function getTokenFromHeader(authorization?: string | null): string | null {
  return getBearerToken(authorization);
}

export function signAccessToken(payload: Record<string, unknown>, options: SignOptions = {}): string {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: '1h',
    ...options,
  });
}

export function verifyToken(token: string): JwtPayload {
  return jwt.verify(token, JWT_SECRET) as JwtPayload;
}

export async function getAuthenticatedUser(token: string) {
  const decoded = verifyToken(token);
  const userId = decoded.sub || decoded.userId || decoded.id;
  if (!userId) return null;
  return prisma.user.findUnique({ where: { id: userId } });
}

export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

export async function verifyPassword(password: string, hashed: string): Promise<boolean> {
  return bcrypt.compare(password, hashed);
}
