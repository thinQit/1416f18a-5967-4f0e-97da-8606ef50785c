import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const schema = z.object({});

export async function GET(_request: NextRequest) {
  try {
    schema.parse({});
    return NextResponse.json({
      success: true,
      data: {
        status: "ok",
        uptime_seconds: process.uptime(),
        timestamp: new Date().toISOString()
      }
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Health check failed";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
