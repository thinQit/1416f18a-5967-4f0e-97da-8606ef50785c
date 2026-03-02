import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/db';
import { getTokenFromHeader, verifyToken } from '@/lib/auth';

const createProductSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().min(1, 'Description is required'),
  price: z.number().positive('Price must be positive'),
  sku: z.string().min(1, 'SKU is required'),
  inventoryCount: z.number().int().nonnegative('Inventory must be 0 or more'),
  images: z.array(z.string().url()).optional()
});

const querySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
  q: z.string().optional(),
  sort: z.string().optional()
});

type SortField = 'createdAt' | 'name' | 'price' | 'sku';

function buildOrderBy(sort?: string) {
  if (!sort) return { createdAt: 'desc' } as const;
  const [field, direction] = sort.split(':');
  const allowed: SortField[] = ['createdAt', 'name', 'price', 'sku'];
  if (!allowed.includes(field as SortField)) return { createdAt: 'desc' } as const;
  const dir = direction === 'asc' ? 'asc' : 'desc';
  return { [field]: dir } as const;
}

async function getCurrentUser(request: NextRequest) {
  const token = getTokenFromHeader(request.headers.get('authorization')) ?? request.cookies.get('token')?.value ?? null;
  if (!token) return null;
  try {
    const payload = verifyToken(token);
    const userId = typeof payload.sub === 'string' ? payload.sub : null;
    if (!userId) return null;
    return prisma.user.findUnique({ where: { id: userId } });
  } catch {
    return null;
  }
}

function parseImages(images: string): string[] {
  try {
    return JSON.parse(images) as string[];
  } catch {
    return [];
  }
}

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser(request);
    if (!user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const parsed = querySchema.parse(Object.fromEntries(new URL(request.url).searchParams));
    const where = {
      isDeleted: false,
      ...(parsed.q
        ? {
            OR: [
              { name: { contains: parsed.q, mode: 'insensitive' as const } },
              { description: { contains: parsed.q, mode: 'insensitive' as const } },
              { sku: { contains: parsed.q, mode: 'insensitive' as const } }
            ]
          }
        : {})
    };

    const [items, total] = await Promise.all([
      prisma.product.findMany({
        where,
        skip: (parsed.page - 1) * parsed.limit,
        take: parsed.limit,
        orderBy: buildOrderBy(parsed.sort)
      }),
      prisma.product.count({ where })
    ]);

    const mapped = items.map((item) => ({
      ...item,
      images: parseImages(item.images)
    }));

    return NextResponse.json({
      success: true,
      data: { items: mapped, total, page: parsed.page, limit: parsed.limit }
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ success: false, error: error.issues[0]?.message || 'Invalid query' }, { status: 400 });
    }
    return NextResponse.json({ success: false, error: 'Failed to fetch products' }, { status: 500 });
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
    const payload = createProductSchema.parse(body);

    const product = await prisma.product.create({
      data: {
        name: payload.name,
        description: payload.description,
        price: payload.price,
        sku: payload.sku,
        inventoryCount: payload.inventoryCount,
        images: JSON.stringify(payload.images ?? []),
        createdBy: user.id
      }
    });

    return NextResponse.json({
      success: true,
      data: { ...product, images: parseImages(product.images) }
    }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ success: false, error: error.issues[0]?.message || 'Invalid input' }, { status: 400 });
    }
    return NextResponse.json({ success: false, error: 'Failed to create product' }, { status: 500 });
  }
}
