import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import db from '@/lib/db';
import { signToken, verifyPassword } from '@/lib/auth';

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
  remember: z.boolean().optional()
});

function safeUser(user: { id: string; name: string; email: string; role: string; createdAt: Date }) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role as 'admin' | 'user',
    createdAt: user.createdAt.toISOString()
  };
}

export async function POST(request: NextRequest) {
  try {
    const body = schema.parse(await request.json());
    const user = await db.user.findUnique({ where: { email: body.email } });
    if (!user) {
      return NextResponse.json({ success: false, error: 'Invalid credentials' }, { status: 401 });
    }

    const valid = await verifyPassword(body.password, user.passwordHash);
    if (!valid) {
      return NextResponse.json({ success: false, error: 'Invalid credentials' }, { status: 401 });
    }

    const token = signToken({ sub: user.id, email: user.email, role: user.role });
    const expiresIn = 60 * 60 * 24;
    const response = NextResponse.json({
      success: true,
      data: {
        accessToken: token,
        expiresIn,
        user: safeUser(user)
      }
    });

    response.cookies.set('access_token', token, {
      httpOnly: true,
      sameSite: 'strict',
      secure: process.env.NODE_ENV === 'production',
      maxAge: body.remember ? 60 * 60 * 24 * 7 : expiresIn,
      path: '/'
    });

    return response;
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Invalid request';
    return NextResponse.json({ success: false, error: message }, { status: 400 });
  }
}
