import { NextRequest, NextResponse } from 'next/server';
import { getAuthContext } from '@/lib/auth-helpers';

export async function GET(request: NextRequest) {
  try {
    const auth = await getAuthContext(request);
    if (!auth) {
      return NextResponse.json({ success: false, error: 'unauthorized' }, { status: 401 });
    }

    const user = auth.user;
    return NextResponse.json({
      success: true,
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        created_at: user.created_at.toISOString()
      }
    });
  } catch (_error) {
    return NextResponse.json({ success: false, error: 'unauthorized' }, { status: 401 });
  }
}
