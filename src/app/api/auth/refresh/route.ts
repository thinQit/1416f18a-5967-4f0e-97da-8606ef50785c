import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import jwt, { type Secret } from 'jsonwebtoken';
import { db } from '@/lib/db';
import { signToken, verifyPassword } from '@/lib/auth';

const schema = z.object({
  refreshToken: z.string().min(1, 'Refresh token is required')
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const data = schema.parse(body);

    const refreshSecret: Secret = process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET || 'dev-refresh-secret-change-me';
    const payload = jwt.verify(data.refreshToken, refreshSecret) as { sub?: string };
    const userId = payload.sub;

    if (!userId) {
      return NextResponse.json({ success: false, error: 'Invalid refresh token' }, { status: 401 });
    }

    const storedTokens = await db.authToken.findMany({
      where: {
        userId,
        expiresAt: { gt: new Date() }
      }
    });

    let matched = false;
    for (const token of storedTokens) {
      const ok = await verifyPassword(data.refreshToken, token.token);
      if (ok) {
        matched = true;
        break;
      }
    }

    if (!matched) {
      return NextResponse.json({ success: false, error: 'Invalid refresh token' }, { status: 401 });
    }

    const user = await db.user.findUnique({ where: { id: userId } });
    if (!user) {
      return NextResponse.json({ success: false, error: 'Invalid refresh token' }, { status: 401 });
    }

    const accessToken = signToken({ sub: user.id, role: user.role });

    return NextResponse.json({ success: true, data: { accessToken, expiresIn: 86400 } });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ success: false, error: error.errors.map(err => err.message).join(', ') }, { status: 400 });
    }
    return NextResponse.json({ success: false, error: 'Refresh failed' }, { status: 401 });
  }
}
