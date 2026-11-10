import React from "react";
import Link from "next/link";
import {
  Scale,
  ShieldCheck,
  Mic,
  MessageSquare,
  FileCheck2,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";

const WORKFLOW_STEPS = [
  {
    step: "Step 1: Understand",
    desc: "Read the citizen's text or transcribe their voice note in Urdu, Roman Urdu, Punjabi, or English.",
  },
  {
    step: "Step 2: Classify",
    desc: "Classify the issue into Education, Police, Government Services, Employment, Human Rights, Consumer Protection, Property, or Cybercrime.",
  },
  {
    step: "Step 3: Ask Questions",
    desc: "Highlight any helpful details (city, institution name, date, roll/reference number) needed for a complete application.",
  },
  {
    step: "Step 4: Explain Rights",
    desc: "Identify applicable 1973 Constitutional Articles and Pakistan Code statutes in simple everyday language without inventing laws.",
  },
  {
    step: "Step 5: Recommend Solutions",
    desc: "Provide practical, step-by-step administrative remedies.",
  },
  {
    step: "Step 6: Find Authority",
    desc: "Match the exact official body (HEC, Wafaqi Mohtasib, Police 1787, MoHR 1099, FOSPAH, FIA 1991) with verified URLs and helplines.",
  },
  {
    step: "Step 7: Generate Complaint",
    desc: "Draft a structured formal complaint strictly from the citizen's stated facts.",
  },
  {
    step: "Step 8: User Approval & 1-Click Forward",
    desc: "Allow the citizen to review, edit, and explicitly approve the complaint before 1-click forwarding to the relevant institution.",
  },
];

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 space-y-12">
      {/* Hero */}
      <div className="rounded-3xl bg-gradient-to-br from-[#01411C] to-[#033619] p-8 sm:p-12 text-white shadow-xl space-y-4">
        <span className="inline-flex items-center gap-2 rounded-full bg-amber-400/20 px-3.5 py-1 text-xs font-bold text-amber-300">
          <Scale className="h-4 w-4" /> About HaqAI (حق اے آئی کا مقصد)
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold">
          Empowering Every Citizen of Pakistan to Know Their Rights &amp; Take Action
        </h1>
        <p className="max-w-3xl text-base text-emerald-100/90 leading-relaxed">
          Millions of citizens in Pakistan face everyday injustices—universities
          withholding original degrees, police stations refusing to register an
          FIR, employers withholding wages, or relatives denying women their
          lawful inheritance—simply because legal terminology is complex,
          applications require formal drafting, and people do not know which
          government institution handles their grievance.
        </p>
        <div className="pt-2 flex flex-wrap gap-3">
          <Link
            href="/assistant?demo=degree"
            className="inline-flex items-center gap-2 rounded-xl bg-[#D4AF37] px-5 py-3 text-xs font-extrabold text-[#01411C] hover:bg-amber-400 transition"
          >
            <Mic className="h-4 w-4" />
            <span>Try Flagship University Degree Demo</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            href="/profile"
            className="inline-flex items-center gap-2 rounded-xl bg-green-500 px-5 py-3 text-xs font-extrabold text-slate-950 hover:bg-green-400 transition"
          >
            <MessageSquare className="h-4 w-4" />
            <span>Citizen ID &amp; Real WhatsApp Setup</span>
          </Link>
        </div>
      </div>

      {/* 8-Step AI Agent Workflow */}
      <div className="space-y-6">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#01411C]">
            Verified Legal Agent Architecture
          </span>
          <h2 className="mt-1 text-2xl font-extrabold text-slate-900">
            The 8-Step HaqAI Agent Workflow
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {WORKFLOW_STEPS.map((item, idx) => (
            <div
              key={idx}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-2"
            >
              <div className="flex items-center justify-between">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#01411C] text-xs font-bold text-[#D4AF37]">
                  {idx + 1}
                </span>
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
              </div>
              <h3 className="text-sm font-extrabold text-slate-900">
                {item.step}
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Privacy, Safety & Legal Disclaimer */}
      <div className="rounded-2xl border-2 border-amber-300 bg-amber-50/70 p-6 sm:p-8 space-y-4">
        <div className="flex items-center gap-2 text-amber-950 font-extrabold text-lg">
          <ShieldCheck className="h-6 w-6 text-[#01411C]" />
          <span>
            Non-Hallucination Guarantee, Citizen Approval Gate &amp; Legal Disclaimer
          </span>
        </div>
        <ul className="space-y-2 text-xs sm:text-sm text-slate-800 leading-relaxed list-disc pl-5">
          <li>
            <strong>Zero Fabricated Laws:</strong> HaqAI strictly cites verified
            Articles of the Constitution of Pakistan (1973), enacted Pakistan
            Code statutes, and official government portals.
          </li>
          <li>
            <strong>Zero Fabricated Facts:</strong> Formal complaints are
            generated exclusively from the citizen&apos;s own statement, using
            clear editable fields for any details the citizen wishes to fill in.
          </li>
          <li>
            <strong>Mandatory Citizen Approval Gate:</strong> HaqAI never
            transmits or dispatches a complaint without the citizen reviewing,
            editing, and checking the explicit approval box.
          </li>
          <li>
            <strong>Informational Assistant:</strong> HaqAI provides public
            legal information and complaint-drafting assistance to empower
            citizens; it does not replace a licensed advocate in court
            proceedings.
          </li>
        </ul>
        <div className="pt-2">
          <Link
            href="/complaint"
            className="inline-flex items-center gap-2 rounded-xl bg-[#01411C] px-5 py-2.5 text-xs font-extrabold text-[#D4AF37]"
          >
            <FileCheck2 className="h-4 w-4" />
            <span>Go to 1-Click Complaint Studio</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
