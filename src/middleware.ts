import { NextRequest, NextResponse } from "next/server";
import { getTokenFromHeader, verifyToken } from "@/lib/auth";

export const runtime = "nodejs";

const openPaths = [
  "/api/health",
  "/api/auth/login",
  "/api/auth/register",
  "/api/products"
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const method = request.method;

  const isProductRead = pathname.startsWith("/api/products/") && method === "GET";
  const isOpen = openPaths.includes(pathname) || isProductRead;

  if (isOpen) {
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
