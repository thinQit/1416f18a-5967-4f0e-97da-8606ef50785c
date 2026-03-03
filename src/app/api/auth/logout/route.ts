import { NextRequest, NextResponse } from 'next/server';
import { getTokenFromHeader } from '@/lib/auth';
import { db } from '@/lib/db';

export async function POST(request: NextRequest) {
  const token = getTokenFromHeader(request.headers.get('authorization'));
  if (!token) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    await db.authSession.deleteMany({ where: { token } });
    return NextResponse.json({ success: true, data: { success: true } });
  } catch {
    return NextResponse.json({ success: false, error: 'Failed to logout' }, { status: 500 });
  }
}
