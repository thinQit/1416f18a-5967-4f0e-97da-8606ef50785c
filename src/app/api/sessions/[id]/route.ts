import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import db from '@/lib/db';
import { getTokenFromHeader, verifyToken } from '@/lib/auth';

const updateSchema = z.object({
  expires_at: z.string().datetime().optional()
});

function isAdmin(token: string | null): boolean {
  if (!token) return false;
  const payload = verifyToken(token);
  return payload.role === 'admin';
}

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const token = getTokenFromHeader(request.headers.get('authorization'));
    if (!isAdmin(token)) {
      return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 });
    }

    const session = await db.session.findUnique({ where: { id: params.id } });
    if (!session) {
      return NextResponse.json({ success: false, error: 'Not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: session });
  } catch (_error) {
    return NextResponse.json({ success: false, error: 'Unable to fetch session' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const token = getTokenFromHeader(request.headers.get('authorization'));
    if (!isAdmin(token)) {
      return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 });
    }

    const payload = updateSchema.parse(await request.json());
    const existing = await db.session.findUnique({ where: { id: params.id } });
    if (!existing) {
      return NextResponse.json({ success: false, error: 'Not found' }, { status: 404 });
    }

    const session = await db.session.update({
      where: { id: params.id },
      data: {
        expires_at: payload.expires_at ? new Date(payload.expires_at) : existing.expires_at
      }
    });

    return NextResponse.json({ success: true, data: session });
  } catch (_error) {
    return NextResponse.json({ success: false, error: 'Validation error' }, { status: 400 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const token = getTokenFromHeader(request.headers.get('authorization'));
    if (!isAdmin(token)) {
      return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 });
    }

    await db.session.delete({ where: { id: params.id } });
    return NextResponse.json({ success: true, data: { id: params.id } });
  } catch (_error) {
    return NextResponse.json({ success: false, error: 'Unable to delete session' }, { status: 500 });
  }
}
