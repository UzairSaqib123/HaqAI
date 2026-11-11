import {
  ALL_LEGAL_CATEGORIES,
  AuthorityInfo,
  detectLanguageFromInput,
  LEGAL_KNOWLEDGE_BASE,
  LegalCategoryId,
  LegalKnowledgeEntry,
  SupportedLanguage,
} from "./legal-knowledge";
import {
  CONSTITUTION_OF_PAKISTAN_1973,
  PAKISTAN_LAWS_CORPUS,
} from "./pakistan-constitution-laws";
import { generateText, parseJsonObject } from "./llm";
import { CitizenProfile } from "./supabase";

export interface ExtractedUserFacts {
  haqId?: string;
  rawStatement: string;
  applicantName: string;
  cnic: string;
  city: string;
  address?: string;
  institutionOrRespondent: string;
  dateOfIncident: string;
  referenceOrRollNo: string;
  contactPhone: string;
  contactEmail: string;
}

export interface GeneratedComplaint {
  subject: string;
  recipientTitle: string;
  recipientAuthority: AuthorityInfo;
  date: string;
  bodyText: string;
  emailSubject: string;
  emailBody: string;
  categoryId: LegalCategoryId;
  facts: ExtractedUserFacts;
}

export interface AgentWorkflowStep {
  stepNumber: number;
  title: string;
  status: "completed" | "action_required";
  summary: string;
}

export interface ChatTurn {
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

export interface HaqAIAnalysisResult {
  caseId: string;
  haqId: string;
  citizenProfile?: CitizenProfile;
  timestamp: string;
  channel: "website" | "whatsapp";
  language: SupportedLanguage;
  /** e.g. "gemini:gemini-flash-latest" or "groq:llama-3.3-70b-versatile" */
  aiEngineUsed: string;
  userQuery: string;
  categoryId: LegalCategoryId;
  categoryTitle: string;
  replyText: string;
  whatsappReplyText: string;
  voiceSummaryText: string;
  constitutionalRights: {
    article: string;
    title: string;
    summary: string;
  }[];
  statutoryLaws: {
    law: string;
    section: string;
    explanation: string;
  }[];
  nextSteps: string[];
  followUpQuestions: string[];
  recommendedAuthorities: AuthorityInfo[];
  primaryAuthority: AuthorityInfo;
  generatedComplaint: GeneratedComplaint;
  workflowSteps: AgentWorkflowStep[];
  chatHistory: ChatTurn[];
  status?: "Open" | "Dispatched" | "Resolved" | "Under Review";
}

export function extractFactsFromText(
  text: string,
  existing?: Partial<ExtractedUserFacts>,
  profile?: CitizenProfile | null
): ExtractedUserFacts {
  const cnicMatch = text.match(/\b\d{5}-\d{7}-\d{1}\b/);
  const phoneMatch = text.match(/\b(?:03\d{2}-?\d{7}|\+923\d{9})\b/);
  const city = existing?.city || profile?.city || "";

  return {
    haqId: profile?.haqId || existing?.haqId || "",
    rawStatement: text.trim(),
    applicantName: existing?.applicantName || profile?.fullName || "",
    cnic: cnicMatch ? cnicMatch[0] : existing?.cnic || profile?.cnic || "",
    city,
    address: existing?.address || profile?.address || city,
    institutionOrRespondent: existing?.institutionOrRespondent || "",
    dateOfIncident:
      existing?.dateOfIncident || new Date().toISOString().split("T")[0],
    referenceOrRollNo: existing?.referenceOrRollNo || "",
    contactPhone: phoneMatch
      ? phoneMatch[0]
      : existing?.contactPhone || profile?.phone || "",
    contactEmail: existing?.contactEmail || profile?.email || "",
  };
}

export function buildFormalComplaint(
  entry: LegalKnowledgeEntry,
  facts: ExtractedUserFacts,
  customAuthority?: AuthorityInfo,
  customLegalParagraph?: string,
  customReliefParagraph?: string,
  customSubject?: string
): GeneratedComplaint {
  const primaryAuthority = customAuthority || entry.authorities[0];
  const todayFormatted = new Date().toLocaleDateString("en-PK", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const subject =
    customSubject ||
    `${entry.complaintTemplate.subjectPrefix}${
      facts.institutionOrRespondent
        ? ` – Regarding ${facts.institutionOrRespondent}`
        : ""
    }`;
  const legalCit =
    customLegalParagraph || entry.complaintTemplate.legalCitationParagraph;
  const reliefCit =
    customReliefParagraph || entry.complaintTemplate.requestedReliefParagraph;

  const applicantName = facts.applicantName || "___________________________";
  const cnic = facts.cnic || "_____-_______-_";
  const cityOrAddress = facts.address || facts.city || "___________________________";
  const cityOnly = facts.city || "Pakistan";
  const phone = facts.contactPhone || "___________________________";
  const email = facts.contactEmail || "___________________________";
  const respondent =
    facts.institutionOrRespondent || "The Concerned Department / Respondent";
  const statementText =
    facts.rawStatement && facts.rawStatement.trim()
      ? facts.rawStatement.trim()
      : "The applicant is aggrieved by the unlawful action/inaction of the respondent and seeks immediate statutory redressal in accordance with law.";

  const bodyText = `BEFORE THE COMPETENT AUTHORITY
${primaryAuthority.name.toUpperCase()}

To,
The Worthy Head of Institution / Grievance Redressal Authority,
${primaryAuthority.name},
${primaryAuthority.address || cityOnly}.

Date: ${todayFormatted}

IN THE MATTER OF:
${applicantName} (Holder of CNIC No. ${cnic}),
Resident of ${cityOrAddress}.
                                                        ... APPLICANT / COMPLAINANT
VERSUS
${respondent}${
    facts.referenceOrRollNo
      ? ` (Reference / Roll / Account No.: ${facts.referenceOrRollNo})`
      : ""
  }
                                                        ... RESPONDENT(S)

SUBJECT: ${subject.toUpperCase()}

Respected Sir / Madam,

MOST RESPECTFULLY SHEWETH:

1. That the undersigned applicant is a law-abiding citizen of Pakistan holding CNIC No. ${cnic}, residing at ${cityOrAddress}, and is directly aggrieved by the matter stated herein.

2. STATEMENT OF FACTS & GRIEVANCE:
   That on or around ${facts.dateOfIncident}, the following grievance arose involving ${respondent}:
   "${statementText}"${
    facts.referenceOrRollNo
      ? `\n   Relevant Reference / Registration / Account No.: ${facts.referenceOrRollNo}.`
      : ""
  }

3. APPLICABLE CONSTITUTIONAL & STATUTORY LEGAL GROUNDS:
   ${legalCit}

4. That the applicant has approached the concerned quarters for redressal; however, the grievance remains unresolved to date, leaving the applicant with no other efficacious remedy except to invoke the lawful jurisdiction of this Honourable Authority.

5. PRAYER / RELIEF SOUGHT:
   ${reliefCit}

   It is, therefore, most respectfully prayed that this Honourable Authority may graciously be pleased to take immediate cognizance of this application, direct an impartial inquiry into the matter, and grant the relief prayed for above in accordance with law and principles of natural justice.

Yours obediently,


Signature: ___________________________
Full Name: ${applicantName}
CNIC No.: ${cnic}
Residential Address: ${cityOrAddress}
Contact Phone: ${phone}
Email Address: ${email}

VERIFICATION:
Verified at ${cityOnly} on this ${todayFormatted} that the contents of the above application are true and correct to the best of my knowledge and belief, and nothing material has been concealed therefrom.

Deponent / Applicant: ___________________________

ENCLOSURES:
1. Attested / Clear Copy of Applicant's CNIC (${cnic})
2. Copies of Relevant Supporting Documents / Receipts / Evidence`;

  const emailBody = `Respected Sir / Madam,
${primaryAuthority.name},

Please find below my formal written application submitted for urgent legal and administrative redressal:

====================================================================
${bodyText}
====================================================================`;

  return {
    subject,
    recipientTitle: primaryAuthority.name,
    recipientAuthority: primaryAuthority,
    date: todayFormatted,
    bodyText,
    emailSubject: `Formal Application: ${subject}`,
    emailBody,
    categoryId: entry.id,
    facts,
  };
}

/** Verified directory of Pakistani complaint authorities (official URLs / helplines). */
function getAuthorityDirectory(): AuthorityInfo[] {
  const map = new Map<string, AuthorityInfo>();
  for (const cat of ALL_LEGAL_CATEGORIES) {
    for (const a of cat.authorities) {
      if (!map.has(a.id)) map.set(a.id, a);
    }
  }
  return Array.from(map.values());
}

const LANGUAGE_INSTRUCTIONS: Record<SupportedLanguage, string> = {
  ur: "Urdu written in Urdu script (اردو)",
  pa: "Punjabi in Shahmukhi script, or simple Urdu script if unsure",
  roman_ur: "Roman Urdu (Urdu written with English letters, e.g. 'Aap ka qanooni haq ye hai...')",
  en: "simple, clear English",
};

const CONSTITUTION_REF = CONSTITUTION_OF_PAKISTAN_1973.map(
  (c) => `- ${c.article} (${c.title}): ${c.textSummary}`
).join("\n");

const LAWS_REF = PAKISTAN_LAWS_CORPUS.map(
  (l) => `- ${l.lawName} [${l.keySections}]: ${l.description}`
).join("\n");

const SYSTEM_PROMPT = `You are HaqAI, an expert Pakistani legal-rights assistant for ordinary citizens of Pakistan.

Your job: answer the citizen's EXACT question accurately under the law of Pakistan, in plain language they can act on.

Accuracy rules (most important):
- Answer the specific question asked. Never give a generic answer about a different topic.
- Cite ONLY Pakistani law (1973 Constitution of Pakistan, PPC 1860, CrPC 1898, CPC 1908, Qanun-e-Shahadat 1984, Muslim Family Laws Ordinance 1961, Family Courts Act 1964, Dissolution of Muslim Marriages Act 1939, Guardians and Wards Act 1890, Transfer of Property Act 1882, Specific Relief Act 1877, Illegal Dispossession Act 2005, Enforcement of Women's Property Rights Act 2020, PECA 2016, Protection against Harassment of Women at the Workplace Act 2010, Payment of Wages Act 1936, Consumer Protection Acts, provincial Rent laws, Police Order 2002, Wafaqi Mohtasib Order 1983, Right of Access to Information Act 2017).
- NEVER cite Indian law (for example, in Pakistan cheque dishonour is Section 489-F PPC & Order 37 CPC, NOT Section 138 NI Act; FIR registration is Section 154 CrPC & Justice of Peace petition is Section 22-A/22-B CrPC).
- If you are not certain of an exact section number, name the law without inventing a section number. Never fabricate laws, sections, case names, punishments or deadlines.
- Mention provincial differences when they matter (Punjab, Sindh, KP, Balochistan, ICT).
- Give practical next steps: which office/court to go to, what documents to bring, time limits, helplines.
- For the authority, prefer an entry from the VERIFIED AUTHORITY DIRECTORY (return its id). Only if none fits, describe the correct real authority yourself.

VERIFIED CONSTITUTION OF PAKISTAN (1973) REFERENCE:
${CONSTITUTION_REF}

VERIFIED PAKISTAN STATUTES REFERENCE:
${LAWS_REF}

Always reply with a single valid JSON object and nothing else.`;

/**
 * Live AI analysis. Every answer is produced by the LLM (Gemini, with Groq as an
 * optional free fallback). Throws LLMUnavailableError if no model can answer, so
 * the UI shows a real error instead of a canned response.
 */
export async function generateHaqAIAnalysisAsync(params: {
  query: string;
  language?: SupportedLanguage;
  channel?: "website" | "whatsapp";
  existingCaseId?: string;
  factOverrides?: Partial<ExtractedUserFacts>;
  citizenProfile?: CitizenProfile | null;
  previousChatHistory?: ChatTurn[];
}): Promise<HaqAIAnalysisResult> {
  const channel = params.channel || "website";
  const lang = detectLanguageFromInput(params.query, params.language);
  const langInstruction = LANGUAGE_INSTRUCTIONS[lang];
  const directory = getAuthorityDirectory();
  const categoryIds = ALL_LEGAL_CATEGORIES.map((c) => c.id);

  const history = (params.previousChatHistory || []).slice(-6);
  const historyBlock = history.length
    ? `PREVIOUS CONVERSATION (for context of follow-up questions):\n${history
        .map((t) => `${t.role === "user" ? "CITIZEN" : "HAQAI"}: ${t.content.slice(0, 1500)}`)
        .join("\n")}\n`
    : "";

  const profileBlock = params.citizenProfile
    ? `CITIZEN LOCATION: ${params.citizenProfile.city || "unknown"}, ${params.citizenProfile.province || "unknown"}`
    : "CITIZEN LOCATION: unknown";

  const directoryBlock = directory
    .map((a) => `- id="${a.id}" | ${a.name} | helpline ${a.helpline} | ${a.portalUrl}`)
    .join("\n");

  const prompt = `${historyBlock}${profileBlock}

CITIZEN'S QUESTION:
"""${params.query}"""

RESPONSE LANGUAGE: Write every human-readable field in ${langInstruction}. Law names and section numbers may stay in English.
${
  lang === "en"
    ? 'Write "voiceSummaryText" in English.'
    : 'Write "voiceSummaryText" in Urdu script (اردو) ONLY – no English letters, no markdown, numbers written as words – because it is read aloud by an Urdu text-to-speech voice.'
}

VERIFIED AUTHORITY DIRECTORY:
${directoryBlock}

Return JSON with exactly these keys:
{
  "categoryId": one of ${JSON.stringify(categoryIds)},
  "categoryTitle": "short title of the legal topic",
  "replyText": "complete, direct answer to the question (markdown allowed: short paragraphs, bullet points, bold for key laws). Start with the direct answer in 1-2 sentences, then explain the law, remedies/punishments, and what to do.",
  "voiceSummaryText": "3-4 short spoken sentences summarising the answer",
  "constitutionalRights": [{"article": "Article N", "title": "...", "summary": "how it applies here"}],
  "statutoryLaws": [{"law": "exact law name", "section": "section number(s) or empty string if unsure", "explanation": "how it applies here"}],
  "nextSteps": ["concrete step 1", "concrete step 2", "..."],
  "followUpQuestions": ["one useful clarifying question, if any"],
  "authorityId": "id from the directory, or empty string",
  "customAuthority": {"name": "", "shortName": "", "role": "", "portalUrl": "", "email": "", "helpline": "", "address": "", "turnaroundTime": ""},
  "complaintSubject": "formal subject line for a complaint about this issue",
  "legalCitationParagraph": "formal paragraph citing the relevant Articles and sections",
  "requestedReliefParagraph": "formal paragraph with the specific relief requested",
  "respondent": "person/department the complaint is against, if mentioned, else empty string"
}`;

  const llm = await generateText({
    systemPrompt: SYSTEM_PROMPT,
    prompt,
    json: true,
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const parsed = parseJsonObject<Record<string, any>>(llm.text);
  if (!parsed || typeof parsed.replyText !== "string") {
    throw new Error("AI returned an unreadable response. Please try again.");
  }

  const categoryId: LegalCategoryId = categoryIds.includes(parsed.categoryId)
    ? parsed.categoryId
    : "government";
  const entry = LEGAL_KNOWLEDGE_BASE[categoryId];

  const directoryMatch = directory.find((a) => a.id === parsed.authorityId);
  const custom = parsed.customAuthority || {};
  const primaryAuthority: AuthorityInfo =
    directoryMatch ||
    (custom.name
      ? {
          id: "ai-suggested",
          name: String(custom.name),
          shortName: String(custom.shortName || custom.name),
          role: String(custom.role || ""),
          portalUrl: String(custom.portalUrl || ""),
          email: String(custom.email || ""),
          helpline: String(custom.helpline || ""),
          address: String(custom.address || ""),
          turnaroundTime: String(custom.turnaroundTime || ""),
          instructions: entry.authorities[0].instructions,
        }
      : entry.authorities[0]);

  const caseId =
    params.existingCaseId ||
    `HAQ-${Math.floor(100000 + Math.random() * 900000)}`;
  const haqId =
    params.citizenProfile?.haqId || params.factOverrides?.haqId || "";

  const facts = extractFactsFromText(params.query, params.factOverrides, params.citizenProfile);
  if (!facts.institutionOrRespondent && parsed.respondent) {
    facts.institutionOrRespondent = String(parsed.respondent);
  }

  const generatedComplaint = buildFormalComplaint(
    entry,
    facts,
    primaryAuthority,
    parsed.legalCitationParagraph,
    parsed.requestedReliefParagraph,
    parsed.complaintSubject
  );

  const asArray = <T,>(v: unknown): T[] => (Array.isArray(v) ? (v as T[]) : []);
  const constitutionalRights = asArray<{ article: string; title: string; summary: string }>(
    parsed.constitutionalRights
  );
  const statutoryLaws = asArray<{ law: string; section: string; explanation: string }>(
    parsed.statutoryLaws
  );
  const nextSteps = asArray<string>(parsed.nextSteps).map(String);
  const followUpQuestions = asArray<string>(parsed.followUpQuestions).map(String);
  const categoryTitle = String(parsed.categoryTitle || entry.title[lang]);
  const replyText = parsed.replyText.trim();
  const voiceSummaryText = String(parsed.voiceSummaryText || "").trim();

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const whatsappReplyText =
    `🇵🇰 *HaqAI – Legal Rights Assistant*\n\n` +
    `📌 *${categoryTitle}*\n\n` +
    `${replyText.replace(/\*\*/g, "*").slice(0, 2500)}\n\n` +
    (primaryAuthority.helpline
      ? `🏛️ *${primaryAuthority.name}* – Helpline: ${primaryAuthority.helpline}\n\n`
      : "") +
    `1️⃣ *Online Complaint (edit & send):*\n${appUrl}/complaint?caseId=${caseId}\n\n` +
    `2️⃣ *Full Guidance & Voice:*\n${appUrl}/assistant?caseId=${caseId}`;

  const workflowSteps: AgentWorkflowStep[] = [
    { stepNumber: 1, title: "Understand Input", status: "completed", summary: `${channel} query (${lang})` },
    { stepNumber: 2, title: "AI Legal Analysis", status: "completed", summary: `${llm.provider}:${llm.model}` },
    { stepNumber: 3, title: "Laws Identified", status: "completed", summary: `${constitutionalRights.length} Articles, ${statutoryLaws.length} statutes` },
    { stepNumber: 4, title: "Authority Found", status: "completed", summary: primaryAuthority.shortName },
    { stepNumber: 5, title: "Complaint Drafted", status: "completed", summary: generatedComplaint.subject },
    { stepNumber: 6, title: "Citizen Approval", status: "action_required", summary: "Awaiting review & 1-click dispatch" },
  ];

  const now = new Date().toISOString();
  const chatHistory: ChatTurn[] = [
    ...(params.previousChatHistory || []),
    { role: "user", content: params.query, timestamp: now },
    { role: "assistant", content: replyText, timestamp: now },
  ];

  return {
    caseId,
    haqId,
    citizenProfile: params.citizenProfile || undefined,
    timestamp: now,
    channel,
    language: lang,
    aiEngineUsed: `${llm.provider}:${llm.model}`,
    userQuery: params.query,
    categoryId,
    categoryTitle,
    replyText,
    whatsappReplyText,
    voiceSummaryText,
    constitutionalRights,
    statutoryLaws,
    nextSteps,
    followUpQuestions,
    recommendedAuthorities: [
      primaryAuthority,
      ...entry.authorities.filter((a) => a.id !== primaryAuthority.id),
    ],
    primaryAuthority,
    generatedComplaint,
    workflowSteps,
    chatHistory,
    status: "Open",
  };
}
