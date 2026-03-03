import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import db from "@/lib/db";
import { getTokenFromHeader, verifyToken } from "@/lib/auth";
import type { Product as PrismaProduct } from "@prisma/client";

const paramsSchema = z.object({
  id: z.string().min(1)
});

const updateSchema = z.object({
  name: z.string().min(1).optional(),
  description: z.string().min(1).optional(),
  price: z.number().positive().optional(),
  currency: z.string().min(1).optional(),
  stock: z.number().int().nonnegative().optional(),
  category: z.string().min(1).optional(),
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

export async function GET(request: NextRequest, context: { params: { id: string } }) {
  try {
    const { id } = paramsSchema.parse(context.params);
    const product = await db.product.findUnique({ where: { id } });
    if (!product) {
      return NextResponse.json({ success: false, error: "Product not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: normalizeProduct(product) });
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

    const existing = await db.product.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ success: false, error: "Product not found" }, { status: 404 });
    }

    const updateData: {
      name?: string;
      description?: string;
      price?: number;
      currency?: string;
      stock?: number;
      category?: string;
      images?: string;
    } = {};

    if (body.name) updateData.name = body.name;
    if (body.description) updateData.description = body.description;
    if (body.price !== undefined) updateData.price = body.price;
    if (body.currency) updateData.currency = body.currency;
    if (body.stock !== undefined) updateData.stock = body.stock;
    if (body.category) updateData.category = body.category;
    if (body.images) updateData.images = JSON.stringify(body.images);

    const product = await db.product.update({
      where: { id },
      data: updateData
    });

    return NextResponse.json({
      success: true,
      data: { updated: true, product: normalizeProduct(product) }
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
    const existing = await db.product.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ success: false, error: "Product not found" }, { status: 404 });
    }

    await db.product.delete({ where: { id } });

    return NextResponse.json({ success: true, data: { deleted: true } });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Invalid request";
    return NextResponse.json({ success: false, error: message }, { status: 400 });
  }
}
