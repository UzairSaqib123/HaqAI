import { NextRequest, NextResponse } from "next/server";
import {
  getAllCases,
  getAllDispatches,
  getAllProfiles,
  updateCaseOrDispatchStatus,
} from "@/lib/store";
import { isSupabaseConfigured } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export async function GET() {
  const geminiKey = process.env.GEMINI_API_KEY?.trim();
  const isGeminiConfigured = Boolean(
    geminiKey && geminiKey !== "your_gemini_api_key_here"
  );
  const isWhatsAppConfigured = Boolean(
    process.env.WHATSAPP_ACCESS_TOKEN && process.env.WHATSAPP_PHONE_NUMBER_ID
  );

  return NextResponse.json({
    profiles: getAllProfiles(),
    cases: getAllCases(),
    dispatches: getAllDispatches(),
    systemStatus: {
      isGeminiConfigured,
      isSupabaseConfigured,
      isWhatsAppConfigured,
      whatsappNumber: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "923001234567",
      appUrl: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3001",
    },
  });
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { caseId, dispatchId, status } = body;
    updateCaseOrDispatchStatus({ caseId, dispatchId, status });
    return NextResponse.json({
      success: true,
      cases: getAllCases(),
      dispatches: getAllDispatches(),
    });
  } catch (err) {
    console.error("Error in /api/admin PATCH:", err);
    return NextResponse.json(
      { error: "Failed to update status" },
      { status: 500 }
    );
  }
}
