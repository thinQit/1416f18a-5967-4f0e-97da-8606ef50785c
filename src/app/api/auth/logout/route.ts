import { NextRequest, NextResponse } from 'next/server';

export async function POST(_request: NextRequest) {
  try {
    return NextResponse.json({ success: true, data: { ok: true } });
  } catch (_error) {
    return NextResponse.json({ success: false, error: 'Logout failed' }, { status: 500 });
  }
}
