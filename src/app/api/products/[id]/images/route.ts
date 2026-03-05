import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import db from '@/lib/db';
import { getUserFromRequest } from '@/lib/auth-helpers';

const imagesSchema = z.object({
  images: z.array(z.string()).min(1)
});

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const product = await db.product.findUnique({ where: { id: params.id } });
    if (!product) {
      return NextResponse.json({ success: false, error: 'Product not found' }, { status: 404 });
    }

    if (user.role !== 'admin' && product.createdBy !== user.id) {
      return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 });
    }

    const body = await request.json();
    const data = imagesSchema.parse(body);

    const updated = await db.product.update({
      where: { id: params.id },
      data: { images: JSON.stringify(data.images) }
    });

    return NextResponse.json({ success: true, data: { images: data.images } });
  } catch (error: unknown) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ success: false, error: 'Invalid images payload' }, { status: 400 });
    }
    console.error(JSON.stringify({ level: 'error', message: 'Failed to upload images', error }));
    return NextResponse.json({ success: false, error: 'Failed to upload images' }, { status: 500 });
  }
}
