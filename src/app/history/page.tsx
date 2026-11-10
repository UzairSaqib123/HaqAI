"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  History,
  FileCheck2,
  Volume2,
  ExternalLink,
  CheckCircle2,
  MessageSquare,
  Globe,
} from "lucide-react";
import { HaqAIAnalysisResult } from "@/lib/ai-engine";
import { DispatchRecord } from "@/lib/store";

export default function HistoryPage() {
  const [cases, setCases] = useState<HaqAIAnalysisResult[]>([]);
  const [dispatches, setDispatches] = useState<DispatchRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/history")
      .then((r) => r.json())
      .then((data) => {
        if (data.cases) setCases(data.cases);
        if (data.dispatches) setDispatches(data.dispatches);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      <div className="rounded-2xl bg-gradient-to-r from-[#01411C] to-[#045d2a] p-6 text-white shadow-lg">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-400/20 px-3 py-1 text-xs font-bold text-amber-300">
          <History className="h-3.5 w-3.5" /> Citizen Case &amp; Dispatch History
        </span>
        <h1 className="mt-2 text-2xl sm:text-3xl font-extrabold">
          Saved Legal Cases &amp; 1-Click Dispatched Complaints
        </h1>
        <p className="mt-1 text-sm text-emerald-100/90">
          Every voice note or text query from WhatsApp and the Website is saved
          with a unique Case ID so you can revisit legal guidance or forward
          your complaint anytime.
        </p>
      </div>

      {/* Dispatched Complaints Log */}
      {dispatches.length > 0 && (
        <div className="rounded-2xl border-2 border-green-600 bg-green-50/70 p-6 space-y-4">
          <h2 className="text-lg font-extrabold text-green-950 flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-green-600" />
            1-Click Forwarded / Dispatched Complaints ({dispatches.length})
          </h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {dispatches.map((d) => (
              <div
                key={d.dispatchId}
                className="rounded-xl border border-green-300 bg-white p-4 space-y-2 text-xs shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <span className="rounded bg-green-100 px-2.5 py-0.5 font-mono font-bold text-green-900">
                    {d.dispatchId} (Case: {d.caseId})
                  </span>
                  <span className="font-semibold text-green-700">
                    {d.status}
                  </span>
                </div>
                <p className="font-bold text-slate-900 text-sm">
                  To: {d.authorityName}
                </p>
                <p className="text-slate-600">
                  Email: {d.authorityEmail} •{" "}
                  {new Date(d.dispatchedAt).toLocaleString()}
                </p>
                <div className="pt-1 flex items-center gap-3">
                  <a
                    href={d.portalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 font-bold text-[#01411C] hover:underline"
                  >
                    Official Portal <ExternalLink className="h-3 w-3" />
                  </a>
                  <Link
                    href={`/complaint?caseId=${d.caseId}`}
                    className="font-bold text-amber-800 hover:underline"
                  >
                    View Complaint Letter →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Saved Cases */}
      <div className="space-y-4">
        <h2 className="text-lg font-extrabold text-slate-900">
          Saved Citizen Cases ({cases.length})
        </h2>

        {loading ? (
          <p className="text-sm text-slate-600">Loading saved cases...</p>
        ) : (
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            {cases.map((c) => (
              <div
                key={c.caseId}
                className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-4"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="rounded-lg bg-emerald-100 px-2.5 py-1 text-xs font-mono font-bold text-[#01411C]">
                      {c.caseId}
                    </span>
                    <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-0.5 text-[11px] font-semibold text-slate-700">
                      {c.channel === "whatsapp" ? (
                        <>
                          <MessageSquare className="h-3 w-3 text-green-600" />{" "}
                          WhatsApp Channel
                        </>
                      ) : (
                        <>
                          <Globe className="h-3 w-3 text-[#01411C]" /> Website
                          Channel
                        </>
                      )}
                    </span>
                  </div>

                  <h3 className="text-base font-extrabold text-slate-900">
                    {c.categoryTitle}
                  </h3>
                  <p className="text-xs text-slate-700 italic bg-slate-50 rounded-xl p-3 border border-slate-100">
                    &ldquo;{c.userQuery}&rdquo;
                  </p>
                  <p className="text-xs text-emerald-900 font-semibold">
                    Recommended Authority: {c.primaryAuthority.name}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 grid grid-cols-2 gap-2.5">
                  <Link
                    href={`/complaint?caseId=${c.caseId}`}
                    className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-[#01411C] px-3 py-2.5 text-xs font-extrabold text-[#D4AF37] hover:bg-emerald-900 transition"
                  >
                    <FileCheck2 className="h-3.5 w-3.5" />
                    <span>Option 1: 1-Click Complaint</span>
                  </Link>
                  <Link
                    href={`/assistant?caseId=${c.caseId}`}
                    className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-slate-300 bg-slate-50 px-3 py-2.5 text-xs font-bold text-slate-800 hover:bg-slate-100 transition"
                  >
                    <Volume2 className="h-3.5 w-3.5 text-[#01411C]" />
                    <span>Option 2: Legal Guidance</span>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
