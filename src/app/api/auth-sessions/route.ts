import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { db } from '@/lib/db';

const querySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(10)
});

const createSchema = z.object({
  token: z.string().min(1),
  userId: z.string().min(1),
  expiresAt: z.coerce.date()
});

export async function GET(request: NextRequest) {
  let query: z.infer<typeof querySchema>;
  try {
    const { searchParams } = new URL(request.url);
    query = querySchema.parse({
      page: searchParams.get('page') ?? undefined,
      pageSize: searchParams.get('pageSize') ?? undefined
    });
  } catch {
    return NextResponse.json({ success: false, error: 'Invalid query parameters' }, { status: 400 });
  }

  try {
    const [total, sessions] = await Promise.all([
      db.authSession.count(),
      db.authSession.findMany({
        orderBy: { createdAt: 'desc' },
        skip: (query.page - 1) * query.pageSize,
        take: query.pageSize
      })
    ]);

    return NextResponse.json({
      success: true,
      data: {
        total,
        page: query.page,
        pageSize: query.pageSize,
        items: sessions
      }
    });
  } catch {
    return NextResponse.json({ success: false, error: 'Failed to fetch sessions' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  let payload: z.infer<typeof createSchema>;
  try {
    const json = await request.json();
    payload = createSchema.parse(json);
  } catch {
    return NextResponse.json({ success: false, error: 'Invalid input' }, { status: 400 });
  }

  try {
    const session = await db.authSession.create({
      data: {
        token: payload.token,
        userId: payload.userId,
        expiresAt: payload.expiresAt
      }
    });

    return NextResponse.json({ success: true, data: session }, { status: 201 });
  } catch {
    return NextResponse.json({ success: false, error: 'Failed to create session' }, { status: 500 });
  }
}
