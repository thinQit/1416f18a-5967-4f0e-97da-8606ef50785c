import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import db from '@/lib/db';
import { getUserFromRequest } from '@/lib/auth-helpers';
import { hashPassword } from '@/lib/auth';

const createSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(8),
  role: z.string().optional()
});

export async function GET(request: NextRequest) {
  try {
    const authUser = await getUserFromRequest(request);
    if (!authUser) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }
    if (authUser.role !== 'admin') {
      return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 });
    }

    const users = await db.user.findMany({ orderBy: { createdAt: 'desc' } });
    const safeUsers = users.map(({ passwordHash: _passwordHash, ...safeUser }) => safeUser);
    return NextResponse.json({ success: true, data: { users: safeUsers } });
  } catch (error: unknown) {
    console.error(JSON.stringify({ level: 'error', message: 'Failed to list users', error }));
    return NextResponse.json({ success: false, error: 'Failed to list users' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const authUser = await getUserFromRequest(request);
    if (!authUser) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }
    if (authUser.role !== 'admin') {
      return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 });
    }

    const body = await request.json();
    const data = createSchema.parse(body);

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
        role: data.role ?? 'user'
      }
    });

    const { passwordHash: _passwordHash, ...safeUser } = user;
    return NextResponse.json({ success: true, data: { user: safeUser } }, { status: 201 });
  } catch (error: unknown) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ success: false, error: 'Invalid user data' }, { status: 400 });
    }
    console.error(JSON.stringify({ level: 'error', message: 'Failed to create user', error }));
    return NextResponse.json({ success: false, error: 'Failed to create user' }, { status: 500 });
  }
}
