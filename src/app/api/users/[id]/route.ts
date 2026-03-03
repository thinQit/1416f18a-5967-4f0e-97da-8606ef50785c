import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import db from '@/lib/db';
import { getTokenFromHeader, verifyToken, hashPassword } from '@/lib/auth';

const updateSchema = z.object({
  name: z.string().min(2).optional(),
  email: z.string().email().optional(),
  password: z.string().min(8).optional()
});

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const token = getTokenFromHeader(request.headers.get('authorization'));
    if (!token) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }
    const payload = verifyToken(token);
    const userId = typeof payload.userId === 'string' ? payload.userId : null;
    const role = typeof payload.role === 'string' ? payload.role : 'user';
    if (!userId) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    if (userId !== params.id && role !== 'admin') {
      return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 });
    }

    const user = await db.user.findUnique({
      where: { id: params.id },
      select: { id: true, name: true, email: true, role: true, created_at: true }
    });

    if (!user) {
      return NextResponse.json({ success: false, error: 'Not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: user });
  } catch (_error) {
    return NextResponse.json({ success: false, error: 'Unable to fetch user' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const token = getTokenFromHeader(request.headers.get('authorization'));
    if (!token) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }
    const payload = verifyToken(token);
    const userId = typeof payload.userId === 'string' ? payload.userId : null;
    const role = typeof payload.role === 'string' ? payload.role : 'user';
    if (!userId) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    if (userId !== params.id && role !== 'admin') {
      return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 });
    }

    const data = updateSchema.parse(await request.json());
    const existing = await db.user.findUnique({ where: { id: params.id } });
    if (!existing) {
      return NextResponse.json({ success: false, error: 'Not found' }, { status: 404 });
    }

    const password_hash = data.password ? await hashPassword(data.password) : existing.password_hash;

    const user = await db.user.update({
      where: { id: params.id },
      data: {
        name: data.name ?? existing.name,
        email: data.email ?? existing.email,
        password_hash
      },
      select: { id: true, name: true, email: true, role: true, created_at: true }
    });

    return NextResponse.json({ success: true, data: user });
  } catch (_error) {
    return NextResponse.json({ success: false, error: 'Validation error' }, { status: 400 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const token = getTokenFromHeader(request.headers.get('authorization'));
    if (!token) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }
    const payload = verifyToken(token);
    const role = typeof payload.role === 'string' ? payload.role : 'user';

    if (role !== 'admin') {
      return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 });
    }

    await db.user.delete({ where: { id: params.id } });
    return NextResponse.json({ success: true, data: { id: params.id } });
  } catch (_error) {
    return NextResponse.json({ success: false, error: 'Unable to delete user' }, { status: 500 });
  }
}
