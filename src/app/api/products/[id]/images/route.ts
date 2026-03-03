import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { getTokenFromHeader, verifyToken } from "@/lib/auth";

type FileLike = File | string;

const idSchema = z.string().uuid();

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

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  const token = getTokenFromHeader(request.headers.get("authorization"));
  if (!token) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const id = idSchema.parse(params.id);
    const payload = verifyToken(token);
    const userId = typeof payload.userId === "string" ? payload.userId : null;
    if (!userId) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const product = await db.product.findUnique({ where: { id } });
    if (!product) {
      return NextResponse.json({ success: false, error: "Not found" }, { status: 404 });
    }

    if (product.ownerId !== userId && payload.role !== "admin") {
      return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 });
    }

    const formData = await request.formData();
    const files = formData.getAll("files") as FileLike[];
    if (files.length === 0) {
      return NextResponse.json({ success: false, error: "No files uploaded" }, { status: 400 });
    }

    const newImages = files.map((file, index) => {
      const name = typeof file === "string" ? file : file.name;
      return `/uploads/${id}/${Date.now()}-${index}-${name}`;
    });

    const existing = parseImages(product.images);
    const updatedImages = [...existing, ...newImages];

    await db.product.update({
      where: { id },
      data: { images: JSON.stringify(updatedImages) }
    });

    return NextResponse.json({ success: true, data: { images: updatedImages } });
  } catch (error: unknown) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ success: false, error: "Invalid product id" }, { status: 400 });
    }
    return NextResponse.json({ success: false, error: "Failed to upload images" }, { status: 500 });
  }
}
