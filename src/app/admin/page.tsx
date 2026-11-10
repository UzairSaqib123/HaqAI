"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  ShieldAlert,
  Users,
  FileText,
  Send,
  CheckCircle2,
  Key,
  Database,
  Smartphone,
  ExternalLink,
  RefreshCw,
} from "lucide-react";
import { CitizenProfile } from "@/lib/supabase";
import { HaqAIAnalysisResult } from "@/lib/ai-engine";
import { DispatchRecord } from "@/lib/store";

export default function AdminDashboardPage() {
  const [profiles, setProfiles] = useState<CitizenProfile[]>([]);
  const [cases, setCases] = useState<HaqAIAnalysisResult[]>([]);
  const [dispatches, setDispatches] = useState<DispatchRecord[]>([]);
  const [systemStatus, setSystemStatus] = useState<{
    isGeminiConfigured: boolean;
    isSupabaseConfigured: boolean;
    isWhatsAppConfigured: boolean;
    whatsappNumber: string;
    appUrl: string;
  } | null>(null);
  const [activeTab, setActiveTab] = useState<
    "citizens" | "cases" | "dispatches" | "setup"
  >("citizens");
  const [loading, setLoading] = useState(true);

  // Admin Webhook Test state (simulates an incoming real WhatsApp webhook hit from a citizen's phone)
  const [testWaPhone, setTestWaPhone] = useState("+923001234567");
  const [testWaMessage, setTestWaMessage] = useState(
    "Meri university meri original degree wapas nahi kar rahi. Main kya kar sakta hoon?"
  );
  const [testWaResult, setTestWaResult] = useState<{
    caseId: string;
    whatsappReply: string;
  } | null>(null);

  async function loadAdminData() {
    setLoading(true);
    try {
      const res = await fetch("/api/admin");
      const data = await res.json();
      setProfiles(data.profiles || []);
      setCases(data.cases || []);
      setDispatches(data.dispatches || []);
      setSystemStatus(data.systemStatus || null);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadAdminData();
  }, []);

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

  async function handleTestRealWhatsAppWebhook() {
    const res = await fetch("/api/whatsapp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        senderPhone: testWaPhone,
        message: testWaMessage,
        isVoiceNote: true,
      }),
    });
    const data = await res.json();
    if (data.success) {
      setTestWaResult({
        caseId: data.caseId,
        whatsappReply: data.whatsappReply,
      });
      loadAdminData();
    }
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
              Admin Dashboard: Citizens, Cases, Complaints &amp; Integrations
            </h1>
            <p className="mt-1 text-sm text-emerald-100/90">
              Monitor registered citizens (`HAQ-PK-XXXXXX`), Google Auth
              profiles, legal consultations, 1-click dispatched complaints, and
              system keys (`Gemini`, `Supabase`, `Real WhatsApp Webhook`).
            </p>
          </div>
          <button
            type="button"
            onClick={loadAdminData}
            className="inline-flex items-center gap-2 rounded-xl bg-[#D4AF37] px-4 py-2.5 text-xs font-extrabold text-[#01411C] hover:bg-amber-400 transition shrink-0"
          >
            <RefreshCw className="h-4 w-4" />
            <span>Refresh Data</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase text-slate-500">
              Registered Citizens
            </span>
            <Users className="h-5 w-5 text-[#01411C]" />
          </div>
          <p className="mt-2 text-3xl font-extrabold text-slate-900">
            {profiles.length}
          </p>
          <p className="mt-1 text-xs text-emerald-700 font-medium">
            Unique HaqAI Citizen IDs Issued
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase text-slate-500">
              Total Legal Cases
            </span>
            <FileText className="h-5 w-5 text-[#01411C]" />
          </div>
          <p className="mt-2 text-3xl font-extrabold text-slate-900">
            {cases.length}
          </p>
          <p className="mt-1 text-xs text-slate-600">
            Website + Real WhatsApp Webhook
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase text-slate-500">
              1-Click Dispatched
            </span>
            <Send className="h-5 w-5 text-green-600" />
          </div>
          <p className="mt-2 text-3xl font-extrabold text-slate-900">
            {dispatches.length}
          </p>
          <p className="mt-1 text-xs text-green-700 font-medium">
            Citizen-Approved Applications
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-1.5">
          <span className="text-xs font-bold uppercase text-slate-500 block">
            Live Integrations Status
          </span>
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold">Gemini LLM Key:</span>
            <span
              className={`rounded px-2 py-0.5 font-bold ${
                systemStatus?.isGeminiConfigured
                  ? "bg-green-100 text-green-800"
                  : "bg-amber-100 text-amber-800"
              }`}
            >
              {systemStatus?.isGeminiConfigured ? "Active" : "Add in .env.local"}
            </span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold">Supabase DB &amp; Auth:</span>
            <span
              className={`rounded px-2 py-0.5 font-bold ${
                systemStatus?.isSupabaseConfigured
                  ? "bg-green-100 text-green-800"
                  : "bg-amber-100 text-amber-800"
              }`}
            >
              {systemStatus?.isSupabaseConfigured
                ? "Connected"
                : "Local + Ready"}
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
          1. Registered Citizens &amp; HaqAI IDs ({profiles.length})
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
          2. All Legal Consultations &amp; Cases ({cases.length})
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
          3. 1-Click Dispatched Complaints ({dispatches.length})
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("setup")}
          className={`rounded-xl px-4 py-2.5 text-xs font-extrabold transition ${
            activeTab === "setup"
              ? "bg-[#01411C] text-[#D4AF37] shadow"
              : "bg-amber-50 border border-amber-300 text-amber-900 hover:bg-amber-100"
          }`}
        >
          4. Setup Guide: Gemini Key, Supabase &amp; Real WhatsApp
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
            <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
              <div className="p-5 border-b border-slate-100 flex items-center justify-between">
                <div>
                  <h2 className="text-base font-extrabold text-slate-900">
                    Registered Citizens Directory (`citizen_profiles`)
                  </h2>
                  <p className="text-xs text-slate-500">
                    Every citizen who signs in via Google Auth and completes
                    their onboarding profile appears here with their unique
                    HaqAI ID.
                  </p>
                </div>
                <Link
                  href="/profile"
                  className="rounded-xl bg-[#01411C] px-3.5 py-2 text-xs font-bold text-[#D4AF37]"
                >
                  + Add / Edit Citizen Profile
                </Link>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-600 uppercase border-b border-slate-200">
                    <tr>
                      <th className="py-3.5 px-4">HaqAI Citizen ID</th>
                      <th className="py-3.5 px-4">Full Name</th>
                      <th className="py-3.5 px-4">CNIC Number</th>
                      <th className="py-3.5 px-4">WhatsApp / Phone</th>
                      <th className="py-3.5 px-4">Google Email</th>
                      <th className="py-3.5 px-4">City / Province</th>
                      <th className="py-3.5 px-4">Address</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {profiles.map((p) => (
                      <tr key={p.haqId} className="hover:bg-slate-50/80">
                        <td className="py-3.5 px-4 font-mono font-extrabold text-[#01411C]">
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
            </div>
          )}

          {/* TAB 2: ALL LEGAL CASES */}
          {activeTab === "cases" && (
            <div className="space-y-4">
              {cases.map((c) => (
                <div
                  key={c.caseId}
                  className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-3"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="rounded-lg bg-[#01411C] px-2.5 py-1 font-mono text-xs font-bold text-[#D4AF37]">
                        Case: {c.caseId}
                      </span>
                      <span className="rounded-lg bg-emerald-100 px-2.5 py-1 font-mono text-xs font-bold text-[#01411C]">
                        Citizen ID: {c.haqId || "HAQ-PK-104829"}
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
                      <span className="text-slate-500 block">Citizen Name &amp; CNIC:</span>
                      <span className="font-bold text-slate-900">
                        {c.generatedComplaint.facts.applicantName} (
                        {c.generatedComplaint.facts.cnic})
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-500 block">Legal Area:</span>
                      <span className="font-bold text-[#01411C]">
                        {c.categoryTitle}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-500 block">Matched Authority:</span>
                      <span className="font-bold text-slate-900">
                        {c.primaryAuthority.name}
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-800 italic">
                    <strong>Citizen Statement:</strong> &ldquo;{c.userQuery}&rdquo;
                  </p>
                </div>
              ))}
            </div>
          )}

          {/* TAB 3: DISPATCHED COMPLAINTS */}
          {activeTab === "dispatches" && (
            <div className="space-y-4">
              {dispatches.length === 0 ? (
                <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-sm text-slate-600">
                  No complaints have been 1-click dispatched yet. Go to{" "}
                  <Link
                    href="/complaint"
                    className="font-bold text-[#01411C] underline"
                  >
                    1-Click Complaint Studio
                  </Link>{" "}
                  to approve and forward a complaint.
                </div>
              ) : (
                dispatches.map((d) => (
                  <div
                    key={d.dispatchId}
                    className="rounded-2xl border-2 border-green-600/50 bg-white p-5 shadow-sm space-y-3"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="h-5 w-5 text-green-600" />
                        <span className="font-mono text-xs font-extrabold text-green-900 bg-green-100 px-2.5 py-1 rounded">
                          {d.dispatchId}
                        </span>
                        <span className="font-mono text-xs font-bold text-[#01411C] bg-emerald-50 px-2.5 py-1 rounded">
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
                        <strong>Citizen:</strong> {d.citizenName} ({d.citizenCnic})
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
                      <summary className="cursor-pointer font-bold text-[#01411C]">
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

          {/* TAB 4: SETUP GUIDE FOR GEMINI, SUPABASE & REAL WHATSAPP */}
          {activeTab === "setup" && (
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
              <div className="lg:col-span-7 space-y-6">
                {/* 1. Gemini Key Setup */}
                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-3">
                  <div className="flex items-center gap-2 text-sm font-extrabold text-[#01411C]">
                    <Key className="h-5 w-5" />
                    <span>
                      1. How to Add Google Gemini LLM Key (`GEMINI_API_KEY`)
                    </span>
                  </div>
                  <ol className="list-decimal pl-5 space-y-1.5 text-xs text-slate-700 leading-relaxed">
                    <li>
                      Open{" "}
                      <a
                        href="https://aistudio.google.com/app/apikey"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-bold text-[#01411C] underline"
                      >
                        Google AI Studio (aistudio.google.com/app/apikey)
                      </a>{" "}
                      and click <strong>Create API Key</strong>.
                    </li>
                    <li>
                      Open the file{" "}
                      <code className="bg-slate-100 px-1.5 py-0.5 rounded font-mono">
                        .env.local
                      </code>{" "}
                      in your project root folder (`c:\Users\uzair\Desktop\Hackathon Project\.env.local`).
                    </li>
                    <li>
                      Paste your key:{" "}
                      <code className="bg-slate-100 px-1.5 py-0.5 rounded font-mono">
                        GEMINI_API_KEY=AIzaSy...
                      </code>
                    </li>
                    <li>
                      HaqAI will immediately use <strong>Gemini 2.5 Flash</strong>{" "}
                      to answer any question from the 1973 Constitution &amp; all
                      Pakistani laws AND transcribe voice notes!
                    </li>
                  </ol>
                </div>

                {/* 2. Supabase Setup */}
                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-3">
                  <div className="flex items-center gap-2 text-sm font-extrabold text-[#01411C]">
                    <Database className="h-5 w-5" />
                    <span>
                      2. How to Connect Supabase (Google Auth + Database)
                    </span>
                  </div>
                  <ol className="list-decimal pl-5 space-y-1.5 text-xs text-slate-700 leading-relaxed">
                    <li>
                      Create a free project at{" "}
                      <a
                        href="https://supabase.com/dashboard"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-bold text-[#01411C] underline"
                      >
                        supabase.com/dashboard
                      </a>
                      .
                    </li>
                    <li>
                      Open <strong>SQL Editor</strong> in Supabase, copy the
                      contents of{" "}
                      <code className="bg-slate-100 px-1.5 py-0.5 rounded font-mono">
                        supabase/schema.sql
                      </code>
                      , and click <strong>Run</strong>.
                    </li>
                    <li>
                      In Supabase <strong>Authentication → Providers → Google</strong>,
                      enable Google Sign-In and set Redirect URL to{" "}
                      <code className="bg-slate-100 px-1.5 py-0.5 rounded font-mono">
                        http://localhost:3001/profile
                      </code>
                      .
                    </li>
                    <li>
                      Copy your Project URL &amp; `anon` public key from{" "}
                      <strong>Project Settings → API</strong> and paste them into{" "}
                      <code className="bg-slate-100 px-1.5 py-0.5 rounded font-mono">
                        .env.local
                      </code>{" "}
                      as <code className="font-mono">NEXT_PUBLIC_SUPABASE_URL</code>{" "}
                      and{" "}
                      <code className="font-mono">
                        NEXT_PUBLIC_SUPABASE_ANON_KEY
                      </code>
                      .
                    </li>
                  </ol>
                </div>

                {/* 3. Real WhatsApp Setup */}
                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-3">
                  <div className="flex items-center gap-2 text-sm font-extrabold text-[#01411C]">
                    <Smartphone className="h-5 w-5" />
                    <span>
                      3. How to Connect Real Original WhatsApp (`/api/whatsapp`)
                    </span>
                  </div>
                  <ol className="list-decimal pl-5 space-y-1.5 text-xs text-slate-700 leading-relaxed">
                    <li>
                      Our backend webhook at{" "}
                      <code className="bg-slate-100 px-1.5 py-0.5 rounded font-mono">
                        /api/whatsapp
                      </code>{" "}
                      supports both <strong>Meta WhatsApp Cloud API</strong> and{" "}
                      <strong>Twilio WhatsApp Sandbox/Business</strong>.
                    </li>
                    <li>
                      Run{" "}
                      <code className="bg-slate-100 px-1.5 py-0.5 rounded font-mono">
                        npx ngrok http 3001
                      </code>{" "}
                      (or deploy to Vercel) and set your WhatsApp Webhook URL to{" "}
                      <code className="bg-slate-100 px-1.5 py-0.5 rounded font-mono">
                        https://your-domain/api/whatsapp
                      </code>{" "}
                      with Verify Token{" "}
                      <code className="bg-slate-100 px-1.5 py-0.5 rounded font-mono">
                        haqai_whatsapp_verify_2026
                      </code>
                      .
                    </li>
                    <li>
                      When a citizen messages or sends a voice note on{" "}
                      <strong>real WhatsApp</strong>, `/api/whatsapp` looks up
                      their phone number in `citizen_profiles`, analyzes the
                      case with Gemini, and replies on WhatsApp with their{" "}
                      <strong>Website Case Link</strong> (`/complaint?caseId=...`
                      &amp; `/assistant?caseId=...`)!
                    </li>
                  </ol>
                </div>
              </div>

              {/* Right: Live Real WhatsApp Webhook Tester for Admin */}
              <div className="lg:col-span-5">
                <div className="rounded-2xl border border-slate-200 bg-slate-900 p-6 text-white shadow-lg space-y-4">
                  <h3 className="text-sm font-extrabold text-[#D4AF37]">
                    Test Real WhatsApp Webhook (`/api/whatsapp`)
                  </h3>
                  <p className="text-xs text-slate-300">
                    Simulate an incoming webhook payload from Meta/Twilio
                    WhatsApp to verify how `/api/whatsapp` matches the citizen&apos;s
                    phone number (`{testWaPhone}`) to their HaqAI ID and returns
                    the Website handoff link:
                  </p>

                  <div>
                    <label className="block text-xs font-bold text-emerald-300 mb-1">
                      Incoming Citizen WhatsApp Phone:
                    </label>
                    <input
                      type="text"
                      value={testWaPhone}
                      onChange={(e) => setTestWaPhone(e.target.value)}
                      className="w-full rounded-xl bg-slate-800 border border-slate-700 px-3 py-2 text-xs font-mono text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-emerald-300 mb-1">
                      Incoming WhatsApp Voice Note / Message:
                    </label>
                    <textarea
                      rows={3}
                      value={testWaMessage}
                      onChange={(e) => setTestWaMessage(e.target.value)}
                      className="w-full rounded-xl bg-slate-800 border border-slate-700 p-3 text-xs text-white"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={handleTestRealWhatsAppWebhook}
                    className="w-full rounded-xl bg-green-500 py-3 text-xs font-extrabold text-slate-950 hover:bg-green-400 transition"
                  >
                    Trigger Incoming `/api/whatsapp` Webhook
                  </button>

                  {testWaResult && (
                    <div className="rounded-xl bg-slate-800 border border-emerald-500/40 p-4 space-y-2 text-xs">
                      <p className="font-bold text-green-400">
                        WhatsApp Reply Dispatched (Case: {testWaResult.caseId}):
                      </p>
                      <pre className="whitespace-pre-wrap font-sans text-[11px] text-slate-200 leading-relaxed">
                        {testWaResult.whatsappReply}
                      </pre>
                      <div className="pt-2 flex gap-2">
                        <Link
                          href={`/complaint?caseId=${testWaResult.caseId}`}
                          className="flex-1 text-center rounded-lg bg-[#D4AF37] py-2 font-bold text-[#01411C]"
                        >
                          Open Website Link (Option 1) →
                        </Link>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
