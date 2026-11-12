import { NextRequest, NextResponse } from "next/server";
import {
  AdvocateCredentials,
  AvailabilityTimeSlot,
  getAllCases,
  getAllHelpers,
  HelpTypeOption,
  LegalHelperAvailability,
  saveHelperAvailability,
} from "@/lib/store";
import {
  ALL_LEGAL_CATEGORIES,
  LegalCategoryId,
} from "@/lib/legal-knowledge";

export const dynamic = "force-dynamic";

/** Degrees that are not yet enrolled advocates (no Bar licence required) */
const NON_LICENSED_DEGREES = ["Law Student (LLB in progress)", "Paralegal Certificate"];

function sanitizeCredentials(raw: unknown): AdvocateCredentials | undefined {
  if (!raw || typeof raw !== "object") return undefined;
  const c = raw as Record<string, unknown>;
  const s = (v: unknown) => String(v ?? "").trim();
  const degree = s(c.degree);
  const university = s(c.university);
  const graduationYear = s(c.graduationYear);
  const barCouncil = s(c.barCouncil);
  const licenseNumber = s(c.licenseNumber);
  if (!degree || !university || !graduationYear) return undefined;
  const needsLicence = !NON_LICENSED_DEGREES.includes(degree);
  if (needsLicence && (!barCouncil || !licenseNumber)) return undefined;
  return {
    degree,
    university,
    graduationYear,
    barCouncil,
    licenseNumber,
    experienceYears: s(c.experienceYears),
    specialization: s(c.specialization),
    bio: s(c.bio).slice(0, 600),
    submittedAt: s(c.submittedAt) || new Date().toISOString(),
  };
}

export interface PreferenceMatch {
  matchId: string;
  helperId: string;
  helperName: string;
  helperRole: string;
  helperCity: string;
  helperPhone: string;
  helperEmail: string;
  timeSlot: AvailabilityTimeSlot;
  helpTypes: HelpTypeOption[];
  caseId: string;
  citizenName: string;
  citizenCity: string;
  categoryId: LegalCategoryId;
  categoryTitle: string;
  userQuery: string;
  authorityShortName: string;
  matchScore: number;
  matchReasons: string[];
}

function computePreferenceMatches(
  helpers: LegalHelperAvailability[]
): PreferenceMatch[] {
  const cases = getAllCases();
  const matches: PreferenceMatch[] = [];

  for (const helper of helpers) {
    if (!helper.isAvailable) continue;

    for (const legalCase of cases) {
      let score = 0;
      const reasons: string[] = [];

      // 1. Category preference match
      if (
        helper.legalCategories.length === 0 ||
        helper.legalCategories.includes(legalCase.categoryId)
      ) {
        score += 50;
        reasons.push(`Legal Expertise: ${legalCase.categoryTitle}`);
      } else {
        continue; // Must match selected legal category preference
      }

      // 2. City preference match
      const caseCity = (
        legalCase.generatedComplaint?.facts?.city || ""
      ).toLowerCase();
      if (
        helper.city &&
        caseCity &&
        helper.city.toLowerCase() === caseCity
      ) {
        score += 25;
        reasons.push(`Same City (${helper.city})`);
      } else {
        score += 10;
        reasons.push("Remote / Nationwide Legal Aid");
      }

      // 3. Help type & Time slot readiness
      if (helper.helpTypes.includes("drafting")) {
        score += 15;
        reasons.push("Complaint Drafting Review");
      }
      if (helper.helpTypes.includes("consultation")) {
        score += 10;
        reasons.push("Direct Citizen Legal Consultation");
      }

      matches.push({
        matchId: `${helper.helperId}-${legalCase.caseId}`,
        helperId: helper.helperId,
        helperName: helper.fullName,
        helperRole: helper.roleTitle,
        helperCity: helper.city,
        helperPhone: helper.phone,
        helperEmail: helper.email,
        timeSlot: helper.timeSlot,
        helpTypes: helper.helpTypes,
        caseId: legalCase.caseId,
        citizenName:
          legalCase.generatedComplaint?.facts?.applicantName || "Citizen",
        citizenCity:
          legalCase.generatedComplaint?.facts?.city || "Pakistan",
        categoryId: legalCase.categoryId,
        categoryTitle: legalCase.categoryTitle,
        userQuery: legalCase.userQuery,
        authorityShortName: legalCase.primaryAuthority.shortName,
        matchScore: Math.min(100, score),
        matchReasons: reasons,
      });
    }
  }

  return matches.sort((a, b) => b.matchScore - a.matchScore);
}

export async function GET() {
  const helpers = getAllHelpers();
  const cases = getAllCases();
  const matches = computePreferenceMatches(helpers);

  return NextResponse.json({
    helpers,
    activeHelpersCount: helpers.filter((h) => h.isAvailable).length,
    totalCasesCount: cases.length,
    matches,
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      helperId,
      haqId,
      fullName,
      roleTitle,
      phone,
      email,
      city,
      isAvailable,
      timeSlot,
      helpTypes,
      legalCategories,
      credentials,
    } = body;

    if (!fullName || !String(fullName).trim()) {
      return NextResponse.json(
        { error: "Full name is required to activate the Availability Switch." },
        { status: 400 }
      );
    }

    const cleanHelperId =
      helperId ||
      haqId ||
      `HLP-${Math.floor(100000 + Math.random() * 900000)}`;

    // Advocate credentials: use newly submitted ones, otherwise keep what is on file
    const existingHelper = getAllHelpers().find(
      (h) => h.helperId === cleanHelperId
    );
    const finalCredentials = sanitizeCredentials(credentials) ||
      existingHelper?.credentials;

    if (Boolean(isAvailable) && !finalCredentials) {
      return NextResponse.json(
        {
          error:
            "Please submit your degree and professional details before switching ON the Availability Switch.",
          requiresCredentials: true,
        },
        { status: 400 }
      );
    }

    const validTimeSlot: AvailabilityTimeSlot = [
      "immediate",
      "morning",
      "evening",
      "weekends",
    ].includes(timeSlot)
      ? timeSlot
      : "immediate";

    const validHelpTypes: HelpTypeOption[] =
      Array.isArray(helpTypes) && helpTypes.length > 0
        ? helpTypes
        : ["consultation", "drafting"];

    const validCategories: LegalCategoryId[] =
      Array.isArray(legalCategories) && legalCategories.length > 0
        ? legalCategories
        : ALL_LEGAL_CATEGORIES.map((c) => c.id);

    const allCases = getAllCases();
    const matchedCaseIds = Boolean(isAvailable)
      ? allCases
          .filter((c) => validCategories.includes(c.categoryId))
          .map((c) => c.caseId)
      : [];

    const saved = saveHelperAvailability({
      helperId: cleanHelperId,
      haqId: haqId || cleanHelperId,
      fullName: String(fullName).trim(),
      roleTitle: String(roleTitle || "Pro-Bono Legal Aid Volunteer").trim(),
      phone: String(phone || "").trim(),
      email: String(email || "").trim(),
      city: String(city || "Pakistan").trim(),
      isAvailable: Boolean(isAvailable),
      timeSlot: validTimeSlot,
      helpTypes: validHelpTypes,
      legalCategories: validCategories,
      matchedCaseIds,
      credentials: finalCredentials,
      updatedAt: new Date().toISOString(),
    });

    const helpers = getAllHelpers();
    const matches = computePreferenceMatches(helpers);

    return NextResponse.json({
      success: true,
      helper: saved,
      helpers,
      matches,
    });
  } catch (err) {
    console.error("Error in /api/availability POST:", err);
    return NextResponse.json(
      { error: "Failed to update availability switch." },
      { status: 500 }
    );
  }
}
