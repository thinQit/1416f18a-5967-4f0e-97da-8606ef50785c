import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import db from "@/lib/db";
import { signToken, verifyPassword } from "@/lib/auth";

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(6)
});

export async function POST(request: NextRequest) {
  try {
    const body = schema.parse(await request.json());

    const user = await db.user.findUnique({ where: { email: body.email } });
    if (!user) {
      return NextResponse.json({ success: false, error: "Invalid credentials" }, { status: 401 });
    }

    const isValid = await verifyPassword(body.password, user.password_hash);
    if (!isValid) {
      return NextResponse.json({ success: false, error: "Invalid credentials" }, { status: 401 });
    }

    const token = signToken({
      id: user.id,
      email: user.email,
      role: user.role,
      name: user.name
    });
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

    await db.authSession.create({
      data: {
        token,
        expires_at: expiresAt,
        user_id: user.id
      }
    });

    return NextResponse.json({
      success: true,
      data: {
        token,
        expires_at: expiresAt.toISOString(),
        user: { id: user.id, name: user.name, email: user.email, role: user.role }
      }
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Invalid request";
    return NextResponse.json({ success: false, error: message }, { status: 400 });
  }
}
