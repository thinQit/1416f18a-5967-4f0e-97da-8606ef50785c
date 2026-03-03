import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { getTokenFromHeader, verifyToken } from "@/lib/auth";
import type { Product as PrismaProduct } from "@prisma/client";

const idSchema = z.string().uuid();

const updateSchema = z.object({
  name: z.string().min(2).optional(),
  description: z.string().min(5).optional(),
  price: z.coerce.number().positive().optional(),
  sku: z.string().optional().nullable(),
  stock: z.coerce.number().int().optional().nullable(),
  images: z.array(z.string()).optional(),
  active: z.boolean().optional()
});

function parseImages(images: string | null): string[] {
  if (!images) return [];
  try {
    const parsed = JSON.parse(images);
    if (Array.isArray(parsed)) {
      return parsed.filter((item) => typeof item === "string");
    }
    return [];
  } catch (_error) {
    return [];
  }
}

function formatProduct(product: PrismaProduct) {
  return {
    ...product,
    price: Number(product.price),
    images: parseImages(product.images)
  };
}

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

export async function GET(_request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = idSchema.parse(params.id);
    const product = await db.product.findUnique({ where: { id } });
    if (!product) {
      return NextResponse.json({ success: false, error: "Not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: formatProduct(product) });
  } catch (error: unknown) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ success: false, error: "Invalid product id" }, { status: 400 });
    }
    return NextResponse.json({ success: false, error: "Failed to fetch product" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = idSchema.parse(params.id);
    const user = await getAuthUser(request);
    if (!user) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const product = await db.product.findUnique({ where: { id } });
    if (!product) {
      return NextResponse.json({ success: false, error: "Not found" }, { status: 404 });
    }

    if (product.ownerId !== user.id && user.role !== "admin") {
      return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 });
    }

    const body = updateSchema.parse(await request.json());
    const updated = await db.product.update({
      where: { id },
      data: {
        name: body.name,
        description: body.description,
        price: body.price,
        sku: body.sku ?? undefined,
        stock: body.stock ?? undefined,
        images: body.images ? JSON.stringify(body.images) : undefined,
        active: body.active
      }
    });

    return NextResponse.json({ success: true, data: formatProduct(updated) });
  } catch (error: unknown) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ success: false, error: error.errors[0]?.message ?? "Invalid request" }, { status: 400 });
    }
    return NextResponse.json({ success: false, error: "Failed to update product" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = idSchema.parse(params.id);
    const user = await getAuthUser(request);
    if (!user) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const product = await db.product.findUnique({ where: { id } });
    if (!product) {
      return NextResponse.json({ success: false, error: "Not found" }, { status: 404 });
    }

    if (product.ownerId !== user.id && user.role !== "admin") {
      return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 });
    }

    await db.product.delete({ where: { id } });
    return NextResponse.json({ success: true, data: { success: true } });
  } catch (error: unknown) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ success: false, error: "Invalid product id" }, { status: 400 });
    }
    return NextResponse.json({ success: false, error: "Failed to delete product" }, { status: 500 });
  }
}
