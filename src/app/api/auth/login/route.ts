import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import db from '@/lib/db';
import { signToken, verifyPassword } from '@/lib/auth';

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(1)
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const data = schema.parse(body);

    const user = await db.user.findUnique({ where: { email: data.email } });
    if (!user) {
      return NextResponse.json({ success: false, error: 'invalid_credentials' }, { status: 401 });
    }

    const valid = await verifyPassword(data.password, user.password_hash);
    if (!valid) {
      return NextResponse.json({ success: false, error: 'invalid_credentials' }, { status: 401 });
    }

    const token = signToken({ id: user.id, email: user.email, role: user.role });
    const expires_at = new Date(Date.now() + 24 * 60 * 60 * 1000);

    await db.authSession.create({
      data: {
        token,
        expires_at,
        user_id: user.id
      }
    });

    const response = NextResponse.json({
      success: true,
      data: {
        token,
        expires_at: expires_at.toISOString(),
        user: { id: user.id, name: user.name, email: user.email }
      }
    });

    response.cookies.set('token', token, { httpOnly: true, sameSite: 'lax', path: '/' });

    return response;
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'invalid_request';
    return NextResponse.json({ success: false, error: message }, { status: 400 });
  }
}
