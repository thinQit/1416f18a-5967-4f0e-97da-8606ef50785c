import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';
import { getAuthContext } from '@/lib/auth-helpers';

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const auth = await getAuthContext(request);
    if (!auth || auth.user.role !== 'admin') {
      return NextResponse.json({ success: false, error: 'forbidden' }, { status: 403 });
    }

    const session = await db.authSession.findUnique({ where: { token: params.id } });
    if (!session) {
      return NextResponse.json({ success: false, error: 'not_found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: { token: session.token, expires_at: session.expires_at.toISOString() }
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'invalid_request';
    return NextResponse.json({ success: false, error: message }, { status: 400 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const auth = await getAuthContext(request);
    if (!auth || auth.user.role !== 'admin') {
      return NextResponse.json({ success: false, error: 'forbidden' }, { status: 403 });
    }

    const session = await db.authSession.findUnique({ where: { token: params.id } });
    if (!session) {
      return NextResponse.json({ success: false, error: 'not_found' }, { status: 404 });
    }

    await db.authSession.delete({ where: { token: params.id } });
    return NextResponse.json({ success: true, data: { success: true } });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'invalid_request';
    return NextResponse.json({ success: false, error: message }, { status: 400 });
  }
}
