import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getTokenFromHeader, verifyToken } from '@/lib/auth';

export const runtime = 'nodejs';

function requiresAuth(request: NextRequest): boolean {
  const { pathname } = request.nextUrl;

  if (pathname === '/api/health') return false;
  if (pathname.startsWith('/api/auth')) return false;
  if (pathname.startsWith('/api/products') && request.method === 'GET') return false;

  return pathname.startsWith('/api/products') || pathname.startsWith('/api/users') || pathname.startsWith('/api/auth-tokens');
}

export function middleware(request: NextRequest) {
  if (!requiresAuth(request)) return NextResponse.next();

  const token = getTokenFromHeader(request.headers.get('authorization'));
  if (!token) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    verifyToken(token);
    return NextResponse.next();
  } catch (_error) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }
}

export const config = {
  matcher: ['/api/:path*']
};
