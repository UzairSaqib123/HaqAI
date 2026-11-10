import { NextRequest, NextResponse } from "next/server";
import {
  ChatTurn,
  ExtractedUserFacts,
  generateHaqAIAnalysisAsync,
} from "@/lib/ai-engine";
import { SupportedLanguage } from "@/lib/legal-knowledge";
import { findCitizenProfile, getCaseById, saveCase } from "@/lib/store";
import { CitizenProfile } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const caseId = searchParams.get("caseId");
  if (!caseId) {
    return NextResponse.json(
      { error: "Missing caseId parameter" },
      { status: 400 }
    );
  }
  const found = getCaseById(caseId);
  if (!found) {
    return NextResponse.json(
      { error: `Case ${caseId} not found` },
      { status: 404 }
    );
  }
  return NextResponse.json({ caseData: found });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      query,
      language,
      channel,
      existingCaseId,
      haqId,
      citizenProfile,
      factOverrides,
      previousChatHistory,
    }: {
      query: string;
      language?: SupportedLanguage;
      channel?: "website" | "whatsapp";
      existingCaseId?: string;
      haqId?: string;
      citizenProfile?: CitizenProfile | null;
      factOverrides?: Partial<ExtractedUserFacts>;
      previousChatHistory?: ChatTurn[];
    } = body;

    if (!query || typeof query !== "string" || !query.trim()) {
      return NextResponse.json(
        { error: "Please provide a description of your legal issue." },
        { status: 400 }
      );
    }

    const resolvedProfile =
      citizenProfile || findCitizenProfile({ haqId }) || null;

    const existingCase = existingCaseId ? getCaseById(existingCaseId) : null;
    const mergedHistory =
      previousChatHistory || existingCase?.chatHistory || [];

    const analysis = await generateHaqAIAnalysisAsync({
      query,
      language,
      channel: channel || "website",
      existingCaseId,
      factOverrides,
      citizenProfile: resolvedProfile,
      previousChatHistory: mergedHistory,
    });

    await saveCase(analysis);

    return NextResponse.json({
      success: true,
      caseData: analysis,
    });
  } catch (err) {
    console.error("Error in /api/chat:", err);
    return NextResponse.json(
      { error: "Failed to process legal query." },
      { status: 500 }
    );
  }
}
