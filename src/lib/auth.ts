import type { NextRequest } from 'next/server';
import jwt, { type JwtPayload, type Secret, type SignOptions } from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/db';

const JWT_SECRET: Secret = process.env.JWT_SECRET ?? 'dev-secret';

export function getBearerToken(header: string | null): string | null {
  if (!header) return null;
  const [scheme, token] = header.split(' ');
  if (scheme?.toLowerCase() !== 'bearer') return null;
  return token || null;
}

export function getTokenFromHeader(header: string | null): string | null {
  return getBearerToken(header);
}

export function signAccessToken(subject: string, options: SignOptions = { expiresIn: '7d' }) {
  return jwt.sign({}, JWT_SECRET, { ...options, subject });
}

export function verifyToken(token: string): JwtPayload {
  return jwt.verify(token, JWT_SECRET) as JwtPayload;
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
    const payload = verifyToken(token);
    const userId = typeof payload.sub === 'string' ? payload.sub : null;
    if (!userId) return null;
    return prisma.user.findUnique({ where: { id: userId } });
  } catch {
    return null;
  }
}

export async function getAuthenticatedUser(request: NextRequest) {
  return getCurrentUser(request);
}
