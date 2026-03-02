import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(_request: NextRequest) {
  try {
    await prisma.$queryRaw`SELECT 1`;
    return NextResponse.json({ success: true, data: { status: 'ok', details: { db: 'ok' } } });
  } catch {
    return NextResponse.json({ success: true, data: { status: 'degraded', details: { db: 'error' } } });
  }
}
