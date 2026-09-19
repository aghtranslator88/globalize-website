import { NextResponse } from "next/server";
import { z } from "zod";
import {
  checkRateLimit,
  storeLeadPermanently,
  dispatchNotifications,
  LeadInput,
} from "@/lib/leadResilience";

const quoteRequestSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name is too long"),
  phone: z
    .string()
    .trim()
    .min(8, "Phone number must be at least 8 characters")
    .max(25, "Phone number is too long")
    .regex(/^[+]?[\d\s\-().]{8,25}$/, "Invalid phone number format"),
  email: z
    .string()
    .trim()
    .email("Invalid email format")
    .max(120, "Email is too long")
    .nullable()
    .optional()
    .or(z.literal("")),
  serviceType: z.string().trim().min(1, "Service type is required").max(60),
  attachmentName: z.string().trim().max(255).nullable().optional(),
  fileUrl: z.string().trim().max(500).nullable().optional(),
  notes: z.string().trim().max(2000).nullable().optional(),
  _gotcha: z.string().optional(), // Bot honeypot field
});

export async function POST(request: Request) {
  try {
    // 1. Rate Limiting Check (per IP)
    const clientIp =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      request.headers.get("x-real-ip") ||
      "unknown";

    const rateLimit = checkRateLimit(clientIp);
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: "Too many requests. Please wait a minute before submitting again." },
        {
          status: 429,
          headers: {
            "Retry-After": "60",
          },
        }
      );
    }

    // 2. Request Body Parsing
    let body: any;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { error: "Invalid JSON request body" },
        { status: 400 }
      );
    }

    // 3. Honeypot Anti-Bot Protection
    if (body._gotcha && typeof body._gotcha === "string" && body._gotcha.trim().length > 0) {
      return NextResponse.json(
        { error: "Spam submission rejected", code: "HONEYPOT_TRIGGERED" },
        { status: 400 }
      );
    }

    // 4. Input Validation with Zod
    const validationResult = quoteRequestSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { error: "Validation failed", details: validationResult.error.flatten() },
        { status: 400 }
      );
    }

    const { name, phone, email, serviceType, attachmentName, fileUrl, notes } = validationResult.data;

    const leadInput: LeadInput = {
      name,
      phone,
      email: email || null,
      serviceType,
      attachmentName: attachmentName || fileUrl || null,
      notes: notes || null,
    };

    // 5. Permanent Lead Storage (PostgreSQL primary -> Upstash Redis fallback)
    const storeResult = await storeLeadPermanently(leadInput);

    // 5a. Deduplication catch: If identical lead submitted within 30s
    if (storeResult.isDuplicate) {
      return NextResponse.json(
        {
          success: true,
          leadId: storeResult.lead.id,
          duplicate: true,
          message: "Duplicate submission detected, request already recorded",
          storageStatus: storeResult.lead.storageStatus,
          attachmentStatus: storeResult.lead.attachmentStatus,
          notifications: {
            telegram: storeResult.lead.telegramStatus,
            email: storeResult.lead.emailStatus,
          },
        },
        { status: 200 }
      );
    }

    // 5b. Permanent Storage Failed (Both Primary DB and Fallback Store failed)
    if (!storeResult.success) {
      return NextResponse.json(
        {
          success: false,
          error: "Lead storage service is temporarily unavailable. Please contact us directly via WhatsApp.",
          leadId: storeResult.lead.id,
          storageStatus: "FAILED",
        },
        { status: 503 }
      );
    }

    // 6. Downstream Notifications (Executed ONLY after successful persistent storage)
    const notifications = await dispatchNotifications(storeResult.lead);

    // 7. Successful 201 Created Response
    return NextResponse.json(
      {
        success: true,
        leadId: storeResult.lead.id,
        storageStatus: storeResult.lead.storageStatus,
        attachmentStatus: storeResult.lead.attachmentStatus,
        notifications,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Critical error in quote request handler:", error);
    return NextResponse.json(
      { error: "Internal server error. Please contact us directly via WhatsApp." },
      { status: 500 }
    );
  }
}
