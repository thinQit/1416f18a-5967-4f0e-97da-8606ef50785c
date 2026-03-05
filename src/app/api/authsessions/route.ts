import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import db from '@/lib/db';
import { getAuthContext } from '@/lib/auth-helpers';

const createSchema = z.object({
  token: z.string().min(10),
  expires_at: z.string().datetime()
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
      db.authSession.findMany({
        skip: (page - 1) * perPage,
        take: perPage,
        orderBy: { expires_at: 'desc' }
      }),
      db.authSession.count()
    ]);

    const sessions = items.map((session) => ({
      token: session.token,
      expires_at: session.expires_at.toISOString()
    }));

    return NextResponse.json({
      success: true,
      data: { items: sessions, total, page, per_page: perPage }
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

    const session = await db.authSession.create({
      data: {
        token: data.token,
        expires_at: new Date(data.expires_at)
      }
    });

    return NextResponse.json({
      success: true,
      data: { token: session.token, expires_at: session.expires_at.toISOString() }
    }, { status: 201 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'invalid_request';
    return NextResponse.json({ success: false, error: message }, { status: 400 });
  }
}
