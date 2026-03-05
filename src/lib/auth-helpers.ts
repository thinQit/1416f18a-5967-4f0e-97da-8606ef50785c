import type { JwtPayload } from 'jsonwebtoken';
import type { User } from '@prisma/client';
import { NextRequest } from 'next/server';
import db from '@/lib/db';
import { getTokenFromHeader, verifyToken } from '@/lib/auth';

export interface AuthContext {
  user: User;
  token: string;
}

export async function getAuthContext(request: NextRequest): Promise<AuthContext | null> {
  const token = getTokenFromHeader(request.headers.get('authorization')) ?? request.cookies.get('token')?.value ?? null;
  if (!token) return null;

  let payload: JwtPayload;
  try {
    payload = verifyToken(token);
  } catch {
    return null;
  }

  const userId = typeof payload.id === 'string' ? payload.id : null;
  if (!userId) return null;

  const session = await db.authSession.findUnique({ where: { token } });
  if (!session || session.expires_at < new Date() || session.user_id !== userId) return null;

  const user = await db.user.findUnique({ where: { id: userId } });
  if (!user) return null;

  return { user, token };
}
