import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getTokenFromHeader, verifyToken } from '@/lib/auth';

async function getCurrentUser(request: NextRequest) {
  const token = getTokenFromHeader(request.headers.get('authorization')) ?? request.cookies.get('token')?.value ?? null;
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

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser(request);
    if (!user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }
    if (user.role !== 'admin') {
      return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 });
    }

    const [totalUsers, totalProducts] = await Promise.all([
      prisma.user.count(),
      prisma.product.count({ where: { isDeleted: false } })
    ]);

    return NextResponse.json({
      success: true,
      data: { totalUsers, totalProducts }
    });
  } catch {
    return NextResponse.json({ success: false, error: 'Failed to fetch dashboard stats' }, { status: 500 });
  }
}
