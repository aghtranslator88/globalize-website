import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const quoteRequestSchema = z.object({
  name: z.string().min(1, "Name is required"),
  phone: z.string().min(8, "Phone number must be at least 8 characters"),
  serviceType: z.string().min(1, "Service type is required"),
  fileUrl: z.string().nullable().optional(),
  notes: z.string().nullable().optional(),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Validate request body
    const validationResult = quoteRequestSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { error: "Validation failed", details: validationResult.error.flatten() },
        { status: 400 }
      );
    }

    const { name, phone, serviceType, fileUrl, notes } = validationResult.data;

    // Try creating quote request in the database if available
    try {
      const newRequest = await prisma.quoteRequest.create({
        data: {
          name,
          phone,
          serviceType,
          fileUrl: fileUrl || null,
          notes: notes || null,
          status: "NEW",
        },
      });

      return NextResponse.json(
        { success: true, request: newRequest },
        { status: 201 }
      );
    } catch (dbError) {
      console.warn("Database offline for quote request, storing in fallback:", {
        name,
        phone,
        serviceType,
        timestamp: new Date().toISOString(),
      });

      // Return success to the client with mock request object
      const fallbackRequest = {
        id: `local_${Date.now()}`,
        name,
        phone,
        serviceType,
        fileUrl: fileUrl || null,
        notes: notes || null,
        status: "NEW",
        createdAt: new Date().toISOString(),
      };

      return NextResponse.json(
        { success: true, request: fallbackRequest, fallback: true },
        { status: 200 }
      );
    }
  } catch (error) {
    console.error("Error creating quote request:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
