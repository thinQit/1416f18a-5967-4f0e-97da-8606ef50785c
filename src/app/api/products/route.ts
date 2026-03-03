import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import db from '@/lib/db';
import { getCurrentUser } from '@/lib/server-auth';

const productSchema = z.object({
  name: z.string().min(2),
  description: z.string().optional(),
  price: z.number().positive(),
  currency: z.string().optional(),
  stock: z.number().int().optional(),
  images: z.array(z.string()).optional()
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

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const pageParam = Number(searchParams.get('page') || 1);
    const limitParam = Number(searchParams.get('limit') || 10);
    const page = Number.isFinite(pageParam) && pageParam > 0 ? pageParam : 1;
    const limit = Number.isFinite(limitParam) && limitParam > 0 ? Math.min(limitParam, 50) : 10;
    const q = searchParams.get('q') || '';

    const where = q
      ? { isActive: true, OR: [{ name: { contains: q } }, { description: { contains: q } }] }
      : { isActive: true };

    const [products, total] = await Promise.all([
      db.product.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' }
      }),
      db.product.count({ where })
    ]);

    const items = products.map((product) => ({
      ...product,
      images: parseImages(product.images)
    }));

    return NextResponse.json({
      success: true,
      data: {
        items,
        meta: { page, limit, total }
      }
    });
  } catch (_error) {
    return NextResponse.json({ success: false, error: 'Failed to fetch products' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const current = await getCurrentUser(request);
    if (!current) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }
    if (current.user.role !== 'admin') {
      return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 });
    }

    const body = await request.json();
    const data = productSchema.parse(body);

    const product = await db.product.create({
      data: {
        name: data.name,
        description: data.description,
        price: data.price,
        currency: data.currency || 'USD',
        stock: data.stock ?? 0,
        images: JSON.stringify(data.images ?? [])
      }
    });

    return NextResponse.json(
      {
        success: true,
        data: {
          ...product,
          images: parseImages(product.images)
        }
      },
      { status: 201 }
    );
  } catch (error: unknown) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: 'Validation error', details: error.flatten() },
        { status: 400 }
      );
    }
    return NextResponse.json({ success: false, error: 'Unable to create product' }, { status: 500 });
  }
}
