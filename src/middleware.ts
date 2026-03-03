import { NextRequest, NextResponse } from 'next/server';
import { getTokenFromHeader, verifyToken } from '@/lib/auth';

export const runtime = 'nodejs';

const publicPrefixes = ['/api/health', '/api/auth/login', '/api/auth/register', '/api/auth/refresh'];
const protectedPrefixes = ['/api/products', '/api/users', '/api/auth-tokens', '/api/auth/me'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (publicPrefixes.some(prefix => pathname.startsWith(prefix))) {
    return NextResponse.next();
  }

  if (pathname.startsWith('/api/products') && request.method === 'GET') {
    return NextResponse.next();
  }

  if (protectedPrefixes.some(prefix => pathname.startsWith(prefix))) {
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

  return NextResponse.next();
}
