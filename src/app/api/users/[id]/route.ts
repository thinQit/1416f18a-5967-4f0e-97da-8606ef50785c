import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import db from '@/lib/db';
import { hashPassword } from '@/lib/auth';
import { getCurrentUser } from '@/lib/server-auth';

const updateSchema = z.object({
  name: z.string().min(2).optional(),
  email: z.string().email().optional(),
  password: z.string().min(8).optional(),
  role: z.string().optional()
});

const mapUser = (user: { id: string; name: string | null; email: string; role: string; createdAt: Date; updatedAt: Date }) => ({
  id: user.id,
  name: user.name,
  email: user.email,
  role: user.role,
  createdAt: user.createdAt.toISOString(),
  updatedAt: user.updatedAt.toISOString()
});

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const current = await getCurrentUser(request);
    if (!current) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const isSelf = current.user.id === params.id;
    if (!isSelf && current.user.role !== 'admin') {
      return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 });
    }

    const user = await db.user.findUnique({ where: { id: params.id } });
    if (!user) {
      return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: mapUser(user) });
  } catch (_error) {
    return NextResponse.json({ success: false, error: 'Failed to load user' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const current = await getCurrentUser(request);
    if (!current) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const isSelf = current.user.id === params.id;
    const isAdmin = current.user.role === 'admin';
    if (!isSelf && !isAdmin) {
      return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 });
    }

    const body = await request.json();
    const data = updateSchema.parse(body);

    if (data.role && !isAdmin) {
      return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 });
    }

    if (data.email) {
      const existing = await db.user.findUnique({ where: { email: data.email } });
      if (existing && existing.id !== params.id) {
        return NextResponse.json({ success: false, error: 'Email already in use' }, { status: 400 });
      }
    }

    const updateData: {
      name?: string | null;
      email?: string;
      passwordHash?: string;
      role?: string;
    } = {};

    if (data.name !== undefined) updateData.name = data.name;
    if (data.email !== undefined) updateData.email = data.email;
    if (data.role !== undefined) updateData.role = data.role;
    if (data.password) updateData.passwordHash = await hashPassword(data.password);

    const user = await db.user.update({
      where: { id: params.id },
      data: updateData
    });

    return NextResponse.json({ success: true, data: mapUser(user) });
  } catch (error: unknown) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: 'Validation error', details: error.flatten() },
        { status: 400 }
      );
    }
    return NextResponse.json({ success: false, error: 'Unable to update user' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const current = await getCurrentUser(request);
    if (!current) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }
    if (current.user.role !== 'admin') {
      return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 });
    }

    await db.user.delete({ where: { id: params.id } });

    return NextResponse.json({ success: true, data: { message: 'User deleted' } });
  } catch (_error) {
    return NextResponse.json({ success: false, error: 'Unable to delete user' }, { status: 500 });
  }
}
