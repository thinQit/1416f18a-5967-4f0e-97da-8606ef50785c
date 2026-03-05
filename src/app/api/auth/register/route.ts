import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import db from '@/lib/db';
import { hashPassword, signToken } from '@/lib/auth';

const registerSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email'),
  password: z.string().min(8, 'Password must be at least 8 characters')
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
    const data = registerSchema.parse(body);

    const existing = await db.user.findUnique({ where: { email: data.email } });
    if (existing) {
      return NextResponse.json({ success: false, error: 'Email already in use' }, { status: 400 });
    }

    const passwordHash = await hashPassword(data.password);
    const user = await db.user.create({
      data: {
        name: data.name,
        email: data.email,
        passwordHash,
        role: 'user'
      }
    });

    const token = signToken({ userId: user.id, role: user.role });
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

    await db.authToken.create({
      data: {
        token,
        expiresAt,
        userId: user.id
      }
    });

    return NextResponse.json(
      {
        success: true,
        data: {
          user: sanitizeUser(user),
          token,
          expiresAt: expiresAt.toISOString()
        }
      },
      { status: 201 }
    );
  } catch (error: unknown) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ success: false, error: 'Invalid registration data' }, { status: 400 });
    }
    console.error(JSON.stringify({ level: 'error', message: 'Registration failed', error }));
    return NextResponse.json({ success: false, error: 'Registration failed' }, { status: 500 });
  }
}
