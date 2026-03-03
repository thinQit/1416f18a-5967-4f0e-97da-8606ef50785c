import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getCurrentUser } from '@/lib/server-auth';

const updateSchema = z.object({
  token: z.string().min(10).optional(),
  expiresAt: z.string().datetime().optional()
});

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const current = await getCurrentUser(request);
    if (!current) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }
    if (current.user.role !== 'admin') {
      return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 });
    }

    return NextResponse.json(
      { success: false, error: `Session storage not configured for ${params.id}` },
      { status: 501 }
    );
  } catch (_error) {
    return NextResponse.json({ success: false, error: 'Failed to load session' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const current = await getCurrentUser(request);
    if (!current) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }
    if (current.user.role !== 'admin') {
      return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 });
    }

    const body = await request.json();
    updateSchema.parse(body);

    return NextResponse.json(
      { success: false, error: `Session storage not configured for ${params.id}` },
      { status: 501 }
    );
  } catch (error: unknown) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: 'Validation error', details: error.flatten() },
        { status: 400 }
      );
    }
    return NextResponse.json({ success: false, error: 'Unable to update session' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const current = await getCurrentUser(request);
    if (!current) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }
    if (current.user.role !== 'admin') {
      return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 });
    }

    return NextResponse.json(
      { success: false, error: `Session storage not configured for ${params.id}` },
      { status: 501 }
    );
  } catch (_error) {
    return NextResponse.json({ success: false, error: 'Unable to delete session' }, { status: 500 });
  }
}
