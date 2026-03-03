import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(_request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await db.authSession.findUnique({ where: { id: params.id } });
    if (!session) {
      return NextResponse.json({ success: false, error: 'Not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: session });
  } catch {
    return NextResponse.json({ success: false, error: 'Failed to fetch session' }, { status: 500 });
  }
}

export async function DELETE(_request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await db.authSession.delete({ where: { id: params.id } });
    return NextResponse.json({ success: true, data: { success: true } });
  } catch {
    return NextResponse.json({ success: false, error: 'Failed to delete session' }, { status: 500 });
  }
}
