import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { signToken, verifyPassword } from "@/lib/auth";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6)
});

export async function POST(request: NextRequest) {
  try {
    const body = loginSchema.parse(await request.json());
    const user = await db.user.findUnique({ where: { email: body.email } });

    if (!user) {
      return NextResponse.json({ success: false, error: "Invalid credentials" }, { status: 401 });
    }

    const valid = await verifyPassword(body.password, user.passwordHash);
    if (!valid) {
      return NextResponse.json({ success: false, error: "Invalid credentials" }, { status: 401 });
    }

    const token = signToken({ userId: user.id, role: user.role });
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

    await db.authToken.create({
      data: {
        token,
        userId: user.id,
        expiresAt
      }
    });

    return NextResponse.json({
      success: true,
      data: {
        token,
        expiresAt: expiresAt.toISOString(),
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role
        }
      }
    });
  } catch (error: unknown) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ success: false, error: error.errors[0]?.message ?? "Invalid request" }, { status: 400 });
    }
    return NextResponse.json({ success: false, error: "Login failed" }, { status: 500 });
  }
}
