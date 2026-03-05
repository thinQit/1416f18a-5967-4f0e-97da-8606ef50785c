import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import db from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';

const schema = z.object({
  url: z.string().url('URL must be valid')
});

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser(request);
    if (!user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const uploads = await db.upload.findMany({ orderBy: { uploadedAt: 'desc' } });
    return NextResponse.json({ success: true, data: uploads });
  } catch (_error) {
    return NextResponse.json({ success: false, error: 'Unable to fetch uploads' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser(request);
    if (!user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const data = schema.parse(body);

    const upload = await db.upload.create({ data: { url: data.url } });
    return NextResponse.json({ success: true, data: upload }, { status: 201 });
  } catch (error: unknown) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ success: false, error: error.errors[0]?.message || 'Invalid input' }, { status: 400 });
    }
    return NextResponse.json({ success: false, error: 'Unable to create upload' }, { status: 500 });
  }
}
