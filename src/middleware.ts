export const runtime = 'nodejs';

import { NextRequest, NextResponse } from 'next/server';
import { getTokenFromHeader, verifyToken } from '@/lib/auth';

function getToken(request: NextRequest): string | null {
  const headerToken = getTokenFromHeader(request.headers.get('authorization'));
  if (headerToken) return headerToken;
  const cookieToken = request.cookies.get('access_token')?.value || request.cookies.get('token')?.value;
  return cookieToken ?? null;
}

export function middleware(request: NextRequest) {
  const token = getToken(request);
  const isApiRoute = request.nextUrl.pathname.startsWith('/api');

  if (!token) {
    if (isApiRoute) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }
    return NextResponse.redirect(new URL('/login', request.url));
  }

  try {
    verifyToken(token);
    return NextResponse.next();
  } catch (_error) {
    if (isApiRoute) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }
    return NextResponse.redirect(new URL('/login', request.url));
  }
}

export const config = {
  matcher: ['/products/:path*', '/api/products/:path*', '/api/users/:path*', '/api/auth/me', '/api/uploads']
};
