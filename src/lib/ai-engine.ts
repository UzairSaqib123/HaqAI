import { GoogleGenerativeAI } from "@google/generative-ai";
import {
  AuthorityInfo,
  classifyLegalIssue,
  detectLanguageFromInput,
  LegalCategoryId,
  LegalKnowledgeEntry,
  SupportedLanguage,
} from "./legal-knowledge";
import {
  CONSTITUTION_OF_PAKISTAN_1973,
  PAKISTAN_LAWS_CORPUS,
} from "./pakistan-constitution-laws";
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
  aiEngineUsed: "gemini-live" | "verified-pakistan-rag";
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
  const cities = [
    "Islamabad",
    "Lahore",
    "Karachi",
    "Rawalpindi",
    "Peshawar",
    "Quetta",
    "Faisalabad",
    "Multan",
    "Sialkot",
    "Gujranwala",
    "Hyderabad",
    "Abbottabad",
    "Bahawalpur",
    "Sargodha",
  ];

  let detectedCity = existing?.city || profile?.city || "";
  if (!detectedCity) {
    for (const c of cities) {
      if (text.toLowerCase().includes(c.toLowerCase())) {
        detectedCity = c;
        break;
      }
    }
  }

  let institution = existing?.institutionOrRespondent || "";
  if (!institution) {
    const uniMatch = text.match(
      /([A-Z][a-zA-Z]+\s+(?:University|College|Institute|Police|Hospital|Bank|Company|Authority|Board|Court|Office))/
    );
    if (uniMatch && uniMatch[1]) {
      institution = uniMatch[1];
    } else if (
      text.toLowerCase().includes("university") ||
      text.includes("یونیورسٹی")
    ) {
      institution = "Concerned University / Degree Awarding Institute";
    } else if (text.toLowerCase().includes("nadra") || text.includes("نادرا")) {
      institution = "NADRA Regional Office";
    } else if (
      text.toLowerCase().includes("police") ||
      text.toLowerCase().includes("thana") ||
      text.includes("پولیس") ||
      text.includes("تھانہ")
    ) {
      institution = "Concerned Police Station (Thana) & District Police";
    } else {
      institution = "Concerned Department / Respondent";
    }
  }

  const cnicMatch = text.match(/\b\d{5}-\d{7}-\d{1}\b/);
  const phoneMatch = text.match(/\b(?:03\d{2}-?\d{7}|\+923\d{9})\b/);

  return {
    haqId: profile?.haqId || existing?.haqId || "",
    rawStatement: text.trim(),
    applicantName: existing?.applicantName || profile?.fullName || "",
    cnic: cnicMatch ? cnicMatch[0] : existing?.cnic || profile?.cnic || "",
    city: detectedCity,
    address: existing?.address || profile?.address || detectedCity,
    institutionOrRespondent: institution,
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

  const applicantName = facts.applicantName || "[Applicant Full Name]";
  const cnic = facts.cnic || "[CNIC Number]";
  const cityOrAddress = facts.address || facts.city || "[City / Address]";
  const phone = facts.contactPhone || "[Mobile Number]";
  const email = facts.contactEmail || "[Email Address]";
  const haqIdLabel = facts.haqId || "Unregistered";

  const bodyText = `To,
The Competent Authority / Grievance Redressal Cell,
${primaryAuthority.name}
Official Portal: ${primaryAuthority.portalUrl}
Date: ${todayFormatted}
HaqAI Citizen ID: ${haqIdLabel}

SUBJECT: ${subject.toUpperCase()}

Respected Sir / Madam,

I, ${applicantName} (holding CNIC No. ${cnic}, resident of ${cityOrAddress}), respectfully submit this formal complaint and state the facts strictly as follows:

1. STATEMENT OF GRIEVANCE & FACTS:
   - Aggrieved Citizen Statement: "${facts.rawStatement}"
   - Concerned Institution / Respondent: ${facts.institutionOrRespondent}
   - City / Jurisdiction: ${facts.city || cityOrAddress}${
     facts.referenceOrRollNo
       ? `\n   - Reference / Roll No.: ${facts.referenceOrRollNo}`
       : ""
   }
   - Date: ${facts.dateOfIncident}

2. APPLICABLE CONSTITUTIONAL & STATUTORY LEGAL PROVISIONS (PAKISTAN):
   ${legalCit}

3. PRAYER / REQUESTED RELIEF:
   ${reliefCit}

I affirm that the facts stated above are true and accurate to the best of my knowledge. Copies of my CNIC (${cnic}) and relevant supporting documents are attached herewith.

Yours faithfully,

Signature: ___________________________
Full Name: ${applicantName}
HaqAI Citizen ID: ${haqIdLabel}
CNIC No.: ${cnic}
Address / City: ${cityOrAddress}
Contact Phone: ${phone}
Email: ${email}`;

  const emailBody = `Dear Grievance Redressal Officer (${primaryAuthority.shortName}),

Please find below the formal citizen complaint submitted by ${applicantName} (HaqAI ID: ${haqIdLabel}, CNIC: ${cnic}) for urgent statutory action:

--------------------------------------------------
${bodyText}
--------------------------------------------------`;

  return {
    subject,
    recipientTitle: primaryAuthority.name,
    recipientAuthority: primaryAuthority,
    date: todayFormatted,
    bodyText,
    emailSubject: `[Formal Citizen Complaint${
      facts.haqId ? ` - ${facts.haqId}` : ""
    }] ${subject}`,
    emailBody,
    categoryId: entry.id,
    facts,
  };
}

function extractJsonObject(raw: string): Record<string, unknown> | null {
  try {
    return JSON.parse(raw);
  } catch {
    const start = raw.indexOf("{");
    const end = raw.lastIndexOf("}");
    if (start !== -1 && end !== -1 && end > start) {
      try {
        return JSON.parse(raw.slice(start, end + 1));
      } catch {
        return null;
      }
    }
    return null;
  }
}

/**
 * Dynamic Live AI Analysis Engine:
 * 1. Uses Google Gemini when GEMINI_API_KEY is configured.
 * 2. Automatically uses Live OpenAI-compatible LLM (text.pollinations.ai) when GEMINI_API_KEY is not set,
 *    ensuring 100% dynamic, real-time AI answers for ANY Urdu, Roman Urdu, Punjabi, or English question.
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
  const baseResult = generateHaqAIAnalysis(params);

  const constitutionContext = CONSTITUTION_OF_PAKISTAN_1973.map(
    (c) => `${c.article} (${c.title}): ${c.textSummary}`
  ).join("\n");

  const lawsContext = PAKISTAN_LAWS_CORPUS.map(
    (l) =>
      `${l.lawName} [${l.domain}] (${l.keySections}): ${l.description} | Authority: ${l.authorityName} (${l.portalUrl}, Helpline: ${l.helpline}, Email: ${l.email})`
  ).join("\n");

  const profileContext = params.citizenProfile
    ? `Logged-in Citizen Profile:
- HaqAI Citizen ID: ${params.citizenProfile.haqId}
- Full Name: ${params.citizenProfile.fullName}
- CNIC: ${params.citizenProfile.cnic}
- Phone/WhatsApp: ${params.citizenProfile.phone}
- Email: ${params.citizenProfile.email}
- City/Province: ${params.citizenProfile.city}, ${params.citizenProfile.province}
- Address: ${params.citizenProfile.address}`
    : "Citizen has not provided profile details yet.";

  const historyContext =
    params.previousChatHistory && params.previousChatHistory.length > 0
      ? `Previous Conversation Turns:\n` +
        params.previousChatHistory
          .map((t) => `${t.role.toUpperCase()}: ${t.content}`)
          .join("\n")
      : "";

  const langInstruction =
    baseResult.language === "ur"
      ? "Pure Pakistani Urdu script (اردو حروف تہجی)"
      : baseResult.language === "pa"
      ? "Pakistani Punjabi / Urdu script (شاہ مکھی پنجابی / اردو)"
      : baseResult.language === "roman_ur"
      ? "Easy Roman Urdu (written in English alphabet, e.g., Aap ka qanooni haq...)"
      : "Clear English";

  const prompt = `You are HaqAI (حق اے آئی), Pakistan's authoritative AI Legal Rights & Complaint Assistant.
You know the ENTIRE Constitution of the Islamic Republic of Pakistan (1973) and ALL Pakistani Statutory Laws (Pakistan Penal Code PPC, Code of Criminal Procedure CrPC, Civil Procedure Code CPC, Muslim Family Laws Ordinance 1961, Family Courts Act 1964, Guardians & Wards Act 1890, Property/Inheritance/Rent Laws, Illegal Dispossession Act 2005, PECA Cybercrime Act 2016, HEC Ordinance 2002, Wafaqi Mohtasib Order 1983, Consumer Protection Acts, Labour/Employment Laws, Banking/Tax/FBR Laws, NADRA/Passport Laws, Motor Vehicles Ordinance, Human Rights Laws).

CRITICAL RULES:
1. Directly and specifically answer the citizen's exact question ("${params.query}") under Pakistani law. Do NOT give a generic answer.
2. NEVER invent fake articles or fake laws. Cite real Articles of the 1973 Constitution of Pakistan and real sections of Pakistani statutes.
3. Write "categoryTitle", "replyText", "constitutionalRights", "statutoryLaws", and "nextSteps" in ${langInstruction}.
4. IMPORTANT FOR VOICE ("voiceSummaryText"): If the user language is 'ur', 'roman_ur', or 'pa', you MUST write "voiceSummaryText" in pure URDU SCRIPT (اردو حروف تہجی، مثلاً: السلام علیکم! پاکستانی قانون کے مطابق...) so our Urdu voice engine speaks it clearly in natural Urdu.

${profileContext}

REFERENCE CONSTITUTION OF PAKISTAN (1973):
${constitutionContext}

REFERENCE PAKISTAN STATUTORY LAWS:
${lawsContext}

${historyContext}

CITIZEN CURRENT QUESTION / PROBLEM:
"${params.query}"

Return ONLY a valid JSON object matching this exact structure:
{
  "categoryTitle": "Specific legal topic title in ${langInstruction}",
  "replyText": "Detailed, direct, helpful answer to the citizen's exact question in ${langInstruction}, citing exact Pakistani laws, punishments/remedies, and practical steps",
  "voiceSummaryText": "3-4 sentence spoken summary (MUST be in pure Urdu script اردو if language is ur, roman_ur, or pa)",
  "constitutionalRights": [
    { "article": "Article X – Constitution of Pakistan 1973", "title": "Title of Article", "summary": "How this Article protects the citizen in ${langInstruction}" }
  ],
  "statutoryLaws": [
    { "law": "Exact Name of Pakistani Act / Ordinance / PPC / CrPC", "section": "Exact Section(s)", "explanation": "Clear explanation in ${langInstruction}" }
  ],
  "nextSteps": [
    "Step 1 practical legal action in ${langInstruction}",
    "Step 2 practical legal action in ${langInstruction}",
    "Step 3 practical legal action in ${langInstruction}"
  ],
  "followUpQuestions": [
    "1 short follow-up question in ${langInstruction}"
  ],
  "primaryAuthority": {
    "id": "authority_slug",
    "name": "Full Official Name of Pakistani Government Institution / Ombudsman / Court / Helpline",
    "shortName": "Short Name",
    "role": "Official statutory role",
    "portalUrl": "Verified official https://... gov.pk URL",
    "email": "Official complaint email",
    "helpline": "Official helpline number (e.g. 1099, 1055, 1787, 1991, etc.)",
    "address": "Official office address in Pakistan",
    "turnaroundTime": "Expected statutory resolution timeframe"
  },
  "complaintSubject": "Formal legal subject line tailored to the citizen's exact grievance",
  "legalCitationParagraph": "Formal paragraph citing the exact Constitutional Articles and Pakistani statutory sections violated in this case",
  "requestedReliefParagraph": "Formal prayer/relief paragraph requesting specific action from the authority",
  "detectedInstitutionOrRespondent": "Name of respondent/department/person mentioned by user, or appropriate authority"
}`;

  let parsed: Record<string, any> | null = null;
  const apiKey = process.env.GEMINI_API_KEY?.trim();

  // 1. Try Google Gemini first if GEMINI_API_KEY is configured
  if (apiKey && apiKey !== "your_gemini_api_key_here") {
    try {
      const genAI = new GoogleGenerativeAI(apiKey);
      let rawJson = "";
      try {
        const model = genAI.getGenerativeModel({
          model: "gemini-2.5-flash",
          generationConfig: {
            responseMimeType: "application/json",
            temperature: 0.2,
          },
        });
        const response = await model.generateContent(prompt);
        rawJson = response.response.text();
      } catch {
        const fallbackModel = genAI.getGenerativeModel({
          model: "gemini-1.5-flash",
          generationConfig: {
            responseMimeType: "application/json",
            temperature: 0.2,
          },
        });
        const response = await fallbackModel.generateContent(prompt);
        rawJson = response.response.text();
      }
      parsed = extractJsonObject(rawJson);
    } catch (err) {
      console.warn("Gemini API error, trying live LLM fallback:", err);
    }
  }

  // 2. If Gemini key is not set or failed, use Live OpenAI-compatible LLM endpoint
  if (!parsed) {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 14000);
      const llmRes = await fetch("https://text.pollinations.ai/openai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "openai",
          temperature: 0.2,
          response_format: { type: "json_object" },
          messages: [
            {
              role: "system",
              content:
                "You are HaqAI, Pakistan's AI Legal Rights & Complaint Assistant. Always respond with valid JSON only.",
            },
            {
              role: "user",
              content: prompt,
            },
          ],
        }),
        signal: controller.signal,
      });
      clearTimeout(timeout);

      if (llmRes.ok) {
        const llmData = await llmRes.json();
        const content = llmData?.choices?.[0]?.message?.content;
        if (typeof content === "string") {
          parsed = extractJsonObject(content);
        }
      }
    } catch (err) {
      console.warn("Live LLM fallback warning:", err);
    }
  }

  if (!parsed) {
    return baseResult;
  }

  try {
    const updatedFacts: ExtractedUserFacts = {
      ...baseResult.generatedComplaint.facts,
      institutionOrRespondent:
        parsed.detectedInstitutionOrRespondent ||
        baseResult.generatedComplaint.facts.institutionOrRespondent,
    };

    const customAuth: AuthorityInfo = {
      id: parsed.primaryAuthority?.id || baseResult.primaryAuthority.id,
      name: parsed.primaryAuthority?.name || baseResult.primaryAuthority.name,
      shortName:
        parsed.primaryAuthority?.shortName ||
        baseResult.primaryAuthority.shortName,
      role: parsed.primaryAuthority?.role || baseResult.primaryAuthority.role,
      portalUrl:
        parsed.primaryAuthority?.portalUrl ||
        baseResult.primaryAuthority.portalUrl,
      email:
        parsed.primaryAuthority?.email || baseResult.primaryAuthority.email,
      helpline:
        parsed.primaryAuthority?.helpline ||
        baseResult.primaryAuthority.helpline,
      address:
        parsed.primaryAuthority?.address || baseResult.primaryAuthority.address,
      turnaroundTime:
        parsed.primaryAuthority?.turnaroundTime ||
        baseResult.primaryAuthority.turnaroundTime,
      instructions: baseResult.primaryAuthority.instructions,
    };

    const entry = classifyLegalIssue(params.query);
    const updatedComplaint = buildFormalComplaint(
      entry,
      updatedFacts,
      customAuth,
      parsed.legalCitationParagraph,
      parsed.requestedReliefParagraph,
      parsed.complaintSubject
    );

    const appUrl =
      process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

    const whatsappReplyText =
      `🇵🇰 *HaqAI – Pakistan Legal Rights & Complaint Assistant*\n\n` +
      (baseResult.haqId ? `👤 *Citizen ID:* ${baseResult.haqId}\n` : "") +
      `📌 *Legal Area:* ${parsed.categoryTitle || baseResult.categoryTitle}\n` +
      `⚖️ *Applicable Law:* ${
        parsed.constitutionalRights?.[0]?.article || "Constitution 1973"
      } & ${parsed.statutoryLaws?.[0]?.law || "Pakistan Code"}\n` +
      `🏛️ *Relevant Authority:* ${customAuth.name} (Helpline: ${customAuth.helpline})\n\n` +
      `👇 *Click Your Personalized Website Link Below (2 Options):*\n` +
      `1️⃣ *Option 1 – Online Complaint Submit (Edit & 1-Click Forward):*\n${appUrl}/complaint?caseId=${baseResult.caseId}\n\n` +
      `2️⃣ *Option 2 – Full Legal Guidance & Voice Chat:*\n${appUrl}/assistant?caseId=${baseResult.caseId}`;

    const newTurns: ChatTurn[] = [
      ...(params.previousChatHistory || []),
      {
        role: "user",
        content: params.query,
        timestamp: new Date().toISOString(),
      },
      {
        role: "assistant",
        content: parsed.replyText || baseResult.replyText,
        timestamp: new Date().toISOString(),
      },
    ];

    return {
      ...baseResult,
      aiEngineUsed: "gemini-live",
      categoryTitle: parsed.categoryTitle || baseResult.categoryTitle,
      replyText: parsed.replyText || baseResult.replyText,
      voiceSummaryText: parsed.voiceSummaryText || baseResult.voiceSummaryText,
      whatsappReplyText,
      constitutionalRights:
        Array.isArray(parsed.constitutionalRights) &&
        parsed.constitutionalRights.length > 0
          ? parsed.constitutionalRights
          : baseResult.constitutionalRights,
      statutoryLaws:
        Array.isArray(parsed.statutoryLaws) && parsed.statutoryLaws.length > 0
          ? parsed.statutoryLaws
          : baseResult.statutoryLaws,
      nextSteps:
        Array.isArray(parsed.nextSteps) && parsed.nextSteps.length > 0
          ? parsed.nextSteps
          : baseResult.nextSteps,
      followUpQuestions:
        Array.isArray(parsed.followUpQuestions) &&
        parsed.followUpQuestions.length > 0
          ? parsed.followUpQuestions
          : baseResult.followUpQuestions,
      primaryAuthority: customAuth,
      recommendedAuthorities: [
        customAuth,
        ...baseResult.recommendedAuthorities.filter(
          (a) => a.shortName !== customAuth.shortName
        ),
      ],
      generatedComplaint: updatedComplaint,
      chatHistory: newTurns,
    };
  } catch (err) {
    console.warn("Error formatting live LLM response:", err);
    return baseResult;
  }
}

export function generateHaqAIAnalysis(params: {
  query: string;
  language?: SupportedLanguage;
  channel?: "website" | "whatsapp";
  existingCaseId?: string;
  factOverrides?: Partial<ExtractedUserFacts>;
  citizenProfile?: CitizenProfile | null;
  previousChatHistory?: ChatTurn[];
}): HaqAIAnalysisResult {
  const channel = params.channel || "website";
  const lang = detectLanguageFromInput(params.query, params.language);
  const entry = classifyLegalIssue(params.query);

  const caseId =
    params.existingCaseId ||
    `HAQ-${Math.floor(100000 + Math.random() * 900000)}`;
  const haqId =
    params.citizenProfile?.haqId || params.factOverrides?.haqId || "";

  const facts = extractFactsFromText(
    params.query,
    params.factOverrides,
    params.citizenProfile
  );
  const generatedComplaint = buildFormalComplaint(entry, facts);
  const primaryAuthority = entry.authorities[0];

  const constitutionalRights = entry.constitutionalRights.map((c) => ({
    article: c.article,
    title: c.title,
    summary: c.summary[lang],
  }));

  const statutoryLaws = entry.statutoryLaws.map((s) => ({
    law: s.law,
    section: s.section,
    explanation: s.explanation[lang],
  }));

  const nextSteps = entry.administrativeProcedures[lang];
  const followUpQuestions = entry.followUpQuestions[lang];
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  const resolvedCategoryTitle = entry.title[lang];

  let replyText = "";
  let voiceSummaryText = "";

  if (lang === "roman_ur") {
    replyText =
      `Aap ka masla **${entry.title.roman_ur}** ke qawaneen ke tehat aata hai.\n\n` +
      `⚖️ **Aaeen-e-Pakistan (1973):**\n` +
      constitutionalRights
        .map((c) => `• **${c.article} (${c.title}):** ${c.summary}`)
        .join("\n") +
      `\n\n📜 **Pakistani Qawaneen:**\n` +
      statutoryLaws
        .map((s) => `• **${s.law} (${s.section}):** ${s.explanation}`)
        .join("\n") +
      `\n\n✅ **Qanooni Tareeqa-e-Kar:**\n` +
      nextSteps.map((step, i) => `${i + 1}. ${step}`).join("\n") +
      `\n\n🏛️ **Mutaliqa Idara:** **${primaryAuthority.name}** (Helpline: \`${primaryAuthority.helpline}\` | Portal: ${primaryAuthority.portalUrl})`;

    voiceSummaryText = `السلام علیکم۔ آپ کا مسئلہ ${entry.title.ur} سے متعلق ہے۔ ${entry.statutoryLaws[0]?.explanation.ur} آپ اس مسئلے کی شکایت ${primaryAuthority.name} کو کر سکتے ہیں۔`;
  } else if (lang === "ur" || lang === "pa") {
    replyText =
      `آئینِ پاکستان 1973 اور نافذ العمل قوانین کے مطابق آپ کا مسئلہ **${entry.title.ur}** سے متعلق ہے۔\n\n` +
      `⚖️ **آئینِ پاکستان (1973) کے تحت حقوق:**\n` +
      constitutionalRights
        .map((c) => `• **${c.article}:** ${c.summary}`)
        .join("\n") +
      `\n\n📜 **لاگو پاکستانی قوانین:**\n` +
      statutoryLaws
        .map((s) => `• **${s.law} (${s.section}):** ${s.explanation}`)
        .join("\n") +
      `\n\n✅ **قانونی طریقہ کار:**\n` +
      nextSteps.map((step, i) => `${i + 1}. ${step}`).join("\n") +
      `\n\n🏛️ **متعلقہ سرکاری ادارہ:** **${primaryAuthority.name}** (ہیلپ لائن: \`${primaryAuthority.helpline}\` | پورٹل: ${primaryAuthority.portalUrl})`;

    voiceSummaryText = `السلام علیکم۔ آپ کا مسئلہ ${entry.title.ur} سے متعلق ہے۔ ${entry.statutoryLaws[0]?.explanation.ur} آپ اپنی درخواست ایک کلک پر ${primaryAuthority.name} کو بھیج سکتے ہیں۔`;
  } else {
    replyText =
      `Under the **Constitution of Pakistan (1973)** and **Pakistani Statutory Law**, your issue falls under **${entry.title.en}**.\n\n` +
      `⚖️ **Constitutional Protections:**\n` +
      constitutionalRights
        .map((c) => `• **${c.article} (${c.title}):** ${c.summary}`)
        .join("\n") +
      `\n\n📜 **Applicable Pakistani Statutes:**\n` +
      statutoryLaws
        .map((s) => `• **${s.law} (${s.section}):** ${s.explanation}`)
        .join("\n") +
      `\n\n✅ **Step-by-Step Legal Procedure:**\n` +
      nextSteps.map((step, i) => `${i + 1}. ${step}`).join("\n") +
      `\n\n🏛️ **Verified Authority:** **${primaryAuthority.name}** (${primaryAuthority.portalUrl} | Helpline: ${primaryAuthority.helpline})`;

    voiceSummaryText = `Your issue involves ${resolvedCategoryTitle}. Under ${constitutionalRights[0]?.article} and ${statutoryLaws[0]?.law}, ${statutoryLaws[0]?.explanation}`;
  }

  const whatsappReplyText =
    `🇵🇰 *HaqAI – Citizen Rights & Complaint Assistant*\n\n` +
    (haqId ? `👤 *Citizen ID:* ${haqId}\n` : "") +
    `📌 *Issue:* ${resolvedCategoryTitle}\n` +
    `⚖️ *Pakistani Law:* ${constitutionalRights[0]?.article} & ${statutoryLaws[0]?.law}\n` +
    `🏛️ *Authority:* ${primaryAuthority.name} (Helpline: ${primaryAuthority.helpline})\n\n` +
    `👇 *Click Your Website Link Below (2 Citizen Options):*\n` +
    `1️⃣ *Option 1 – Submit Online Complaint (Edit & 1-Click Forward):*\n${appUrl}/complaint?caseId=${caseId}\n\n` +
    `2️⃣ *Option 2 – Full Legal Guidance (Voice & Text):*\n${appUrl}/assistant?caseId=${caseId}`;

  const workflowSteps: AgentWorkflowStep[] = [
    {
      stepNumber: 1,
      title: "Understand Input",
      status: "completed",
      summary: `Captured ${channel} query (${lang.toUpperCase()})`,
    },
    {
      stepNumber: 2,
      title: "Classify & Match Laws",
      status: "completed",
      summary: resolvedCategoryTitle,
    },
    {
      stepNumber: 3,
      title: "Citizen Profile Linked",
      status: "completed",
      summary: haqId ? `HaqAI ID: ${haqId}` : "Citizen Session",
    },
    {
      stepNumber: 4,
      title: "Explain 1973 Constitution",
      status: "completed",
      summary: `${constitutionalRights.length} Articles & ${statutoryLaws.length} Statutes verified`,
    },
    {
      stepNumber: 5,
      title: "Recommend Solutions",
      status: "completed",
      summary: `${nextSteps.length} actionable legal steps mapped`,
    },
    {
      stepNumber: 6,
      title: "Find Authority",
      status: "completed",
      summary: `${primaryAuthority.shortName} (${primaryAuthority.portalUrl})`,
    },
    {
      stepNumber: 7,
      title: "Pre-Fill Formal Complaint",
      status: "completed",
      summary: `Formal complaint drafted`,
    },
    {
      stepNumber: 8,
      title: "User Review & 1-Click Approval",
      status: "action_required",
      summary: "Awaiting citizen approval for 1-click dispatch",
    },
  ];

  const chatHistory: ChatTurn[] = [
    ...(params.previousChatHistory || []),
    {
      role: "user",
      content: params.query,
      timestamp: new Date().toISOString(),
    },
    {
      role: "assistant",
      content: replyText,
      timestamp: new Date().toISOString(),
    },
  ];

  return {
    caseId,
    haqId,
    citizenProfile: params.citizenProfile || undefined,
    timestamp: new Date().toISOString(),
    channel,
    language: lang,
    aiEngineUsed: "verified-pakistan-rag",
    userQuery: params.query,
    categoryId: entry.id,
    categoryTitle: resolvedCategoryTitle,
    replyText,
    whatsappReplyText,
    voiceSummaryText,
    constitutionalRights,
    statutoryLaws,
    nextSteps,
    followUpQuestions,
    recommendedAuthorities: entry.authorities,
    primaryAuthority,
    generatedComplaint,
    workflowSteps,
    chatHistory,
    status: "Open",
  };
}
