import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { getTokenFromHeader, verifyToken, hashPassword } from "@/lib/auth";

const idSchema = z.string().uuid();

const updateSchema = z.object({
  name: z.string().min(2).optional(),
  email: z.string().email().optional(),
  password: z.string().min(6).optional(),
  role: z.string().optional()
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

function sanitizeUser(user: { passwordHash: string } & Record<string, unknown>) {
  const { passwordHash: _passwordHash, ...safeUser } = user;
  return safeUser;
}

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = idSchema.parse(params.id);
    const authUser = await getAuthUser(request);
    if (!authUser) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    if (authUser.role !== "admin" && authUser.id !== id) {
      return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 });
    }

    const user = await db.user.findUnique({ where: { id } });
    if (!user) {
      return NextResponse.json({ success: false, error: "Not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: sanitizeUser(user) });
  } catch (error: unknown) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ success: false, error: "Invalid user id" }, { status: 400 });
    }
    return NextResponse.json({ success: false, error: "Failed to fetch user" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = idSchema.parse(params.id);
    const authUser = await getAuthUser(request);
    if (!authUser) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    if (authUser.role !== "admin" && authUser.id !== id) {
      return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 });
    }

    const body = updateSchema.parse(await request.json());
    if (body.role && authUser.role !== "admin") {
      return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 });
    }

    const data: { name?: string; email?: string; passwordHash?: string; role?: string } = {
      name: body.name,
      email: body.email,
      role: body.role === "admin" ? "admin" : body.role === "user" ? "user" : undefined
    };

    if (body.password) {
      data.passwordHash = await hashPassword(body.password);
    }

    const updated = await db.user.update({ where: { id }, data });
    return NextResponse.json({ success: true, data: sanitizeUser(updated) });
  } catch (error: unknown) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ success: false, error: error.errors[0]?.message ?? "Invalid request" }, { status: 400 });
    }
    return NextResponse.json({ success: false, error: "Failed to update user" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = idSchema.parse(params.id);
    const authUser = await getAuthUser(request);
    if (!authUser) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }
    if (authUser.role !== "admin") {
      return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 });
    }

    await db.user.delete({ where: { id } });
    return NextResponse.json({ success: true, data: { success: true } });
  } catch (error: unknown) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ success: false, error: "Invalid user id" }, { status: 400 });
    }
    return NextResponse.json({ success: false, error: "Failed to delete user" }, { status: 500 });
  }
}
