import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { hashPassword } from "@/lib/auth";

const registerSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6)
});

export async function POST(request: NextRequest) {
  try {
    const body = registerSchema.parse(await request.json());
    const existing = await db.user.findUnique({ where: { email: body.email } });
    if (existing) {
      return NextResponse.json({ success: false, error: "Email already registered" }, { status: 400 });
    }

    const passwordHash = await hashPassword(body.password);
    const user = await db.user.create({
      data: {
        name: body.name,
        email: body.email,
        passwordHash,
        role: "user"
      }
    });

    return NextResponse.json({
      success: true,
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt
      }
    });
  } catch (error: unknown) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ success: false, error: error.errors[0]?.message ?? "Invalid request" }, { status: 400 });
    }
    return NextResponse.json({ success: false, error: "Failed to register" }, { status: 500 });
  }
}
