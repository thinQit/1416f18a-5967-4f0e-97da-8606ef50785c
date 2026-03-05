import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import db from '@/lib/db';
import { getAuthContext } from '@/lib/auth-helpers';

const createSchema = z.object({
  title: z.string().min(2),
  description: z.string().min(1),
  price: z.number().nonnegative(),
  inventory: z.number().int().nonnegative().optional(),
  image_url: z.string().url().optional()
});

const querySchema = z.object({
  page: z.string().optional(),
  per_page: z.string().optional(),
  q: z.string().optional(),
  min_price: z.string().optional(),
  max_price: z.string().optional()
});

export async function GET(request: NextRequest) {
  try {
    const params = Object.fromEntries(new URL(request.url).searchParams.entries());
    const parsed = querySchema.parse(params);

    const page = Math.max(1, parseInt(parsed.page ?? '1', 10) || 1);
    const perPage = Math.min(50, Math.max(1, parseInt(parsed.per_page ?? '12', 10) || 12));
    const minPrice = Number.isNaN(Number(parsed.min_price)) ? 0 : Number(parsed.min_price);
    const maxPrice = Number.isNaN(Number(parsed.max_price)) ? 1_000_000 : Number(parsed.max_price);
    const query = parsed.q ?? '';

    const where: Prisma.ProductWhereInput = {};
    if (query) {
      where.title = { contains: query };
    }
    if (!Number.isNaN(minPrice) || !Number.isNaN(maxPrice)) {
      where.price = { gte: minPrice, lte: maxPrice };
    }

    const [items, total] = await Promise.all([
      db.product.findMany({
        where,
        skip: (page - 1) * perPage,
        take: perPage,
        orderBy: { created_at: 'desc' }
      }),
      db.product.count({ where })
    ]);

    return NextResponse.json({
      success: true,
      data: {
        items,
        total,
        page,
        per_page: perPage
      }
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'invalid_request';
    return NextResponse.json({ success: false, error: message }, { status: 400 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const auth = await getAuthContext(request);
    if (!auth) {
      return NextResponse.json({ success: false, error: 'unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const data = createSchema.parse(body);

    const product = await db.product.create({
      data: {
        title: data.title,
        description: data.description,
        price: data.price,
        inventory: data.inventory ?? 0,
        image_url: data.image_url,
        owner_id: auth.user.id
      }
    });

    return NextResponse.json({ success: true, data: product }, { status: 201 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'invalid_request';
    return NextResponse.json({ success: false, error: message }, { status: 400 });
  }
}
