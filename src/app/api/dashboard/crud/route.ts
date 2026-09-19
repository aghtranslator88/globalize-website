import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

export const dynamic = "force-dynamic";

// Explicit Whitelist of Allowed Models
export const ALLOWED_MODELS = [
  "document",
  "embassy",
  "govEntity",
  "language",
  "branch",
  "teamMember",
  "review",
  "blogPost",
  "fAQ",
  "siteSetting",
] as const;

export type AllowedModel = (typeof ALLOWED_MODELS)[number];

export const ALLOWED_ACTIONS = ["create", "update", "delete"] as const;

const crudInputSchema = z.object({
  action: z.enum(ALLOWED_ACTIONS),
  model: z.enum(ALLOWED_MODELS),
  id: z.string().min(1).optional(),
  data: z.record(z.string(), z.any()).optional(),
});

// Explicit, Type-Safe Delegate Lookup Table (Prevents arbitrary Prisma reflection)
const getModelDelegate = (model: AllowedModel) => {
  switch (model) {
    case "document":
      return prisma.document;
    case "embassy":
      return prisma.embassy;
    case "govEntity":
      return prisma.govEntity;
    case "language":
      return prisma.language;
    case "branch":
      return prisma.branch;
    case "teamMember":
      return prisma.teamMember;
    case "review":
      return prisma.review;
    case "blogPost":
      return prisma.blogPost;
    case "fAQ":
      return prisma.fAQ;
    case "siteSetting":
      return prisma.siteSetting;
    default:
      return null;
  }
};

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const rawBody = await request.json().catch(() => null);
    const parseResult = crudInputSchema.safeParse(rawBody);

    if (!parseResult.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parseResult.error.flatten() },
        { status: 400 }
      );
    }

    const { action, model, id, data } = parseResult.data;
    const role = (session.user as any).role;

    // Enforce role permission: EDITOR cannot modify site settings
    if (role === "EDITOR" && model === "siteSetting") {
      return NextResponse.json(
        { error: "Forbidden: Editors cannot modify site settings" },
        { status: 403 }
      );
    }

    const dbModel = getModelDelegate(model);
    if (!dbModel) {
      return NextResponse.json({ error: "Invalid model access" }, { status: 400 });
    }

    let result;

    if (action === "create") {
      if (!data || Object.keys(data).length === 0) {
        return NextResponse.json({ error: "Data is required for creation" }, { status: 400 });
      }
      result = await (dbModel as any).create({ data });
    } else if (action === "update") {
      if (!id) {
        return NextResponse.json({ error: "ID is required for update" }, { status: 400 });
      }
      if (!data || Object.keys(data).length === 0) {
        return NextResponse.json({ error: "Data is required for update" }, { status: 400 });
      }
      result = await (dbModel as any).update({
        where: { id },
        data,
      });
    } else if (action === "delete") {
      if (!id) {
        return NextResponse.json({ error: "ID is required for delete" }, { status: 400 });
      }
      result = await (dbModel as any).delete({
        where: { id },
      });
    }

    return NextResponse.json(
      { success: true, result },
      {
        headers: {
          "Cache-Control": "private, no-store, max-age=0",
        },
      }
    );
  } catch (error: any) {
    console.error("Dashboard CRUD error:", error);
    return NextResponse.json(
      { error: "Internal server error", details: error.message },
      { status: 500 }
    );
  }
}
