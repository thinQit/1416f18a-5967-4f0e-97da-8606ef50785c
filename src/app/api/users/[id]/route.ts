import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import db from '@/lib/db';
import { getUserFromRequest } from '@/lib/auth-helpers';
import { hashPassword } from '@/lib/auth';

const updateSchema = z.object({
  name: z.string().min(1).optional(),
  email: z.string().email().optional(),
  password: z.string().min(8).optional(),
  role: z.string().optional()
});

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const authUser = await getUserFromRequest(request);
    if (!authUser) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    if (authUser.role !== 'admin' && authUser.id !== params.id) {
      return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 });
    }

    const user = await db.user.findUnique({ where: { id: params.id } });
    if (!user) {
      return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 });
    }

    const { passwordHash: _passwordHash, ...safeUser } = user;
    return NextResponse.json({ success: true, data: { user: safeUser } });
  } catch (error: unknown) {
    console.error(JSON.stringify({ level: 'error', message: 'Failed to fetch user', error }));
    return NextResponse.json({ success: false, error: 'Failed to fetch user' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const authUser = await getUserFromRequest(request);
    if (!authUser) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const data = updateSchema.parse(body);

    if (authUser.role !== 'admin' && authUser.id !== params.id) {
      return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 });
    }

    if (data.role && authUser.role !== 'admin') {
      return NextResponse.json({ success: false, error: 'Only admins can change roles' }, { status: 403 });
    }

    if (data.email) {
      const existing = await db.user.findUnique({ where: { email: data.email } });
      if (existing && existing.id !== params.id) {
        return NextResponse.json({ success: false, error: 'Email already in use' }, { status: 400 });
      }
    }

    const updateData: { name?: string; email?: string; passwordHash?: string; role?: string } = {};
    if (data.name !== undefined) updateData.name = data.name;
    if (data.email !== undefined) updateData.email = data.email;
    if (data.role !== undefined) updateData.role = data.role;
    if (data.password !== undefined) {
      updateData.passwordHash = await hashPassword(data.password);
    }

    const user = await db.user.update({ where: { id: params.id }, data: updateData });
    const { passwordHash: _passwordHash, ...safeUser } = user;
    return NextResponse.json({ success: true, data: { user: safeUser } });
  } catch (error: unknown) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ success: false, error: 'Invalid user data' }, { status: 400 });
    }
    console.error(JSON.stringify({ level: 'error', message: 'Failed to update user', error }));
    return NextResponse.json({ success: false, error: 'Failed to update user' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const authUser = await getUserFromRequest(request);
    if (!authUser) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    if (authUser.role !== 'admin' && authUser.id !== params.id) {
      return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 });
    }

    const user = await db.user.findUnique({ where: { id: params.id } });
    if (!user) {
      return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 });
    }

    await db.user.delete({ where: { id: params.id } });
    return NextResponse.json({ success: true, data: { success: true } });
  } catch (error: unknown) {
    console.error(JSON.stringify({ level: 'error', message: 'Failed to delete user', error }));
    return NextResponse.json({ success: false, error: 'Failed to delete user' }, { status: 500 });
  }
}
