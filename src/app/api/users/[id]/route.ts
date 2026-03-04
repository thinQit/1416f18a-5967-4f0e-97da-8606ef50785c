import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import db from '@/lib/db';
import { getTokenFromHeader, hashPassword, verifyToken } from '@/lib/auth';

const updateSchema = z.object({
  name: z.string().min(2).optional(),
  email: z.string().email().optional(),
  password: z.string().min(8).regex(/^(?=.*[A-Za-z])(?=.*\d).+$/, 'Password must include a letter and a number').optional(),
  role: z.enum(['admin', 'user']).optional()
});

function getToken(request: NextRequest): string | null {
  const headerToken = getTokenFromHeader(request.headers.get('authorization'));
  if (headerToken) return headerToken;
  const cookieToken = request.cookies.get('access_token')?.value || request.cookies.get('token')?.value;
  return cookieToken ?? null;
}

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const token = getToken(request);
    if (!token) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }
    verifyToken(token);

    const user = await db.user.findUnique({ where: { id: params.id } });
    if (!user) {
      return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role as 'admin' | 'user',
        createdAt: user.createdAt.toISOString()
      }
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Request failed';
    return NextResponse.json({ success: false, error: message }, { status: 400 });
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const token = getToken(request);
    if (!token) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }
    verifyToken(token);

    const body = updateSchema.parse(await request.json());

    if (body.email) {
      const existing = await db.user.findUnique({ where: { email: body.email } });
      if (existing && existing.id !== params.id) {
        return NextResponse.json({ success: false, error: 'Email already in use' }, { status: 400 });
      }
    }

    const data: { name?: string; email?: string; role?: string; passwordHash?: string } = {
      name: body.name,
      email: body.email,
      role: body.role
    };

    if (body.password) {
      data.passwordHash = await hashPassword(body.password);
    }

    const user = await db.user.update({ where: { id: params.id }, data });

    return NextResponse.json({
      success: true,
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role as 'admin' | 'user',
        createdAt: user.createdAt.toISOString()
      }
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Invalid request';
    return NextResponse.json({ success: false, error: message }, { status: 400 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const token = getToken(request);
    if (!token) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }
    verifyToken(token);

    await db.user.delete({ where: { id: params.id } });
    return NextResponse.json({ success: true, data: { success: true } });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unable to delete user';
    return NextResponse.json({ success: false, error: message }, { status: 400 });
  }
}
