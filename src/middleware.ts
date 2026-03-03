export const runtime = 'nodejs';

import { NextRequest, NextResponse } from "next/server";
import { getTokenFromHeader, verifyToken } from "@/lib/auth";

const publicPaths = ["/api/health", "/api/auth/login", "/api/auth/register"];

function isPublicRequest(request: NextRequest): boolean {
  const { pathname } = request.nextUrl;
  if (publicPaths.includes(pathname)) return true;
  if (pathname.startsWith("/api/products") && request.method === "GET") return true;
  return false;
}

export function middleware(request: NextRequest) {
  if (isPublicRequest(request)) {
    return NextResponse.next();
  }

  const token = getTokenFromHeader(request.headers.get("authorization"));
  if (!token) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    verifyToken(token);
    return NextResponse.next();
  } catch (_error) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }
}

export const config = {
  matcher: ["/api/:path*"]
};
