import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import db from '@/lib/db';
import { getAuthContext } from '@/lib/auth-helpers';
import { hashPassword } from '@/lib/auth';

const updateSchema = z.object({
  name: z.string().min(2).optional(),
  email: z.string().email().optional(),
  password: z.string().min(8).optional(),
  role: z.enum(['user', 'admin']).optional()
});

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const auth = await getAuthContext(request);
    if (!auth) {
      return NextResponse.json({ success: false, error: 'unauthorized' }, { status: 401 });
    }

    if (auth.user.role !== 'admin' && auth.user.id !== params.id) {
      return NextResponse.json({ success: false, error: 'forbidden' }, { status: 403 });
    }

    const user = await db.user.findUnique({ where: { id: params.id } });
    if (!user) {
      return NextResponse.json({ success: false, error: 'not_found' }, { status: 404 });
    }

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
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'invalid_request';
    return NextResponse.json({ success: false, error: message }, { status: 400 });
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const auth = await getAuthContext(request);
    if (!auth) {
      return NextResponse.json({ success: false, error: 'unauthorized' }, { status: 401 });
    }

    if (auth.user.role !== 'admin' && auth.user.id !== params.id) {
      return NextResponse.json({ success: false, error: 'forbidden' }, { status: 403 });
    }

    const body = await request.json();
    const data = updateSchema.parse(body);

    if (data.role && auth.user.role !== 'admin') {
      return NextResponse.json({ success: false, error: 'forbidden' }, { status: 403 });
    }

    if (data.email) {
      const existing = await db.user.findUnique({ where: { email: data.email } });
      if (existing && existing.id !== params.id) {
        return NextResponse.json({ success: false, error: 'email_taken' }, { status: 409 });
      }
    }

    const updateData: { name?: string; email?: string; password_hash?: string; role?: string } = {};
    if (data.name) updateData.name = data.name;
    if (data.email) updateData.email = data.email;
    if (data.role) updateData.role = data.role;
    if (data.password) {
      updateData.password_hash = await hashPassword(data.password);
    }

    const user = await db.user.update({ where: { id: params.id }, data: updateData });

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
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'invalid_request';
    return NextResponse.json({ success: false, error: message }, { status: 400 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const auth = await getAuthContext(request);
    if (!auth || auth.user.role !== 'admin') {
      return NextResponse.json({ success: false, error: 'forbidden' }, { status: 403 });
    }

    const user = await db.user.findUnique({ where: { id: params.id } });
    if (!user) {
      return NextResponse.json({ success: false, error: 'not_found' }, { status: 404 });
    }

    await db.user.delete({ where: { id: params.id } });
    return NextResponse.json({ success: true, data: { success: true } });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'invalid_request';
    return NextResponse.json({ success: false, error: message }, { status: 400 });
  }
}
