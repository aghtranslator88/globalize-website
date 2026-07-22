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

    // Create quote request in the database
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
  } catch (error) {
    console.error("Error creating quote request:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
