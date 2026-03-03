import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getCurrentUser } from '@/lib/server-auth';

const createSchema = z.object({
  token: z.string().min(10),
  expiresAt: z.string().datetime()
});

export async function GET(request: NextRequest) {
  try {
    const current = await getCurrentUser(request);
    if (!current) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }
    if (current.user.role !== 'admin') {
      return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const pageParam = Number(searchParams.get('page') || 1);
    const limitParam = Number(searchParams.get('limit') || 10);
    const page = Number.isFinite(pageParam) && pageParam > 0 ? pageParam : 1;
    const limit = Number.isFinite(limitParam) && limitParam > 0 ? Math.min(limitParam, 50) : 10;

    return NextResponse.json({
      success: true,
      data: {
        items: [],
        meta: { page, limit, total: 0 }
      }
    });
  } catch (_error) {
    return NextResponse.json({ success: false, error: 'Failed to load sessions' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const current = await getCurrentUser(request);
    if (!current) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }
    if (current.user.role !== 'admin') {
      return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 });
    }

    const body = await request.json();
    createSchema.parse(body);

    return NextResponse.json(
      { success: false, error: 'Session storage not configured' },
      { status: 501 }
    );
  } catch (error: unknown) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: 'Validation error', details: error.flatten() },
        { status: 400 }
      );
    }
    return NextResponse.json({ success: false, error: 'Unable to create session' }, { status: 500 });
  }
}
