import { NextRequest, NextResponse } from "next/server";
import {
  buildFormalComplaint,
  ExtractedUserFacts,
  extractFactsFromText,
} from "@/lib/ai-engine";
import {
  LegalCategoryId,
  LEGAL_KNOWLEDGE_BASE,
} from "@/lib/legal-knowledge";
import { getCaseById, saveCase } from "@/lib/store";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      caseId,
      categoryId,
      facts,
      customBodyText,
    }: {
      caseId?: string;
      categoryId?: LegalCategoryId;
      facts?: Partial<ExtractedUserFacts>;
      customBodyText?: string;
    } = body;

    const existingCase = caseId ? getCaseById(caseId) : null;
    const resolvedCategoryId: LegalCategoryId =
      categoryId || existingCase?.categoryId || "education";
    const entry = LEGAL_KNOWLEDGE_BASE[resolvedCategoryId];

    const mergedFacts = extractFactsFromText(
      facts?.rawStatement ||
        existingCase?.userQuery ||
        "My university is refusing to return my original educational documents.",
      {
        ...(existingCase?.generatedComplaint.facts || {}),
        ...(facts || {}),
      }
    );

    const complaint = buildFormalComplaint(entry, mergedFacts);
    if (customBodyText && customBodyText.trim()) {
      complaint.bodyText = customBodyText;
    }

    if (existingCase) {
      existingCase.generatedComplaint = complaint;
      saveCase(existingCase);
    }

    return NextResponse.json({
      success: true,
      complaint,
    });
  } catch (err) {
    console.error("Error in /api/complaint:", err);
    return NextResponse.json(
      { error: "Failed to generate formal complaint" },
      { status: 500 }
    );
  }
}
