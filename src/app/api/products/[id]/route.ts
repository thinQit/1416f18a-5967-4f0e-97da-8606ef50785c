import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import db from '@/lib/db';
import { getCurrentUser } from '@/lib/server-auth';

const updateSchema = z.object({
  name: z.string().min(2).optional(),
  description: z.string().optional(),
  price: z.number().positive().optional(),
  currency: z.string().optional(),
  stock: z.number().int().optional(),
  images: z.array(z.string()).optional(),
  isActive: z.boolean().optional()
});

const parseImages = (value: string | null): string[] => {
  if (!value) return [];
  try {
    const parsed = JSON.parse(value) as unknown;
    return Array.isArray(parsed) && parsed.every((item) => typeof item === 'string') ? parsed : [];
  } catch (_error) {
    return [];
  }
};

export async function GET(_request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const product = await db.product.findUnique({ where: { id: params.id } });
    if (!product) {
      return NextResponse.json({ success: false, error: 'Not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: {
        ...product,
        images: parseImages(product.images)
      }
    });
  } catch (_error) {
    return NextResponse.json({ success: false, error: 'Failed to load product' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const current = await getCurrentUser(request);
    if (!current) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }
    if (current.user.role !== 'admin') {
      return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 });
    }

    const body = await request.json();
    const data = updateSchema.parse(body);

    const updateData: {
      name?: string;
      description?: string;
      price?: number;
      currency?: string;
      stock?: number;
      images?: string;
      isActive?: boolean;
    } = {};

    if (data.name !== undefined) updateData.name = data.name;
    if (data.description !== undefined) updateData.description = data.description;
    if (data.price !== undefined) updateData.price = data.price;
    if (data.currency !== undefined) updateData.currency = data.currency;
    if (data.stock !== undefined) updateData.stock = data.stock;
    if (data.isActive !== undefined) updateData.isActive = data.isActive;
    if (data.images !== undefined) updateData.images = JSON.stringify(data.images);

    const product = await db.product.update({
      where: { id: params.id },
      data: updateData
    });

    return NextResponse.json({
      success: true,
      data: {
        ...product,
        images: parseImages(product.images)
      }
    });
  } catch (error: unknown) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: 'Validation error', details: error.flatten() },
        { status: 400 }
      );
    }
    return NextResponse.json({ success: false, error: 'Unable to update product' }, { status: 500 });
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

    await db.product.update({
      where: { id: params.id },
      data: { isActive: false }
    });

    return NextResponse.json({ success: true, data: { message: 'Product deleted' } });
  } catch (_error) {
    return NextResponse.json({ success: false, error: 'Unable to delete product' }, { status: 500 });
  }
}
