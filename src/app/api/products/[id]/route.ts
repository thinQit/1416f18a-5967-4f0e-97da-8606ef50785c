import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { Prisma, Product } from '@prisma/client';
import { db } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';

const updateSchema = z.object({
  name: z.string().min(1).optional(),
  description: z.string().optional(),
  price: z.coerce.number().positive().optional(),
  sku: z.string().optional(),
  stock: z.coerce.number().int().min(0).optional(),
  images: z.array(z.string().url()).optional()
});

function parseImages(images: string | null): string[] {
  if (!images) return [];
  try {
    const parsed = JSON.parse(images) as unknown;
    return Array.isArray(parsed) ? parsed.filter((item): item is string => typeof item === 'string') : [];
  } catch {
    return [];
  }
}

function formatProduct(product: Product) {
  return {
    id: product.id,
    name: product.name,
    description: product.description,
    price: product.price,
    sku: product.sku,
    stock: product.stock,
    images: parseImages(product.images),
    createdBy: product.createdBy,
    createdAt: product.createdAt,
    updatedAt: product.updatedAt
  };
}

export async function GET(_request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const product = await db.product.findFirst({ where: { id: params.id, deleted: false } });
    if (!product) {
      return NextResponse.json({ success: false, error: 'Not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: formatProduct(product) });
  } catch {
    return NextResponse.json({ success: false, error: 'Failed to fetch product' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  const user = await getCurrentUser(request);
  if (!user) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  let payload: z.infer<typeof updateSchema>;
  try {
    const json = await request.json();
    payload = updateSchema.parse(json);
  } catch {
    return NextResponse.json({ success: false, error: 'Invalid input' }, { status: 400 });
  }

  if (Object.keys(payload).length === 0) {
    return NextResponse.json({ success: false, error: 'No fields to update' }, { status: 400 });
  }

  try {
    const existing = await db.product.findFirst({ where: { id: params.id, deleted: false } });
    if (!existing) {
      return NextResponse.json({ success: false, error: 'Not found' }, { status: 404 });
    }

    if (existing.createdBy !== user.id && user.role !== 'admin') {
      return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 });
    }

    const data: Prisma.ProductUpdateInput = {};
    if (payload.name !== undefined) data.name = payload.name;
    if (payload.description !== undefined) data.description = payload.description;
    if (payload.price !== undefined) data.price = payload.price;
    if (payload.sku !== undefined) data.sku = payload.sku;
    if (payload.stock !== undefined) data.stock = payload.stock;
    if (payload.images !== undefined) data.images = JSON.stringify(payload.images);

    const product = await db.product.update({ where: { id: params.id }, data });

    return NextResponse.json({ success: true, data: formatProduct(product) });
  } catch {
    return NextResponse.json({ success: false, error: 'Failed to update product' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  const user = await getCurrentUser(request);
  if (!user) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const existing = await db.product.findFirst({ where: { id: params.id, deleted: false } });
    if (!existing) {
      return NextResponse.json({ success: false, error: 'Not found' }, { status: 404 });
    }

    if (existing.createdBy !== user.id && user.role !== 'admin') {
      return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 });
    }

    await db.product.update({ where: { id: params.id }, data: { deleted: true } });

    return NextResponse.json({ success: true, data: { success: true } });
  } catch {
    return NextResponse.json({ success: false, error: 'Failed to delete product' }, { status: 500 });
  }
}
