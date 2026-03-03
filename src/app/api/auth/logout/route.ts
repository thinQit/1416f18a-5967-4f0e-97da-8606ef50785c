import { NextRequest, NextResponse } from 'next/server';
import { getTokenFromHeader } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const token = getTokenFromHeader(request.headers.get('authorization'));
    if (!token) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    return NextResponse.json({ success: true, data: { message: 'Logged out' } });
  } catch (_error) {
    return NextResponse.json({ success: false, error: 'Logout failed' }, { status: 500 });
  }
}
