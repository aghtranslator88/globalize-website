import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

export const dynamic = "force-dynamic";

// Policy: Editors cannot delete records
const EDITOR_CAN_DELETE = false;

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

const emptyToNull = z.preprocess(
  (val) => (val === "" || val === undefined ? null : val),
  z.string().nullable().optional()
);

export const modelSchemas: Record<AllowedModel, z.ZodObject<any, any>> = {
  document: z
    .object({
      nameAr: z.string().min(1),
      nameEn: z.string().min(1),
      slug: z.string().min(1),
      priceEGP: z.coerce.number().int(),
      deliveryHours: z.coerce.number().int(),
      descriptionAr: z.string(),
      descriptionEn: z.string(),
      answerBoxAr: z.string(),
      answerBoxEn: z.string(),
      sampleImageUrl: emptyToNull,
      indexable: z.boolean().default(true),
    })
    .strict(),

  embassy: z
    .object({
      nameAr: z.string().min(1),
      nameEn: z.string().min(1),
      slug: z.string().min(1),
      countryCode: z.string().min(1),
      region: z.enum(["EUROPE", "GULF_ARAB", "AMERICAS", "ASIA_AUSTRALIA"]),
      requirementsAr: z.array(z.string()).or(z.any()),
      requirementsEn: z.array(z.string()).or(z.any()),
      useCasesAr: z.array(z.string()).or(z.any()),
      useCasesEn: z.array(z.string()).or(z.any()),
      indexable: z.boolean().default(false),
    })
    .strict(),

  govEntity: z
    .object({
      nameAr: z.string().min(1),
      nameEn: z.string().min(1),
      slug: z.string().min(1),
      requirementsAr: z.array(z.string()).or(z.any()),
      requirementsEn: z.array(z.string()).or(z.any()),
      useCasesAr: z.array(z.string()).or(z.any()),
      useCasesEn: z.array(z.string()).or(z.any()),
      indexable: z.boolean().default(false),
    })
    .strict(),

  language: z
    .object({
      nameAr: z.string().min(1),
      nameEn: z.string().min(1),
      slug: z.string().min(1),
      code: z.string().min(1),
      popular: z.boolean().default(false),
      descriptionAr: z.string(),
      descriptionEn: z.string(),
    })
    .strict(),

  branch: z
    .object({
      nameAr: z.string().min(1),
      nameEn: z.string().min(1),
      slug: z.string().min(1),
      addressAr: z.string(),
      addressEn: z.string(),
      phone: z.string(),
      whatsapp: z.string(),
      workingHoursAr: z.string(),
      workingHoursEn: z.string(),
      lat: z.coerce.number(),
      lng: z.coerce.number(),
      photoUrl: emptyToNull,
      googleMapsUrl: z.string(),
    })
    .strict(),

  teamMember: z
    .object({
      nameAr: z.string().min(1),
      nameEn: z.string().min(1),
      titleAr: z.string(),
      titleEn: z.string(),
      languagePair: z.string(),
      yearsExperience: z.coerce.number().int(),
      certifications: z.array(z.string()).or(z.any()),
      photoUrl: emptyToNull,
      isLeadership: z.boolean().default(false),
      bioAr: z.string(),
      bioEn: z.string(),
    })
    .strict(),

  review: z
    .object({
      authorName: z.string().min(1),
      rating: z.coerce.number().int().min(1).max(5),
      textAr: z.string(),
      textEn: z.string(),
      serviceType: z.enum(["CERTIFIED", "LOCALIZATION", "INTERPRETATION"]),
      date: z.coerce.date().default(() => new Date()),
      videoUrl: emptyToNull,
      published: z.boolean().default(true),
    })
    .strict(),

  blogPost: z
    .object({
      titleAr: z.string().min(1),
      titleEn: z.string().min(1),
      slug: z.string().min(1),
      excerptAr: z.string(),
      excerptEn: z.string(),
      bodyAr: z.string(),
      bodyEn: z.string(),
      categoryAr: z.string(),
      categoryEn: z.string(),
      featuredImageUrl: emptyToNull,
      videoUrl: emptyToNull,
      authorId: z.string().min(1),
      publishedAt: z.coerce.date().optional(),
      readMinutes: z.coerce.number().int(),
      published: z.boolean().default(true),
    })
    .strict(),

  fAQ: z
    .object({
      questionAr: z.string().min(1),
      answerAr: z.string().min(1),
      questionEn: z.string().min(1),
      answerEn: z.string().min(1),
      sortOrder: z.coerce.number().int().default(0),
      serviceId: emptyToNull,
      documentId: emptyToNull,
      embassyId: emptyToNull,
      govEntityId: emptyToNull,
      blogPostId: emptyToNull,
      languageId: emptyToNull,
      homepage: z.boolean().default(false),
    })
    .strict(),

  siteSetting: z
    .object({
      key: z.string().min(1),
      value: z.string(),
    })
    .strict(),
};

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

    // Enforce delete policy: Editors cannot delete
    if (action === "delete" && role !== "ADMIN" && !EDITOR_CAN_DELETE) {
      return NextResponse.json(
        { error: "Forbidden: Editors are not permitted to delete records" },
        { status: 403 }
      );
    }

    const dbModel = getModelDelegate(model);
    if (!dbModel) {
      return NextResponse.json({ error: "Invalid model access" }, { status: 400 });
    }

    const schema = modelSchemas[model];
    let result;

    if (action === "create") {
      if (!data || Object.keys(data).length === 0) {
        return NextResponse.json({ error: "Data is required for creation" }, { status: 400 });
      }

      const validated = schema.safeParse(data);
      if (!validated.success) {
        return NextResponse.json(
          { error: "Validation failed", details: validated.error.flatten() },
          { status: 400 }
        );
      }

      result = await (dbModel as any).create({ data: validated.data });
    } else if (action === "update") {
      if (!id) {
        return NextResponse.json({ error: "ID is required for update" }, { status: 400 });
      }
      if (!data || Object.keys(data).length === 0) {
        return NextResponse.json({ error: "Data is required for update" }, { status: 400 });
      }

      // SEO Guard: slug is IMMUTABLE on update
      if ("slug" in data) {
        return NextResponse.json(
          { error: "Validation failed: 'slug' is immutable and cannot be updated" },
          { status: 400 }
        );
      }

      const validated = schema.partial().safeParse(data);
      if (!validated.success) {
        return NextResponse.json(
          { error: "Validation failed", details: validated.error.flatten() },
          { status: 400 }
        );
      }

      result = await (dbModel as any).update({
        where: { id },
        data: validated.data,
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
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
