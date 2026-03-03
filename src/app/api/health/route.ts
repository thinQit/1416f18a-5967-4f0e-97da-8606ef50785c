import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const full = searchParams.get('full') === 'true';

  const data = full
    ? { status: 'ok', uptime_seconds: Math.floor(process.uptime()), version: '1.0.0', timestamp: new Date().toISOString() }
    : { status: 'ok', uptime_seconds: Math.floor(process.uptime()), version: '1.0.0' };

  return NextResponse.json({ success: true, data });
}
