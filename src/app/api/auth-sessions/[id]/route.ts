import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import db from "@/lib/db";
import { getTokenFromHeader, verifyToken } from "@/lib/auth";

const paramsSchema = z.object({
  id: z.string().min(1)
});

const updateSchema = z.object({
  token: z.string().min(1).optional(),
  expires_at: z.coerce.date().optional(),
  user_id: z.string().min(1).optional()
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
    if (payload.role !== "admin") {
      return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 });
    }

    const { id } = paramsSchema.parse(context.params);
    const session = await db.authSession.findUnique({ where: { id } });
    if (!session) {
      return NextResponse.json({ success: false, error: "Session not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: {
        id: session.id,
        token: session.token,
        expires_at: session.expires_at.toISOString(),
        created_at: session.created_at.toISOString(),
        user_id: session.user_id
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

    if (body.user_id) {
      const user = await db.user.findUnique({ where: { id: body.user_id } });
      if (!user) {
        return NextResponse.json({ success: false, error: "User not found" }, { status: 404 });
      }
    }

    const session = await db.authSession.update({
      where: { id },
      data: {
        token: body.token,
        expires_at: body.expires_at,
        user_id: body.user_id
      }
    });

    return NextResponse.json({
      success: true,
      data: {
        id: session.id,
        token: session.token,
        expires_at: session.expires_at.toISOString(),
        created_at: session.created_at.toISOString(),
        user_id: session.user_id
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
    await db.authSession.delete({ where: { id } });

    return NextResponse.json({ success: true, data: { deleted: true } });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Invalid request";
    return NextResponse.json({ success: false, error: message }, { status: 400 });
  }
}
