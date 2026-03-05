export const runtime = 'nodejs';

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const protectedPaths = ['/dashboard', '/products/new'];
  const { pathname } = request.nextUrl;

  if (protectedPaths.some((path) => pathname.startsWith(path))) {
    const token = request.cookies.get('shopflow_token');
    if (!token) {
      const url = request.nextUrl.clone();
      url.pathname = '/login';
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard', '/products/new']
};
