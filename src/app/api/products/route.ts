import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import db from "@/lib/db";
import { getTokenFromHeader, verifyToken } from "@/lib/auth";
import type { Product as PrismaProduct } from "@prisma/client";

const querySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(10),
  category: z.string().optional()
});

const createSchema = z.object({
  name: z.string().min(1),
  description: z.string().min(1),
  price: z.number().positive(),
  currency: z.string().min(1),
  stock: z.number().int().nonnegative(),
  category: z.string().min(1),
  images: z.array(z.string().url()).optional()
});

type TokenPayload = {
  id: string;
  email: string;
  role: string;
  name: string;
};

function parseImages(value: string | null): string[] {
  if (!value) return [];
  try {
    const parsed = JSON.parse(value);
    if (Array.isArray(parsed) && parsed.every(item => typeof item === "string")) {
      return parsed;
    }
    return [];
  } catch (_error) {
    return [];
  }
}

function normalizeProduct(product: PrismaProduct) {
  return {
    id: product.id,
    name: product.name,
    description: product.description,
    price: product.price,
    currency: product.currency,
    stock: product.stock,
    images: parseImages(product.images),
    category: product.category,
    created_by: product.created_by,
    created_at: product.created_at.toISOString(),
    updated_at: product.updated_at.toISOString()
  };
}

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
    const parsedQuery = querySchema.parse(Object.fromEntries(new URL(request.url).searchParams));
    const page = parsedQuery.page;
    const limit = parsedQuery.limit;
    const category = parsedQuery.category?.trim() || undefined;
    const skip = (page - 1) * limit;

    const where = category ? { category } : {};

    const [items, total] = await Promise.all([
      db.product.findMany({
        where,
        skip,
        take: limit,
        orderBy: { created_at: "desc" }
      }),
      db.product.count({ where })
    ]);

    return NextResponse.json({
      success: true,
      data: {
        items: items.map(normalizeProduct),
        meta: { page, limit, total }
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
    const images = body.images ?? [];

    const product = await db.product.create({
      data: {
        name: body.name,
        description: body.description,
        price: body.price,
        currency: body.currency,
        stock: body.stock,
        category: body.category,
        images: JSON.stringify(images),
        created_by: payload.id
      }
    });

    return NextResponse.json(
      { success: true, data: normalizeProduct(product) },
      { status: 201 }
    );
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Invalid request";
    return NextResponse.json({ success: false, error: message }, { status: 400 });
  }
}
