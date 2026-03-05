import { NextRequest, NextResponse } from 'next/server';
import { getUserFromRequest } from '@/lib/auth-helpers';

export async function GET(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { passwordHash: _passwordHash, ...safeUser } = user;
    return NextResponse.json({ success: true, data: { user: safeUser } });
  } catch (error: unknown) {
    console.error(JSON.stringify({ level: 'error', message: 'Failed to fetch user', error }));
    return NextResponse.json({ success: false, error: 'Failed to fetch user' }, { status: 500 });
  }
}
