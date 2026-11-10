import { NextRequest, NextResponse } from "next/server";
import {
  getAllCases,
  getAllDispatches,
  getAllHelpers,
  getAllProfiles,
  mergeClientDataIntoStore,
  syncStoreWithSupabase,
  updateCaseOrDispatchStatus,
} from "@/lib/store";
import { isSupabaseConfigured } from "@/lib/supabase";

export const dynamic = "force-dynamic";
export const revalidate = 0;

function getSystemStatus() {
  const geminiKey = process.env.GEMINI_API_KEY?.trim();
  const isGeminiConfigured = Boolean(
    geminiKey && geminiKey !== "your_gemini_api_key_here"
  );
  const groqKey = process.env.GROQ_API_KEY?.trim();
  const isGroqConfigured = Boolean(
    groqKey && groqKey !== "your_groq_api_key_here"
  );

  return {
    isGeminiConfigured,
    isGroqConfigured,
    isSupabaseConfigured,
    appUrl: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
  };
}

export async function GET() {
  await syncStoreWithSupabase();

  return NextResponse.json(
    {
      profiles: getAllProfiles(),
      cases: getAllCases(),
      dispatches: getAllDispatches(),
      helpers: getAllHelpers(),
      systemStatus: getSystemStatus(),
    },
    {
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
      },
    }
  );
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    await mergeClientDataIntoStore({
      profiles: body.profiles,
      cases: body.cases,
      dispatches: body.dispatches,
      helpers: body.helpers,
    });
    await syncStoreWithSupabase();

    return NextResponse.json(
      {
        success: true,
        profiles: getAllProfiles(),
        cases: getAllCases(),
        dispatches: getAllDispatches(),
        helpers: getAllHelpers(),
        systemStatus: getSystemStatus(),
      },
      {
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
        },
      }
    );
  } catch (err) {
    console.error("Error in /api/admin POST sync:", err);
    return NextResponse.json(
      { error: "Failed to sync admin records" },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { caseId, dispatchId, status } = body;
    await updateCaseOrDispatchStatus({ caseId, dispatchId, status });
    return NextResponse.json({
      success: true,
      profiles: getAllProfiles(),
      cases: getAllCases(),
      dispatches: getAllDispatches(),
      helpers: getAllHelpers(),
    });
  } catch (err) {
    console.error("Error in /api/admin PATCH:", err);
    return NextResponse.json(
      { error: "Failed to update status" },
      { status: 500 }
    );
  }
}
