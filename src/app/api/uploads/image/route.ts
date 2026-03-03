import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getTokenFromHeader, verifyToken } from "@/lib/auth";

const schema = z.object({});

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

export async function POST(request: NextRequest) {
  try {
    schema.parse({});
    const payload = getPayload(request);
    if (!payload) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get("file");
    if (!(file instanceof File)) {
      return NextResponse.json({ success: false, error: "File is required" }, { status: 400 });
    }

    const key = `${Date.now()}-${file.name}`;
    const baseUrl = process.env.STORAGE_PROVIDER_URL || "https://example.com/uploads";
    const url = `${baseUrl}/${key}`;

    return NextResponse.json({ success: true, data: { url, key } }, { status: 201 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Upload failed";
    return NextResponse.json({ success: false, error: message }, { status: 400 });
  }
}
