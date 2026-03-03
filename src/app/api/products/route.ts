import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { getTokenFromHeader, verifyToken } from "@/lib/auth";
import type { Product as PrismaProduct, Prisma } from "@prisma/client";

const createSchema = z.object({
  name: z.string().min(2),
  description: z.string().min(5),
  price: z.coerce.number().positive(),
  sku: z.string().optional(),
  stock: z.coerce.number().int().optional(),
  images: z.array(z.string()).optional()
});

const querySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  pageSize: z.coerce.number().int().positive().max(100).default(20),
  q: z.string().optional().default(""),
  sort: z.string().optional().default("createdAt:desc")
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

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = querySchema.parse({
      page: searchParams.get("page") ?? undefined,
      pageSize: searchParams.get("pageSize") ?? undefined,
      q: searchParams.get("q") ?? undefined,
      sort: searchParams.get("sort") ?? undefined
    });

    const allowedSortFields = ["createdAt", "price", "name", "updatedAt"] as const;
    const [sortFieldRaw, sortOrderRaw] = query.sort.split(":");
    const sortField = allowedSortFields.includes(sortFieldRaw as (typeof allowedSortFields)[number])
      ? (sortFieldRaw as (typeof allowedSortFields)[number])
      : "createdAt";
    const sortOrder: Prisma.SortOrder = sortOrderRaw === "asc" ? "asc" : "desc";

    const where: Prisma.ProductWhereInput = query.q
      ? {
          OR: [
            { name: { contains: query.q, mode: "insensitive" } },
            { description: { contains: query.q, mode: "insensitive" } },
            { sku: { contains: query.q, mode: "insensitive" } }
          ]
        }
      : {};

    const [total, items] = await Promise.all([
      db.product.count({ where }),
      db.product.findMany({
        where,
        orderBy: { [sortField]: sortOrder },
        skip: (query.page - 1) * query.pageSize,
        take: query.pageSize
      })
    ]);

    return NextResponse.json({
      success: true,
      data: {
        total,
        page: query.page,
        pageSize: query.pageSize,
        items: items.map(formatProduct)
      }
    });
  } catch (error: unknown) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ success: false, error: error.errors[0]?.message ?? "Invalid query" }, { status: 400 });
    }
    return NextResponse.json({ success: false, error: "Failed to fetch products" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
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

    const body = createSchema.parse(await request.json());
    const product = await db.product.create({
      data: {
        name: body.name,
        description: body.description,
        price: body.price,
        sku: body.sku,
        stock: body.stock ?? 0,
        images: JSON.stringify(body.images ?? []),
        ownerId: userId
      }
    });

    return NextResponse.json({ success: true, data: formatProduct(product) }, { status: 201 });
  } catch (error: unknown) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ success: false, error: error.errors[0]?.message ?? "Invalid request" }, { status: 400 });
    }
    return NextResponse.json({ success: false, error: "Failed to create product" }, { status: 500 });
  }
}
