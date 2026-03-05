import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import db from '@/lib/db';
import { getUserFromRequest } from '@/lib/auth-helpers';

const updateSchema = z.object({
  token: z.string().min(1).optional(),
  expiresAt: z.string().datetime().optional(),
  userId: z.string().optional()
});

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const authUser = await getUserFromRequest(request);
    if (!authUser) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }
    if (authUser.role !== 'admin') {
      return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 });
    }

    const token = await db.authToken.findUnique({ where: { id: params.id } });
    if (!token) {
      return NextResponse.json({ success: false, error: 'Auth token not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: {
        token: {
          id: token.id,
          token: token.token,
          expiresAt: token.expiresAt.toISOString(),
          createdAt: token.createdAt.toISOString(),
          userId: token.userId
        }
      }
    });
  } catch (error: unknown) {
    console.error(JSON.stringify({ level: 'error', message: 'Failed to fetch auth token', error }));
    return NextResponse.json({ success: false, error: 'Failed to fetch auth token' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const authUser = await getUserFromRequest(request);
    if (!authUser) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }
    if (authUser.role !== 'admin') {
      return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 });
    }

    const body = await request.json();
    const data = updateSchema.parse(body);

    if (data.userId) {
      const user = await db.user.findUnique({ where: { id: data.userId } });
      if (!user) {
        return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 });
      }
    }

    const updateData: { token?: string; expiresAt?: Date; userId?: string | null } = {};
    if (data.token !== undefined) updateData.token = data.token;
    if (data.expiresAt !== undefined) updateData.expiresAt = new Date(data.expiresAt);
    if (data.userId !== undefined) updateData.userId = data.userId;

    const token = await db.authToken.update({ where: { id: params.id }, data: updateData });

    return NextResponse.json({
      success: true,
      data: {
        token: {
          id: token.id,
          token: token.token,
          expiresAt: token.expiresAt.toISOString(),
          createdAt: token.createdAt.toISOString(),
          userId: token.userId
        }
      }
    });
  } catch (error: unknown) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ success: false, error: 'Invalid token data' }, { status: 400 });
    }
    console.error(JSON.stringify({ level: 'error', message: 'Failed to update auth token', error }));
    return NextResponse.json({ success: false, error: 'Failed to update auth token' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const authUser = await getUserFromRequest(request);
    if (!authUser) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }
    if (authUser.role !== 'admin') {
      return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 });
    }

    const token = await db.authToken.findUnique({ where: { id: params.id } });
    if (!token) {
      return NextResponse.json({ success: false, error: 'Auth token not found' }, { status: 404 });
    }

    await db.authToken.delete({ where: { id: params.id } });
    return NextResponse.json({ success: true, data: { success: true } });
  } catch (error: unknown) {
    console.error(JSON.stringify({ level: 'error', message: 'Failed to delete auth token', error }));
    return NextResponse.json({ success: false, error: 'Failed to delete auth token' }, { status: 500 });
  }
}
