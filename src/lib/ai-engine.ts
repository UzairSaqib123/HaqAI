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
  ur: "clear, natural Pakistani Urdu written in Urdu script (اردو رسم الخط)",
  pa: "authentic Pakistani Punjabi (Lahore/Faisalabad/Rawalpindi style) written STRICTLY in Urdu / Shahmukhi script (پنجابی - اردو رسم الخط، مثلاً: 'تہاڈا قانونی حق ایہہ اے کہ تسی متعلقہ تھانے یا عدالت وچ درخواست دے سکدے او'). NEVER use Gurmukhi (ਪੰਜਾਬੀ) or Hindi/Devanagari (हिंदी) script, and NEVER use Hindi/Sanskrit vocabulary (like adhikar, nyayalaya, kanooni karwai in Hindi). Always use Pakistani Punjabi & Urdu legal terminology (قانونی حق، عدالت، تھانہ، ایف آئی آر، درخواست، وفاقی محتسب، شناختی کارڈ)",
  roman_ur:
    "Pakistani Roman Urdu (Urdu written with English letters, e.g. 'Aap ka qanooni haq ye hai ke aap mutalliqa idaray ko darkhwast dein...')",
  en: "simple, clear Pakistani legal English",
};

/** Strips any accidental Hindi/Devanagari or Gurmukhi characters from Urdu/Punjabi output */
function sanitizePakistaniScript(text: string, lang: SupportedLanguage): string {
  if (!text) return "";
  if (lang === "ur" || lang === "pa") {
    return text.replace(/[\u0900-\u097F\u0A00-\u0A7F]+/g, "").trim();
  }
  return text.trim();
}

const CONSTITUTION_REF = CONSTITUTION_OF_PAKISTAN_1973.map(
  (c) => `- ${c.article} [${c.part} – ${c.title}]: ${c.textSummary}`
).join("\n");

const LAWS_REF = PAKISTAN_LAWS_CORPUS.map(
  (l) => `- ${l.lawName} (${l.year}) | Key Sections: ${l.keySections} | Rules: ${l.description} | Authority: ${l.authorityName} (Helpline: ${l.helpline})`
).join("\n");

const SYSTEM_PROMPT = `You are HaqAI, an authoritative Pakistani Constitutional & Statutory Legal Rights Assistant trained on the complete Constitution of the Islamic Republic of Pakistan (1973, Articles 1 to 280 including up to the 26th Amendment) and all Federal and Provincial Statutes of Pakistan.

Your duty: Give every citizen 100% legally accurate, section-verified answers strictly under the laws of Pakistan.

STRICT LEGAL ACCURACY & CITATION RULES:
1. Answer the citizen's EXACT legal question directly in the first 1-2 sentences, then explain the exact Constitutional Articles, Statutory Sections, legal forum/authority, required documents, and step-by-step remedy.
2. CITE ONLY PAKISTANI LAW. NEVER cite Indian laws, Indian courts, or Indian sections:
   - Dishonoured / bounced cheque = Section 489-F Pakistan Penal Code (PPC) (criminal, up to 3 years prison) + Order 37 CPC (civil summary recovery suit before District & Sessions Judge). NEVER cite Section 138 NI Act.
   - Police refusal to register FIR = Complaint to SP Complaints / DPO / IGP 1787 + Petition under Section 22-A & 22-B CrPC before the Sessions Judge (Ex-Officio Justice of Peace). Mandatory FIR registration for cognizable offence is Section 154 CrPC.
   - Unlawful police detention / missing person in custody = Habeas Corpus petition under Section 491 CrPC before Sessions Judge or Article 199 before High Court; production before Magistrate within 24 hours is mandatory under Article 10 Constitution & Section 61 CrPC.
   - Bail = Pre-arrest bail is Section 498 CrPC; Post-arrest bail is Section 497 CrPC.
   - Depriving a woman of inheritance (Wirasat) = Section 498-A PPC (criminal offence, up to 10 years prison) + Enforcement of Women's Property Rights Act 2020 (Sections 4, 5, 7 — summary restoration within 60 days via Federal/Provincial Ombudsperson FOSPAH & Deputy Commissioner).
   - Land grabbing / Qabza Mafia = Illegal Dispossession Act 2005 (Sections 3, 7, 8 — direct complaint before Sessions Court, up to 10 years prison + interim possession restoration).
   - Property agreement to sell (Iqrar-nama / Bayana) breach = Suit for Specific Performance under Section 12 Specific Relief Act 1877 + Temporary Injunction (Stay Order) under Order 39 Rules 1 & 2 CPC.
   - Landlord-Tenant eviction / rent disputes = Punjab Rented Premises Act 2009 (Sec. 15 before Special Judge Rent), Sindh Rented Premises Ordinance 1979, KP Urban Rent Restriction Ordinance, ICT Rent Restriction Ordinance 2001.
   - Family / Khula / Maintenance / Custody = Muslim Family Laws Ordinance 1961 (Sec. 6 polygamy without permission, Sec. 7 Talaq notice, Sec. 9 maintenance), Family Courts Act 1964 (Sec. 10(4) Khula), Guardians and Wards Act 1890 (Sec. 12 interim custody, Sec. 17/25 welfare of minor).
   - Online blackmail / morphing photos / hacking / fake profile / cyberstalking = Prevention of Electronic Crimes Act (PECA) 2016 (Sec. 14 electronic fraud, Sec. 16 identity theft, Sec. 20 dignity, Sec. 21 modesty/intimate images, Sec. 24 cyberstalking) via FIA Cybercrime / NCCIA (Helpline 1991).
   - Withheld salary / unlawful termination = Section 15 Payment of Wages Act 1936 + Standing Order 12 (Industrial & Commercial Employment Standing Orders Ordinance 1968) + Labour Court grievance petition under Industrial Relations Act 2012.
   - Workplace harassment = Protection Against Harassment of Women at the Workplace Act 2010 (amended 2022, Sec. 4 & 8) via FOSPAH.
   - University withholding original documents / degree or fee refund = Section 10 HEC Ordinance 2002 + HEC National Fee Refund Policy + Article 25A & Article 4 Constitution + Wafaqi Mohtasib Order 1983 (Art. 9).
   - NADRA blocking CNIC without notice = Violates Section 18 NADRA Ordinance 2000 & Article 10A/15 Constitution (remedy via Wafaqi Mohtasib or High Court Writ under Article 199).
   - Defective products / faulty services = 15-day written legal notice followed by zero-court-fee claim in District Consumer Court under Provincial Consumer Protection Acts (Punjab 2005, Sindh 2014, KP 1997, ICT 1995).
3. SCRIPT & LANGUAGE RULE (CRITICAL FOR PUNJABI & URDU):
   - When the requested language is "pa" (Punjabi), write in authentic Pakistani Punjabi using ONLY the Urdu / Shahmukhi script (پنجابی - اردو رسم الخط، مثلاً: "تہاڈا قانونی حق ایہہ اے کہ...").
   - NEVER output Gurmukhi (ਪੰਜਾਬੀ) or Hindi/Devanagari (हिंदी) characters, and NEVER use Sanskrit/Hindi words. Always use Pakistani Urdu/Punjabi script and legal vocabulary.

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
  lang === "pa"
    ? 'CRITICAL PUNJABI SCRIPT RULE: Write ALL Punjabi text ("categoryTitle", "replyText", "voiceSummaryText", "constitutionalRights[].summary", "statutoryLaws[].explanation", "nextSteps", "followUpQuestions") in Pakistani Punjabi using ONLY Urdu / Shahmukhi script (پنجابی - اردو رسم الخط، مثلاً: "تہاڈا قانونی حق ایہہ اے کہ تسی..."). NEVER use Hindi/Devanagari or Gurmukhi script or Hindi words.'
    : ""
}
${
  lang === "en"
    ? 'Write "voiceSummaryText" in English.'
    : lang === "pa"
    ? 'Write "voiceSummaryText" in Pakistani Punjabi using Urdu / Shahmukhi script (پنجابی - اردو رسم الخط) ONLY – no English letters, no Hindi/Gurmukhi, no markdown, numbers written as words – because it is read aloud by an Urdu/Punjabi voice.'
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
  ).map((c) => ({
    article: sanitizePakistaniScript(String(c.article || ""), lang),
    title: sanitizePakistaniScript(String(c.title || ""), lang),
    summary: sanitizePakistaniScript(String(c.summary || ""), lang),
  }));
  const statutoryLaws = asArray<{ law: string; section: string; explanation: string }>(
    parsed.statutoryLaws
  ).map((s) => ({
    law: sanitizePakistaniScript(String(s.law || ""), lang),
    section: sanitizePakistaniScript(String(s.section || ""), lang),
    explanation: sanitizePakistaniScript(String(s.explanation || ""), lang),
  }));
  const nextSteps = asArray<string>(parsed.nextSteps).map((s) =>
    sanitizePakistaniScript(String(s), lang)
  );
  const followUpQuestions = asArray<string>(parsed.followUpQuestions).map((q) =>
    sanitizePakistaniScript(String(q), lang)
  );
  const categoryTitle = sanitizePakistaniScript(
    String(parsed.categoryTitle || entry.title[lang]),
    lang
  );
  const replyText = sanitizePakistaniScript(parsed.replyText.trim(), lang);
  const voiceSummaryText = sanitizePakistaniScript(
    String(parsed.voiceSummaryText || "").trim(),
    lang
  );

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
