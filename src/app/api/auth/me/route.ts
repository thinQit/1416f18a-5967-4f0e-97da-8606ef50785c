import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getTokenFromHeader, verifyToken } from "@/lib/auth";

export async function GET(request: NextRequest) {
  const token = getTokenFromHeader(request.headers.get("authorization"));
  if (!token) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const payload = verifyToken(token);
    const userId = typeof payload.userId === "string" ? payload.userId : null;

    if (!userId) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const user = await db.user.findUnique({ where: { id: userId } });
    if (!user) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    return NextResponse.json({
      success: true,
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (_error) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }
}
