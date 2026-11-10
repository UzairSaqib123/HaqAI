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
  Sparkles,
  BookOpen,
} from "lucide-react";
import { ALL_LEGAL_CATEGORIES } from "@/lib/legal-knowledge";

export default function HomePage() {
  return (
    <div className="space-y-16 pb-20">
      {/* Modern Hero Section */}
      <section className="relative overflow-hidden border-b border-slate-200/70 bg-gradient-to-b from-teal-50/70 via-white to-slate-50/60 pt-14 pb-20">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full bg-teal-50 border border-teal-200/80 px-4 py-1.5 text-xs font-semibold text-teal-800 shadow-sm">
            <Sparkles className="h-3.5 w-3.5 text-teal-600" />
            <span>
              AI Citizen Rights &amp; Complaint Assistant • ہر پاکستانی شہری کا آسان قانونی مددگار
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900 leading-tight">
            Speak Your Problem.{" "}
            <span className="bg-gradient-to-r from-teal-600 to-emerald-600 bg-clip-text text-transparent">
              Know Your Rights.
            </span>{" "}
            Send Complaints in 1 Click.
          </h1>

          <p className="text-lg sm:text-xl font-semibold text-slate-700 max-w-3xl mx-auto">
            اپنا مسئلہ اپنی زبان (اردو، پنجابی یا رومن اردو) میں بول کر بتائیں —
            صاف اردو آواز میں اپنے قانونی حقوق سنیں اور ایک کلک پر شکایت بھیجیں۔
          </p>

          <p className="text-sm sm:text-base text-slate-500 max-w-2xl mx-auto leading-relaxed">
            No complex legal terms or lengthy paperwork. Press the microphone,
            explain what happened, listen to HaqAI explain your rights under the
            1973 Constitution &amp; Pakistani laws, and forward a pre-filled
            application to the right department.
          </p>

          <div className="pt-3 flex flex-col sm:flex-row items-center justify-center gap-3.5">
            <Link
              href="/assistant"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-teal-600 to-emerald-600 px-8 py-4 text-base font-bold text-white shadow-lg shadow-teal-600/20 hover:from-teal-700 hover:to-emerald-700 transition-all hover:-translate-y-0.5"
            >
              <Mic className="h-5 w-5" />
              <span>Speak or Type Your Problem (مسئلہ بولیں)</span>
              <ArrowRight className="h-4 w-4" />
            </Link>

            <Link
              href="/complaint"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 rounded-2xl border border-slate-200 bg-white px-7 py-4 text-base font-semibold text-slate-800 shadow-sm hover:border-teal-300 hover:bg-teal-50/40 transition-all"
            >
              <FileCheck2 className="h-4 w-4 text-teal-600" />
              <span>1-Click Complaint Studio (شکایت بھیجیں)</span>
            </Link>
          </div>

          <div className="pt-4 flex flex-wrap items-center justify-center gap-5 text-xs font-medium text-slate-500">
            <span className="inline-flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-teal-600" /> Clear Urdu Voice
              Playback (صاف اردو آواز)
            </span>
            <span className="inline-flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-teal-600" /> Complete 1973
              Constitution &amp; Laws
            </span>
            <span className="inline-flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-teal-600" /> Pre-Filled
              1-Click Complaint
            </span>
          </div>
        </div>
      </section>

      {/* Simple 3-Step Visual Guide */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-1.5">
          <span className="text-xs font-bold uppercase tracking-wider text-teal-600">
            Simple 3-Step Process
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            صرف 3 آسان مراحل میں اپنا حق حاصل کریں
          </h2>
          <p className="text-sm text-slate-500">
            Designed so anyone can use it effortlessly without legal knowledge
          </p>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-3">
          <div className="soft-card rounded-2xl p-6 text-center space-y-3 hover:-translate-y-0.5 transition-all">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-teal-50 text-teal-600 border border-teal-100">
              <Mic className="h-6 w-6" />
            </div>
            <span className="inline-block rounded-full bg-slate-100 px-3 py-0.5 text-[11px] font-bold text-slate-600">
              Step 1 • پہلا قدم
            </span>
            <h3 className="text-lg font-bold text-slate-900">
              مائیک دبا کر مسئلہ بولیں
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
              Speak or type your problem in Urdu, Punjabi, Roman Urdu, or
              English on the website or via WhatsApp.
            </p>
          </div>

          <div className="soft-card rounded-2xl p-6 text-center space-y-3 hover:-translate-y-0.5 transition-all">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 border border-indigo-100">
              <Volume2 className="h-6 w-6" />
            </div>
            <span className="inline-block rounded-full bg-slate-100 px-3 py-0.5 text-[11px] font-bold text-slate-600">
              Step 2 • دوسرا قدم
            </span>
            <h3 className="text-lg font-bold text-slate-900">
              صاف اردو آواز میں اپنا حق سنیں
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
              Listen to HaqAI explain your Constitutional rights and the exact
              government authority in clear, natural Urdu speech.
            </p>
          </div>

          <div className="soft-card rounded-2xl p-6 text-center space-y-3 hover:-translate-y-0.5 transition-all">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-100">
              <Send className="h-6 w-6" />
            </div>
            <span className="inline-block rounded-full bg-slate-100 px-3 py-0.5 text-[11px] font-bold text-slate-600">
              Step 3 • تیسرا قدم
            </span>
            <h3 className="text-lg font-bold text-slate-900">
              1-کلک پر شکایت آگے بھیجیں
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
              Review your pre-filled application (with your Name, CNIC &amp;
              Address) and forward it in 1 click to the relevant department.
            </p>
          </div>
        </div>
      </section>

      {/* Dynamic Legal Domains from Knowledge Base */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="space-y-1">
            <span className="text-xs font-bold uppercase tracking-wider text-teal-600">
              Pakistani Legal Coverage
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              آئینِ پاکستان (1973) اور قانونی شعبہ جات
            </h2>
          </div>
          <Link
            href="/rights"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-teal-600 hover:text-teal-700"
          >
            <BookOpen className="h-4 w-4" />
            <span>Explore Full Constitution &amp; Laws Corpus →</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {ALL_LEGAL_CATEGORIES.map((cat) => (
            <Link
              key={cat.id}
              href={`/complaint?category=${cat.id}`}
              className="group soft-card flex flex-col justify-between rounded-2xl p-6 hover:border-teal-300 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-50 text-teal-700">
                    <Scale className="h-5 w-5" />
                  </div>
                  <span className="rounded-full border border-teal-200/70 bg-teal-50/70 px-2.5 py-0.5 text-[11px] font-semibold text-teal-700">
                    {cat.authorities[0]?.shortName}
                  </span>
                </div>

                <h3 className="text-base font-bold text-slate-900 leading-snug">
                  {cat.title.ur}
                </h3>
                <p className="text-xs font-medium text-slate-600">
                  {cat.title.en}
                </p>
                <p className="text-xs text-slate-400 line-clamp-2">
                  {cat.constitutionalRights[0]?.article} •{" "}
                  {cat.statutoryLaws[0]?.law}
                </p>
              </div>

              <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-teal-600">
                <span>فوری قانونی درخواست تیار کریں</span>
                <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
