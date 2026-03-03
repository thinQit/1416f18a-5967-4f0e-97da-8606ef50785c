import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { hashPassword, signToken } from '@/lib/auth';
import db from '@/lib/db';

const schema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(8)
});

export async function POST(request: NextRequest) {
  try {
    const payload = schema.parse(await request.json());
    const existing = await db.user.findUnique({ where: { email: payload.email } });
    if (existing) {
      return NextResponse.json({ success: false, error: 'Email already registered' }, { status: 400 });
    }

    const password_hash = await hashPassword(payload.password);
    const user = await db.user.create({
      data: {
        name: payload.name,
        email: payload.email,
        password_hash,
        role: 'user'
      }
    });

    const token = signToken({ userId: user.id, role: user.role });

    return NextResponse.json(
      {
        success: true,
        data: {
          user: { id: user.id, name: user.name, email: user.email, role: user.role, created_at: user.created_at },
          token
        }
      },
      { status: 201 }
    );
  } catch (_error) {
    return NextResponse.json({ success: false, error: 'Validation error' }, { status: 400 });
  }
}
