import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import db from '@/lib/db';
import { getTokenFromHeader, verifyToken } from '@/lib/auth';

const updateSchema = z.object({
  name: z.string().min(2).optional(),
  description: z.string().min(2).optional(),
  price: z.coerce.number().positive().optional(),
  sku: z.string().min(2).optional(),
  stock: z.coerce.number().int().nonnegative().optional(),
  imageUrl: z.string().optional()
}).refine(data => !data.imageUrl || data.imageUrl === '' || /^https?:\/\//.test(data.imageUrl), {
  path: ['imageUrl'],
  message: 'Invalid image URL'
});

function getToken(request: NextRequest): string | null {
  const headerToken = getTokenFromHeader(request.headers.get('authorization'));
  if (headerToken) return headerToken;
  const cookieToken = request.cookies.get('access_token')?.value || request.cookies.get('token')?.value;
  return cookieToken ?? null;
}

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const token = getToken(request);
    if (!token) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }
    verifyToken(token);

    const product = await db.product.findUnique({ where: { id: params.id } });
    if (!product) {
      return NextResponse.json({ success: false, error: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: product });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Request failed';
    return NextResponse.json({ success: false, error: message }, { status: 400 });
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const token = getToken(request);
    if (!token) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }
    verifyToken(token);

    const body = updateSchema.parse(await request.json());
    const product = await db.product.update({ where: { id: params.id }, data: body });
    return NextResponse.json({ success: true, data: product });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Invalid request';
    return NextResponse.json({ success: false, error: message }, { status: 400 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const token = getToken(request);
    if (!token) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }
    verifyToken(token);

    await db.product.delete({ where: { id: params.id } });
    return NextResponse.json({ success: true, data: { success: true } });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unable to delete product';
    return NextResponse.json({ success: false, error: message }, { status: 400 });
  }
}
