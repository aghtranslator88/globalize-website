import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

export async function PUT(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id, status } = await request.json();

    const updated = await prisma.quoteRequest.update({
      where: { id },
      data: { status },
    });

    return NextResponse.json({ success: true, result: updated });
  } catch (error: any) {
    console.error("Dashboard quote status update error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
