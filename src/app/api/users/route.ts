import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import db from '@/lib/db';
import { getTokenFromHeader, verifyToken, hashPassword } from '@/lib/auth';

const createSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(8),
  role: z.string().optional()
});

function isAdmin(token: string | null): boolean {
  if (!token) return false;
  const payload = verifyToken(token);
  return payload.role === 'admin';
}

export async function GET(request: NextRequest) {
  try {
    const token = getTokenFromHeader(request.headers.get('authorization'));
    if (!isAdmin(token)) {
      return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 });
    }

    const users = await db.user.findMany({
      select: { id: true, name: true, email: true, role: true, created_at: true }
    });

    return NextResponse.json({ success: true, data: users });
  } catch (_error) {
    return NextResponse.json({ success: false, error: 'Unable to fetch users' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const token = getTokenFromHeader(request.headers.get('authorization'));
    if (!isAdmin(token)) {
      return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 });
    }

    const payload = createSchema.parse(await request.json());
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
        role: payload.role === 'admin' ? 'admin' : 'user'
      }
    });

    return NextResponse.json(
      {
        success: true,
        data: { id: user.id, name: user.name, email: user.email, role: user.role, created_at: user.created_at }
      },
      { status: 201 }
    );
  } catch (_error) {
    return NextResponse.json({ success: false, error: 'Validation error' }, { status: 400 });
  }
}
