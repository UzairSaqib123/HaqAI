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

  let detectedCity =
    existing?.city ||
    profile?.city ||
    "[Your City, e.g., Lahore / Islamabad]";
  for (const c of cities) {
    if (text.toLowerCase().includes(c.toLowerCase())) {
      detectedCity = c;
      break;
    }
  }

  let institution =
    existing?.institutionOrRespondent ||
    "[Name of Concerned Department / Institution / Respondent]";
  const uniMatch = text.match(
    /([A-Z][a-zA-Z]+\s+(?:University|College|Institute|Police|Hospital|Bank|Company|Authority|Board|Court|Office))/
  );
  if (uniMatch && uniMatch[1]) {
    institution = uniMatch[1];
  } else if (
    text.toLowerCase().includes("university") ||
    text.includes("یونیورسٹی")
  ) {
    institution = "[Name of University / Degree Awarding Institute]";
  } else if (text.toLowerCase().includes("nadra") || text.includes("نادرا")) {
    institution = "NADRA Regional Office";
  } else if (
    text.toLowerCase().includes("police") ||
    text.toLowerCase().includes("thana") ||
    text.includes("پولیس")
  ) {
    institution = "[Concerned Police Station (Thana) & District]";
  }

  const cnicMatch = text.match(/\b\d{5}-\d{7}-\d{1}\b/);
  const phoneMatch = text.match(/\b(?:03\d{2}-?\d{7}|\+923\d{9})\b/);

  return {
    haqId: profile?.haqId || existing?.haqId || "HAQ-PK-GUEST",
    rawStatement: text.trim(),
    applicantName:
      existing?.applicantName || profile?.fullName || "[Your Full Name]",
    cnic: cnicMatch
      ? cnicMatch[0]
      : existing?.cnic ||
        profile?.cnic ||
        "[Your CNIC Number: XXXXX-XXXXXXX-X]",
    city: detectedCity,
    address:
      existing?.address ||
      profile?.address ||
      `${detectedCity}, Pakistan`,
    institutionOrRespondent: institution,
    dateOfIncident:
      existing?.dateOfIncident || new Date().toISOString().split("T")[0],
    referenceOrRollNo:
      existing?.referenceOrRollNo ||
      "[Registration / Roll No. / Reference ID]",
    contactPhone: phoneMatch
      ? phoneMatch[0]
      : existing?.contactPhone ||
        profile?.phone ||
        "[Your Mobile Number: 03XX-XXXXXXX]",
    contactEmail:
      existing?.contactEmail || profile?.email || "[Your Email Address]",
  };
}

export function buildFormalComplaint(
  entry: LegalKnowledgeEntry,
  facts: ExtractedUserFacts,
  customAuthority?: AuthorityInfo,
  customLegalParagraph?: string,
  customReliefParagraph?: string
): GeneratedComplaint {
  const primaryAuthority = customAuthority || entry.authorities[0];
  const todayFormatted = new Date().toLocaleDateString("en-PK", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const subject = `${entry.complaintTemplate.subjectPrefix} – Regarding ${facts.institutionOrRespondent}`;
  const legalCit =
    customLegalParagraph || entry.complaintTemplate.legalCitationParagraph;
  const reliefCit =
    customReliefParagraph || entry.complaintTemplate.requestedReliefParagraph;

  const bodyText = `To,
The Competent Authority / Grievance Redressal Cell,
${primaryAuthority.name}
Official Portal: ${primaryAuthority.portalUrl}
Date: ${todayFormatted}
HaqAI Citizen ID: ${facts.haqId || "HAQ-PK-CITIZEN"}

SUBJECT: ${subject.toUpperCase()}

Respected Sir / Madam,

I, ${facts.applicantName} (holding CNIC No. ${facts.cnic}, resident of ${
    facts.address || facts.city
  }), respectfully submit this formal complaint and state the facts strictly as follows:

1. STATEMENT OF GRIEVANCE & FACTS:
   - Aggrieved Citizen Statement: "${facts.rawStatement}"
   - Concerned Institution / Respondent: ${facts.institutionOrRespondent}
   - City / Jurisdiction: ${facts.city}
   - Relevant Date / Reference / Roll No.: ${
     facts.referenceOrRollNo
   } (Date: ${facts.dateOfIncident})

2. APPLICABLE CONSTITUTIONAL & STATUTORY LEGAL PROVISIONS (PAKISTAN):
   ${legalCit}

3. PRAYER / REQUESTED RELIEF:
   ${reliefCit}

I affirm that the facts stated above are true and accurate to the best of my knowledge. Copies of my CNIC (${
    facts.cnic
  }) and relevant supporting documents are attached herewith.

Yours faithfully,

Signature: ___________________________
Full Name: ${facts.applicantName}
HaqAI Citizen ID: ${facts.haqId || "HAQ-PK-CITIZEN"}
CNIC No.: ${facts.cnic}
Address / City: ${facts.address || facts.city}
Contact Phone: ${facts.contactPhone}
Email: ${facts.contactEmail}`;

  const emailBody = `Dear Grievance Redressal Officer (${primaryAuthority.shortName}),

Please find below the formal citizen complaint submitted by ${facts.applicantName} (HaqAI ID: ${
    facts.haqId || "HAQ-PK-CITIZEN"
  }, CNIC: ${facts.cnic}) for urgent statutory action:

--------------------------------------------------
${bodyText}
--------------------------------------------------`;

  return {
    subject,
    recipientTitle: primaryAuthority.name,
    recipientAuthority: primaryAuthority,
    date: todayFormatted,
    bodyText,
    emailSubject: `[Formal Citizen Complaint - ${facts.haqId}] ${subject}`,
    emailBody,
    categoryId: entry.id,
    facts,
  };
}

/**
 * Async AI Analysis Engine powered by Google Gemini (when GEMINI_API_KEY is set)
 * grounded in the entire Constitution of Pakistan (1973) and all Pakistani statutory laws.
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
  // First build deterministic baseline
  const baseResult = generateHaqAIAnalysis(params);

  const apiKey = process.env.GEMINI_API_KEY?.trim();
  if (!apiKey || apiKey === "your_gemini_api_key_here") {
    return baseResult;
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      generationConfig: {
        responseMimeType: "application/json",
        temperature: 0.2,
      },
    });

    const constitutionContext = CONSTITUTION_OF_PAKISTAN_1973.map(
      (c) => `${c.article} (${c.title}): ${c.textSummary}`
    ).join("\n");

    const lawsContext = PAKISTAN_LAWS_CORPUS.map(
      (l) =>
        `${l.lawName} [${l.domain}] (${l.keySections}): ${l.description} | Authority: ${l.authorityName} (${l.portalUrl}, Helpline: ${l.helpline}, Email: ${l.email})`
    ).join("\n");

    const profileContext = params.citizenProfile
      ? `Logged-in Citizen Profile (Pre-verified):
- HaqAI Citizen ID: ${params.citizenProfile.haqId}
- Full Name: ${params.citizenProfile.fullName}
- CNIC: ${params.citizenProfile.cnic}
- Phone/WhatsApp: ${params.citizenProfile.phone}
- Email: ${params.citizenProfile.email}
- City/Province: ${params.citizenProfile.city}, ${params.citizenProfile.province}
- Address: ${params.citizenProfile.address}`
      : "No pre-saved citizen profile provided.";

    const historyContext =
      params.previousChatHistory && params.previousChatHistory.length > 0
        ? `Previous Conversation Turns:\n` +
          params.previousChatHistory
            .map((t) => `${t.role.toUpperCase()}: ${t.content}`)
            .join("\n")
        : "";

    const prompt = `You are HaqAI (حق اے آئی), Pakistan's authoritative AI Legal Rights & Complaint Assistant.
You know the ENTIRE Constitution of the Islamic Republic of Pakistan (1973) and ALL Pakistani Statutory Laws (Pakistan Penal Code PPC, Code of Criminal Procedure CrPC, Civil Procedure Code CPC, Family Laws Ordinance 1961, Property/Inheritance/Rent Laws, PECA Cybercrime Act 2016, HEC Ordinance 2002, Wafaqi Mohtasib Order 1983, Consumer Protection Acts, Labour/Employment Laws, Banking/Tax/FBR Laws, NADRA/Passport Laws, Traffic/Municipal Laws, Human Rights Laws).

CRITICAL RULES:
1. Answer ANY legal or constitutional question asked by the citizen accurately under Pakistani law.
2. NEVER invent fake articles or fake laws. Cite real Articles of the 1973 Constitution of Pakistan and real sections of Pakistani statutes.
3. Respond in the citizen's requested language (${baseResult.language}: 'roman_ur' = easy Roman Urdu, 'ur' = Urdu script, 'pa' = Punjabi, 'en' = English).
4. Use the citizen's pre-saved profile details (${profileContext}) to automatically populate the formal complaint letter so they do not have to re-enter their Name, CNIC, Phone, Email, or City.

REFERENCE CONSTITUTION OF PAKISTAN (1973):
${constitutionContext}

REFERENCE PAKISTAN STATUTORY LAWS:
${lawsContext}

${historyContext}

CITIZEN CURRENT QUERY / MESSAGE:
"${params.query}"

Return a JSON object matching this exact schema:
{
  "categoryTitle": "Specific legal area title in the user's language (e.g. Family Law / Property / Criminal / Constitutional / Education / Tax / Rent)",
  "replyText": "Comprehensive, empathetic markdown response in the user's language explaining their exact rights under the 1973 Constitution and Pakistani statutes, relevant authority, and reminding them of Option 1 (1-Click Online Complaint) and Option 2 (Voice/Text Legal Guidance)",
  "voiceSummaryText": "3-4 sentence natural spoken summary suitable for Text-to-Speech. IMPORTANT: If the user language is 'roman_ur', 'ur', or 'pa', you MUST write voiceSummaryText in pure URDU SCRIPT (اردو حروف تہجی، جیسے: السلام علیکم! آپ کے مسئلے کے مطابق پاکستانی قانون آپ کو مکمل تحفظ دیتا ہے...) so our Urdu voice engine pronounces every word clearly in authentic Urdu! Only use English script if language is 'en'.",
  "constitutionalRights": [
    { "article": "Article X – Constitution of Pakistan 1973", "title": "Title of Article", "summary": "Clear explanation in user's language" }
  ],
  "statutoryLaws": [
    { "law": "Exact Name of Pakistani Act / Ordinance / PPC / CrPC", "section": "Exact Section(s)", "explanation": "Clear explanation in user's language" }
  ],
  "nextSteps": [
    "Step 1 practical instruction in user's language",
    "Step 2 practical instruction in user's language",
    "Step 3 practical instruction in user's language"
  ],
  "followUpQuestions": [
    "1 or 2 short clarifying questions if any incident detail is missing"
  ],
  "primaryAuthority": {
    "id": "authority_slug",
    "name": "Full Official Name of Pakistani Government Institution / Ombudsman / Court / Helpline",
    "shortName": "Short Name",
    "role": "Statutory role of this authority",
    "portalUrl": "Verified official https://... gov.pk URL",
    "email": "Official complaint email",
    "helpline": "Official helpline number (e.g. 1099, 1055, 1787, 1991, etc.)",
    "address": "Official headquarter/office address in Pakistan",
    "turnaroundTime": "Expected statutory resolution timeframe"
  },
  "complaintSubject": "Formal subject line for the legal complaint/application",
  "legalCitationParagraph": "Formal paragraph citing the exact Constitutional Articles and Pakistani statutory sections violated",
  "requestedReliefParagraph": "Formal prayer/relief paragraph requesting action from the authority",
  "detectedInstitutionOrRespondent": "Name of respondent/department/person mentioned by user, or sensible placeholder"
}`;

    const response = await model.generateContent(prompt);
    const rawJson = response.response.text();
    const parsed = JSON.parse(rawJson);

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
      parsed.requestedReliefParagraph
    );
    if (parsed.complaintSubject) {
      updatedComplaint.subject = parsed.complaintSubject;
    }

    const appUrl =
      process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3001";

    const whatsappReplyText =
      `🇵🇰 *HaqAI – Pakistan Legal Rights & Complaint Assistant*\n\n` +
      `👤 *Citizen ID:* ${baseResult.haqId}\n` +
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
        parsed.constitutionalRights?.length > 0
          ? parsed.constitutionalRights
          : baseResult.constitutionalRights,
      statutoryLaws:
        parsed.statutoryLaws?.length > 0
          ? parsed.statutoryLaws
          : baseResult.statutoryLaws,
      nextSteps:
        parsed.nextSteps?.length > 0 ? parsed.nextSteps : baseResult.nextSteps,
      followUpQuestions:
        parsed.followUpQuestions?.length > 0
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
    console.warn("Gemini API fallback to verified RAG engine:", err);
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
    params.citizenProfile?.haqId ||
    params.factOverrides?.haqId ||
    "HAQ-PK-104829";

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
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3001";

  let replyText = "";
  let voiceSummaryText = "";
  let whatsappReplyText = "";

  if (lang === "roman_ur") {
    replyText =
      `Assalam-o-Alaikum **${facts.applicantName}** (Citizen ID: \`${haqId}\`)! Main ne Pakistan ke **1973 Constitution** aur **Pakistani Qawaneen** ke mutabiq aap ka masla check kar liya hai. Yeh **${entry.title.roman_ur}** se mutaliq hai.\n\n` +
      `### ⚖️ Aap ke Aaeeni Haqooq (1973 Constitution):\n` +
      constitutionalRights
        .map((c) => `- **${c.article} (${c.title}):** ${c.summary}`)
        .join("\n") +
      `\n\n### 📜 Laago Pakistani Qanoon (Statutes):\n` +
      statutoryLaws
        .map((s) => `- **${s.law} (${s.section}):** ${s.explanation}`)
        .join("\n") +
      `\n\n### 🏛️ Mutaliqa Sarkari Idara:\n` +
      `- **${primaryAuthority.name}** (${primaryAuthority.portalUrl} | Helpline: ${primaryAuthority.helpline})\n\n` +
      `### ✅ Aap ki pre-saved details (\`${facts.cnic}\`, \`${facts.city}\`) ke sath Complaint tayyar hai:\n` +
      `1. **Option 1 – Online Complaint Submit Karein (Edit & 1-Click Forward):** Apni tayyar complaint check/edit karein aur 1-Click mein **${primaryAuthority.shortName}** ko forward karein.\n` +
      `2. **Option 2 – Mukammal Legal Guidance:** Neeche diye gaye qanooni steps parhein/sunein ya mazeed koi bhi qanooni sawal poochein.`;

    voiceSummaryText = `السلام علیکم ${facts.applicantName}۔ آپ کا مسئلہ ${entry.title.ur} سے متعلق ہے۔ ${entry.statutoryLaws[0]?.explanation.ur} آپ اس مسئلے کی شکایت ${primaryAuthority.name} کو کر سکتے ہیں۔ ہم نے آپ کی تمام تفصیلات کے ساتھ درخواست تیار کر دی ہے جسے آپ صرف ایک کلک پر متعلقہ ادارے کو بھیج سکتے ہیں۔`;
  } else if (lang === "ur" || lang === "pa") {
    replyText =
      `السلام علیکم **${facts.applicantName}** (شناختی آئی ڈی: \`${haqId}\`)! آئینِ پاکستان 1973 اور نافذ العمل قوانین کے مطابق آپ کا مسئلہ **${entry.title.ur}** سے متعلق ہے۔\n\n` +
      `### ⚖️ آپ کے آئینی حقوق:\n` +
      constitutionalRights
        .map((c) => `- **${c.article}:** ${c.summary}`)
        .join("\n") +
      `\n\n### 📜 لاگو پاکستانی قوانین:\n` +
      statutoryLaws.map((s) => `- **${s.law}:** ${s.explanation}`).join("\n") +
      `\n\n### 🏛️ متعلقہ ادارہ:\n` +
      `- **${primaryAuthority.name}** (${primaryAuthority.portalUrl} | ہیلپ لائن: ${primaryAuthority.helpline})`;

    voiceSummaryText = `السلام علیکم۔ آپ کا مسئلہ ${entry.title.ur} سے متعلق ہے۔ ${entry.statutoryLaws[0]?.explanation.ur} آپ کی تفصیلات کے ساتھ درخواست تیار کر دی گئی ہے جسے آپ ایک کلک پر متعلقہ ادارے کو بھیج سکتے ہیں۔`;
  } else {
    replyText =
      `Hello **${facts.applicantName}** (Citizen ID: \`${haqId}\`). Based on the **Constitution of Pakistan (1973)** and **Pakistani Statutory Law**, your issue falls under **${entry.title.en}**.\n\n` +
      `### ⚖️ Constitutional Protections:\n` +
      constitutionalRights
        .map((c) => `- **${c.article} (${c.title}):** ${c.summary}`)
        .join("\n") +
      `\n\n### 📜 Applicable Pakistani Statutes:\n` +
      statutoryLaws
        .map((s) => `- **${s.law} (${s.section}):** ${s.explanation}`)
        .join("\n") +
      `\n\n### 🏛️ Verified Complaint Authority:\n` +
      `- **${primaryAuthority.name}** (${primaryAuthority.portalUrl} | Helpline: ${primaryAuthority.helpline})\n\n` +
      `Your saved Citizen Profile details (\`${facts.cnic}\`, \`${facts.city}\`) have been automatically populated into your formal complaint.`;

    voiceSummaryText = `Your issue involves ${entry.title.en}. Under ${constitutionalRights[0]?.article} and ${statutoryLaws[0]?.law}, ${statutoryLaws[0]?.explanation} Your formal complaint has been pre-filled with your citizen profile details for one-click forwarding to ${primaryAuthority.shortName}.`;
  }

  whatsappReplyText =
    `🇵🇰 *HaqAI – Citizen Rights & Complaint Assistant*\n\n` +
    `👤 *Citizen ID:* ${haqId}\n` +
    `📌 *Issue:* ${entry.title.roman_ur}\n` +
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
      summary: entry.title.en,
    },
    {
      stepNumber: 3,
      title: "Citizen Profile Linked",
      status: "completed",
      summary: `HaqAI ID: ${haqId} (${facts.applicantName})`,
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
      summary: `Pre-filled with Citizen CNIC & Address`,
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
    categoryTitle: entry.title[lang],
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
