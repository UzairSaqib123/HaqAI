import React from "react";
import Link from "next/link";
import {
  Mic,
  Volume2,
  Send,
  Scale,
  FileCheck2,
  ArrowRight,
  CheckCircle2,
  BookOpen,
  Navigation,
  ShieldCheck,
} from "lucide-react";
import { ALL_LEGAL_CATEGORIES } from "@/lib/legal-knowledge";
import AvailabilitySwitchCard from "@/components/AvailabilitySwitchCard";

const CATEGORY_ACCENTS = [
  {
    iconBg: "from-emerald-500 to-teal-600",
    pillBg: "bg-emerald-50 text-emerald-700 border-emerald-200",
    hoverBorder: "hover:border-emerald-400",
  },
  {
    iconBg: "from-indigo-500 to-blue-600",
    pillBg: "bg-indigo-50 text-indigo-700 border-indigo-200",
    hoverBorder: "hover:border-indigo-400",
  },
  {
    iconBg: "from-teal-500 to-cyan-600",
    pillBg: "bg-cyan-50 text-cyan-800 border-cyan-200",
    hoverBorder: "hover:border-cyan-400",
  },
  {
    iconBg: "from-amber-500 to-orange-600",
    pillBg: "bg-amber-50 text-amber-800 border-amber-200",
    hoverBorder: "hover:border-amber-400",
  },
  {
    iconBg: "from-violet-500 to-purple-600",
    pillBg: "bg-violet-50 text-violet-800 border-violet-200",
    hoverBorder: "hover:border-violet-400",
  },
];

export default function HomePage() {
  return (
    <div className="space-y-20 pb-24">
      {/* Animated Hero Section */}
      <section className="relative overflow-hidden border-b border-teal-200/50 bg-gradient-to-br from-emerald-50/80 via-white to-cyan-50/70 pt-16 pb-24">
        {/* Decorative Animated Glow Rings */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-28 left-1/2 -translate-x-1/2 h-72 w-[42rem] rounded-full bg-gradient-to-r from-teal-400/20 via-emerald-400/20 to-cyan-400/20 blur-3xl"
        />

        <div className="relative mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 text-center space-y-7">
          <h1 className="animate-fade-up text-4xl sm:text-6xl font-extrabold tracking-tight text-slate-900 leading-[1.15]">
            Speak Your Problem.{" "}
            <span className="animate-gradient-x bg-gradient-to-r from-emerald-600 via-teal-500 to-cyan-600 bg-clip-text text-transparent">
              Know Your Rights.
            </span>{" "}
            <span className="block sm:inline">Send Complaints in 1 Click.</span>
          </h1>

          <p className="animate-fade-up delay-100 text-lg sm:text-2xl font-bold text-slate-800 max-w-3xl mx-auto leading-relaxed">
            اپنا مسئلہ اپنی زبان (اردو، پنجابی یا رومن اردو) میں بول کر بتائیں —
            صاف اردو آواز میں اپنے قانونی حقوق سنیں اور ایک کلک پر شکایت بھیجیں۔
          </p>

          <p className="animate-fade-up delay-200 text-sm sm:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed">
            No complex legal terms or lengthy paperwork. Press the microphone,
            explain what happened, listen to your rights under the 1973
            Constitution &amp; Pakistani laws, find the nearest helping station,
            and forward a formal legal petition to the right authority.
          </p>

          <div className="animate-fade-up delay-300 pt-3 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/assistant"
              className="animate-glow-cta w-full sm:w-auto inline-flex items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 px-8 py-4 text-base font-extrabold text-white transition-all duration-300 hover:-translate-y-1 hover:from-emerald-700 hover:to-teal-700"
            >
              <Mic className="h-5 w-5 animate-pulse" />
              <span>Speak or Type Your Problem (مسئلہ بولیں)</span>
              <ArrowRight className="h-4 w-4" />
            </Link>

            <Link
              href="/complaint"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 rounded-2xl border-2 border-teal-200/80 bg-white/90 backdrop-blur px-7 py-4 text-base font-bold text-slate-800 shadow-md hover:border-teal-400 hover:bg-teal-50/50 hover:-translate-y-1 transition-all duration-300"
            >
              <FileCheck2 className="h-5 w-5 text-teal-600" />
              <span>1-Click Complaint Studio (شکایت بھیجیں)</span>
            </Link>
          </div>

          {/* Animated Feature Pills */}
          <div className="animate-fade-up delay-300 pt-5 flex flex-wrap items-center justify-center gap-3 sm:gap-4 text-xs font-bold">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/90 border border-emerald-200 px-3.5 py-1.5 text-slate-700 shadow-sm">
              <CheckCircle2 className="h-4 w-4 text-emerald-600" />
              Clear Urdu Voice Playback (صاف اردو آواز)
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/90 border border-teal-200 px-3.5 py-1.5 text-slate-700 shadow-sm">
              <ShieldCheck className="h-4 w-4 text-teal-600" />
              1973 Constitution &amp; Pakistan Laws
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/90 border border-cyan-200 px-3.5 py-1.5 text-slate-700 shadow-sm">
              <Navigation className="h-4 w-4 text-cyan-600" />
              Nearest Helping Station Locator
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/90 border border-amber-200 px-3.5 py-1.5 text-slate-700 shadow-sm">
              <FileCheck2 className="h-4 w-4 text-amber-600" />
              Printable Formal Legal Petition
            </span>
          </div>
        </div>
      </section>

      {/* Vibrant 3-Step Visual Guide */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-2">
          <span className="inline-block rounded-full bg-teal-50 border border-teal-200 px-3.5 py-1 text-xs font-extrabold uppercase tracking-wider text-teal-700">
            Simple 3-Step Process
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900">
            صرف 3 آسان مراحل میں اپنا حق حاصل کریں
          </h2>
          <p className="text-sm text-slate-500">
            Designed so any citizen can understand the law and take action
            effortlessly
          </p>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-3">
          {/* Step 1 */}
          <div className="soft-card relative overflow-hidden rounded-3xl p-7 text-center space-y-3.5 hover:-translate-y-1.5 transition-all duration-300 border-t-4 border-t-teal-500">
            <div className="animate-float-gentle mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-teal-500 to-emerald-600 text-white shadow-lg shadow-teal-500/25">
              <Mic className="h-7 w-7" />
            </div>
            <span className="inline-block rounded-full bg-teal-50 border border-teal-200 px-3 py-0.5 text-[11px] font-extrabold text-teal-700">
              Step 1 • پہلا قدم
            </span>
            <h3 className="text-xl font-extrabold text-slate-900">
              مائیک دبا کر مسئلہ بولیں
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Speak or type your problem in Urdu, Pakistani Punjabi (اردو),
              Roman Urdu, or English directly on the website.
            </p>
          </div>

          {/* Step 2 */}
          <div className="soft-card relative overflow-hidden rounded-3xl p-7 text-center space-y-3.5 hover:-translate-y-1.5 transition-all duration-300 border-t-4 border-t-indigo-500">
            <div className="animate-float-gentle mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-blue-600 text-white shadow-lg shadow-indigo-500/25">
              <Volume2 className="h-7 w-7" />
            </div>
            <span className="inline-block rounded-full bg-indigo-50 border border-indigo-200 px-3 py-0.5 text-[11px] font-extrabold text-indigo-700">
              Step 2 • دوسرا قدم
            </span>
            <h3 className="text-xl font-extrabold text-slate-900">
              صاف اردو آواز میں اپنا حق سنیں
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Listen to your exact Constitutional rights, applicable Pakistani
              laws, and locate the nearest helping station with GPS directions.
            </p>
          </div>

          {/* Step 3 */}
          <div className="soft-card relative overflow-hidden rounded-3xl p-7 text-center space-y-3.5 hover:-translate-y-1.5 transition-all duration-300 border-t-4 border-t-emerald-500">
            <div className="animate-float-gentle mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-lg shadow-emerald-500/25">
              <Send className="h-7 w-7" />
            </div>
            <span className="inline-block rounded-full bg-emerald-50 border border-emerald-200 px-3 py-0.5 text-[11px] font-extrabold text-emerald-700">
              Step 3 • تیسرا قدم
            </span>
            <h3 className="text-xl font-extrabold text-slate-900">
              1-کلک پر شکایت آگے بھیجیں
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Review your formal legal petition (ready to print on A4 paper or
              send online) and forward it in 1 click to the official department.
            </p>
          </div>
        </div>
      </section>

      {/* Dynamic Legal Domains from Knowledge Base */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 space-y-7">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="space-y-1.5">
            <span className="inline-block rounded-full bg-emerald-50 border border-emerald-200 px-3 py-0.5 text-xs font-extrabold uppercase tracking-wider text-emerald-700">
              Pakistani Legal Coverage
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              آئینِ پاکستان (1973) اور قانونی شعبہ جات
            </h2>
          </div>
          <Link
            href="/rights"
            className="inline-flex items-center gap-2 rounded-xl bg-teal-50 border border-teal-200 px-4 py-2.5 text-xs font-extrabold text-teal-800 hover:bg-teal-100 transition"
          >
            <BookOpen className="h-4 w-4 text-teal-600" />
            <span>Explore Full Constitution &amp; Laws Corpus →</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {ALL_LEGAL_CATEGORIES.map((cat, idx) => {
            const accent = CATEGORY_ACCENTS[idx % CATEGORY_ACCENTS.length];
            return (
              <Link
                key={cat.id}
                href={`/complaint?category=${cat.id}`}
                className={`group soft-card flex flex-col justify-between rounded-3xl p-6 ${accent.hoverBorder} hover:-translate-y-1.5 transition-all duration-300`}
              >
                <div className="space-y-3.5">
                  <div className="flex items-center justify-between gap-2">
                    <div
                      className={`flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br ${accent.iconBg} text-white shadow-md transition-transform duration-300 group-hover:scale-110`}
                    >
                      <Scale className="h-5 w-5" />
                    </div>
                    <span
                      className={`rounded-full border px-3 py-1 text-[11px] font-bold ${accent.pillBg}`}
                    >
                      {cat.authorities[0]?.shortName}
                    </span>
                  </div>

                  <h3 className="text-base font-extrabold text-slate-900 leading-snug">
                    {cat.title.ur}
                  </h3>
                  <p className="text-xs font-bold text-slate-700">
                    {cat.title.en}
                  </p>
                  <p className="text-xs text-slate-500 line-clamp-2">
                    {cat.constitutionalRights[0]?.article} •{" "}
                    {cat.statutoryLaws[0]?.law}
                  </p>
                </div>

                <div className="mt-5 pt-3.5 border-t border-slate-100 flex items-center justify-between text-xs font-extrabold text-teal-700">
                  <span>فوری قانونی درخواست تیار کریں</span>
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1.5 transition-transform duration-300" />
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Pro-Bono Legal Aid Availability Switch Section */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <AvailabilitySwitchCard compact />
      </section>
    </div>
  );
}
