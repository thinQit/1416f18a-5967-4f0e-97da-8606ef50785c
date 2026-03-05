import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import db from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';

const numberField = z.preprocess(
  (value) => (typeof value === 'string' || typeof value === 'number' ? Number(value) : value),
  z.number().nonnegative()
);
const intField = z.preprocess(
  (value) => (typeof value === 'string' || typeof value === 'number' ? Number(value) : value),
  z.number().int().nonnegative()
);

const createSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  description: z.string().min(2, 'Description is required'),
  price: numberField,
  stock: intField,
  imageUrl: z.string().url('Image URL must be valid').optional()
});

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = Math.max(1, Number(searchParams.get('page') || 1));
    const pageSize = Math.min(100, Math.max(1, Number(searchParams.get('pageSize') || 20)));
    const q = searchParams.get('q') || '';

    const where = q ? { name: { contains: q } } : {};

    const [items, total] = await Promise.all([
      db.product.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * pageSize,
        take: pageSize
      }),
      db.product.count({ where })
    ]);

    return NextResponse.json({
      success: true,
      data: {
        items,
        meta: { page, pageSize, total }
      }
    });
  } catch (_error) {
    return NextResponse.json({ success: false, error: 'Unable to fetch products' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser(request);
    if (!user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }
    if (user.role !== 'admin') {
      return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 });
    }

    const body = await request.json();
    const data = createSchema.parse(body);

    const product = await db.product.create({
      data: {
        ...data,
        createdBy: user.id
      }
    });

    return NextResponse.json({ success: true, data: product }, { status: 201 });
  } catch (error: unknown) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ success: false, error: error.errors[0]?.message || 'Invalid input' }, { status: 400 });
    }
    return NextResponse.json({ success: false, error: 'Unable to create product' }, { status: 500 });
  }
}
