"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  ShieldAlert,
  Users,
  FileText,
  Send,
  CheckCircle2,
  RefreshCw,
  Lock,
  LogOut,
  HeartHandshake,
} from "lucide-react";
import { CitizenProfile } from "@/lib/supabase";
import { HaqAIAnalysisResult } from "@/lib/ai-engine";
import { DispatchRecord, LegalHelperAvailability } from "@/lib/store";

const ADMIN_PASSCODE = "12341234";

export default function AdminDashboardPage() {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");
  const [authError, setAuthError] = useState<string | null>(null);

  const [profiles, setProfiles] = useState<CitizenProfile[]>([]);
  const [cases, setCases] = useState<HaqAIAnalysisResult[]>([]);
  const [dispatches, setDispatches] = useState<DispatchRecord[]>([]);
  const [helpers, setHelpers] = useState<LegalHelperAvailability[]>([]);
  const [systemStatus, setSystemStatus] = useState<{
    isGeminiConfigured: boolean;
    isGroqConfigured: boolean;
    isSupabaseConfigured: boolean;
    appUrl: string;
  } | null>(null);
  const [activeTab, setActiveTab] = useState<
    "citizens" | "cases" | "dispatches" | "helpers"
  >("citizens");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    try {
      const savedUnlock = sessionStorage.getItem("haqai_admin_unlocked");
      if (savedUnlock === "true") {
        setIsUnlocked(true);
      }
    } catch {
      // ignore sessionStorage errors
    }
  }, []);

  useEffect(() => {
    if (isUnlocked) {
      loadAdminData();
    }
  }, [isUnlocked]);

  function handleUnlockSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (passwordInput === ADMIN_PASSCODE) {
      setIsUnlocked(true);
      setAuthError(null);
      try {
        sessionStorage.setItem("haqai_admin_unlocked", "true");
      } catch {
        // ignore
      }
    } else {
      setAuthError("Incorrect admin password. Please try again.");
    }
  }

  function handleLockAdmin() {
    setIsUnlocked(false);
    setPasswordInput("");
    try {
      sessionStorage.removeItem("haqai_admin_unlocked");
    } catch {
      // ignore
    }
  }

  async function loadAdminData() {
    setLoading(true);
    try {
      const res = await fetch("/api/admin");
      const data = await res.json();
      setProfiles(data.profiles || []);
      setCases(data.cases || []);
      setDispatches(data.dispatches || []);
      setHelpers(data.helpers || []);
      setSystemStatus(data.systemStatus || null);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  async function handleStatusUpdate(params: {
    caseId?: string;
    dispatchId?: string;
    status: string;
  }) {
    await fetch("/api/admin", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(params),
    });
    loadAdminData();
  }

  // Password Gate Screen
  if (!isUnlocked) {
    return (
      <div className="mx-auto max-w-md px-4 py-20">
        <div className="soft-card rounded-3xl p-8 space-y-6 border border-slate-200 shadow-xl">
          <div className="flex flex-col items-center text-center space-y-2">
            <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-emerald-700 to-teal-700 text-white flex items-center justify-center shadow-md">
              <Lock className="h-6 w-6" />
            </div>
            <span className="rounded-full bg-amber-100 px-3 py-0.5 text-[11px] font-bold uppercase tracking-wider text-amber-900">
              Restricted Access
            </span>
            <h1 className="text-2xl font-extrabold text-slate-900">
              HaqAI Admin Panel
            </h1>
            <p className="text-xs text-slate-500">
              Enter the administrator password to access citizen records, legal
              cases, 1-click complaint dispatches, and Card 9 volunteers.
            </p>
          </div>

          <form onSubmit={handleUnlockSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Admin Password
              </label>
              <input
                type="password"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                placeholder="Enter admin password..."
                autoFocus
                className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm font-mono focus:border-teal-600 focus:outline-none"
              />
            </div>

            {authError && (
              <p className="text-xs font-semibold text-rose-600 bg-rose-50 border border-rose-200 rounded-xl px-3 py-2">
                {authError}
              </p>
            )}

            <button
              type="submit"
              className="w-full rounded-xl bg-gradient-to-r from-teal-600 to-emerald-600 py-3 text-sm font-bold text-white shadow-md hover:from-teal-700 hover:to-emerald-700 transition"
            >
              Unlock Admin Dashboard
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      {/* Header */}
      <div className="rounded-2xl bg-gradient-to-r from-slate-900 via-[#01411C] to-slate-900 p-6 sm:p-8 text-white shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-400/20 px-3 py-1 text-xs font-bold text-amber-300">
              <ShieldAlert className="h-3.5 w-3.5" /> HaqAI Admin Control Panel
            </span>
            <h1 className="mt-2 text-2xl sm:text-3xl font-extrabold">
              Admin Dashboard: Citizens, Cases, Dispatches &amp; Volunteers
            </h1>
            <p className="mt-1 text-sm text-emerald-100/90">
              Monitor registered citizens, AI legal consultations, 1-click
              dispatched complaints, and Card 9 Legal Aid Volunteers.
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={loadAdminData}
              className="inline-flex items-center gap-2 rounded-xl bg-[#D4AF37] px-4 py-2.5 text-xs font-extrabold text-[#01411C] hover:bg-amber-400 transition"
            >
              <RefreshCw className="h-4 w-4" />
              <span>Refresh Data</span>
            </button>
            <button
              type="button"
              onClick={handleLockAdmin}
              className="inline-flex items-center gap-1.5 rounded-xl bg-white/10 border border-white/20 px-3.5 py-2.5 text-xs font-bold text-white hover:bg-white/20 transition"
            >
              <LogOut className="h-4 w-4" />
              <span>Lock</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="soft-card rounded-2xl p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase text-slate-500">
              Registered Citizens
            </span>
            <Users className="h-5 w-5 text-teal-600" />
          </div>
          <p className="mt-2 text-3xl font-extrabold text-slate-900">
            {profiles.length}
          </p>
          <p className="mt-1 text-xs text-emerald-700 font-medium">
            Unique HaqAI Citizen IDs
          </p>
        </div>

        <div className="soft-card rounded-2xl p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase text-slate-500">
              Total Legal Cases
            </span>
            <FileText className="h-5 w-5 text-teal-600" />
          </div>
          <p className="mt-2 text-3xl font-extrabold text-slate-900">
            {cases.length}
          </p>
          <p className="mt-1 text-xs text-slate-500">
            Live AI Legal Consultations
          </p>
        </div>

        <div className="soft-card rounded-2xl p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase text-slate-500">
              1-Click Dispatched
            </span>
            <Send className="h-5 w-5 text-emerald-600" />
          </div>
          <p className="mt-2 text-3xl font-extrabold text-slate-900">
            {dispatches.length}
          </p>
          <p className="mt-1 text-xs text-emerald-700 font-medium">
            Citizen-Approved Applications
          </p>
        </div>

        <div className="soft-card rounded-2xl p-5 space-y-1.5">
          <span className="text-xs font-bold uppercase text-slate-500 block">
            Live Integrations Status
          </span>
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold">Gemini / Groq LLM:</span>
            <span
              className={`rounded px-2 py-0.5 font-bold ${
                systemStatus?.isGeminiConfigured ||
                systemStatus?.isGroqConfigured
                  ? "bg-green-100 text-green-800"
                  : "bg-amber-100 text-amber-800"
              }`}
            >
              {systemStatus?.isGeminiConfigured ||
              systemStatus?.isGroqConfigured
                ? "Active"
                : "Not Set"}
            </span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold">Supabase DB:</span>
            <span
              className={`rounded px-2 py-0.5 font-bold ${
                systemStatus?.isSupabaseConfigured
                  ? "bg-green-100 text-green-800"
                  : "bg-amber-100 text-amber-800"
              }`}
            >
              {systemStatus?.isSupabaseConfigured ? "Connected" : "Local Store"}
            </span>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-3">
        <button
          type="button"
          onClick={() => setActiveTab("citizens")}
          className={`rounded-xl px-4 py-2.5 text-xs font-extrabold transition ${
            activeTab === "citizens"
              ? "bg-[#01411C] text-[#D4AF37] shadow"
              : "bg-white border border-slate-200 text-slate-700 hover:bg-slate-50"
          }`}
        >
          1. Registered Citizens ({profiles.length})
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("cases")}
          className={`rounded-xl px-4 py-2.5 text-xs font-extrabold transition ${
            activeTab === "cases"
              ? "bg-[#01411C] text-[#D4AF37] shadow"
              : "bg-white border border-slate-200 text-slate-700 hover:bg-slate-50"
          }`}
        >
          2. Legal Cases ({cases.length})
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("dispatches")}
          className={`rounded-xl px-4 py-2.5 text-xs font-extrabold transition ${
            activeTab === "dispatches"
              ? "bg-[#01411C] text-[#D4AF37] shadow"
              : "bg-white border border-slate-200 text-slate-700 hover:bg-slate-50"
          }`}
        >
          3. Dispatched Complaints ({dispatches.length})
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("helpers")}
          className={`rounded-xl px-4 py-2.5 text-xs font-extrabold transition ${
            activeTab === "helpers"
              ? "bg-[#01411C] text-[#D4AF37] shadow"
              : "bg-white border border-slate-200 text-slate-700 hover:bg-slate-50"
          }`}
        >
          4. Card 9 Legal Volunteers ({helpers.length})
        </button>
      </div>

      {loading ? (
        <div className="p-8 text-center text-sm text-slate-600">
          Loading Admin Panel records...
        </div>
      ) : (
        <>
          {/* TAB 1: CITIZEN PROFILES */}
          {activeTab === "citizens" && (
            <div className="soft-card rounded-2xl overflow-hidden">
              <div className="p-5 border-b border-slate-100 flex items-center justify-between">
                <div>
                  <h2 className="text-base font-extrabold text-slate-900">
                    Registered Citizens Directory (`citizen_profiles`)
                  </h2>
                  <p className="text-xs text-slate-500">
                    Real registered citizens with their unique HaqAI Citizen ID.
                  </p>
                </div>
                <Link
                  href="/profile"
                  className="rounded-xl bg-[#01411C] px-3.5 py-2 text-xs font-bold text-[#D4AF37]"
                >
                  + Add / Edit Citizen Profile
                </Link>
              </div>

              {profiles.length === 0 ? (
                <div className="p-8 text-center text-xs text-slate-500">
                  No citizen profiles registered yet.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 text-slate-600 uppercase border-b border-slate-200">
                      <tr>
                        <th className="py-3.5 px-4">HaqAI Citizen ID</th>
                        <th className="py-3.5 px-4">Full Name</th>
                        <th className="py-3.5 px-4">CNIC Number</th>
                        <th className="py-3.5 px-4">Phone</th>
                        <th className="py-3.5 px-4">Email</th>
                        <th className="py-3.5 px-4">City / Province</th>
                        <th className="py-3.5 px-4">Address</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {profiles.map((p) => (
                        <tr key={p.haqId} className="hover:bg-slate-50/80">
                          <td className="py-3.5 px-4 font-mono font-extrabold text-teal-700">
                            {p.haqId}
                          </td>
                          <td className="py-3.5 px-4 font-bold text-slate-900">
                            {p.fullName}
                          </td>
                          <td className="py-3.5 px-4 font-mono text-slate-800">
                            {p.cnic}
                          </td>
                          <td className="py-3.5 px-4 font-mono text-emerald-800 font-semibold">
                            {p.phone}
                          </td>
                          <td className="py-3.5 px-4 text-slate-700">
                            {p.email}
                          </td>
                          <td className="py-3.5 px-4 text-slate-700">
                            {p.city}, {p.province}
                          </td>
                          <td className="py-3.5 px-4 text-slate-600 max-w-xs truncate">
                            {p.address}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: ALL LEGAL CASES */}
          {activeTab === "cases" && (
            <div className="space-y-4">
              {cases.length === 0 ? (
                <div className="soft-card rounded-2xl p-8 text-center text-sm text-slate-500">
                  No legal cases recorded yet.
                </div>
              ) : (
                cases.map((c) => (
                  <div
                    key={c.caseId}
                    className="soft-card rounded-2xl p-5 space-y-3"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="rounded-lg bg-[#01411C] px-2.5 py-1 font-mono text-xs font-bold text-[#D4AF37]">
                          Case: {c.caseId}
                        </span>
                        <span className="rounded-lg bg-emerald-100 px-2.5 py-1 font-mono text-xs font-bold text-[#01411C]">
                          Citizen ID: {c.haqId || "UNREGISTERED"}
                        </span>
                        <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-[11px] font-bold uppercase text-slate-700">
                          Channel: {c.channel}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <select
                          value={c.status || "Open"}
                          onChange={(e) =>
                            handleStatusUpdate({
                              caseId: c.caseId,
                              status: e.target.value,
                            })
                          }
                          className="rounded-lg border border-slate-300 bg-slate-50 px-2.5 py-1 text-xs font-bold text-slate-900"
                        >
                          <option value="Open">Open</option>
                          <option value="Under Review">Under Review</option>
                          <option value="Dispatched">Dispatched</option>
                          <option value="Resolved">Resolved</option>
                        </select>

                        <Link
                          href={`/complaint?caseId=${c.caseId}`}
                          className="rounded-lg bg-amber-100 px-3 py-1 text-xs font-bold text-amber-900 hover:bg-amber-200"
                        >
                          Open Complaint →
                        </Link>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 gap-3 md:grid-cols-3 text-xs bg-slate-50 rounded-xl p-3.5 border border-slate-100">
                      <div>
                        <span className="text-slate-500 block">
                          Citizen Name &amp; CNIC:
                        </span>
                        <span className="font-bold text-slate-900">
                          {c.generatedComplaint.facts.applicantName || "N/A"} (
                          {c.generatedComplaint.facts.cnic || "N/A"})
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-500 block">Legal Area:</span>
                        <span className="font-bold text-teal-700">
                          {c.categoryTitle}
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-500 block">
                          Matched Authority:
                        </span>
                        <span className="font-bold text-slate-900">
                          {c.primaryAuthority.name}
                        </span>
                      </div>
                    </div>

                    <p className="text-xs text-slate-800 italic">
                      <strong>Citizen Statement:</strong> &ldquo;{c.userQuery}
                      &rdquo;
                    </p>
                  </div>
                ))
              )}
            </div>
          )}

          {/* TAB 3: DISPATCHED COMPLAINTS */}
          {activeTab === "dispatches" && (
            <div className="space-y-4">
              {dispatches.length === 0 ? (
                <div className="soft-card rounded-2xl p-8 text-center text-sm text-slate-600">
                  No complaints have been 1-click dispatched yet. Go to{" "}
                  <Link
                    href="/complaint"
                    className="font-bold text-teal-700 underline"
                  >
                    1-Click Complaint Studio
                  </Link>{" "}
                  to approve and forward a complaint.
                </div>
              ) : (
                dispatches.map((d) => (
                  <div
                    key={d.dispatchId}
                    className="soft-card rounded-2xl border-2 border-green-600/50 p-5 space-y-3"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="h-5 w-5 text-green-600" />
                        <span className="font-mono text-xs font-extrabold text-green-900 bg-green-100 px-2.5 py-1 rounded">
                          {d.dispatchId}
                        </span>
                        <span className="font-mono text-xs font-bold text-teal-800 bg-emerald-50 px-2.5 py-1 rounded">
                          Citizen ID: {d.haqId}
                        </span>
                      </div>

                      <select
                        value={d.status}
                        onChange={(e) =>
                          handleStatusUpdate({
                            dispatchId: d.dispatchId,
                            status: e.target.value,
                          })
                        }
                        className="rounded-lg border border-green-400 bg-green-50 px-3 py-1 text-xs font-bold text-green-900"
                      >
                        <option value="Dispatched">Dispatched</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Resolved">Resolved</option>
                      </select>
                    </div>

                    <div className="grid grid-cols-1 gap-2 sm:grid-cols-3 text-xs bg-slate-50 p-3 rounded-xl">
                      <p>
                        <strong>Citizen:</strong> {d.citizenName} ({d.citizenCnic}
                        )
                      </p>
                      <p>
                        <strong>Phone &amp; City:</strong> {d.citizenPhone} •{" "}
                        {d.citizenCity}
                      </p>
                      <p>
                        <strong>Forwarded To:</strong> {d.authorityName} (
                        {d.authorityEmail})
                      </p>
                    </div>

                    <details className="text-xs">
                      <summary className="cursor-pointer font-bold text-teal-700">
                        View Full Dispatched Formal Application Text
                      </summary>
                      <pre className="mt-2 whitespace-pre-wrap rounded-xl bg-slate-900 p-4 font-mono text-[11px] text-emerald-100">
                        {d.finalComplaintText}
                      </pre>
                    </details>
                  </div>
                ))
              )}
            </div>
          )}

          {/* TAB 4: CARD 9 LEGAL VOLUNTEERS */}
          {activeTab === "helpers" && (
            <div className="space-y-4">
              {helpers.length === 0 ? (
                <div className="soft-card rounded-2xl p-8 text-center text-sm text-slate-600">
                  No volunteers have toggled the Card 9 Availability Switch yet.
                  Visit{" "}
                  <Link
                    href="/volunteer"
                    className="font-bold text-teal-700 underline"
                  >
                    Availability Switch (/volunteer)
                  </Link>{" "}
                  to register a volunteer.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {helpers.map((h) => (
                    <div
                      key={h.helperId}
                      className="soft-card rounded-2xl p-5 space-y-2.5"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <HeartHandshake className="h-5 w-5 text-emerald-600" />
                          <span className="font-bold text-sm text-slate-900">
                            {h.fullName}
                          </span>
                        </div>
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                            h.isAvailable
                              ? "bg-emerald-100 text-emerald-800"
                              : "bg-slate-200 text-slate-700"
                          }`}
                        >
                          {h.isAvailable ? "Switch ON (Available)" : "Paused"}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600">
                        {h.roleTitle} • {h.city} • Time Slot:{" "}
                        <strong>{h.timeSlot}</strong>
                      </p>
                      <p className="text-xs text-slate-500">
                        Help Types: {h.helpTypes.join(", ")}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}
