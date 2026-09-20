import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

export const dynamic = "force-dynamic";

const updateQuoteSchema = z.object({
  id: z.string().min(1, "Quote ID is required"),
  status: z.enum(["NEW", "CONTACTED", "QUOTED", "WON", "LOST"], {
    message: "Invalid quote status value",
  }),
});

export async function PUT(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const rawBody = await request.json().catch(() => null);
    const parseResult = updateQuoteSchema.safeParse(rawBody);

    if (!parseResult.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parseResult.error.flatten() },
        { status: 400 }
      );
    }

    const { id, status } = parseResult.data;

    const updated = await prisma.quoteRequest.update({
      where: { id },
      data: { status },
    });

    return NextResponse.json(
      { success: true, result: updated },
      {
        headers: {
          "Cache-Control": "private, no-store, max-age=0",
        },
      }
    );
  } catch (error: any) {
    console.error("Dashboard quote status update error:", error);
    return NextResponse.json(
      { error: "Internal server error", details: error.message },
      { status: 500 }
    );
  }
}
