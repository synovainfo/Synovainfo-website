import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { rateLimit } from "@/lib/rate-limit";

// ---------------------------------------------------------------------------
// Rate limiter — 5 requests per 60 seconds per IP
// ---------------------------------------------------------------------------

const contactRateLimit = rateLimit({ interval: 60_000, max: 5 });

// ---------------------------------------------------------------------------
// Validation Schema
// ---------------------------------------------------------------------------

const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().max(20).optional().default(""),
  company: z.string().max(100).optional().default(""),
  service: z.string().max(100).optional().default(""),
  budget: z.string().max(50).optional().default(""),
  timeline: z.string().max(50).optional().default(""),
  message: z
    .string()
    .min(10, "Message must be at least 10 characters")
    .max(5000, "Message is too long"),
  website: z.string().max(0).optional(), // honeypot
});

// ---------------------------------------------------------------------------
// POST /api/contact
// ---------------------------------------------------------------------------

export async function POST(request: NextRequest) {
  try {
    // --- Rate limit check ---
    const rateLimitResult = await contactRateLimit(request);
    if (!rateLimitResult.success) {
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        {
          status: 429,
          headers: rateLimitResult.headers,
        },
      );
    }

    // --- Parse body ---
    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { error: "Invalid request body. Expected JSON." },
        { status: 400 },
      );
    }

    // --- Validate ---
    const parsed = contactSchema.safeParse(body);
    if (!parsed.success) {
      const fieldErrors = parsed.error.flatten().fieldErrors;
      const firstError =
        Object.values(fieldErrors)
          .flat()
          .find(Boolean) ?? "Validation failed";

      return NextResponse.json(
        { error: firstError, fieldErrors },
        { status: 400 },
      );
    }

    const data = parsed.data;

    // --- Honeypot check ---
    // If the hidden "website" field is filled, it's a bot — silently accept
    if (data.website && data.website.length > 0) {
      // Pretend success to avoid revealing the honeypot
      return NextResponse.json(
        { message: "Message sent successfully!" },
        { status: 201 },
      );
    }

    // --- Extract request metadata ---
    const ipAddress =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
      request.headers.get("x-real-ip") ??
      null;

    const userAgent = request.headers.get("user-agent") ?? null;
    const referrer = request.headers.get("referer") ?? null;

    // --- Save to database ---
    await prisma.contact.create({
      data: {
        name: data.name,
        email: data.email,
        phone: data.phone || null,
        company: data.company || null,
        service: data.service || null,
        budget: data.budget || null,
        timeline: data.timeline || null,
        message: data.message,
        ipAddress,
        browser: userAgent,
        referrer,
        source: "website",
        status: "NEW",
      },
    });

    return NextResponse.json(
      { message: "Message sent successfully!" },
      { status: 201, headers: rateLimitResult.headers },
    );
  } catch (err) {
    console.error("Contact API error:", err);
    return NextResponse.json(
      { error: "An unexpected error occurred. Please try again later." },
      { status: 500 },
    );
  }
}
