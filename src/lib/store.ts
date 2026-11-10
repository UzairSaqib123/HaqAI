import fs from "fs";
import path from "path";
import { generateHaqAIAnalysis, HaqAIAnalysisResult } from "./ai-engine";
import { CitizenProfile, isSupabaseConfigured, supabase } from "./supabase";

export interface DispatchRecord {
  dispatchId: string;
  caseId: string;
  haqId: string;
  citizenName: string;
  citizenCnic: string;
  citizenPhone: string;
  citizenEmail: string;
  citizenCity: string;
  authorityName: string;
  authorityEmail: string;
  portalUrl: string;
  dispatchedAt: string;
  status: "Dispatched" | "In Progress" | "Resolved";
  finalComplaintText: string;
}

interface StoreShape {
  profiles: Record<string, CitizenProfile>;
  cases: Record<string, HaqAIAnalysisResult>;
  dispatches: DispatchRecord[];
}

const DATA_DIR = path.join(process.cwd(), "data");
const STORE_PATH = path.join(DATA_DIR, "haqai-store.json");

function getInitialStore(): StoreShape {
  const defaultProfile: CitizenProfile = {
    id: "prof-demo-01",
    haqId: "HAQ-PK-104829",
    email: "uzair.citizen@gmail.com",
    fullName: "Muhammad Uzair",
    cnic: "35202-4829104-1",
    phone: "+923001234567",
    city: "Islamabad",
    province: "Islamabad Capital Territory (ICT)",
    address: "House 14, Street 8, Sector G-10/2, Islamabad",
    occupation: "University Graduate / Software Engineer",
    role: "admin",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const flagshipCase = generateHaqAIAnalysis({
    query:
      "Meri university meri original degree aur educational documents wapas nahi kar rahi jabke meri clearance mukammal hai. Main kya kar sakta hoon?",
    language: "roman_ur",
    channel: "whatsapp",
    existingCaseId: "HAQ-DEMO01",
    citizenProfile: defaultProfile,
    factOverrides: {
      haqId: defaultProfile.haqId,
      applicantName: defaultProfile.fullName,
      cnic: defaultProfile.cnic,
      city: defaultProfile.city,
      address: defaultProfile.address,
      contactPhone: defaultProfile.phone,
      contactEmail: defaultProfile.email,
      institutionOrRespondent:
        "Department of Student Affairs / University Registrar",
      referenceOrRollNo: "FA22-BCS-049",
    },
  });

  return {
    profiles: {
      [defaultProfile.haqId]: defaultProfile,
    },
    cases: {
      [flagshipCase.caseId]: flagshipCase,
    },
    dispatches: [],
  };
}

export function readStore(): StoreShape {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (!fs.existsSync(STORE_PATH)) {
      const initial = getInitialStore();
      fs.writeFileSync(STORE_PATH, JSON.stringify(initial, null, 2), "utf-8");
      return initial;
    }
    const raw = fs.readFileSync(STORE_PATH, "utf-8");
    const parsed = JSON.parse(raw) as StoreShape;
    if (!parsed.profiles) {
      const init = getInitialStore();
      parsed.profiles = init.profiles;
    }
    return parsed;
  } catch {
    return getInitialStore();
  }
}

function writeStore(store: StoreShape) {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(STORE_PATH, JSON.stringify(store, null, 2), "utf-8");
  } catch {
    // ignore read-only fs errors
  }
}

export async function saveCitizenProfile(
  profile: CitizenProfile
): Promise<CitizenProfile> {
  const store = readStore();
  store.profiles[profile.haqId] = profile;
  writeStore(store);

  if (isSupabaseConfigured && supabase) {
    try {
      await supabase.from("citizen_profiles").upsert(
        {
          haq_id: profile.haqId,
          email: profile.email,
          full_name: profile.fullName,
          cnic: profile.cnic,
          phone: profile.phone,
          city: profile.city,
          province: profile.province,
          address: profile.address,
          occupation: profile.occupation,
          role: profile.role,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "haq_id" }
      );
    } catch (e) {
      console.warn("Supabase citizen_profiles upsert warning:", e);
    }
  }

  return profile;
}

export function findCitizenProfile(query: {
  haqId?: string;
  email?: string;
  phone?: string;
}): CitizenProfile | null {
  const store = readStore();
  if (query.haqId && store.profiles[query.haqId]) {
    return store.profiles[query.haqId];
  }
  const all = Object.values(store.profiles);
  if (query.email) {
    const byEmail = all.find(
      (p) => p.email.toLowerCase() === query.email?.toLowerCase()
    );
    if (byEmail) return byEmail;
  }
  if (query.phone) {
    const cleanPhone = query.phone.replace(/\D/g, "").slice(-10);
    const byPhone = all.find((p) =>
      p.phone.replace(/\D/g, "").endsWith(cleanPhone)
    );
    if (byPhone) return byPhone;
  }
  return all[0] || null;
}

export function getAllProfiles(): CitizenProfile[] {
  const store = readStore();
  return Object.values(store.profiles).sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

export async function saveCase(
  result: HaqAIAnalysisResult
): Promise<HaqAIAnalysisResult> {
  const store = readStore();
  store.cases[result.caseId] = result;
  writeStore(store);

  if (isSupabaseConfigured && supabase) {
    try {
      await supabase.from("legal_cases").upsert(
        {
          case_id: result.caseId,
          haq_id: result.haqId || "HAQ-PK-GUEST",
          channel: result.channel,
          language: result.language,
          user_query: result.userQuery,
          legal_area: result.categoryTitle,
          reply_text: result.replyText,
          voice_summary: result.voiceSummaryText,
          constitutional_articles: result.constitutionalRights,
          statutory_laws: result.statutoryLaws,
          next_steps: result.nextSteps,
          authority_name: result.primaryAuthority.name,
          authority_short_name: result.primaryAuthority.shortName,
          authority_portal: result.primaryAuthority.portalUrl,
          authority_email: result.primaryAuthority.email,
          authority_helpline: result.primaryAuthority.helpline,
          complaint_subject: result.generatedComplaint.subject,
          complaint_body: result.generatedComplaint.bodyText,
          chat_history: result.chatHistory || [],
          status: result.status || "Open",
        },
        { onConflict: "case_id" }
      );
    } catch (e) {
      console.warn("Supabase legal_cases upsert warning:", e);
    }
  }

  return result;
}

export function getCaseById(caseId: string): HaqAIAnalysisResult | null {
  const store = readStore();
  return store.cases[caseId] || null;
}

export function getAllCases(): HaqAIAnalysisResult[] {
  const store = readStore();
  return Object.values(store.cases).sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );
}

export async function recordDispatch(
  record: DispatchRecord
): Promise<DispatchRecord> {
  const store = readStore();
  store.dispatches.unshift(record);
  writeStore(store);

  if (isSupabaseConfigured && supabase) {
    try {
      await supabase.from("complaint_dispatches").upsert(
        {
          dispatch_id: record.dispatchId,
          case_id: record.caseId,
          haq_id: record.haqId,
          citizen_name: record.citizenName,
          citizen_cnic: record.citizenCnic,
          citizen_phone: record.citizenPhone,
          citizen_email: record.citizenEmail,
          citizen_city: record.citizenCity,
          authority_name: record.authorityName,
          authority_email: record.authorityEmail,
          portal_url: record.portalUrl,
          final_complaint_text: record.finalComplaintText,
          status: record.status,
          dispatched_at: record.dispatchedAt,
        },
        { onConflict: "dispatch_id" }
      );
    } catch (e) {
      console.warn("Supabase complaint_dispatches upsert warning:", e);
    }
  }

  return record;
}

export function getAllDispatches(): DispatchRecord[] {
  const store = readStore();
  return store.dispatches;
}

export function updateCaseOrDispatchStatus(params: {
  caseId?: string;
  dispatchId?: string;
  status: string;
}) {
  const store = readStore();
  if (params.caseId && store.cases[params.caseId]) {
    store.cases[params.caseId].status = params.status as
      | "Open"
      | "Dispatched"
      | "Resolved"
      | "Under Review";
  }
  if (params.dispatchId) {
    const d = store.dispatches.find((x) => x.dispatchId === params.dispatchId);
    if (d) {
      d.status = params.status as "Dispatched" | "In Progress" | "Resolved";
    }
  }
  writeStore(store);
}
