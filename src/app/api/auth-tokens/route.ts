import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { db } from '@/lib/db';
import { getCurrentUser, isAdmin } from '@/lib/auth-helpers';

const createSchema = z.object({
  userId: z.string().min(1, 'User ID is required'),
  token: z.string().min(1, 'Token is required'),
  expiresAt: z.string().min(1, 'Expiry is required')
});

const querySchema = z.object({
  page: z.string().optional(),
  limit: z.string().optional()
});

export async function GET(request: NextRequest) {
  try {
    const authUser = await getCurrentUser(request);
    if (!authUser) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }
    if (!isAdmin(authUser)) {
      return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 });
    }

    const parsed = querySchema.parse(Object.fromEntries(new URL(request.url).searchParams));
    const pageValue = Number(parsed.page ?? 1);
    const limitValue = Number(parsed.limit ?? 20);

    const page = Number.isFinite(pageValue) && pageValue > 0 ? pageValue : 1;
    const limit = Number.isFinite(limitValue) && limitValue > 0 ? Math.min(limitValue, 100) : 20;

    const [items, total] = await Promise.all([
      db.authToken.findMany({
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' }
      }),
      db.authToken.count()
    ]);

    return NextResponse.json({ success: true, data: { items, total, page, limit } });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ success: false, error: error.errors.map(err => err.message).join(', ') }, { status: 400 });
    }
    return NextResponse.json({ success: false, error: 'Failed to fetch tokens' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const authUser = await getCurrentUser(request);
    if (!authUser) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }
    if (!isAdmin(authUser)) {
      return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 });
    }

    const body = await request.json();
    const data = createSchema.parse(body);

    const expiresAt = new Date(data.expiresAt);
    if (Number.isNaN(expiresAt.getTime())) {
      return NextResponse.json({ success: false, error: 'Invalid expiry date' }, { status: 400 });
    }

    const token = await db.authToken.create({
      data: {
        userId: data.userId,
        token: data.token,
        expiresAt
      }
    });

    return NextResponse.json({ success: true, data: token }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ success: false, error: error.errors.map(err => err.message).join(', ') }, { status: 400 });
    }
    return NextResponse.json({ success: false, error: 'Failed to create token' }, { status: 500 });
  }
}
