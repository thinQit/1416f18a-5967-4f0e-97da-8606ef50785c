import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import db from '@/lib/db';
import { signToken, verifyPassword } from '@/lib/auth';

const loginSchema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(1, 'Password is required')
});

type SafeUser = { id: string; name: string; email: string; role: string; createdAt: Date };

function sanitizeUser(user: { id: string; name: string; email: string; role: string; createdAt: Date }) {
  const safeUser: SafeUser = {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    createdAt: user.createdAt
  };
  return safeUser;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const data = loginSchema.parse(body);

    const user = await db.user.findUnique({ where: { email: data.email } });
    if (!user) {
      return NextResponse.json({ success: false, error: 'Invalid credentials' }, { status: 401 });
    }

    const valid = await verifyPassword(data.password, user.passwordHash);
    if (!valid) {
      return NextResponse.json({ success: false, error: 'Invalid credentials' }, { status: 401 });
    }

    const token = signToken({ userId: user.id, role: user.role });
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

    await db.authToken.create({
      data: {
        token,
        expiresAt,
        userId: user.id
      }
    });

    return NextResponse.json({
      success: true,
      data: {
        user: sanitizeUser(user),
        token,
        expiresAt: expiresAt.toISOString()
      }
    });
  } catch (error: unknown) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ success: false, error: 'Invalid login data' }, { status: 400 });
    }
    console.error(JSON.stringify({ level: 'error', message: 'Login failed', error }));
    return NextResponse.json({ success: false, error: 'Login failed' }, { status: 500 });
  }
}
