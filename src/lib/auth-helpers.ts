import type { NextRequest } from 'next/server';
import { prisma } from '@/lib/db';
import { getTokenFromHeader, verifyToken } from '@/lib/auth';

export async function getAuthContext(request: NextRequest) {
  const token =
    getTokenFromHeader(request.headers.get('authorization')) ??
    request.cookies.get('token')?.value ??
    null;

  if (!token) return null;

  try {
    const payload = verifyToken(token);
    const userId = typeof payload.sub === 'string' ? payload.sub : null;
    if (!userId) return null;

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) return null;

    return { user, token };
  } catch {
    return null;
  }
}
