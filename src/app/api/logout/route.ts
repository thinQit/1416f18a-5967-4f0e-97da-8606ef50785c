import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import crypto from 'crypto';
import db from '@/lib/db';

const schema = z.object({
  refreshToken: z.string().optional()
});

function hashRefreshToken(token: string): string {
  return crypto.createHash('sha256').update(token).digest('hex');
}

export async function POST(request: NextRequest) {
  try {
    const payload = schema.parse(await request.json());
    if (payload.refreshToken) {
      await db.session.deleteMany({ where: { refresh_token_hash: hashRefreshToken(payload.refreshToken) } });
    }
    return NextResponse.json({ success: true, data: { loggedOut: true } });
  } catch (_error) {
    return NextResponse.json({ success: false, error: 'Invalid request' }, { status: 400 });
  }
}
