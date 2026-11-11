import { NextRequest, NextResponse } from "next/server";
import {
  findCitizenProfile,
  getCaseById,
  recordDispatch,
  saveCase,
} from "@/lib/store";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      caseId,
      haqId,
      approved,
      citizenName,
      citizenCnic,
      citizenPhone,
      citizenEmail,
      citizenCity,
      authorityName,
      authorityEmail,
      portalUrl,
      finalComplaintText,
      subject,
    }: {
      caseId: string;
      haqId?: string;
      approved: boolean;
      citizenName?: string;
      citizenCnic?: string;
      citizenPhone?: string;
      citizenEmail?: string;
      citizenCity?: string;
      authorityName: string;
      authorityEmail: string;
      portalUrl: string;
      finalComplaintText: string;
      subject?: string;
    } = body;

    if (!approved) {
      return NextResponse.json(
        {
          error:
            "User approval is strictly required before forwarding a complaint to any institution.",
        },
        { status: 400 }
      );
    }

    if (!finalComplaintText || !finalComplaintText.trim()) {
      return NextResponse.json(
        { error: "Complaint text cannot be empty." },
        { status: 400 }
      );
    }

    const existingCase = caseId ? getCaseById(caseId) : null;
    const profile = findCitizenProfile({
      haqId: haqId || existingCase?.haqId,
    });

    const dispatchId = `DSP-${Math.floor(100000 + Math.random() * 900000)}`;
    const dispatchedAt = new Date().toISOString();

    const record = await recordDispatch({
      dispatchId,
      caseId: caseId || "HAQ-DIRECT",
      haqId: haqId || existingCase?.haqId || profile?.haqId || "HAQ-PK-CITIZEN",
      citizenName:
        citizenName ||
        existingCase?.generatedComplaint.facts.applicantName ||
        profile?.fullName ||
        "Citizen",
      citizenCnic:
        citizenCnic ||
        existingCase?.generatedComplaint.facts.cnic ||
        profile?.cnic ||
        "N/A",
      citizenPhone:
        citizenPhone ||
        existingCase?.generatedComplaint.facts.contactPhone ||
        profile?.phone ||
        "N/A",
      citizenEmail:
        citizenEmail ||
        existingCase?.generatedComplaint.facts.contactEmail ||
        profile?.email ||
        "N/A",
      citizenCity:
        citizenCity ||
        existingCase?.generatedComplaint.facts.city ||
        profile?.city ||
        "Pakistan",
      authorityName: authorityName || "Higher Education Commission (HEC)",
      authorityEmail: authorityEmail || "complaints@hec.gov.pk",
      portalUrl: portalUrl || "https://onlinehelp.hec.gov.pk",
      dispatchedAt,
      status: "Dispatched",
      finalComplaintText,
    });

    if (existingCase) {
      existingCase.generatedComplaint.bodyText = finalComplaintText;
      existingCase.status = "Dispatched";
      const step8 = existingCase.workflowSteps.find((s) => s.stepNumber === 8);
      if (step8) {
        step8.status = "completed";
        step8.summary = `Approved & Dispatched (${dispatchId}) to ${authorityName}`;
      }
      await saveCase(existingCase);
    }

    const cleanAuthorityEmail = authorityEmail || "complaints@hec.gov.pk";
    const cleanSubject =
      subject || "Formal Application for Statutory & Administrative Redressal";

    const mailtoUrl = `mailto:${encodeURIComponent(
      cleanAuthorityEmail
    )}?subject=${encodeURIComponent(cleanSubject)}&body=${encodeURIComponent(
      finalComplaintText
    )}`;

    const gmailComposeUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(
      cleanAuthorityEmail
    )}&su=${encodeURIComponent(cleanSubject)}&body=${encodeURIComponent(
      finalComplaintText
    )}`;

    return NextResponse.json({
      success: true,
      dispatchRecord: record,
      mailtoUrl,
      gmailComposeUrl,
      officialPortalUrl: portalUrl,
    });
  } catch (err) {
    console.error("Error in /api/dispatch:", err);
    return NextResponse.json(
      { error: "Failed to dispatch complaint." },
      { status: 500 }
    );
  }
}
