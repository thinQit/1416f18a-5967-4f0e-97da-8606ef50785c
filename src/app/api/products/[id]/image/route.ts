import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';
import { getAuthContext } from '@/lib/auth-helpers';

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const auth = await getAuthContext(request);
    if (!auth) {
      return NextResponse.json({ success: false, error: 'unauthorized' }, { status: 401 });
    }

    const product = await db.product.findUnique({ where: { id: params.id } });
    if (!product) {
      return NextResponse.json({ success: false, error: 'not_found' }, { status: 404 });
    }

    if (product.owner_id !== auth.user.id && auth.user.role !== 'admin') {
      return NextResponse.json({ success: false, error: 'forbidden' }, { status: 403 });
    }

    const formData = await request.formData();
    const file = formData.get('file');
    if (!(file instanceof File)) {
      return NextResponse.json({ success: false, error: 'file_required' }, { status: 400 });
    }

    if (!file.type.startsWith('image/')) {
      return NextResponse.json({ success: false, error: 'invalid_type' }, { status: 400 });
    }

    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ success: false, error: 'file_too_large' }, { status: 400 });
    }

    const image_url = `/uploads/products/${params.id}/${encodeURIComponent(file.name)}`;
    await db.product.update({ where: { id: params.id }, data: { image_url } });

    return NextResponse.json({ success: true, data: { image_url } });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'invalid_request';
    return NextResponse.json({ success: false, error: message }, { status: 400 });
  }
}
