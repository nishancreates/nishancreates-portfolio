import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";
import { FieldValue } from "firebase-admin/firestore";

// Simple in-memory rate limiter
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const windowMs = 60 * 60 * 1000; // 1 hour
  const maxRequests = 3; // max 3 submissions per IP per hour

  const record = rateLimitMap.get(ip);

  if (!record || now > record.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + windowMs });
    return false;
  }

  if (record.count >= maxRequests) return true;

  record.count++;
  return false;
}

export async function POST(req: NextRequest) {
  try {
    // Rate limiting
    const ip = req.headers.get("x-forwarded-for") ?? "unknown";
    if (isRateLimited(ip)) {
      return NextResponse.json(
        { error: "Too many submissions. Please try again later." },
        { status: 429 }
      );
    }

    const body = await req.json();
    const { name, whatsapp, businessType, briefData } = body;

    // Validate required fields
    if (!name || !whatsapp || !businessType) {
      return NextResponse.json(
        { error: "Missing required fields." },
        { status: 400 }
      );
    }

    // Sanitize
    if (
      typeof name !== "string" || name.length > 100 ||
      typeof whatsapp !== "string" || whatsapp.length > 20 ||
      typeof businessType !== "string" || businessType.length > 50
    ) {
      return NextResponse.json(
        { error: "Invalid input." },
        { status: 400 }
      );
    }

    await adminDb.collection("leads").add({
      name,
      whatsapp,
      businessType,
      briefData: briefData || {},
      status: "new",
      createdAt: FieldValue.serverTimestamp(),
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("submit-brief error:", err);
    return NextResponse.json(
      { error: "Server error. Please try WhatsApp instead." },
      { status: 500 }
    );
  }
}