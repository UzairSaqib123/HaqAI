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
import { saveClientDispatch } from "@/lib/client-storage";

function ComplaintStudioContent() {
  const searchParams = useSearchParams();
  const caseIdParam = searchParams.get("caseId");
  const categoryParam = searchParams.get("category") as LegalCategoryId | null;

  const [caseId, setCaseId] = useState<string>(caseIdParam || "");
  const [categoryId, setCategoryId] = useState<LegalCategoryId>(
    categoryParam && LEGAL_KNOWLEDGE_BASE[categoryParam]
      ? categoryParam
      : "education"
  );

  const [facts, setFacts] = useState<ExtractedUserFacts>({
    haqId: "",
    rawStatement: "",
    applicantName: "",
    cnic: "",
    city: "",
    address: "",
    institutionOrRespondent: "",
    dateOfIncident: new Date().toISOString().split("T")[0],
    referenceOrRollNo: "",
    contactPhone: "",
    contactEmail: "",
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
    gmailComposeUrl: string;
  } | null>(null);

  const activeCategory = LEGAL_KNOWLEDGE_BASE[categoryId];
  const primaryAuthority = activeCategory.authorities[0];

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
              haqId: activeProf?.haqId || c.haqId || "",
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
      const generatedCaseId = `HAQ-${Math.floor(100000 + Math.random() * 900000)}`;
      setCaseId(generatedCaseId);
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
    a.download = `HaqAI-Complaint-${caseId || "Document"}.txt`;
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
        if (data.dispatchRecord) {
          saveClientDispatch(data.dispatchRecord);
        }
        try {
          navigator.clipboard.writeText(complaintText);
          setCopied(true);
          setTimeout(() => setCopied(false), 3000);
        } catch {
          // ignore clipboard permission errors
        }
        setDispatchReceipt({
          dispatchId: data.dispatchRecord.dispatchId,
          dispatchedAt: data.dispatchRecord.dispatchedAt,
          authorityName: primaryAuthority.name,
          authorityEmail: primaryAuthority.email,
          portalUrl: primaryAuthority.portalUrl,
          mailtoUrl: data.mailtoUrl,
          gmailComposeUrl: data.gmailComposeUrl,
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
      <div className="soft-card rounded-3xl bg-gradient-to-r from-teal-50/80 via-white to-emerald-50/60 p-6 sm:p-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-teal-100/80 px-3 py-0.5 text-xs font-semibold text-teal-800">
              <FileCheck2 className="h-3.5 w-3.5" /> 1-Click Complaint Studio{" "}
              {facts.haqId ? `• Citizen ID ${facts.haqId}` : ""}
            </span>
            <h1 className="mt-2 text-2xl sm:text-3xl font-extrabold text-slate-900">
              Formal Complaint &amp; 1-Click Dispatch
            </h1>
            <p className="mt-1 text-sm text-slate-600">
              Review your details below, edit the formal application if needed,
              approve, and forward in 1 click to the relevant government
              authority.
            </p>
          </div>
          {caseId && (
            <div className="flex items-center gap-2 shrink-0">
              <Link
                href={`/assistant?caseId=${caseId}`}
                className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold text-slate-700 shadow-sm hover:border-teal-300 transition"
              >
                <Volume2 className="h-4 w-4 text-teal-600" />
                <span>Option 2: Legal Guidance</span>
              </Link>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 items-start">
        <div className="lg:col-span-5 space-y-5">
          <div className="soft-card rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <UserCheck className="h-4 w-4 text-teal-600" />
                <h2 className="text-sm font-extrabold text-slate-900">
                  Citizen &amp; Case Details {facts.haqId ? `(${facts.haqId})` : ""}
                </h2>
              </div>
              <Link
                href="/profile"
                className="text-xs font-bold text-teal-700 hover:underline"
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
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-xs font-semibold text-slate-900 focus:border-teal-500 focus:outline-none"
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
                  placeholder="Enter your full name"
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs"
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
                  placeholder="XXXXX-XXXXXXX-X"
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Concerned Department / Institution / Respondent:
              </label>
              <input
                type="text"
                value={facts.institutionOrRespondent}
                onChange={(e) =>
                  handleFactChange("institutionOrRespondent", e.target.value)
                }
                placeholder="Enter department, institution, or respondent name"
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs"
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
                  placeholder="Enter your city"
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Reference / Roll No. (Optional):
                </label>
                <input
                  type="text"
                  value={facts.referenceOrRollNo}
                  onChange={(e) =>
                    handleFactChange("referenceOrRollNo", e.target.value)
                  }
                  placeholder="Reference ID / Roll No."
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs"
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
                  placeholder="03XX-XXXXXXX"
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs font-mono"
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
                  placeholder="you@example.com"
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs"
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
                placeholder="Describe what happened..."
                className="w-full rounded-lg border border-slate-200 p-2.5 text-xs"
              />
            </div>

            <button
              type="button"
              onClick={() => regenerateFromFacts(facts, categoryId)}
              className="w-full inline-flex items-center justify-center gap-1.5 rounded-xl bg-slate-900 px-4 py-2.5 text-xs font-bold text-white hover:bg-slate-800 transition"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              <span>Update Formal Complaint Letter</span>
            </button>
          </div>

          <div className="soft-card rounded-2xl p-5 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-1 text-xs font-extrabold uppercase text-teal-700">
                <ShieldCheck className="h-4 w-4" /> Receiving Authority
              </span>
              <span className="rounded bg-teal-50 border border-teal-200 px-2 py-0.5 text-[10px] font-bold text-teal-800">
                {primaryAuthority.turnaroundTime}
              </span>
            </div>
            <h3 className="text-sm font-extrabold text-slate-900">
              {primaryAuthority.name}
            </h3>
            <p className="text-xs text-slate-600">{primaryAuthority.role}</p>
            <div className="text-xs text-slate-700 space-y-1 pt-1">
              <p>
                <strong>Official Portal:</strong>{" "}
                <a
                  href={primaryAuthority.portalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline text-teal-700 font-semibold"
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

        <div className="lg:col-span-7 space-y-5">
          <div className="soft-card rounded-2xl p-6 space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
              <div>
                <h2 className="text-base font-extrabold text-slate-900">
                  Review &amp; Edit Formal Complaint Document
                </h2>
                <p className="text-xs text-slate-500">
                  Edit any line below before approving and forwarding.
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
                      ? "bg-teal-600 text-white"
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
                      ? "bg-teal-600 text-white"
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
                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-800 hover:bg-slate-50"
              >
                <Copy className="h-3.5 w-3.5 text-teal-600" />
                <span>{copied ? "Copied to Clipboard!" : "Copy Complaint"}</span>
              </button>

              <button
                type="button"
                onClick={handleDownloadTxt}
                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-800 hover:bg-slate-50"
              >
                <Download className="h-3.5 w-3.5 text-teal-600" />
                <span>Download (.txt)</span>
              </button>

              <button
                type="button"
                onClick={handlePrintPdf}
                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-800 hover:bg-slate-50"
              >
                <Printer className="h-3.5 w-3.5 text-teal-600" />
                <span>Print / Save PDF</span>
              </button>

              <a
                href={primaryAuthority.portalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-lg border border-teal-200 bg-teal-50 px-3 py-2 text-xs font-bold text-teal-800 hover:bg-teal-100"
              >
                <span>Open {primaryAuthority.shortName} Portal</span>
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            </div>

            <textarea
              rows={18}
              value={complaintText}
              onChange={(e) => setComplaintText(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50/70 p-4 font-mono text-xs leading-relaxed text-slate-900 focus:border-teal-500 focus:bg-white focus:outline-none"
            />

            <label className="flex items-start gap-3 rounded-xl border border-teal-200 bg-teal-50/50 p-4 cursor-pointer">
              <input
                type="checkbox"
                checked={userApproved}
                onChange={(e) => setUserApproved(e.target.checked)}
                className="mt-0.5 h-5 w-5 rounded border-slate-300 text-teal-600 focus:ring-teal-500"
              />
              <div className="text-xs text-slate-800 leading-relaxed">
                <span className="font-extrabold text-teal-900 block">
                  Citizen Review &amp; Approval Gate:
                </span>
                I have reviewed and edited the formal complaint above and
                authorize HaqAI to forward it to{" "}
                <strong>{primaryAuthority.name}</strong>.
              </div>
            </label>

            <button
              type="button"
              disabled={!userApproved || isDispatching}
              onClick={handleOneClickForward}
              className="w-full flex items-center justify-center gap-2.5 rounded-2xl bg-gradient-to-r from-teal-600 to-emerald-600 px-6 py-4 text-base font-bold text-white shadow-lg hover:from-teal-700 hover:to-emerald-700 disabled:opacity-40 transition"
            >
              <Send className="h-5 w-5" />
              <span>
                {isDispatching
                  ? "Forwarding Complaint..."
                  : `1-Click Forward Complaint to ${primaryAuthority.shortName}`}
              </span>
            </button>

            {dispatchReceipt && (
              <div className="rounded-2xl border border-emerald-400 bg-emerald-50/70 p-6 space-y-4 shadow-md">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2 text-emerald-900 font-extrabold text-base">
                    <CheckCircle2 className="h-6 w-6 text-emerald-600" />
                    <span>1-Click Dispatch Logged &amp; Ready to Send!</span>
                  </div>
                  <span className="rounded-lg bg-white border border-emerald-200 px-3 py-1 text-xs font-mono font-bold text-emerald-900">
                    Dispatch ID: {dispatchReceipt.dispatchId}
                  </span>
                </div>

                {/* Clear Destination Breakdown */}
                <div className="rounded-xl bg-white/90 border border-emerald-200 p-4 text-xs space-y-1.5 text-slate-700">
                  <p>
                    <strong className="text-slate-900">
                      Receiving Institution:
                    </strong>{" "}
                    {dispatchReceipt.authorityName}
                  </p>
                  <p>
                    <strong className="text-slate-900">
                      Official Grievance Email:
                    </strong>{" "}
                    <span className="font-mono font-semibold text-teal-700">
                      {dispatchReceipt.authorityEmail}
                    </span>
                  </p>
                  <p>
                    <strong className="text-slate-900">
                      Official Portal URL:
                    </strong>{" "}
                    <a
                      href={dispatchReceipt.portalUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline text-teal-700 font-semibold"
                    >
                      {dispatchReceipt.portalUrl}
                    </a>
                  </p>
                  <p className="text-[11px] text-emerald-800 font-medium pt-1">
                    ✓ Your formal complaint has been logged in HaqAI &amp;
                    copied to your clipboard. Choose your preferred dispatch
                    channel below:
                  </p>
                </div>

                <div className="flex flex-wrap gap-3">
                  <a
                    href={dispatchReceipt.gmailComposeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-xl bg-teal-600 px-4 py-2.5 text-xs font-extrabold text-white shadow hover:bg-teal-700"
                  >
                    <Mail className="h-4 w-4" />
                    <span>
                      Send via Gmail Web ({dispatchReceipt.authorityEmail})
                    </span>
                  </a>
                  <a
                    href={dispatchReceipt.mailtoUrl}
                    className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-xs font-extrabold text-white shadow hover:bg-slate-800"
                  >
                    <Mail className="h-4 w-4" />
                    <span>Open Default Email App</span>
                  </a>
                  <a
                    href={dispatchReceipt.portalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-extrabold text-slate-800 shadow-sm hover:bg-slate-50"
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
