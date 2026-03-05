import type { NextRequest } from 'next/server';
import { prisma } from '@/lib/db';
import { getTokenFromHeader, verifyToken } from '@/lib/auth';

export async function getCurrentUser(request: NextRequest) {
  const token =
    getTokenFromHeader(request.headers.get('authorization')) ??
    request.cookies.get('token')?.value ??
    request.cookies.get('shopflow_token')?.value ??
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

export function isAdmin(user: { role?: string | null } | null) {
  return user?.role === 'admin';
}
