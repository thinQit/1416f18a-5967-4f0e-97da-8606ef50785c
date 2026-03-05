import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import db from '@/lib/db';
import { getUserFromRequest } from '@/lib/auth-helpers';
import type { Product } from '@prisma/client';

const updateSchema = z.object({
  name: z.string().min(1).optional(),
  description: z.string().min(1).optional(),
  price: z.coerce.number().positive().optional(),
  sku: z.string().optional(),
  images: z.array(z.string()).optional(),
  quantity: z.coerce.number().int().nonnegative().optional()
});

type ProductResponse = Omit<Product, 'images'> & { images: string[] | null };

function parseImages(images: string | null): string[] | null {
  if (!images) return null;
  try {
    const parsed = JSON.parse(images);
    if (Array.isArray(parsed) && parsed.every((item) => typeof item === 'string')) {
      return parsed;
    }
    return null;
  } catch (_error) {
    return null;
  }
}

function mapProduct(product: Product): ProductResponse {
  return {
    ...product,
    images: parseImages(product.images)
  };
}

export async function GET(_request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const product = await db.product.findUnique({ where: { id: params.id } });
    if (!product) {
      return NextResponse.json({ success: false, error: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: { product: mapProduct(product) } });
  } catch (error: unknown) {
    console.error(JSON.stringify({ level: 'error', message: 'Failed to fetch product', error }));
    return NextResponse.json({ success: false, error: 'Failed to fetch product' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const product = await db.product.findUnique({ where: { id: params.id } });
    if (!product) {
      return NextResponse.json({ success: false, error: 'Product not found' }, { status: 404 });
    }

    if (user.role !== 'admin' && product.createdBy !== user.id) {
      return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 });
    }

    const body = await request.json();
    const data = updateSchema.parse(body);

    const updateData: {
      name?: string;
      description?: string;
      price?: number;
      sku?: string | null;
      images?: string | null;
      quantity?: number | null;
    } = {};

    if (data.name !== undefined) updateData.name = data.name;
    if (data.description !== undefined) updateData.description = data.description;
    if (data.price !== undefined) updateData.price = data.price;
    if (data.sku !== undefined) updateData.sku = data.sku;
    if (data.images !== undefined) updateData.images = JSON.stringify(data.images);
    if (data.quantity !== undefined) updateData.quantity = data.quantity;

    const updated = await db.product.update({ where: { id: params.id }, data: updateData });

    console.log(JSON.stringify({ level: 'info', message: 'Product updated', userId: user.id, productId: updated.id }));

    return NextResponse.json({ success: true, data: { product: mapProduct(updated) } });
  } catch (error: unknown) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ success: false, error: 'Invalid product data' }, { status: 400 });
    }
    console.error(JSON.stringify({ level: 'error', message: 'Failed to update product', error }));
    return NextResponse.json({ success: false, error: 'Failed to update product' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const product = await db.product.findUnique({ where: { id: params.id } });
    if (!product) {
      return NextResponse.json({ success: false, error: 'Product not found' }, { status: 404 });
    }

    if (user.role !== 'admin' && product.createdBy !== user.id) {
      return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 });
    }

    await db.product.delete({ where: { id: params.id } });

    console.log(JSON.stringify({ level: 'info', message: 'Product deleted', userId: user.id, productId: params.id }));

    return NextResponse.json({ success: true, data: { success: true } });
  } catch (error: unknown) {
    console.error(JSON.stringify({ level: 'error', message: 'Failed to delete product', error }));
    return NextResponse.json({ success: false, error: 'Failed to delete product' }, { status: 500 });
  }
}
