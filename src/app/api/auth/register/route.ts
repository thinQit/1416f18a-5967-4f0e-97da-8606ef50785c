import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import db from '@/lib/db';
import { hashPassword, signToken } from '@/lib/auth';

const schema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(8)
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const data = schema.parse(body);

    const existing = await db.user.findUnique({ where: { email: data.email } });
    if (existing) {
      return NextResponse.json({ success: false, error: 'Email already registered' }, { status: 400 });
    }

    const passwordHash = await hashPassword(data.password);
    const user = await db.user.create({
      data: {
        name: data.name,
        email: data.email,
        passwordHash
      }
    });

    const token = signToken({ userId: user.id, role: user.role });
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

    await db.authSession.create({
      data: {
        token,
        expiresAt
      }
    });

    return NextResponse.json(
      {
        success: true,
        data: {
          token,
          expiresAt: expiresAt.toISOString(),
          user: { id: user.id, name: user.name, email: user.email, role: user.role }
        }
      },
      { status: 201 }
    );
  } catch (error: unknown) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: 'Validation error', details: error.flatten() },
        { status: 400 }
      );
    }
    return NextResponse.json({ success: false, error: 'Registration failed' }, { status: 500 });
  }
}
