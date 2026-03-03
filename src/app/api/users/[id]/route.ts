import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { db } from '@/lib/db';
import { getCurrentUser, isAdmin } from '@/lib/auth-helpers';
import { hashPassword } from '@/lib/auth';

const updateSchema = z.object({
  name: z.string().min(1, 'Name is required').optional(),
  email: z.string().email('Valid email is required').optional(),
  password: z.string().min(8, 'Password must be at least 8 characters').optional(),
  role: z.string().optional()
});

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const authUser = await getCurrentUser(request);
  if (!authUser) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }
  if (!isAdmin(authUser)) {
    return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 });
  }

  const user = await db.user.findUnique({
    where: { id: params.id },
    select: { id: true, name: true, email: true, role: true, createdAt: true, updatedAt: true }
  });

  if (!user) {
    return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 });
  }

  return NextResponse.json({ success: true, data: user });
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const authUser = await getCurrentUser(request);
    if (!authUser) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }
    if (!isAdmin(authUser)) {
      return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 });
    }

    const body = await request.json();
    const data = updateSchema.parse(body);

    const existing = await db.user.findUnique({ where: { id: params.id } });
    if (!existing) {
      return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 });
    }

    if (data.email) {
      const emailTaken = await db.user.findUnique({ where: { email: data.email } });
      if (emailTaken && emailTaken.id !== params.id) {
        return NextResponse.json({ success: false, error: 'Email already registered' }, { status: 400 });
      }
    }

    const updateData: {
      name?: string;
      email?: string;
      passwordHash?: string;
      role?: string;
    } = {
      name: data.name,
      email: data.email,
      role: data.role ? (data.role === 'admin' ? 'admin' : 'user') : undefined
    };

    if (data.password) {
      updateData.passwordHash = await hashPassword(data.password);
    }

    const user = await db.user.update({
      where: { id: params.id },
      data: updateData,
      select: { id: true, name: true, email: true, role: true, createdAt: true, updatedAt: true }
    });

    return NextResponse.json({ success: true, data: user });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ success: false, error: error.errors.map(err => err.message).join(', ') }, { status: 400 });
    }
    return NextResponse.json({ success: false, error: 'Failed to update user' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  const authUser = await getCurrentUser(request);
  if (!authUser) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }
  if (!isAdmin(authUser)) {
    return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 });
  }

  const existing = await db.user.findUnique({ where: { id: params.id } });
  if (!existing) {
    return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 });
  }

  await db.user.delete({ where: { id: params.id } });
  return NextResponse.json({ success: true, data: null });
}
