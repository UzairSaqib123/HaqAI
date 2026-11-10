import { NextRequest, NextResponse } from "next/server";
import {
  getAllCases,
  getAllDispatches,
  getAllHelpers,
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
  const groqKey = process.env.GROQ_API_KEY?.trim();
  const isGroqConfigured = Boolean(
    groqKey && groqKey !== "your_groq_api_key_here"
  );

  return NextResponse.json({
    profiles: getAllProfiles(),
    cases: getAllCases(),
    dispatches: getAllDispatches(),
    helpers: getAllHelpers(),
    systemStatus: {
      isGeminiConfigured,
      isGroqConfigured,
      isSupabaseConfigured,
      appUrl: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
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
