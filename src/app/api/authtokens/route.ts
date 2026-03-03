import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { getTokenFromHeader, verifyToken } from "@/lib/auth";

const createSchema = z.object({
  token: z.string().min(10),
  userId: z.string().uuid(),
  expiresAt: z.coerce.date()
});

async function getAuthUser(request: NextRequest) {
  const token = getTokenFromHeader(request.headers.get("authorization"));
  if (!token) return null;
  try {
    const payload = verifyToken(token);
    const userId = typeof payload.userId === "string" ? payload.userId : null;
    if (!userId) return null;
    return await db.user.findUnique({ where: { id: userId } });
  } catch (_error) {
    return null;
  }
}

export async function GET(request: NextRequest) {
  try {
    const user = await getAuthUser(request);
    if (!user) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }
    if (user.role !== "admin") {
      return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 });
    }

    const tokens = await db.authToken.findMany({ orderBy: { expiresAt: "desc" } });
    return NextResponse.json({ success: true, data: tokens });
  } catch (_error) {
    return NextResponse.json({ success: false, error: "Failed to fetch tokens" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getAuthUser(request);
    if (!user) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }
    if (user.role !== "admin") {
      return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 });
    }

    const body = createSchema.parse(await request.json());
    const token = await db.authToken.create({
      data: {
        token: body.token,
        userId: body.userId,
        expiresAt: body.expiresAt
      }
    });

    return NextResponse.json({ success: true, data: token }, { status: 201 });
  } catch (error: unknown) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ success: false, error: error.errors[0]?.message ?? "Invalid request" }, { status: 400 });
    }
    return NextResponse.json({ success: false, error: "Failed to create token" }, { status: 500 });
  }
}
