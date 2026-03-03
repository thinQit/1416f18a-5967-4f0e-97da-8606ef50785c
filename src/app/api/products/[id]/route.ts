import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import db from '@/lib/db';
import { getTokenFromHeader, verifyToken } from '@/lib/auth';

const updateSchema = z.object({
  name: z.string().min(2).optional(),
  description: z.string().min(2).optional(),
  price: z.number().nonnegative().optional(),
  quantity: z.number().int().nonnegative().optional(),
  images: z.array(z.string().url()).optional()
});

function parseImages(value: string): string[] {
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) && parsed.every((item) => typeof item === 'string') ? parsed : [];
  } catch (_error) {
    return [];
  }
}

export async function GET(_request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const product = await db.product.findUnique({ where: { id: params.id } });
    if (!product) {
      return NextResponse.json({ success: false, error: 'Not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: { ...product, images: parseImages(product.images) } });
  } catch (_error) {
    return NextResponse.json({ success: false, error: 'Unable to fetch product' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const token = getTokenFromHeader(request.headers.get('authorization'));
    if (!token) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }
    const payload = verifyToken(token);
    const userId = typeof payload.userId === 'string' ? payload.userId : null;
    const role = typeof payload.role === 'string' ? payload.role : 'user';
    if (!userId) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const existing = await db.product.findUnique({ where: { id: params.id } });
    if (!existing) {
      return NextResponse.json({ success: false, error: 'Not found' }, { status: 404 });
    }

    if (existing.created_by_user_id !== userId && role !== 'admin') {
      return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 });
    }

    const data = updateSchema.parse(await request.json());
    const imagesValue = data.images ? JSON.stringify(data.images) : existing.images;

    const updated = await db.product.update({
      where: { id: params.id },
      data: {
        name: data.name ?? existing.name,
        description: data.description ?? existing.description,
        price: data.price ?? existing.price,
        quantity: data.quantity ?? existing.quantity,
        images: imagesValue
      }
    });

    return NextResponse.json({ success: true, data: { ...updated, images: parseImages(updated.images) } });
  } catch (_error) {
    return NextResponse.json({ success: false, error: 'Validation error' }, { status: 400 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const token = getTokenFromHeader(request.headers.get('authorization'));
    if (!token) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }
    const payload = verifyToken(token);
    const userId = typeof payload.userId === 'string' ? payload.userId : null;
    const role = typeof payload.role === 'string' ? payload.role : 'user';
    if (!userId) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const existing = await db.product.findUnique({ where: { id: params.id } });
    if (!existing) {
      return NextResponse.json({ success: false, error: 'Not found' }, { status: 404 });
    }

    if (existing.created_by_user_id !== userId && role !== 'admin') {
      return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 });
    }

    await db.product.delete({ where: { id: params.id } });
    return NextResponse.json({ success: true, data: { id: params.id } });
  } catch (_error) {
    return NextResponse.json({ success: false, error: 'Unable to delete product' }, { status: 500 });
  }
}
