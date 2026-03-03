import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { db } from '@/lib/db';
import { signToken, verifyPassword } from '@/lib/auth';

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1)
});

export async function POST(request: NextRequest) {
  let payload: z.infer<typeof loginSchema>;
  try {
    const json = await request.json();
    payload = loginSchema.parse(json);
  } catch {
    return NextResponse.json({ success: false, error: 'Invalid input' }, { status: 400 });
  }

  try {
    const user = await db.user.findUnique({ where: { email: payload.email } });
    if (!user) {
      return NextResponse.json({ success: false, error: 'Invalid credentials' }, { status: 401 });
    }

    const valid = await verifyPassword(payload.password, user.passwordHash);
    if (!valid) {
      return NextResponse.json({ success: false, error: 'Invalid credentials' }, { status: 401 });
    }

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
          role: user.role
        }
      }
    });
  } catch {
    return NextResponse.json({ success: false, error: 'Failed to login' }, { status: 500 });
  }
}
