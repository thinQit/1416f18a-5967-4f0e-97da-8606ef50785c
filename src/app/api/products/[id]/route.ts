import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import db from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';

const optionalNumber = z.preprocess(
  (value) => (typeof value === 'string' || typeof value === 'number' ? Number(value) : value),
  z.number().nonnegative()
).optional();
const optionalInt = z.preprocess(
  (value) => (typeof value === 'string' || typeof value === 'number' ? Number(value) : value),
  z.number().int().nonnegative()
).optional();

const updateSchema = z.object({
  name: z.string().min(2).optional(),
  description: z.string().min(2).optional(),
  price: optionalNumber,
  stock: optionalInt,
  imageUrl: z.string().url().optional().nullable()
});

export async function GET(_request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const product = await db.product.findUnique({ where: { id: params.id } });
    if (!product) {
      return NextResponse.json({ success: false, error: 'Product not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: product });
  } catch (_error) {
    return NextResponse.json({ success: false, error: 'Unable to fetch product' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await getCurrentUser(request);
    if (!user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }
    if (user.role !== 'admin') {
      return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 });
    }

    const body = await request.json();
    const data = updateSchema.parse(body);

    const product = await db.product.update({
      where: { id: params.id },
      data
    });

    return NextResponse.json({ success: true, data: product });
  } catch (error: unknown) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ success: false, error: error.errors[0]?.message || 'Invalid input' }, { status: 400 });
    }
    return NextResponse.json({ success: false, error: 'Unable to update product' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await getCurrentUser(request);
    if (!user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }
    if (user.role !== 'admin') {
      return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 });
    }

    const existing = await db.product.findUnique({ where: { id: params.id } });
    if (!existing) {
      return NextResponse.json({ success: false, error: 'Product not found' }, { status: 404 });
    }

    await db.product.delete({ where: { id: params.id } });
    return NextResponse.json({ success: true, data: { ok: true } });
  } catch (_error) {
    return NextResponse.json({ success: false, error: 'Unable to delete product' }, { status: 500 });
  }
}
