export const runtime = 'nodejs';

import { NextRequest, NextResponse } from 'next/server';
import { getTokenFromHeader, verifyToken } from '@/lib/auth';

const protectedPages = ['/dashboard', '/products/new'];
const publicApiPaths = ['/api/health', '/api/auth/login', '/api/auth/register'];

function isPublicApi(pathname: string, method: string): boolean {
  if (publicApiPaths.includes(pathname)) return true;
  if (pathname.startsWith('/api/products') && method === 'GET') return true;
  return false;
}

function getToken(request: NextRequest): string | null {
  return getTokenFromHeader(request.headers.get('authorization')) ?? request.cookies.get('token')?.value ?? null;
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith('/api')) {
    if (isPublicApi(pathname, request.method)) return NextResponse.next();
    const token = getToken(request);
    if (!token) {
      return NextResponse.json({ success: false, error: 'unauthorized' }, { status: 401 });
    }
    try {
      verifyToken(token);
      return NextResponse.next();
    } catch {
      return NextResponse.json({ success: false, error: 'unauthorized' }, { status: 401 });
    }
  }

  if (protectedPages.some((path) => pathname.startsWith(path))) {
    const token = request.cookies.get('token')?.value;
    if (!token) return NextResponse.redirect(new URL('/login', request.url));
    try {
      verifyToken(token);
    } catch {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  return NextResponse.next();
}
