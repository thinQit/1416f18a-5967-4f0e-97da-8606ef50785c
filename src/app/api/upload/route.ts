import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser(request);
    if (!user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get('image');

    if (!file || !(file instanceof File)) {
      return NextResponse.json({ success: false, error: 'No image uploaded' }, { status: 400 });
    }

    const safeName = file.name || `upload-${Date.now()}`;
    const url = `/uploads/${safeName}`;

    await db.upload.create({ data: { url } });

    return NextResponse.json({ success: true, data: { url } });
  } catch (_error) {
    return NextResponse.json({ success: false, error: 'Upload failed' }, { status: 500 });
  }
}
