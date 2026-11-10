import React from "react";
import Link from "next/link";
import { Scale, PhoneCall, ExternalLink } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-slate-200/80 bg-white text-slate-600">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          <div>
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-teal-600 to-emerald-600 text-white">
                <Scale className="h-4 w-4" />
              </div>
              <span className="text-lg font-extrabold text-slate-900">
                Haq<span className="text-teal-600">AI</span>{" "}
                <span className="text-sm font-medium text-slate-500">
                  (حق اے آئی)
                </span>
              </span>
            </div>
            <p className="mt-3 text-xs sm:text-sm text-slate-500 leading-relaxed">
              Your Rights. Your Voice. Your Action. Speak in Urdu, Punjabi,
              Roman Urdu, or English to understand your Pakistani constitutional
              rights and forward formal complaints in 1 click.
            </p>
            <div className="mt-4 inline-flex items-center gap-1.5 rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-700">
              <PhoneCall className="h-3.5 w-3.5 text-teal-600" />
              <span>
                Helplines: Human Rights 1099 • Ombudsman 1055 • Police 1787 • FIA 1991
              </span>
            </div>
          </div>

          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900">
              Quick Navigation
            </h3>
            <ul className="mt-3 space-y-2 text-xs sm:text-sm text-slate-600">
              <li>
                <Link href="/assistant" className="hover:text-teal-600 transition">
                  Ask AI Voice &amp; Legal Assistant (بول کر پوچھیں)
                </Link>
              </li>
              <li>
                <Link href="/complaint" className="hover:text-teal-600 transition">
                  1-Click Complaint Studio (شکایت بھیجیں)
                </Link>
              </li>
              <li>
                <Link href="/rights" className="hover:text-teal-600 transition">
                  1973 Constitution &amp; Pakistan Laws (قوانین)
                </Link>
              </li>
              <li>
                <Link href="/profile" className="hover:text-teal-600 transition">
                  Citizen Profile &amp; HaqAI ID (پروفائل)
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900">
              Official Portals
            </h3>
            <ul className="mt-3 space-y-2 text-xs text-slate-500">
              <li>
                <a
                  href="https://onlinehelp.hec.gov.pk"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 hover:text-teal-600"
                >
                  HEC Grievance Portal <ExternalLink className="h-3 w-3" />
                </a>
              </li>
              <li>
                <a
                  href="https://www.mohtasib.gov.pk"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 hover:text-teal-600"
                >
                  Wafaqi Mohtasib (Federal Ombudsman) <ExternalLink className="h-3 w-3" />
                </a>
              </li>
              <li>
                <a
                  href="https://citizenportal.gov.pk"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 hover:text-teal-600"
                >
                  Pakistan Citizen Portal <ExternalLink className="h-3 w-3" />
                </a>
              </li>
              <li>
                <a
                  href="https://fospah.gov.pk"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 hover:text-teal-600"
                >
                  FOSPAH (Property &amp; Workplace Rights) <ExternalLink className="h-3 w-3" />
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t border-slate-100 pt-5 text-xs text-slate-400">
          <p>
            <strong>Disclaimer:</strong> HaqAI provides public legal information
            grounded in the Constitution of Pakistan (1973) and Pakistan Code
            statutes to help citizens understand their rights and draft formal
            applications. No complaint is ever forwarded without explicit
            citizen review and approval.
          </p>
        </div>
      </div>
    </footer>
  );
}
