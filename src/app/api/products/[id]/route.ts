import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import db from '@/lib/db';
import { getAuthContext } from '@/lib/auth-helpers';

const updateSchema = z.object({
  title: z.string().min(2).optional(),
  description: z.string().min(1).optional(),
  price: z.number().nonnegative().optional(),
  inventory: z.number().int().nonnegative().optional(),
  image_url: z.string().url().optional().nullable()
});

export async function GET(_request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const product = await db.product.findUnique({ where: { id: params.id } });
    if (!product) {
      return NextResponse.json({ success: false, error: 'not_found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: product });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'invalid_request';
    return NextResponse.json({ success: false, error: message }, { status: 400 });
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const auth = await getAuthContext(request);
    if (!auth) {
      return NextResponse.json({ success: false, error: 'unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const data = updateSchema.parse(body);

    const existing = await db.product.findUnique({ where: { id: params.id } });
    if (!existing) {
      return NextResponse.json({ success: false, error: 'not_found' }, { status: 404 });
    }

    if (existing.owner_id !== auth.user.id && auth.user.role !== 'admin') {
      return NextResponse.json({ success: false, error: 'forbidden' }, { status: 403 });
    }

    const updated = await db.product.update({ where: { id: params.id }, data });
    return NextResponse.json({ success: true, data: updated });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'invalid_request';
    return NextResponse.json({ success: false, error: message }, { status: 400 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const auth = await getAuthContext(request);
    if (!auth) {
      return NextResponse.json({ success: false, error: 'unauthorized' }, { status: 401 });
    }

    const existing = await db.product.findUnique({ where: { id: params.id } });
    if (!existing) {
      return NextResponse.json({ success: false, error: 'not_found' }, { status: 404 });
    }

    if (existing.owner_id !== auth.user.id && auth.user.role !== 'admin') {
      return NextResponse.json({ success: false, error: 'forbidden' }, { status: 403 });
    }

    await db.product.delete({ where: { id: params.id } });
    return new NextResponse(null, { status: 204 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'invalid_request';
    return NextResponse.json({ success: false, error: message }, { status: 400 });
  }
}
