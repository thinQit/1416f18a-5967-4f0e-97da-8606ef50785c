import { NextResponse, type NextRequest } from 'next/server';

export const runtime = 'nodejs';

export function middleware(_request: NextRequest) {
  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/products/new']
};
