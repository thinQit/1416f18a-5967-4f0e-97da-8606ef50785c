import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import db from '@/lib/db';
import { getTokenFromHeader, verifyToken } from '@/lib/auth';

const createSchema = z.object({
  name: z.string().min(2),
  description: z.string().min(2),
  price: z.number().nonnegative(),
  quantity: z.number().int().nonnegative().optional(),
  images: z.array(z.string().url()).optional()
});

const querySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(10),
  q: z.string().optional()
});

function parseImages(value: string): string[] {
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) && parsed.every((item) => typeof item === 'string') ? parsed : [];
  } catch (_error) {
    return [];
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = querySchema.parse({
      page: searchParams.get('page'),
      pageSize: searchParams.get('pageSize'),
      q: searchParams.get('q') || undefined
    });

    const where = query.q
      ? {
          name: {
            contains: query.q,
            mode: 'insensitive'
          }
        }
      : {};

    const [items, total] = await Promise.all([
      db.product.findMany({
        where,
        skip: (query.page - 1) * query.pageSize,
        take: query.pageSize,
        orderBy: { created_at: 'desc' }
      }),
      db.product.count({ where })
    ]);

    const mapped = items.map((item) => ({
      ...item,
      images: parseImages(item.images)
    }));

    return NextResponse.json({
      success: true,
      data: { items: mapped, total, page: query.page, pageSize: query.pageSize }
    });
  } catch (_error) {
    return NextResponse.json({ success: false, error: 'Invalid query parameters' }, { status: 400 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const token = getTokenFromHeader(request.headers.get('authorization'));
    if (!token) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }
    const payload = verifyToken(token);
    const userId = typeof payload.userId === 'string' ? payload.userId : null;
    if (!userId) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const data = createSchema.parse(await request.json());

    const product = await db.product.create({
      data: {
        name: data.name,
        description: data.description,
        price: data.price,
        quantity: data.quantity ?? 0,
        images: JSON.stringify(data.images ?? []),
        created_by_user_id: userId
      }
    });

    return NextResponse.json(
      {
        success: true,
        data: { ...product, images: parseImages(product.images) }
      },
      { status: 201 }
    );
  } catch (_error) {
    return NextResponse.json({ success: false, error: 'Validation error' }, { status: 400 });
  }
}
