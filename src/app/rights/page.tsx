"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  BookOpen,
  Scale,
  ExternalLink,
  PhoneCall,
  Mail,
  Search,
  Send,
  Sparkles,
} from "lucide-react";
import {
  CONSTITUTION_OF_PAKISTAN_1973,
  PAKISTAN_LAWS_CORPUS,
} from "@/lib/pakistan-constitution-laws";

export default function RightsPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"constitution" | "laws" | "all">(
    "all"
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [aiQuestion, setAiQuestion] = useState("");

  const q = searchQuery.toLowerCase().trim();

  const filteredArticles = CONSTITUTION_OF_PAKISTAN_1973.filter((art) => {
    if (!q) return true;
    return (
      art.article.toLowerCase().includes(q) ||
      art.title.toLowerCase().includes(q) ||
      art.textSummary.toLowerCase().includes(q) ||
      art.romanUrduSummary.toLowerCase().includes(q) ||
      art.urduSummary.includes(q)
    );
  });

  const filteredLaws = PAKISTAN_LAWS_CORPUS.filter((law) => {
    if (!q) return true;
    return (
      law.lawName.toLowerCase().includes(q) ||
      law.domain.toLowerCase().includes(q) ||
      law.keySections.toLowerCase().includes(q) ||
      law.description.toLowerCase().includes(q) ||
      law.romanUrduDescription.toLowerCase().includes(q) ||
      law.urduDescription.includes(q)
    );
  });

  function handleAskAI(e: React.FormEvent) {
    e.preventDefault();
    if (!aiQuestion.trim()) return;
    router.push(`/assistant?q=${encodeURIComponent(aiQuestion.trim())}`);
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      {/* Header + Ask AI Any Law Bar */}
      <div className="rounded-3xl bg-gradient-to-r from-[#01411C] via-[#045d2a] to-[#012d14] p-6 sm:p-8 text-white shadow-xl space-y-5">
        <div>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-400/20 px-3 py-1 text-xs font-bold text-amber-300">
            <BookOpen className="h-3.5 w-3.5" /> Complete Pakistan Legal Corpus
          </span>
          <h1 className="mt-2 text-2xl sm:text-3xl font-extrabold">
            Constitution of Pakistan (1973) &amp; All Statutory Laws
          </h1>
          <p className="mt-1 text-sm text-emerald-100/90 max-w-3xl">
            Explore every Fundamental Right in the 1973 Constitution and all
            major Pakistani laws (Criminal PPC/CrPC, Civil CPC, Family Laws,
            Property/Wirasat/Rent, Cybercrime PECA, Education/HEC, Labour,
            Consumer, Banking/Tax/FBR, Utilities &amp; Ombudsman)—or ask Gemini AI
            any legal question below.
          </p>
        </div>

        {/* Ask AI About Any Law Input */}
        <form
          onSubmit={handleAskAI}
          className="flex flex-col sm:flex-row gap-2.5 bg-white/10 p-2.5 rounded-2xl border border-white/20"
        >
          <div className="flex-1 flex items-center gap-2 bg-white rounded-xl px-3.5 py-2.5">
            <Sparkles className="h-4 w-4 text-[#01411C] shrink-0" />
            <input
              type="text"
              value={aiQuestion}
              onChange={(e) => setAiQuestion(e.target.value)}
              placeholder="Ask HaqAI about any Pakistani law, e.g. 'Cheque dishonour Sec 489-F PPC', 'Khula & Haq Mehr law', 'Tenant eviction rules', 'Article 199 writ'..."
              className="w-full text-xs sm:text-sm text-slate-900 focus:outline-none"
            />
          </div>
          <button
            type="submit"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#D4AF37] px-5 py-3 text-xs font-extrabold text-[#01411C] hover:bg-amber-400 transition shrink-0"
          >
            <Send className="h-4 w-4" />
            <span>Ask AI Legal Assistant</span>
          </button>
        </form>
      </div>

      {/* Filter Tabs + Instant Search */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setActiveTab("all")}
            className={`rounded-xl px-4 py-2.5 text-xs font-extrabold transition ${
              activeTab === "all"
                ? "bg-[#01411C] text-[#D4AF37] shadow"
                : "bg-white border border-slate-200 text-slate-700 hover:bg-slate-50"
            }`}
          >
            All (1973 Constitution + Pakistan Laws)
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("constitution")}
            className={`rounded-xl px-4 py-2.5 text-xs font-extrabold transition ${
              activeTab === "constitution"
                ? "bg-[#01411C] text-[#D4AF37] shadow"
                : "bg-white border border-slate-200 text-slate-700 hover:bg-slate-50"
            }`}
          >
            Constitution of Pakistan 1973 ({filteredArticles.length} Articles)
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("laws")}
            className={`rounded-xl px-4 py-2.5 text-xs font-extrabold transition ${
              activeTab === "laws"
                ? "bg-[#01411C] text-[#D4AF37] shadow"
                : "bg-white border border-slate-200 text-slate-700 hover:bg-slate-50"
            }`}
          >
            Pakistan Acts, Codes &amp; Ordinances ({filteredLaws.length})
          </button>
        </div>

        <div className="relative min-w-[280px]">
          <Search className="h-4 w-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Filter by Article, PPC, CrPC, Family, Wirasat, Rent, FBR..."
            className="w-full rounded-xl border border-slate-300 bg-white pl-9 pr-4 py-2 text-xs text-slate-900 focus:border-[#01411C] focus:outline-none"
          />
        </div>
      </div>

      {/* SECTION 1: CONSTITUTION OF PAKISTAN (1973) */}
      {(activeTab === "all" || activeTab === "constitution") && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Scale className="h-5 w-5 text-[#01411C]" />
            <h2 className="text-xl font-extrabold text-slate-900">
              Constitution of the Islamic Republic of Pakistan (1973) —
              Fundamental Rights &amp; Writ Jurisdiction
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {filteredArticles.map((art, i) => (
              <div
                key={i}
                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-3 hover:border-[#01411C] transition"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="rounded-lg bg-[#01411C] px-3 py-1 text-xs font-extrabold text-[#D4AF37]">
                    {art.article}
                  </span>
                  <span className="text-[11px] font-semibold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded">
                    {art.part}
                  </span>
                </div>

                <h3 className="text-base font-extrabold text-slate-900">
                  {art.title}
                </h3>

                <p className="text-xs text-slate-700 leading-relaxed">
                  <strong>English:</strong> {art.textSummary}
                </p>

                <p className="text-xs text-slate-800 leading-relaxed bg-emerald-50/60 p-2.5 rounded-xl border border-emerald-100">
                  <strong>Roman Urdu:</strong> {art.romanUrduSummary}
                </p>

                <p className="text-xs text-emerald-950 font-medium leading-relaxed">
                  <strong>اردو:</strong> {art.urduSummary}
                </p>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-slate-500 truncate max-w-[65%]">
                    <strong>Enforced by:</strong>{" "}
                    {art.applicableAuthorities.join(", ")}
                  </span>
                  <Link
                    href={`/assistant?q=${encodeURIComponent(
                      `Explain ${art.article} (${art.title}) of the 1973 Constitution of Pakistan and how I can enforce my right under it.`
                    )}`}
                    className="font-extrabold text-[#01411C] hover:underline shrink-0"
                  >
                    Ask AI →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SECTION 2: ALL STATUTORY LAWS OF PAKISTAN */}
      {(activeTab === "all" || activeTab === "laws") && (
        <div className="space-y-4 pt-4">
          <div className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-[#01411C]" />
            <h2 className="text-xl font-extrabold text-slate-900">
              Major Acts, Ordinances &amp; Legal Codes of Pakistan
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            {filteredLaws.map((law) => (
              <div
                key={law.id}
                className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-3 hover:border-[#01411C] transition"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="rounded-md bg-amber-100 px-2.5 py-1 text-xs font-extrabold text-amber-950">
                    {law.domain}
                  </span>
                  <span className="rounded bg-slate-100 px-2 py-0.5 font-mono text-[11px] font-bold text-slate-700">
                    {law.year}
                  </span>
                </div>

                <h3 className="text-base font-extrabold text-slate-900">
                  {law.lawName}
                </h3>

                <p className="text-xs font-bold text-[#01411C]">
                  Key Provisions: {law.keySections}
                </p>

                <p className="text-xs text-slate-700 leading-relaxed">
                  {law.description}
                </p>

                <p className="text-xs text-slate-800 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                  <strong>Roman Urdu:</strong> {law.romanUrduDescription}
                </p>

                <p className="text-xs text-emerald-950 font-medium">
                  <strong>اردو:</strong> {law.urduDescription}
                </p>

                <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-xs">
                  <div className="space-y-0.5 text-slate-600">
                    <p className="font-bold text-slate-900">
                      Authority: {law.authorityName}
                    </p>
                    <p className="flex items-center gap-3">
                      <span className="inline-flex items-center gap-1">
                        <PhoneCall className="h-3 w-3 text-[#01411C]" />{" "}
                        {law.helpline}
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <Mail className="h-3 w-3 text-[#01411C]" /> {law.email}
                      </span>
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <a
                      href={law.portalUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 rounded-lg border border-slate-300 px-2.5 py-1.5 font-bold text-slate-700 hover:bg-slate-50"
                    >
                      Portal <ExternalLink className="h-3 w-3" />
                    </a>
                    <Link
                      href={`/assistant?q=${encodeURIComponent(
                        `Mujhe ${law.lawName} (${law.domain}) ke mutabiq qanooni rehnumai aur complaint chahiye.`
                      )}`}
                      className="inline-flex items-center gap-1 rounded-lg bg-[#01411C] px-3 py-1.5 font-bold text-[#D4AF37]"
                    >
                      Consult &amp; File Complaint →
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
