import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { action, model, id, data } = await request.json();
    const role = (session.user as any).role;

    // Enforce role permission: EDITOR cannot modify site settings
    if (role === "EDITOR" && model === "siteSetting") {
      return NextResponse.json(
        { error: "Forbidden: Editors cannot modify site settings" },
        { status: 403 }
      );
    }

    // Mapping model keys to Prisma models
    const dbModel: any = (prisma as any)[model];
    if (!dbModel) {
      return NextResponse.json({ error: "Invalid model name" }, { status: 400 });
    }

    let result;

    if (action === "create") {
      result = await dbModel.create({ data });
    } else if (action === "update") {
      if (!id) {
        return NextResponse.json({ error: "ID is required for update" }, { status: 400 });
      }
      result = await dbModel.update({
        where: { id },
        data,
      });
    } else if (action === "delete") {
      if (!id) {
        return NextResponse.json({ error: "ID is required for delete" }, { status: 400 });
      }
      result = await dbModel.delete({
        where: { id },
      });
    } else {
      return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }

    return NextResponse.json({ success: true, result });
  } catch (error: any) {
    console.error("Dashboard CRUD error:", error);
    return NextResponse.json(
      { error: "Internal server error", details: error.message },
      { status: 500 }
    );
  }
}
