import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { getTokenFromHeader, verifyToken } from "@/lib/auth";

const idSchema = z.string().min(10);

const updateSchema = z.object({
  expiresAt: z.coerce.date().optional()
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

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const tokenId = idSchema.parse(params.id);
    const user = await getAuthUser(request);
    if (!user) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }
    if (user.role !== "admin") {
      return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 });
    }

    const token = await db.authToken.findUnique({ where: { token: tokenId } });
    if (!token) {
      return NextResponse.json({ success: false, error: "Not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: token });
  } catch (error: unknown) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ success: false, error: "Invalid token id" }, { status: 400 });
    }
    return NextResponse.json({ success: false, error: "Failed to fetch token" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const tokenId = idSchema.parse(params.id);
    const user = await getAuthUser(request);
    if (!user) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }
    if (user.role !== "admin") {
      return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 });
    }

    const body = updateSchema.parse(await request.json());
    const updated = await db.authToken.update({
      where: { token: tokenId },
      data: { expiresAt: body.expiresAt }
    });

    return NextResponse.json({ success: true, data: updated });
  } catch (error: unknown) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ success: false, error: error.errors[0]?.message ?? "Invalid request" }, { status: 400 });
    }
    return NextResponse.json({ success: false, error: "Failed to update token" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const tokenId = idSchema.parse(params.id);
    const user = await getAuthUser(request);
    if (!user) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }
    if (user.role !== "admin") {
      return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 });
    }

    await db.authToken.delete({ where: { token: tokenId } });
    return NextResponse.json({ success: true, data: { success: true } });
  } catch (error: unknown) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ success: false, error: "Invalid token id" }, { status: 400 });
    }
    return NextResponse.json({ success: false, error: "Failed to delete token" }, { status: 500 });
  }
}
