import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import crypto from 'crypto';
import db from '@/lib/db';
import { signToken, verifyPassword } from '@/lib/auth';

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(8)
});

function generateRefreshToken(): string {
  return crypto.randomBytes(48).toString('hex');
}

function hashRefreshToken(token: string): string {
  return crypto.createHash('sha256').update(token).digest('hex');
}

export async function POST(request: NextRequest) {
  try {
    const payload = schema.parse(await request.json());
    const user = await db.user.findUnique({ where: { email: payload.email } });
    if (!user) {
      return NextResponse.json({ success: false, error: 'Invalid credentials' }, { status: 401 });
    }

    const valid = await verifyPassword(payload.password, user.password_hash);
    if (!valid) {
      return NextResponse.json({ success: false, error: 'Invalid credentials' }, { status: 401 });
    }

    const token = signToken({ userId: user.id, role: user.role });
    const refreshToken = generateRefreshToken();
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    await db.session.create({
      data: {
        user_id: user.id,
        refresh_token_hash: hashRefreshToken(refreshToken),
        expires_at: expiresAt
      }
    });

    return NextResponse.json({
      success: true,
      data: {
        user: { id: user.id, name: user.name, email: user.email, role: user.role, created_at: user.created_at },
        token,
        refreshToken
      }
    });
  } catch (_error) {
    return NextResponse.json({ success: false, error: 'Invalid credentials' }, { status: 401 });
  }
}
