import { NextRequest, NextResponse } from 'next/server';

export async function GET(_request: NextRequest) {
  return NextResponse.json({
    success: true,
    data: {
      status: 'ok',
      uptime_seconds: process.uptime(),
      timestamp: new Date().toISOString()
    }
  });
}
