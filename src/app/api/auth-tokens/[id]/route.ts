import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { db } from '@/lib/db';
import { getCurrentUser, isAdmin } from '@/lib/auth-helpers';

const updateSchema = z.object({
  token: z.string().min(1, 'Token is required').optional(),
  expiresAt: z.string().min(1, 'Expiry is required').optional()
});

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const authUser = await getCurrentUser(request);
  if (!authUser) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }
  if (!isAdmin(authUser)) {
    return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 });
  }

  const token = await db.authToken.findUnique({ where: { id: params.id } });
  if (!token) {
    return NextResponse.json({ success: false, error: 'Token not found' }, { status: 404 });
  }

  return NextResponse.json({ success: true, data: token });
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const authUser = await getCurrentUser(request);
    if (!authUser) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }
    if (!isAdmin(authUser)) {
      return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 });
    }

    const body = await request.json();
    const data = updateSchema.parse(body);

    const existing = await db.authToken.findUnique({ where: { id: params.id } });
    if (!existing) {
      return NextResponse.json({ success: false, error: 'Token not found' }, { status: 404 });
    }

    const updateData: { token?: string; expiresAt?: Date } = {};
    if (data.token) updateData.token = data.token;
    if (data.expiresAt) {
      const expiresAt = new Date(data.expiresAt);
      if (Number.isNaN(expiresAt.getTime())) {
        return NextResponse.json({ success: false, error: 'Invalid expiry date' }, { status: 400 });
      }
      updateData.expiresAt = expiresAt;
    }

    const token = await db.authToken.update({
      where: { id: params.id },
      data: updateData
    });

    return NextResponse.json({ success: true, data: token });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ success: false, error: error.errors.map(err => err.message).join(', ') }, { status: 400 });
    }
    return NextResponse.json({ success: false, error: 'Failed to update token' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  const authUser = await getCurrentUser(request);
  if (!authUser) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }
  if (!isAdmin(authUser)) {
    return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 });
  }

  const existing = await db.authToken.findUnique({ where: { id: params.id } });
  if (!existing) {
    return NextResponse.json({ success: false, error: 'Token not found' }, { status: 404 });
  }

  await db.authToken.delete({ where: { id: params.id } });
  return NextResponse.json({ success: true, data: null });
}
