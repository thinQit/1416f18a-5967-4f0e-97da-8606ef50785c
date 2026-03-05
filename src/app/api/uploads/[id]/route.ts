import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import db from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';

const schema = z.object({
  url: z.string().url('URL must be valid')
});

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await getCurrentUser(request);
    if (!user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const upload = await db.upload.findUnique({ where: { id: params.id } });
    if (!upload) {
      return NextResponse.json({ success: false, error: 'Upload not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: upload });
  } catch (_error) {
    return NextResponse.json({ success: false, error: 'Unable to fetch upload' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await getCurrentUser(request);
    if (!user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const data = schema.parse(body);

    const upload = await db.upload.update({ where: { id: params.id }, data: { url: data.url } });
    return NextResponse.json({ success: true, data: upload });
  } catch (error: unknown) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ success: false, error: error.errors[0]?.message || 'Invalid input' }, { status: 400 });
    }
    return NextResponse.json({ success: false, error: 'Unable to update upload' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await getCurrentUser(request);
    if (!user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const existing = await db.upload.findUnique({ where: { id: params.id } });
    if (!existing) {
      return NextResponse.json({ success: false, error: 'Upload not found' }, { status: 404 });
    }

    await db.upload.delete({ where: { id: params.id } });
    return NextResponse.json({ success: true, data: { ok: true } });
  } catch (_error) {
    return NextResponse.json({ success: false, error: 'Unable to delete upload' }, { status: 500 });
  }
}
