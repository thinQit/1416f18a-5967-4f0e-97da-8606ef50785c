import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import db from '@/lib/db';
import { getAuthContext } from '@/lib/auth-helpers';
import { hashPassword } from '@/lib/auth';

const createSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(8),
  role: z.enum(['user', 'admin']).optional()
});

const querySchema = z.object({
  page: z.string().optional(),
  per_page: z.string().optional()
});

export async function GET(request: NextRequest) {
  try {
    const auth = await getAuthContext(request);
    if (!auth || auth.user.role !== 'admin') {
      return NextResponse.json({ success: false, error: 'forbidden' }, { status: 403 });
    }

    const params = Object.fromEntries(new URL(request.url).searchParams.entries());
    const parsed = querySchema.parse(params);
    const page = Math.max(1, parseInt(parsed.page ?? '1', 10) || 1);
    const perPage = Math.min(50, Math.max(1, parseInt(parsed.per_page ?? '20', 10) || 20));

    const [items, total] = await Promise.all([
      db.user.findMany({
        skip: (page - 1) * perPage,
        take: perPage,
        orderBy: { created_at: 'desc' },
        select: { id: true, name: true, email: true, role: true, created_at: true }
      }),
      db.user.count()
    ]);

    const users = items.map((user) => ({
      ...user,
      created_at: user.created_at.toISOString()
    }));

    return NextResponse.json({
      success: true,
      data: { items: users, total, page, per_page: perPage }
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'invalid_request';
    return NextResponse.json({ success: false, error: message }, { status: 400 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const auth = await getAuthContext(request);
    if (!auth || auth.user.role !== 'admin') {
      return NextResponse.json({ success: false, error: 'forbidden' }, { status: 403 });
    }

    const body = await request.json();
    const data = createSchema.parse(body);

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
        role: data.role ?? 'user'
      }
    });

    return NextResponse.json({
      success: true,
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        created_at: user.created_at.toISOString()
      }
    }, { status: 201 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'invalid_request';
    return NextResponse.json({ success: false, error: message }, { status: 400 });
  }
}
