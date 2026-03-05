import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';
import { getAuthContext } from '@/lib/auth-helpers';

export async function POST(request: NextRequest) {
  try {
    const auth = await getAuthContext(request);
    if (!auth) {
      return NextResponse.json({ success: false, error: 'unauthorized' }, { status: 401 });
    }

    await db.authSession.deleteMany({ where: { token: auth.token } });

    const response = NextResponse.json({ success: true, data: { success: true } });
    response.cookies.set('token', '', { httpOnly: true, sameSite: 'lax', path: '/', maxAge: 0 });
    return response;
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'invalid_request';
    return NextResponse.json({ success: false, error: message }, { status: 400 });
  }
}
