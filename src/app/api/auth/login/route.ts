import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import jwt, { type Secret } from 'jsonwebtoken';
import { db } from '@/lib/db';
import { signToken, hashPassword, verifyPassword } from '@/lib/auth';

const schema = z.object({
  email: z.string().email('Valid email is required'),
  password: z.string().min(8, 'Password must be at least 8 characters')
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const data = schema.parse(body);

    const user = await db.user.findUnique({ where: { email: data.email } });
    if (!user) {
      return NextResponse.json({ success: false, error: 'Invalid credentials' }, { status: 401 });
    }

    const valid = await verifyPassword(data.password, user.passwordHash);
    if (!valid) {
      return NextResponse.json({ success: false, error: 'Invalid credentials' }, { status: 401 });
    }

    const accessToken = signToken({ sub: user.id, role: user.role });

    const refreshSecret: Secret = process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET || 'dev-refresh-secret-change-me';
    const refreshToken = jwt.sign({ sub: user.id }, refreshSecret, { expiresIn: '7d' });
    const refreshTokenHash = await hashPassword(refreshToken);

    await db.authToken.deleteMany({ where: { userId: user.id } });
    await db.authToken.create({
      data: {
        userId: user.id,
        token: refreshTokenHash,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
      }
    });

    return NextResponse.json({
      success: true,
      data: {
        accessToken,
        refreshToken,
        expiresIn: 86400
      }
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ success: false, error: error.errors.map(err => err.message).join(', ') }, { status: 400 });
    }
    return NextResponse.json({ success: false, error: 'Login failed' }, { status: 500 });
  }
}
