import type { NextRequest } from 'next/server';
import type { User } from '@prisma/client';
import db from '@/lib/db';
import { getTokenFromHeader, verifyToken } from '@/lib/auth';

export async function getUserFromRequest(request: NextRequest): Promise<User | null> {
  const token = getTokenFromHeader(request.headers.get('authorization'));
  if (!token) return null;

  try {
    const payload = verifyToken(token);
    const userId = typeof payload === 'string' ? undefined : (payload as { userId?: string }).userId;
    if (!userId) return null;
    return db.user.findUnique({ where: { id: userId } });
  } catch (_error) {
    return null;
  }
}
