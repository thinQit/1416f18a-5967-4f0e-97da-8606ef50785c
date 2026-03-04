import { NextRequest, NextResponse } from 'next/server';

export async function POST(_request: NextRequest) {
  const response = NextResponse.json({ success: true, data: { success: true } });
  response.cookies.set('access_token', '', { httpOnly: true, sameSite: 'strict', maxAge: 0, path: '/' });
  return response;
}
