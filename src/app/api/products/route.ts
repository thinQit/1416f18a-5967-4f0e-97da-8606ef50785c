import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import db from '@/lib/db';
import { getUserFromRequest } from '@/lib/auth-helpers';
import type { Product } from '@prisma/client';

const createSchema = z.object({
  name: z.string().min(1),
  description: z.string().min(1),
  price: z.coerce.number().positive(),
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

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const pageParam = Number(searchParams.get('page') || '1');
    const limitParam = Number(searchParams.get('limit') || '10');
    const page = Number.isFinite(pageParam) && pageParam > 0 ? pageParam : 1;
    const limit = Number.isFinite(limitParam) && limitParam > 0 ? limitParam : 10;
    const q = searchParams.get('q') || '';
    const sortValue = searchParams.get('sort') === 'price' ? 'price' : 'name';

    const where = q
      ? {
          name: {
            contains: q,
            mode: 'insensitive'
          }
        }
      : {};

    const [items, total] = await Promise.all([
      db.product.findMany({
        where,
        orderBy: { [sortValue]: 'asc' },
        skip: (page - 1) * limit,
        take: limit
      }),
      db.product.count({ where })
    ]);

    const mapped = items.map(mapProduct);

    return NextResponse.json({
      success: true,
      data: {
        items: mapped,
        total,
        page,
        limit
      }
    });
  } catch (error: unknown) {
    console.error(JSON.stringify({ level: 'error', message: 'Failed to list products', error }));
    return NextResponse.json({ success: false, error: 'Failed to list products' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const data = createSchema.parse(body);

    const product = await db.product.create({
      data: {
        name: data.name,
        description: data.description,
        price: data.price,
        sku: data.sku ?? null,
        images: data.images ? JSON.stringify(data.images) : null,
        quantity: data.quantity ?? null,
        createdBy: user.id
      }
    });

    console.log(JSON.stringify({ level: 'info', message: 'Product created', userId: user.id, productId: product.id }));

    return NextResponse.json({ success: true, data: { product: mapProduct(product) } }, { status: 201 });
  } catch (error: unknown) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ success: false, error: 'Invalid product data' }, { status: 400 });
    }
    console.error(JSON.stringify({ level: 'error', message: 'Failed to create product', error }));
    return NextResponse.json({ success: false, error: 'Failed to create product' }, { status: 500 });
  }
}
