import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import db from '@/lib/db';
import { hashPassword, signToken } from '@/lib/auth';

const schema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(8).regex(/^(?=.*[A-Za-z])(?=.*\d).+$/, 'Password must include a letter and a number')
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
    const existing = await db.user.findUnique({ where: { email: body.email } });
    if (existing) {
      return NextResponse.json({ success: false, error: 'Email already in use' }, { status: 400 });
    }

    const passwordHash = await hashPassword(body.password);
    const user = await db.user.create({
      data: {
        name: body.name,
        email: body.email,
        passwordHash,
        role: 'user'
      }
    });

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
      maxAge: expiresIn,
      path: '/'
    });

    return response;
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Invalid request';
    return NextResponse.json({ success: false, error: message }, { status: 400 });
  }
}
