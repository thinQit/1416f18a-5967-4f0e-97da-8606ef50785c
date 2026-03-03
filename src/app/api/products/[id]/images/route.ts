import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';
import { getCurrentUser } from '@/lib/server-auth';

const parseImages = (value: string | null): string[] => {
  if (!value) return [];
  try {
    const parsed = JSON.parse(value) as unknown;
    return Array.isArray(parsed) && parsed.every((item) => typeof item === 'string') ? parsed : [];
  } catch (_error) {
    return [];
  }
};

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const current = await getCurrentUser(request);
    if (!current) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }
    if (current.user.role !== 'admin') {
      return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 });
    }

    const product = await db.product.findUnique({ where: { id: params.id } });
    if (!product) {
      return NextResponse.json({ success: false, error: 'Product not found' }, { status: 404 });
    }

    const formData = await request.formData();
    const files = formData.getAll('images');
    if (files.length === 0) {
      return NextResponse.json({ success: false, error: 'No images provided' }, { status: 400 });
    }

    const existingImages = parseImages(product.images);
    const newImages = files.map((file, index) => {
      const filename = typeof file === 'string' ? file : file.name;
      return `/uploads/${params.id}-${index}-${filename}`;
    });

    const updated = await db.product.update({
      where: { id: params.id },
      data: { images: JSON.stringify([...existingImages, ...newImages]) }
    });

    return NextResponse.json({
      success: true,
      data: { images: parseImages(updated.images) }
    });
  } catch (_error) {
    return NextResponse.json({ success: false, error: 'Unable to upload images' }, { status: 500 });
  }
}
