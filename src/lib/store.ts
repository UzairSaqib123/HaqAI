import fs from "fs";
import os from "os";
import path from "path";
import { HaqAIAnalysisResult } from "./ai-engine";
import {
  ALL_LEGAL_CATEGORIES,
  LEGAL_KNOWLEDGE_BASE,
  LegalCategoryId,
  SupportedLanguage,
} from "./legal-knowledge";
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

export type AvailabilityTimeSlot =
  | "immediate"
  | "morning"
  | "evening"
  | "weekends";

export type HelpTypeOption =
  | "drafting"
  | "consultation"
  | "representation"
  | "verification";

export interface LegalHelperAvailability {
  helperId: string;
  haqId: string;
  fullName: string;
  roleTitle: string;
  phone: string;
  email: string;
  city: string;
  isAvailable: boolean;
  timeSlot: AvailabilityTimeSlot;
  helpTypes: HelpTypeOption[];
  legalCategories: LegalCategoryId[];
  matchedCaseIds: string[];
  updatedAt: string;
}

export interface StoreShape {
  profiles: Record<string, CitizenProfile>;
  cases: Record<string, HaqAIAnalysisResult>;
  dispatches: DispatchRecord[];
  helpers: Record<string, LegalHelperAvailability>;
}

const DATA_DIR = path.join(process.cwd(), "data");
const STORE_PATH = path.join(DATA_DIR, "haqai-store.json");
const TMP_STORE_PATH = path.join(os.tmpdir(), "haqai-store.json");

declare global {
  // eslint-disable-next-line no-var
  var __haqai_store_cache__: StoreShape | undefined;
}

function getInitialStore(): StoreShape {
  return {
    profiles: {},
    cases: {},
    dispatches: [],
    helpers: {},
  };
}

function normalizeStore(parsed: Partial<StoreShape> | null | undefined): StoreShape {
  return {
    profiles: parsed?.profiles && typeof parsed.profiles === "object" ? parsed.profiles : {},
    cases: parsed?.cases && typeof parsed.cases === "object" ? parsed.cases : {},
    dispatches: Array.isArray(parsed?.dispatches) ? parsed.dispatches : [],
    helpers: parsed?.helpers && typeof parsed.helpers === "object" ? parsed.helpers : {},
  };
}

function mergeTwoStores(base: StoreShape, incoming: StoreShape): StoreShape {
  const merged: StoreShape = {
    profiles: { ...base.profiles },
    cases: { ...base.cases },
    dispatches: [...base.dispatches],
    helpers: { ...base.helpers },
  };

  for (const [haqId, prof] of Object.entries(incoming.profiles)) {
    if (!haqId || !prof) continue;
    const existing = merged.profiles[haqId];
    if (
      !existing ||
      new Date(prof.updatedAt || prof.createdAt || 0).getTime() >=
        new Date(existing.updatedAt || existing.createdAt || 0).getTime()
    ) {
      merged.profiles[haqId] = prof;
    }
  }

  for (const [caseId, c] of Object.entries(incoming.cases)) {
    if (!caseId || !c) continue;
    merged.cases[caseId] = {
      ...(merged.cases[caseId] || {}),
      ...c,
    };
  }

  const dispatchMap = new Map<string, DispatchRecord>();
  for (const d of merged.dispatches) {
    if (d?.dispatchId) dispatchMap.set(d.dispatchId, d);
  }
  for (const d of incoming.dispatches) {
    if (d?.dispatchId) {
      dispatchMap.set(d.dispatchId, {
        ...(dispatchMap.get(d.dispatchId) || {}),
        ...d,
      });
    }
  }
  merged.dispatches = Array.from(dispatchMap.values()).sort(
    (a, b) =>
      new Date(b.dispatchedAt || 0).getTime() -
      new Date(a.dispatchedAt || 0).getTime()
  );

  for (const [helperId, h] of Object.entries(incoming.helpers)) {
    if (!helperId || !h) continue;
    const existing = merged.helpers[helperId];
    if (
      !existing ||
      new Date(h.updatedAt || 0).getTime() >=
        new Date(existing.updatedAt || 0).getTime()
    ) {
      merged.helpers[helperId] = h;
    }
  }

  return merged;
}

export function readStore(): StoreShape {
  let current = globalThis.__haqai_store_cache__ || getInitialStore();

  // Read primary data/haqai-store.json
  try {
    if (fs.existsSync(STORE_PATH)) {
      const raw = fs.readFileSync(STORE_PATH, "utf-8");
      const diskStore = normalizeStore(JSON.parse(raw));
      current = mergeTwoStores(current, diskStore);
    }
  } catch {
    // ignore primary read error
  }

  // Read fallback tmp store (useful on serverless / Vercel)
  try {
    if (fs.existsSync(TMP_STORE_PATH)) {
      const rawTmp = fs.readFileSync(TMP_STORE_PATH, "utf-8");
      const tmpStore = normalizeStore(JSON.parse(rawTmp));
      current = mergeTwoStores(current, tmpStore);
    }
  } catch {
    // ignore tmp read error
  }

  globalThis.__haqai_store_cache__ = current;
  return current;
}

function writeStore(store: StoreShape) {
  const normalized = normalizeStore(store);
  globalThis.__haqai_store_cache__ = normalized;
  const serialized = JSON.stringify(normalized, null, 2);

  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(STORE_PATH, serialized, "utf-8");
  } catch {
    // fallback to os.tmpdir() when project directory is read-only (e.g. Vercel)
  }

  try {
    fs.writeFileSync(TMP_STORE_PATH, serialized, "utf-8");
  } catch {
    // ignore tmp write errors
  }
}

export async function syncStoreWithSupabase(): Promise<StoreShape> {
  const store = readStore();
  if (!isSupabaseConfigured || !supabase) {
    return store;
  }

  let updated = false;

  // 1. Sync citizen_profiles from Supabase
  try {
    const { data: profileRows, error } = await supabase
      .from("citizen_profiles")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error && Array.isArray(profileRows)) {
      for (const row of profileRows) {
        if (!row.haq_id) continue;
        const prof: CitizenProfile = {
          id: row.id || `prof-${row.haq_id}`,
          userId: row.user_id || undefined,
          haqId: row.haq_id,
          email: row.email || "",
          fullName: row.full_name || "",
          cnic: row.cnic || "",
          phone: row.phone || "",
          city: row.city || "",
          province: row.province || "Punjab",
          address: row.address || row.city || "",
          occupation: row.occupation || "",
          role: row.role === "admin" ? "admin" : "citizen",
          createdAt: row.created_at || new Date().toISOString(),
          updatedAt: row.updated_at || row.created_at || new Date().toISOString(),
        };
        if (!store.profiles[prof.haqId]) {
          store.profiles[prof.haqId] = prof;
          updated = true;
        }
      }
    }
  } catch (e) {
    console.warn("Supabase citizen_profiles read warning:", e);
  }

  // 2. Sync legal_cases from Supabase
  try {
    const { data: caseRows, error } = await supabase
      .from("legal_cases")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error && Array.isArray(caseRows)) {
      for (const row of caseRows) {
        if (!row.case_id) continue;
        if (store.cases[row.case_id]) {
          if (row.status && store.cases[row.case_id].status !== row.status) {
            store.cases[row.case_id].status = row.status;
            updated = true;
          }
          continue;
        }

        // Match category from legal_area
        const matchedCat =
          ALL_LEGAL_CATEGORIES.find(
            (cat) =>
              cat.title.en.toLowerCase() ===
                String(row.legal_area || "").toLowerCase() ||
              cat.id === row.legal_area
          ) || LEGAL_KNOWLEDGE_BASE.education;

        const linkedProfile = store.profiles[row.haq_id];

        const reconstructed: HaqAIAnalysisResult = {
          caseId: row.case_id,
          haqId: row.haq_id || "UNREGISTERED",
          citizenProfile: linkedProfile,
          timestamp: row.created_at || new Date().toISOString(),
          channel: row.channel === "whatsapp" ? "whatsapp" : "website",
          language: (row.language as SupportedLanguage) || "ur",
          aiEngineUsed: "supabase-synced",
          userQuery: row.user_query || "",
          categoryId: matchedCat.id,
          categoryTitle: row.legal_area || matchedCat.title.en,
          replyText: row.reply_text || "",
          whatsappReplyText: row.reply_text || "",
          voiceSummaryText: row.voice_summary || row.reply_text || "",
          constitutionalRights: Array.isArray(row.constitutional_articles)
            ? row.constitutional_articles
            : [],
          statutoryLaws: Array.isArray(row.statutory_laws)
            ? row.statutory_laws
            : [],
          nextSteps: Array.isArray(row.next_steps) ? row.next_steps : [],
          followUpQuestions: [],
          recommendedAuthorities: matchedCat.authorities,
          primaryAuthority: {
            ...matchedCat.authorities[0],
            name: row.authority_name || matchedCat.authorities[0].name,
            shortName:
              row.authority_short_name || matchedCat.authorities[0].shortName,
            portalUrl:
              row.authority_portal || matchedCat.authorities[0].portalUrl,
            email: row.authority_email || matchedCat.authorities[0].email,
            helpline:
              row.authority_helpline || matchedCat.authorities[0].helpline,
          },
          generatedComplaint: {
            subject: row.complaint_subject || "Formal Citizen Complaint",
            recipientTitle:
              matchedCat.complaintTemplate.defaultRecipientTitle,
            recipientAuthority: matchedCat.authorities[0],
            date: new Date(row.created_at || Date.now())
              .toISOString()
              .split("T")[0],
            bodyText: row.complaint_body || "",
            emailSubject: row.complaint_subject || "Formal Citizen Complaint",
            emailBody: row.complaint_body || "",
            categoryId: matchedCat.id,
            facts: {
              haqId: row.haq_id || "",
              rawStatement: row.user_query || "",
              applicantName: linkedProfile?.fullName || "Citizen",
              cnic: linkedProfile?.cnic || "N/A",
              city: linkedProfile?.city || "Pakistan",
              address: linkedProfile?.address || "",
              institutionOrRespondent: "",
              dateOfIncident: new Date(row.created_at || Date.now())
                .toISOString()
                .split("T")[0],
              referenceOrRollNo: "",
              contactPhone: linkedProfile?.phone || "",
              contactEmail: linkedProfile?.email || "",
            },
          },
          workflowSteps: [],
          chatHistory: Array.isArray(row.chat_history) ? row.chat_history : [],
          status: row.status || "Open",
        };

        store.cases[reconstructed.caseId] = reconstructed;
        updated = true;
      }
    }
  } catch (e) {
    console.warn("Supabase legal_cases read warning:", e);
  }

  // 3. Sync complaint_dispatches from Supabase
  try {
    const { data: dispatchRows, error } = await supabase
      .from("complaint_dispatches")
      .select("*")
      .order("dispatched_at", { ascending: false });

    if (!error && Array.isArray(dispatchRows)) {
      const existingIds = new Set(store.dispatches.map((d) => d.dispatchId));
      for (const row of dispatchRows) {
        if (!row.dispatch_id) continue;
        if (!existingIds.has(row.dispatch_id)) {
          store.dispatches.push({
            dispatchId: row.dispatch_id,
            caseId: row.case_id || "HAQ-DIRECT",
            haqId: row.haq_id || "HAQ-PK-CITIZEN",
            citizenName: row.citizen_name || "Citizen",
            citizenCnic: row.citizen_cnic || "N/A",
            citizenPhone: row.citizen_phone || "N/A",
            citizenEmail: row.citizen_email || "N/A",
            citizenCity: row.citizen_city || "Pakistan",
            authorityName: row.authority_name || "",
            authorityEmail: row.authority_email || "",
            portalUrl: row.portal_url || "",
            finalComplaintText: row.final_complaint_text || "",
            status: row.status || "Dispatched",
            dispatchedAt: row.dispatched_at || new Date().toISOString(),
          });
          existingIds.add(row.dispatch_id);
          updated = true;
        }
      }
    }
  } catch (e) {
    console.warn("Supabase complaint_dispatches read warning:", e);
  }

  if (updated) {
    writeStore(store);
  }

  return store;
}

export async function mergeClientDataIntoStore(payload: {
  profiles?: CitizenProfile[];
  cases?: HaqAIAnalysisResult[];
  dispatches?: DispatchRecord[];
  helpers?: LegalHelperAvailability[];
}): Promise<StoreShape> {
  const incoming: StoreShape = getInitialStore();

  if (Array.isArray(payload.profiles)) {
    for (const p of payload.profiles) {
      if (p?.haqId) {
        incoming.profiles[p.haqId] = p;
      }
    }
  }

  if (Array.isArray(payload.cases)) {
    for (const c of payload.cases) {
      if (c?.caseId) {
        incoming.cases[c.caseId] = c;
      }
    }
  }

  if (Array.isArray(payload.dispatches)) {
    incoming.dispatches = payload.dispatches.filter((d) => Boolean(d?.dispatchId));
  }

  if (Array.isArray(payload.helpers)) {
    for (const h of payload.helpers) {
      if (h?.helperId) {
        incoming.helpers[h.helperId] = h;
      }
    }
  }

  const current = readStore();
  const merged = mergeTwoStores(current, incoming);
  writeStore(merged);

  // Also ensure any new client profiles are pushed to Supabase if configured
  if (isSupabaseConfigured && supabase && Array.isArray(payload.profiles)) {
    for (const p of payload.profiles) {
      if (!p?.haqId || !p.fullName) continue;
      try {
        await supabase.from("citizen_profiles").upsert(
          {
            haq_id: p.haqId,
            email: p.email || "",
            full_name: p.fullName,
            cnic: p.cnic || "",
            phone: p.phone || "",
            city: p.city || "",
            province: p.province || "Punjab",
            address: p.address || p.city || "",
            occupation: p.occupation || "",
            role: p.role || "citizen",
            updated_at: p.updatedAt || new Date().toISOString(),
          },
          { onConflict: "haq_id" }
        );
      } catch {
        // ignore upsert error
      }
    }
  }

  return merged;
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
    if (cleanPhone.length >= 7) {
      const byPhone = all.find((p) =>
        p.phone.replace(/\D/g, "").endsWith(cleanPhone)
      );
      if (byPhone) return byPhone;
    }
  }
  return null;
}

export function getAllProfiles(): CitizenProfile[] {
  const store = readStore();
  return Object.values(store.profiles).sort(
    (a, b) =>
      new Date(b.updatedAt || b.createdAt || 0).getTime() -
      new Date(a.updatedAt || a.createdAt || 0).getTime()
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
          haq_id: result.haqId || "UNREGISTERED",
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
    (a, b) =>
      new Date(b.timestamp || 0).getTime() -
      new Date(a.timestamp || 0).getTime()
  );
}

export async function recordDispatch(
  record: DispatchRecord
): Promise<DispatchRecord> {
  const store = readStore();
  const existingIdx = store.dispatches.findIndex(
    (d) => d.dispatchId === record.dispatchId
  );
  if (existingIdx >= 0) {
    store.dispatches[existingIdx] = record;
  } else {
    store.dispatches.unshift(record);
  }
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

export function saveHelperAvailability(
  helper: LegalHelperAvailability
): LegalHelperAvailability {
  const store = readStore();
  store.helpers[helper.helperId] = helper;
  writeStore(store);
  return helper;
}

export function getAllHelpers(): LegalHelperAvailability[] {
  const store = readStore();
  return Object.values(store.helpers).sort(
    (a, b) =>
      new Date(b.updatedAt || 0).getTime() -
      new Date(a.updatedAt || 0).getTime()
  );
}

export async function updateCaseOrDispatchStatus(params: {
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

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase
          .from("legal_cases")
          .update({ status: params.status })
          .eq("case_id", params.caseId);
      } catch {
        // ignore
      }
    }
  }
  if (params.dispatchId) {
    const d = store.dispatches.find((x) => x.dispatchId === params.dispatchId);
    if (d) {
      d.status = params.status as "Dispatched" | "In Progress" | "Resolved";
    }
    if (isSupabaseConfigured && supabase) {
      try {
        await supabase
          .from("complaint_dispatches")
          .update({ status: params.status })
          .eq("dispatch_id", params.dispatchId);
      } catch {
        // ignore
      }
    }
  }
  writeStore(store);
}
