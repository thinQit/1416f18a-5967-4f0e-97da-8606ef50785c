import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import db from "@/lib/db";
import { getTokenFromHeader, verifyToken } from "@/lib/auth";

const querySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(10)
});

const createSchema = z.object({
  token: z.string().min(1),
  expires_at: z.coerce.date(),
  user_id: z.string().min(1)
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

export async function GET(request: NextRequest) {
  try {
    const payload = getPayload(request);
    if (!payload) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }
    if (payload.role !== "admin") {
      return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 });
    }

    const query = querySchema.parse(Object.fromEntries(new URL(request.url).searchParams));
    const skip = (query.page - 1) * query.limit;

    const [sessions, total] = await Promise.all([
      db.authSession.findMany({
        skip,
        take: query.limit,
        orderBy: { created_at: "desc" }
      }),
      db.authSession.count()
    ]);

    return NextResponse.json({
      success: true,
      data: {
        items: sessions.map(session => ({
          id: session.id,
          token: session.token,
          expires_at: session.expires_at.toISOString(),
          created_at: session.created_at.toISOString(),
          user_id: session.user_id
        })),
        meta: { page: query.page, limit: query.limit, total }
      }
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Invalid request";
    return NextResponse.json({ success: false, error: message }, { status: 400 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const payload = getPayload(request);
    if (!payload) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }
    if (payload.role !== "admin") {
      return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 });
    }

    const body = createSchema.parse(await request.json());
    const user = await db.user.findUnique({ where: { id: body.user_id } });
    if (!user) {
      return NextResponse.json({ success: false, error: "User not found" }, { status: 404 });
    }

    const session = await db.authSession.create({
      data: {
        token: body.token,
        expires_at: body.expires_at,
        user_id: body.user_id
      }
    });

    return NextResponse.json(
      {
        success: true,
        data: {
          id: session.id,
          token: session.token,
          expires_at: session.expires_at.toISOString(),
          created_at: session.created_at.toISOString(),
          user_id: session.user_id
        }
      },
      { status: 201 }
    );
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Invalid request";
    return NextResponse.json({ success: false, error: message }, { status: 400 });
  }
}
