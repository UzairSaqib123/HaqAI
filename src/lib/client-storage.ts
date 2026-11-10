import { HaqAIAnalysisResult } from "./ai-engine";
import { DispatchRecord, LegalHelperAvailability } from "./store";
import { CitizenProfile } from "./supabase";

const ACTIVE_PROFILE_KEY = "haqai_active_profile";
const LEGACY_PROFILE_KEY = "haqai_citizen_profile";
const PROFILES_LIST_KEY = "haqai_profiles_list";
const CASES_LIST_KEY = "haqai_cases_list";
const DISPATCHES_LIST_KEY = "haqai_dispatches_list";
const ACTIVE_HELPER_KEY = "haqai_helper_availability";
const HELPERS_LIST_KEY = "haqai_helpers_list";

export function getActiveClientProfile(): CitizenProfile | null {
  if (typeof window === "undefined") return null;
  try {
    const raw =
      localStorage.getItem(ACTIVE_PROFILE_KEY) ||
      localStorage.getItem(LEGACY_PROFILE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as CitizenProfile;
    if (parsed && parsed.haqId && parsed.fullName) {
      return parsed;
    }
  } catch {
    // ignore
  }
  return null;
}

export function getClientProfiles(): CitizenProfile[] {
  if (typeof window === "undefined") return [];
  const map = new Map<string, CitizenProfile>();

  try {
    const listRaw = localStorage.getItem(PROFILES_LIST_KEY);
    if (listRaw) {
      const list = JSON.parse(listRaw) as CitizenProfile[];
      if (Array.isArray(list)) {
        for (const p of list) {
          if (p?.haqId) map.set(p.haqId, p);
        }
      }
    }
  } catch {
    // ignore
  }

  const active = getActiveClientProfile();
  if (active?.haqId) {
    map.set(active.haqId, active);
  }

  return Array.from(map.values()).sort(
    (a, b) =>
      new Date(b.updatedAt || b.createdAt || 0).getTime() -
      new Date(a.updatedAt || a.createdAt || 0).getTime()
  );
}

export function saveClientProfile(profile: CitizenProfile) {
  if (typeof window === "undefined" || !profile?.haqId) return;
  try {
    localStorage.setItem(ACTIVE_PROFILE_KEY, JSON.stringify(profile));
    localStorage.setItem("haqai_registered_citizen", "true");
    const all = getClientProfiles();
    const map = new Map<string, CitizenProfile>();
    for (const p of all) {
      if (p?.haqId) map.set(p.haqId, p);
    }
    map.set(profile.haqId, profile);
    localStorage.setItem(
      PROFILES_LIST_KEY,
      JSON.stringify(Array.from(map.values()))
    );
    window.dispatchEvent(new Event("haqai-profile-updated"));
  } catch {
    // ignore
  }
}

export function getClientCases(): HaqAIAnalysisResult[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(CASES_LIST_KEY);
    if (!raw) return [];
    const list = JSON.parse(raw) as HaqAIAnalysisResult[];
    return Array.isArray(list)
      ? list.sort(
          (a, b) =>
            new Date(b.timestamp || 0).getTime() -
            new Date(a.timestamp || 0).getTime()
        )
      : [];
  } catch {
    return [];
  }
}

export function saveClientCase(caseData: HaqAIAnalysisResult) {
  if (typeof window === "undefined" || !caseData?.caseId) return;
  try {
    const all = getClientCases();
    const map = new Map<string, HaqAIAnalysisResult>();
    for (const c of all) {
      if (c?.caseId) map.set(c.caseId, c);
    }
    map.set(caseData.caseId, caseData);
    localStorage.setItem(
      CASES_LIST_KEY,
      JSON.stringify(Array.from(map.values()))
    );
    window.dispatchEvent(new Event("haqai-case-updated"));
  } catch {
    // ignore
  }
}

export function getClientDispatches(): DispatchRecord[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(DISPATCHES_LIST_KEY);
    if (!raw) return [];
    const list = JSON.parse(raw) as DispatchRecord[];
    return Array.isArray(list)
      ? list.sort(
          (a, b) =>
            new Date(b.dispatchedAt || 0).getTime() -
            new Date(a.dispatchedAt || 0).getTime()
        )
      : [];
  } catch {
    return [];
  }
}

export function saveClientDispatch(dispatch: DispatchRecord) {
  if (typeof window === "undefined" || !dispatch?.dispatchId) return;
  try {
    const all = getClientDispatches();
    const map = new Map<string, DispatchRecord>();
    for (const d of all) {
      if (d?.dispatchId) map.set(d.dispatchId, d);
    }
    map.set(dispatch.dispatchId, dispatch);
    localStorage.setItem(
      DISPATCHES_LIST_KEY,
      JSON.stringify(Array.from(map.values()))
    );

    // Also update linked case status in client cases if present
    if (dispatch.caseId) {
      const cases = getClientCases();
      let updated = false;
      for (const c of cases) {
        if (c.caseId === dispatch.caseId) {
          c.status = "Dispatched";
          if (dispatch.finalComplaintText && c.generatedComplaint) {
            c.generatedComplaint.bodyText = dispatch.finalComplaintText;
          }
          updated = true;
        }
      }
      if (updated) {
        localStorage.setItem(CASES_LIST_KEY, JSON.stringify(cases));
      }
    }

    window.dispatchEvent(new Event("haqai-dispatch-updated"));
  } catch {
    // ignore
  }
}

export function getClientHelpers(): LegalHelperAvailability[] {
  if (typeof window === "undefined") return [];
  const map = new Map<string, LegalHelperAvailability>();

  try {
    const listRaw = localStorage.getItem(HELPERS_LIST_KEY);
    if (listRaw) {
      const list = JSON.parse(listRaw) as LegalHelperAvailability[];
      if (Array.isArray(list)) {
        for (const h of list) {
          if (h?.helperId) map.set(h.helperId, h);
        }
      }
    }
  } catch {
    // ignore
  }

  try {
    const singleRaw = localStorage.getItem(ACTIVE_HELPER_KEY);
    if (singleRaw) {
      const single = JSON.parse(singleRaw) as LegalHelperAvailability;
      if (single?.helperId && single.fullName) {
        map.set(single.helperId, single);
      }
    }
  } catch {
    // ignore
  }

  return Array.from(map.values()).sort(
    (a, b) =>
      new Date(b.updatedAt || 0).getTime() -
      new Date(a.updatedAt || 0).getTime()
  );
}

export function saveClientHelper(helper: LegalHelperAvailability) {
  if (typeof window === "undefined" || !helper?.helperId) return;
  try {
    localStorage.setItem(ACTIVE_HELPER_KEY, JSON.stringify(helper));
    const all = getClientHelpers();
    const map = new Map<string, LegalHelperAvailability>();
    for (const h of all) {
      if (h?.helperId) map.set(h.helperId, h);
    }
    map.set(helper.helperId, helper);
    localStorage.setItem(
      HELPERS_LIST_KEY,
      JSON.stringify(Array.from(map.values()))
    );
    window.dispatchEvent(new Event("haqai-helper-updated"));
  } catch {
    // ignore
  }
}

export function updateClientStatus(params: {
  caseId?: string;
  dispatchId?: string;
  status: string;
}) {
  if (typeof window === "undefined") return;
  try {
    if (params.caseId) {
      const cases = getClientCases();
      for (const c of cases) {
        if (c.caseId === params.caseId) {
          c.status = params.status as
            | "Open"
            | "Dispatched"
            | "Resolved"
            | "Under Review";
        }
      }
      localStorage.setItem(CASES_LIST_KEY, JSON.stringify(cases));
    }

    if (params.dispatchId) {
      const dispatches = getClientDispatches();
      for (const d of dispatches) {
        if (d.dispatchId === params.dispatchId) {
          d.status = params.status as "Dispatched" | "In Progress" | "Resolved";
        }
      }
      localStorage.setItem(DISPATCHES_LIST_KEY, JSON.stringify(dispatches));
    }
  } catch {
    // ignore
  }
}
