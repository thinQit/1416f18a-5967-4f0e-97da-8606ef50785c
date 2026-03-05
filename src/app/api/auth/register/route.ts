import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import db from '@/lib/db';
import { hashPassword } from '@/lib/auth';

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
      return NextResponse.json({ success: false, error: 'email_taken' }, { status: 409 });
    }

    const password_hash = await hashPassword(data.password);
    const user = await db.user.create({
      data: {
        name: data.name,
        email: data.email,
        password_hash,
        role: 'user'
      }
    });

    return NextResponse.json(
      {
        success: true,
        data: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          created_at: user.created_at.toISOString()
        }
      },
      { status: 201 }
    );
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'invalid_request';
    return NextResponse.json({ success: false, error: message }, { status: 400 });
  }
}
