import { NextRequest } from 'next/server';
import db from '@/lib/db';
import { getTokenFromHeader, verifyToken } from '@/lib/auth';

export interface CurrentUserResult {
  user: {
    id: string;
    name: string | null;
    email: string;
    role: string;
    createdAt: Date;
    updatedAt: Date;
  };
  token: string;
}

function extractUserId(payload: unknown): string | null {
  if (!payload || typeof payload !== 'object') return null;
  const record = payload as { userId?: unknown };
  return typeof record.userId === 'string' ? record.userId : null;
}

export async function getCurrentUser(request: NextRequest): Promise<CurrentUserResult | null> {
  const token = getTokenFromHeader(request.headers.get('authorization'));
  if (!token) return null;

  let payload: unknown;
  try {
    payload = verifyToken(token);
  } catch (_error) {
    return null;
  }

  const userId = extractUserId(payload);
  if (!userId) return null;

  const session = await db.authSession.findUnique({ where: { token } });
  if (!session || session.expiresAt < new Date()) return null;

  const user = await db.user.findUnique({ where: { id: userId } });
  if (!user) return null;

  return { user, token };
}
