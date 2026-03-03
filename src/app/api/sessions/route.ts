import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import db from '@/lib/db';
import { getTokenFromHeader, verifyToken } from '@/lib/auth';

const createSchema = z.object({
  user_id: z.string().uuid(),
  refresh_token_hash: z.string().min(10),
  expires_at: z.string().datetime()
});

function isAdmin(token: string | null): boolean {
  if (!token) return false;
  const payload = verifyToken(token);
  return payload.role === 'admin';
}

export async function GET(request: NextRequest) {
  try {
    const token = getTokenFromHeader(request.headers.get('authorization'));
    if (!isAdmin(token)) {
      return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 });
    }

    const sessions = await db.session.findMany();
    return NextResponse.json({ success: true, data: sessions });
  } catch (_error) {
    return NextResponse.json({ success: false, error: 'Unable to fetch sessions' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const token = getTokenFromHeader(request.headers.get('authorization'));
    if (!isAdmin(token)) {
      return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 });
    }

    const payload = createSchema.parse(await request.json());
    const session = await db.session.create({
      data: {
        user_id: payload.user_id,
        refresh_token_hash: payload.refresh_token_hash,
        expires_at: new Date(payload.expires_at)
      }
    });

    return NextResponse.json({ success: true, data: session }, { status: 201 });
  } catch (_error) {
    return NextResponse.json({ success: false, error: 'Validation error' }, { status: 400 });
  }
}
