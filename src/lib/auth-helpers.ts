import { NextRequest } from 'next/server';
import type { User } from '@prisma/client';
import { db } from '@/lib/db';
import { getTokenFromHeader, verifyToken } from '@/lib/auth';

export async function getCurrentUser(request: NextRequest): Promise<User | null> {
  const token = getTokenFromHeader(request.headers.get('authorization'));
  if (!token) return null;
  try {
    const payload = verifyToken(token);
    const userId = typeof payload.sub === 'string' ? payload.sub : null;
    if (!userId) return null;
    const user = await db.user.findUnique({ where: { id: userId } });
    return user;
  } catch (_error) {
    return null;
  }
}

export function isAdmin(user: User | null): boolean {
  return user?.role === 'admin';
}
