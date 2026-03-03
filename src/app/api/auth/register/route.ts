import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { db } from '@/lib/db';
import { hashPassword, signToken } from '@/lib/auth';

const registerSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(6)
});

export async function POST(request: NextRequest) {
  let payload: z.infer<typeof registerSchema>;
  try {
    const json = await request.json();
    payload = registerSchema.parse(json);
  } catch {
    return NextResponse.json({ success: false, error: 'Invalid input' }, { status: 400 });
  }

  try {
    const existing = await db.user.findUnique({ where: { email: payload.email } });
    if (existing) {
      return NextResponse.json({ success: false, error: 'Email already registered' }, { status: 409 });
    }

    const passwordHash = await hashPassword(payload.password);
    const user = await db.user.create({
      data: {
        name: payload.name,
        email: payload.email,
        passwordHash,
        role: 'user'
      }
    });

    const token = signToken({ sub: user.id, role: user.role });
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);
    await db.authSession.create({
      data: {
        token,
        userId: user.id,
        expiresAt
      }
    });

    return NextResponse.json({
      success: true,
      data: {
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          createdAt: user.createdAt
        }
      }
    }, { status: 201 });
  } catch {
    return NextResponse.json({ success: false, error: 'Failed to register' }, { status: 500 });
  }
}
