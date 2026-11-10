"use client";

import React, { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  FileCheck2,
  Send,
  Copy,
  Download,
  ExternalLink,
  Mail,
  CheckCircle2,
  Printer,
  RefreshCw,
  Volume2,
  ShieldCheck,
  UserCheck,
} from "lucide-react";
import {
  ALL_LEGAL_CATEGORIES,
  LegalCategoryId,
  LEGAL_KNOWLEDGE_BASE,
} from "@/lib/legal-knowledge";
import {
  buildFormalComplaint,
  ExtractedUserFacts,
  HaqAIAnalysisResult,
} from "@/lib/ai-engine";
import { CitizenProfile } from "@/lib/supabase";

function ComplaintStudioContent() {
  const searchParams = useSearchParams();
  const caseIdParam = searchParams.get("caseId");
  const categoryParam = searchParams.get("category") as LegalCategoryId | null;

  const [caseId, setCaseId] = useState<string>(caseIdParam || "HAQ-DEMO01");
  const [categoryId, setCategoryId] = useState<LegalCategoryId>(
    categoryParam && LEGAL_KNOWLEDGE_BASE[categoryParam]
      ? categoryParam
      : "education"
  );

  const [facts, setFacts] = useState<ExtractedUserFacts>({
    haqId: "HAQ-PK-104829",
    rawStatement:
      "My university is refusing to return my original educational documents and degree even though I have completed all my academic requirements and fee clearance.",
    applicantName: "Muhammad Uzair",
    cnic: "35202-4829104-1",
    city: "Islamabad",
    address: "House 14, Street 8, Sector G-10/2, Islamabad",
    institutionOrRespondent:
      "Office of the Registrar / Controller of Examinations",
    dateOfIncident: new Date().toISOString().split("T")[0],
    referenceOrRollNo: "FA22-BCS-049",
    contactPhone: "+923001234567",
    contactEmail: "uzair.citizen@gmail.com",
  });

  const [complaintText, setComplaintText] = useState<string>("");
  const [viewMode, setViewMode] = useState<"letter" | "email">("letter");
  const [userApproved, setUserApproved] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isDispatching, setIsDispatching] = useState(false);
  const [dispatchReceipt, setDispatchReceipt] = useState<{
    dispatchId: string;
    dispatchedAt: string;
    authorityName: string;
    authorityEmail: string;
    portalUrl: string;
    mailtoUrl: string;
  } | null>(null);

  const activeCategory = LEGAL_KNOWLEDGE_BASE[categoryId];
  const primaryAuthority = activeCategory.authorities[0];

  // Auto-load citizen's saved profile from localStorage / backend and pre-fill
  useEffect(() => {
    let activeProf: CitizenProfile | null = null;
    try {
      const raw = localStorage.getItem("haqai_active_profile");
      if (raw) activeProf = JSON.parse(raw);
    } catch {
      // ignore
    }

    if (caseIdParam) {
      fetch(`/api/chat?caseId=${encodeURIComponent(caseIdParam)}`)
        .then((r) => r.json())
        .then((data) => {
          if (data.caseData) {
            const c: HaqAIAnalysisResult = data.caseData;
            setCaseId(c.caseId);
            setCategoryId(c.categoryId);
            const mergedFacts: ExtractedUserFacts = {
              ...c.generatedComplaint.facts,
              haqId: activeProf?.haqId || c.haqId || "HAQ-PK-104829",
              applicantName:
                activeProf?.fullName ||
                c.generatedComplaint.facts.applicantName,
              cnic: activeProf?.cnic || c.generatedComplaint.facts.cnic,
              city: activeProf?.city || c.generatedComplaint.facts.city,
              address:
                activeProf?.address || c.generatedComplaint.facts.address,
              contactPhone:
                activeProf?.phone || c.generatedComplaint.facts.contactPhone,
              contactEmail:
                activeProf?.email || c.generatedComplaint.facts.contactEmail,
            };
            setFacts(mergedFacts);
            const built = buildFormalComplaint(
              LEGAL_KNOWLEDGE_BASE[c.categoryId],
              mergedFacts,
              c.primaryAuthority
            );
            setComplaintText(built.bodyText);
          }
        })
        .catch(() => {});
    } else {
      const mergedFacts: ExtractedUserFacts = activeProf
        ? {
            ...facts,
            haqId: activeProf.haqId,
            applicantName: activeProf.fullName,
            cnic: activeProf.cnic,
            city: activeProf.city,
            address: activeProf.address,
            contactPhone: activeProf.phone,
            contactEmail: activeProf.email,
          }
        : facts;
      setFacts(mergedFacts);
      const built = buildFormalComplaint(
        LEGAL_KNOWLEDGE_BASE[categoryId],
        mergedFacts
      );
      setComplaintText(built.bodyText);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [caseIdParam]);

  function regenerateFromFacts(
    updatedFacts: ExtractedUserFacts,
    updatedCat: LegalCategoryId = categoryId
  ) {
    const entry = LEGAL_KNOWLEDGE_BASE[updatedCat];
    const built = buildFormalComplaint(entry, updatedFacts);
    setComplaintText(
      viewMode === "email" ? built.emailBody : built.bodyText
    );
    setDispatchReceipt(null);
  }

  function handleFactChange(field: keyof ExtractedUserFacts, value: string) {
    const next = { ...facts, [field]: value };
    setFacts(next);
    regenerateFromFacts(next, categoryId);
  }

  function handleCategoryChange(newCat: LegalCategoryId) {
    setCategoryId(newCat);
    regenerateFromFacts(facts, newCat);
  }

  function handleCopy() {
    navigator.clipboard.writeText(complaintText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function handleDownloadTxt() {
    const blob = new Blob([complaintText], {
      type: "text/plain;charset=utf-8",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `HaqAI-Complaint-${caseId}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function handlePrintPdf() {
    window.print();
  }

  async function handleOneClickForward() {
    if (!userApproved) return;
    setIsDispatching(true);
    try {
      const res = await fetch("/api/dispatch", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          caseId,
          haqId: facts.haqId,
          approved: userApproved,
          citizenName: facts.applicantName,
          citizenCnic: facts.cnic,
          citizenPhone: facts.contactPhone,
          citizenEmail: facts.contactEmail,
          citizenCity: facts.city,
          authorityName: primaryAuthority.name,
          authorityEmail: primaryAuthority.email,
          portalUrl: primaryAuthority.portalUrl,
          finalComplaintText: complaintText,
          subject: `${activeCategory.complaintTemplate.subjectPrefix} (${caseId})`,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setDispatchReceipt({
          dispatchId: data.dispatchRecord.dispatchId,
          dispatchedAt: data.dispatchRecord.dispatchedAt,
          authorityName: primaryAuthority.name,
          authorityEmail: primaryAuthority.email,
          portalUrl: primaryAuthority.portalUrl,
          mailtoUrl: data.mailtoUrl,
        });
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsDispatching(false);
    }
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      {/* Top Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-[#01411C] to-[#045d2a] p-6 text-white shadow-lg">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-400/20 px-3 py-1 text-xs font-bold text-amber-300">
              <FileCheck2 className="h-3.5 w-3.5" /> Website Option 1 • Pre-Filled with Citizen ID {facts.haqId}
            </span>
            <h1 className="mt-2 text-2xl sm:text-3xl font-extrabold">
              Pre-Filled Formal Complaint &amp; 1-Click Institution Dispatch
            </h1>
            <p className="mt-1 text-sm text-emerald-100/90">
              Your personal details from Citizen ID{" "}
              <strong>{facts.haqId}</strong> have been automatically populated
              below. Review, edit if needed, approve, and forward in 1 click!
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <Link
              href={`/assistant?caseId=${caseId}`}
              className="inline-flex items-center gap-1.5 rounded-xl bg-white/15 border border-white/25 px-4 py-2.5 text-xs font-bold text-white hover:bg-white/25 transition"
            >
              <Volume2 className="h-4 w-4 text-[#D4AF37]" />
              <span>Option 2: Legal Guidance</span>
            </Link>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 items-start">
        {/* Left Column: Pre-Filled Citizen Facts & Category Editor */}
        <div className="lg:col-span-5 space-y-5">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <UserCheck className="h-4 w-4 text-[#01411C]" />
                <h2 className="text-sm font-extrabold text-slate-900">
                  Pre-Filled Citizen Details ({facts.haqId})
                </h2>
              </div>
              <Link
                href="/profile"
                className="text-xs font-bold text-[#01411C] hover:underline"
              >
                Edit Profile
              </Link>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Primary Legal Category:
              </label>
              <select
                value={categoryId}
                onChange={(e) =>
                  handleCategoryChange(e.target.value as LegalCategoryId)
                }
                className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-2.5 text-xs font-semibold text-slate-900 focus:border-[#01411C] focus:outline-none"
              >
                {ALL_LEGAL_CATEGORIES.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.title.en} — ({cat.authorities[0].shortName})
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Your Full Name:
                </label>
                <input
                  type="text"
                  value={facts.applicantName}
                  onChange={(e) =>
                    handleFactChange("applicantName", e.target.value)
                  }
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  CNIC Number:
                </label>
                <input
                  type="text"
                  value={facts.cnic}
                  onChange={(e) => handleFactChange("cnic", e.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                University / Department / Respondent Name:
              </label>
              <input
                type="text"
                value={facts.institutionOrRespondent}
                onChange={(e) =>
                  handleFactChange("institutionOrRespondent", e.target.value)
                }
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs"
              />
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  City / District:
                </label>
                <input
                  type="text"
                  value={facts.city}
                  onChange={(e) => handleFactChange("city", e.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Roll No. / Reference ID:
                </label>
                <input
                  type="text"
                  value={facts.referenceOrRollNo}
                  onChange={(e) =>
                    handleFactChange("referenceOrRollNo", e.target.value)
                  }
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Phone / WhatsApp:
                </label>
                <input
                  type="text"
                  value={facts.contactPhone}
                  onChange={(e) =>
                    handleFactChange("contactPhone", e.target.value)
                  }
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs font-mono"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Email Address:
                </label>
                <input
                  type="email"
                  value={facts.contactEmail}
                  onChange={(e) =>
                    handleFactChange("contactEmail", e.target.value)
                  }
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Your Statement of Facts:
              </label>
              <textarea
                rows={3}
                value={facts.rawStatement}
                onChange={(e) =>
                  handleFactChange("rawStatement", e.target.value)
                }
                className="w-full rounded-lg border border-slate-300 p-2.5 text-xs"
              />
            </div>

            <button
              type="button"
              onClick={() => regenerateFromFacts(facts, categoryId)}
              className="w-full inline-flex items-center justify-center gap-1.5 rounded-xl bg-slate-900 px-4 py-2.5 text-xs font-bold text-white hover:bg-slate-800 transition"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              <span>Re-Generate Formal Complaint Letter</span>
            </button>
          </div>

          <div className="rounded-2xl border border-emerald-200 bg-emerald-50/70 p-5 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-1 text-xs font-extrabold uppercase text-[#01411C]">
                <ShieldCheck className="h-4 w-4" /> Verified Receiving Authority
              </span>
              <span className="rounded bg-[#01411C] px-2 py-0.5 text-[10px] font-bold text-[#D4AF37]">
                {primaryAuthority.turnaroundTime}
              </span>
            </div>
            <h3 className="text-sm font-extrabold text-slate-900">
              {primaryAuthority.name}
            </h3>
            <p className="text-xs text-slate-700">{primaryAuthority.role}</p>
            <div className="text-xs text-slate-800 space-y-1 pt-1">
              <p>
                <strong>Official Portal:</strong>{" "}
                <a
                  href={primaryAuthority.portalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline text-[#01411C] font-semibold"
                >
                  {primaryAuthority.portalUrl}
                </a>
              </p>
              <p>
                <strong>Grievance Email:</strong> {primaryAuthority.email}
              </p>
              <p>
                <strong>Helpline:</strong> {primaryAuthority.helpline}
              </p>
            </div>
          </div>
        </div>

        {/* Right Column: Editable Formal Application + Approval Gate + 1-Click Forward */}
        <div className="lg:col-span-7 space-y-5">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
              <div>
                <h2 className="text-base font-extrabold text-slate-900">
                  Review &amp; Edit Formal Complaint Document
                </h2>
                <p className="text-xs text-slate-500">
                  Pre-populated with your Citizen ID (`{facts.haqId}`). Edit any
                  line below before approving.
                </p>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => {
                    setViewMode("letter");
                    const built = buildFormalComplaint(activeCategory, facts);
                    setComplaintText(built.bodyText);
                  }}
                  className={`rounded-lg px-3 py-1.5 text-xs font-bold ${
                    viewMode === "letter"
                      ? "bg-[#01411C] text-white"
                      : "bg-slate-100 text-slate-700"
                  }`}
                >
                  Formal Application
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setViewMode("email");
                    const built = buildFormalComplaint(activeCategory, facts);
                    setComplaintText(built.emailBody);
                  }}
                  className={`rounded-lg px-3 py-1.5 text-xs font-bold ${
                    viewMode === "email"
                      ? "bg-[#01411C] text-white"
                      : "bg-slate-100 text-slate-700"
                  }`}
                >
                  Email Version
                </button>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={handleCopy}
                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-bold text-slate-800 hover:bg-slate-50"
              >
                <Copy className="h-3.5 w-3.5 text-[#01411C]" />
                <span>{copied ? "Copied to Clipboard!" : "Copy Complaint"}</span>
              </button>

              <button
                type="button"
                onClick={handleDownloadTxt}
                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-bold text-slate-800 hover:bg-slate-50"
              >
                <Download className="h-3.5 w-3.5 text-[#01411C]" />
                <span>Download (.txt)</span>
              </button>

              <button
                type="button"
                onClick={handlePrintPdf}
                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-bold text-slate-800 hover:bg-slate-50"
              >
                <Printer className="h-3.5 w-3.5 text-[#01411C]" />
                <span>Print / Save PDF</span>
              </button>

              <a
                href={primaryAuthority.portalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-600 bg-emerald-50 px-3 py-2 text-xs font-bold text-[#01411C] hover:bg-emerald-100"
              >
                <span>Open {primaryAuthority.shortName} Portal</span>
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            </div>

            <textarea
              rows={18}
              value={complaintText}
              onChange={(e) => setComplaintText(e.target.value)}
              className="w-full rounded-xl border border-slate-300 bg-slate-50/70 p-4 font-mono text-xs leading-relaxed text-slate-900 focus:border-[#01411C] focus:bg-white focus:outline-none"
            />

            <label className="flex items-start gap-3 rounded-xl border-2 border-amber-300 bg-amber-50/80 p-4 cursor-pointer">
              <input
                type="checkbox"
                checked={userApproved}
                onChange={(e) => setUserApproved(e.target.checked)}
                className="mt-0.5 h-5 w-5 rounded border-slate-300 text-[#01411C] focus:ring-[#01411C]"
              />
              <div className="text-xs text-slate-800 leading-relaxed">
                <span className="font-extrabold text-amber-950 block">
                  Step 8 • Mandatory Citizen Review &amp; Approval Gate:
                </span>
                I ({facts.applicantName}, CNIC: {facts.cnic}, ID: {facts.haqId})
                have reviewed and edited the formal complaint above and
                authorize HaqAI to forward it to{" "}
                <strong>{primaryAuthority.name}</strong>.
              </div>
            </label>

            <button
              type="button"
              disabled={!userApproved || isDispatching}
              onClick={handleOneClickForward}
              className="w-full flex items-center justify-center gap-2.5 rounded-2xl bg-[#01411C] px-6 py-4 text-base font-extrabold text-[#D4AF37] shadow-xl hover:bg-emerald-900 disabled:opacity-40 transition"
            >
              <Send className="h-5 w-5" />
              <span>
                {isDispatching
                  ? "Forwarding Complaint..."
                  : `1-Click Forward Complaint to ${primaryAuthority.shortName}`}
              </span>
            </button>

            {dispatchReceipt && (
              <div className="rounded-2xl border-2 border-green-600 bg-green-50 p-6 space-y-4 shadow-md">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2 text-green-900 font-extrabold text-base">
                    <CheckCircle2 className="h-6 w-6 text-green-600" />
                    <span>
                      1-Click Dispatch Completed! (Logged in Admin Panel &amp; Supabase)
                    </span>
                  </div>
                  <span className="rounded-lg bg-green-200 px-3 py-1 text-xs font-mono font-bold text-green-950">
                    Dispatch ID: {dispatchReceipt.dispatchId}
                  </span>
                </div>

                <div className="flex flex-wrap gap-3">
                  <a
                    href={dispatchReceipt.mailtoUrl}
                    className="inline-flex items-center gap-2 rounded-xl bg-green-700 px-4 py-2.5 text-xs font-extrabold text-white shadow hover:bg-green-800"
                  >
                    <Mail className="h-4 w-4" />
                    <span>Open Pre-Addressed Email Client</span>
                  </a>
                  <a
                    href={dispatchReceipt.portalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-xl bg-[#01411C] px-4 py-2.5 text-xs font-extrabold text-[#D4AF37] shadow hover:bg-emerald-950"
                  >
                    <ExternalLink className="h-4 w-4" />
                    <span>
                      Launch Official Portal ({primaryAuthority.shortName})
                    </span>
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ComplaintPage() {
  return (
    <Suspense
      fallback={
        <div className="p-12 text-center text-sm text-slate-600">
          Loading HaqAI 1-Click Complaint Studio...
        </div>
      }
    >
      <ComplaintStudioContent />
    </Suspense>
  );
}
