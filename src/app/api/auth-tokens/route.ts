import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import db from '@/lib/db';
import { getUserFromRequest } from '@/lib/auth-helpers';

const createSchema = z.object({
  token: z.string().min(1),
  expiresAt: z.string().datetime(),
  userId: z.string().optional()
});

export async function GET(request: NextRequest) {
  try {
    const authUser = await getUserFromRequest(request);
    if (!authUser) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }
    if (authUser.role !== 'admin') {
      return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 });
    }

    const tokens = await db.authToken.findMany({ orderBy: { createdAt: 'desc' } });
    const mapped = tokens.map((token) => ({
      id: token.id,
      token: token.token,
      expiresAt: token.expiresAt.toISOString(),
      createdAt: token.createdAt.toISOString(),
      userId: token.userId
    }));

    return NextResponse.json({ success: true, data: { tokens: mapped } });
  } catch (error: unknown) {
    console.error(JSON.stringify({ level: 'error', message: 'Failed to list auth tokens', error }));
    return NextResponse.json({ success: false, error: 'Failed to list auth tokens' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const authUser = await getUserFromRequest(request);
    if (!authUser) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }
    if (authUser.role !== 'admin') {
      return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 });
    }

    const body = await request.json();
    const data = createSchema.parse(body);

    if (data.userId) {
      const user = await db.user.findUnique({ where: { id: data.userId } });
      if (!user) {
        return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 });
      }
    }

    const token = await db.authToken.create({
      data: {
        token: data.token,
        expiresAt: new Date(data.expiresAt),
        userId: data.userId ?? null
      }
    });

    return NextResponse.json(
      {
        success: true,
        data: {
          token: {
            id: token.id,
            token: token.token,
            expiresAt: token.expiresAt.toISOString(),
            createdAt: token.createdAt.toISOString(),
            userId: token.userId
          }
        }
      },
      { status: 201 }
    );
  } catch (error: unknown) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ success: false, error: 'Invalid token data' }, { status: 400 });
    }
    console.error(JSON.stringify({ level: 'error', message: 'Failed to create auth token', error }));
    return NextResponse.json({ success: false, error: 'Failed to create auth token' }, { status: 500 });
  }
}
