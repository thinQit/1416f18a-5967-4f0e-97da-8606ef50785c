import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { Product } from '@prisma/client';
import { db } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';

const querySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(10),
  q: z.string().optional(),
  minPrice: z.coerce.number().optional(),
  maxPrice: z.coerce.number().optional()
});

const createSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  price: z.coerce.number().positive(),
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

export async function GET(request: NextRequest) {
  let query: z.infer<typeof querySchema>;
  try {
    const { searchParams } = new URL(request.url);
    const raw = {
      page: searchParams.get('page') ?? undefined,
      pageSize: searchParams.get('pageSize') ?? undefined,
      q: searchParams.get('q') ?? undefined,
      minPrice: searchParams.get('minPrice') ?? undefined,
      maxPrice: searchParams.get('maxPrice') ?? undefined
    };
    query = querySchema.parse(raw);
  } catch {
    return NextResponse.json({ success: false, error: 'Invalid query parameters' }, { status: 400 });
  }

  try {
    const where: Record<string, unknown> = { deleted: false };

    if (query.q) {
      where.OR = [
        { name: { contains: query.q } },
        { description: { contains: query.q } }
      ];
    }

    if (query.minPrice !== undefined || query.maxPrice !== undefined) {
      where.price = {
        ...(query.minPrice !== undefined ? { gte: query.minPrice } : {}),
        ...(query.maxPrice !== undefined ? { lte: query.maxPrice } : {})
      };
    }

    const [total, items] = await Promise.all([
      db.product.count({ where }),
      db.product.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (query.page - 1) * query.pageSize,
        take: query.pageSize
      })
    ]);

    return NextResponse.json({
      success: true,
      data: {
        total,
        page: query.page,
        pageSize: query.pageSize,
        items: items.map(formatProduct)
      }
    });
  } catch {
    return NextResponse.json({ success: false, error: 'Failed to fetch products' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const user = await getCurrentUser(request);
  if (!user) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  let payload: z.infer<typeof createSchema>;
  try {
    const json = await request.json();
    payload = createSchema.parse(json);
  } catch {
    return NextResponse.json({ success: false, error: 'Invalid input' }, { status: 400 });
  }

  try {
    const product = await db.product.create({
      data: {
        name: payload.name,
        description: payload.description ?? '',
        price: payload.price,
        sku: payload.sku ?? null,
        stock: payload.stock ?? 0,
        images: JSON.stringify(payload.images ?? []),
        createdBy: user.id
      }
    });

    return NextResponse.json({ success: true, data: formatProduct(product) }, { status: 201 });
  } catch {
    return NextResponse.json({ success: false, error: 'Failed to create product' }, { status: 500 });
  }
}
