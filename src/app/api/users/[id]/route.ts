import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import db from "@/lib/db";
import { getTokenFromHeader, verifyToken, hashPassword } from "@/lib/auth";

const paramsSchema = z.object({
  id: z.string().min(1)
});

const updateSchema = z.object({
  name: z.string().min(1).optional(),
  email: z.string().email().optional(),
  password: z.string().min(6).optional(),
  role: z.enum(["user", "admin"]).optional()
});

type TokenPayload = {
  id: string;
  email: string;
  role: string;
  name: string;
};

function getPayload(request: NextRequest): TokenPayload | null {
  const token = getTokenFromHeader(request.headers.get("authorization"));
  if (!token) return null;
  try {
    const payload = verifyToken(token);
    if (typeof payload !== "object" || payload === null) return null;
    const values = payload as Record<string, unknown>;
    if (
      typeof values.id === "string" &&
      typeof values.email === "string" &&
      typeof values.role === "string" &&
      typeof values.name === "string"
    ) {
      return {
        id: values.id,
        email: values.email,
        role: values.role,
        name: values.name
      };
    }
    return null;
  } catch (_error) {
    return null;
  }
}

export async function GET(request: NextRequest, context: { params: { id: string } }) {
  try {
    const payload = getPayload(request);
    if (!payload) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const { id } = paramsSchema.parse(context.params);
    if (payload.role !== "admin" && payload.id !== id) {
      return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 });
    }

    const user = await db.user.findUnique({ where: { id } });
    if (!user) {
      return NextResponse.json({ success: false, error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        created_at: user.created_at.toISOString()
      }
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Invalid request";
    return NextResponse.json({ success: false, error: message }, { status: 400 });
  }
}

export async function PUT(request: NextRequest, context: { params: { id: string } }) {
  try {
    const payload = getPayload(request);
    if (!payload) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }
    if (payload.role !== "admin") {
      return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 });
    }

    const { id } = paramsSchema.parse(context.params);
    const body = updateSchema.parse(await request.json());

    if (body.email) {
      const existing = await db.user.findUnique({ where: { email: body.email } });
      if (existing && existing.id !== id) {
        return NextResponse.json({ success: false, error: "Email already registered" }, { status: 400 });
      }
    }

    const updateData: {
      name?: string;
      email?: string;
      password_hash?: string;
      role?: string;
    } = {};

    if (body.name) updateData.name = body.name;
    if (body.email) updateData.email = body.email;
    if (body.role) updateData.role = body.role;
    if (body.password) updateData.password_hash = await hashPassword(body.password);

    const user = await db.user.update({
      where: { id },
      data: updateData
    });

    return NextResponse.json({
      success: true,
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        created_at: user.created_at.toISOString()
      }
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Invalid request";
    return NextResponse.json({ success: false, error: message }, { status: 400 });
  }
}

export async function DELETE(request: NextRequest, context: { params: { id: string } }) {
  try {
    const payload = getPayload(request);
    if (!payload) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }
    if (payload.role !== "admin") {
      return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 });
    }

    const { id } = paramsSchema.parse(context.params);
    await db.user.delete({ where: { id } });

    return NextResponse.json({ success: true, data: { deleted: true } });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Invalid request";
    return NextResponse.json({ success: false, error: message }, { status: 400 });
  }
}
