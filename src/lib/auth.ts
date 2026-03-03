import bcrypt from 'bcryptjs';
import jwt, { type Secret, type SignOptions } from 'jsonwebtoken';
import { NextRequest } from 'next/server';
import { db } from './db';

const JWT_SECRET: Secret = process.env.JWT_SECRET || 'dev-secret-change-me';

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export function signToken(payload: object): string {
  const options: SignOptions = { expiresIn: '24h' };
  return jwt.sign(payload, JWT_SECRET, options);
}

export function verifyToken(token: string): jwt.JwtPayload {
  return jwt.verify(token, JWT_SECRET) as jwt.JwtPayload;
}

export function getTokenFromHeader(authHeader: string | null): string | null {
  if (!authHeader) return null;
  const parts = authHeader.split(' ');
  return parts[0] === 'Bearer' && parts[1] ? parts[1] : null;
}

export async function getCurrentUser(request: NextRequest) {
  const token = getTokenFromHeader(request.headers.get('authorization'));
  if (!token) return null;

  let payload: jwt.JwtPayload;
  try {
    payload = verifyToken(token);
  } catch {
    return null;
  }

  const sub = typeof payload.sub === 'string' ? payload.sub : null;
  if (!sub) return null;

  return db.user.findUnique({ where: { id: sub } });
}
