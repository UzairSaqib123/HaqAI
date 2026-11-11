"use client";

import React, { Suspense, useEffect, useRef, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  Mic,
  MicOff,
  Send,
  Volume2,
  VolumeX,
  FileCheck2,
  Scale,
  ExternalLink,
  CheckCircle2,
  PhoneCall,
  Mail,
  UserCheck,
} from "lucide-react";
import { HaqAIAnalysisResult } from "@/lib/ai-engine";
import { SupportedLanguage } from "@/lib/legal-knowledge";
import { CitizenProfile } from "@/lib/supabase";
import { playHaqAITTS, stopHaqAITTS } from "@/lib/tts-player";
import { saveClientCase, saveClientDispatch } from "@/lib/client-storage";
import NearestStationFinder from "@/components/NearestStationFinder";

const LANGUAGE_OPTIONS: {
  id: SupportedLanguage;
  label: string;
  speechLang: string;
}[] = [
  { id: "ur", label: "اردو (Urdu)", speechLang: "ur-PK" },
  { id: "roman_ur", label: "Roman Urdu (آسان اردو)", speechLang: "ur-PK" },
  { id: "pa", label: "پنجابی (Punjabi)", speechLang: "pa-PK" },
  { id: "en", label: "English", speechLang: "en-US" },
];

function AssistantContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const caseIdParam = searchParams.get("caseId");
  const qParam = searchParams.get("q");

  const [citizenProfile, setCitizenProfile] = useState<CitizenProfile | null>(
    null
  );
  const [language, setLanguage] = useState<SupportedLanguage>("ur");
  const [inputText, setInputText] = useState("");
  const [followUpInput, setFollowUpInput] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [autoSpeak, setAutoSpeak] = useState(true);
  const [activeTab, setActiveTab] = useState<"guidance" | "complaint">(
    "guidance"
  );
  const [currentCase, setCurrentCase] = useState<HaqAIAnalysisResult | null>(
    null
  );
  const [voiceStatus, setVoiceStatus] = useState<string>("");

  const [editableComplaint, setEditableComplaint] = useState("");
  const [userApproved, setUserApproved] = useState(false);
  const [dispatchResult, setDispatchResult] = useState<{
    dispatchId: string;
    authorityName: string;
    authorityEmail: string;
    portalUrl: string;
    mailtoUrl: string;
    gmailComposeUrl: string;
  } | null>(null);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    function loadProfile() {
      try {
        const localProf = localStorage.getItem("haqai_active_profile");
        if (localProf) {
          setCitizenProfile(JSON.parse(localProf));
          return;
        }
      } catch {
        // ignore
      }
    }
    loadProfile();
    window.addEventListener("haqai-profile-updated", loadProfile);
    return () => {
      stopHaqAITTS();
      window.removeEventListener("haqai-profile-updated", loadProfile);
    };
  }, []);

  useEffect(() => {
    if (caseIdParam) {
      fetch(`/api/chat?caseId=${encodeURIComponent(caseIdParam)}`)
        .then((r) => r.json())
        .then((data) => {
          if (data.caseData) {
            setCurrentCase(data.caseData);
            setLanguage(data.caseData.language || "ur");
            setEditableComplaint(data.caseData.generatedComplaint.bodyText);
          }
        })
        .catch(() => {});
    } else if (qParam) {
      setInputText(qParam);
      handleAnalyze(qParam, language);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [caseIdParam, qParam]);

  function speakCaseAloud(caseObj: HaqAIAnalysisResult) {
    playHaqAITTS({
      text: caseObj.voiceSummaryText,
      lang: caseObj.language,
      onStart: () => setIsSpeaking(true),
      onEnd: () => setIsSpeaking(false),
    });
  }

  async function handleAnalyze(
    queryText?: string,
    langOverride?: SupportedLanguage,
    continueCase?: HaqAIAnalysisResult | null
  ) {
    const textToUse = (queryText ?? inputText).trim();
    if (!textToUse) return;

    const chosenLang = langOverride || language;
    setIsLoading(true);
    setDispatchResult(null);
    setUserApproved(false);
    stopHaqAITTS();
    setIsSpeaking(false);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: textToUse,
          language: chosenLang,
          channel: "website",
          existingCaseId: continueCase?.caseId,
          haqId: citizenProfile?.haqId,
          citizenProfile,
          previousChatHistory: continueCase?.chatHistory || [],
        }),
      });
      const data = await res.json();
      if (data.caseData) {
        saveClientCase(data.caseData);
        setCurrentCase(data.caseData);
        setEditableComplaint(data.caseData.generatedComplaint.bodyText);
        setFollowUpInput("");
        if (autoSpeak) {
          speakCaseAloud(data.caseData);
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  }

  function toggleMicrophone() {
    if (isRecording) {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      setIsRecording(false);
      setVoiceStatus("آواز ریکارڈ ہو گئی ہے! (Voice recorded)");
      return;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const SpeechRecognitionAPI =
      typeof window !== "undefined"
        ? // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (window as any).SpeechRecognition ||
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (window as any).webkitSpeechRecognition
        : null;

    if (!SpeechRecognitionAPI) {
      setVoiceStatus(
        "آپ کا براؤزر وائس ریکگنیشن سپورٹ نہیں کرتا۔ براہ کرم اپنا مسئلہ نیچے باکس میں لکھیں۔"
      );
      return;
    }

    try {
      const recognition = new SpeechRecognitionAPI();
      const langConfig = LANGUAGE_OPTIONS.find((l) => l.id === language);
      recognition.lang = langConfig?.speechLang || "ur-PK";
      recognition.interimResults = true;
      recognition.continuous = false;

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      recognition.onresult = (event: any) => {
        let transcript = "";
        for (let i = 0; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript;
        }
        setInputText(transcript);
      };

      recognition.onerror = () => {
        setIsRecording(false);
        setVoiceStatus(
          "مائیکروفون تک رسائی ممکن نہیں — براہ کرم اپنا مسئلہ نیچے لکھیں۔"
        );
      };

      recognition.onend = () => {
        setIsRecording(false);
        setVoiceStatus("آواز ریکارڈ ہو گئی! اب نیچے بٹن پر کلک کریں۔");
      };

      recognitionRef.current = recognition;
      recognition.start();
      setIsRecording(true);
      setVoiceStatus("اب اپنا مسئلہ بولیں... (Speak your problem now...)");
    } catch {
      setIsRecording(false);
    }
  }

  function toggleSpeakSummary() {
    if (isSpeaking) {
      stopHaqAITTS();
      setIsSpeaking(false);
      return;
    }
    if (!currentCase) return;
    speakCaseAloud(currentCase);
  }

  async function handleOneClickForward() {
    if (!currentCase || !userApproved) return;
    const res = await fetch("/api/dispatch", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        caseId: currentCase.caseId,
        haqId: citizenProfile?.haqId || currentCase.haqId,
        approved: userApproved,
        citizenName:
          citizenProfile?.fullName ||
          currentCase.generatedComplaint.facts.applicantName,
        citizenCnic:
          citizenProfile?.cnic || currentCase.generatedComplaint.facts.cnic,
        citizenPhone:
          citizenProfile?.phone ||
          currentCase.generatedComplaint.facts.contactPhone,
        citizenEmail:
          citizenProfile?.email ||
          currentCase.generatedComplaint.facts.contactEmail,
        citizenCity:
          citizenProfile?.city || currentCase.generatedComplaint.facts.city,
        authorityName: currentCase.primaryAuthority.name,
        authorityEmail: currentCase.primaryAuthority.email,
        portalUrl: currentCase.primaryAuthority.portalUrl,
        finalComplaintText: editableComplaint,
        subject: currentCase.generatedComplaint.subject,
      }),
    });
    const data = await res.json();
    if (data.success) {
      if (data.dispatchRecord) {
        saveClientDispatch(data.dispatchRecord);
      }
      try {
        navigator.clipboard.writeText(editableComplaint);
      } catch {
        // ignore clipboard errors
      }
      setDispatchResult({
        dispatchId: data.dispatchRecord.dispatchId,
        authorityName: currentCase.primaryAuthority.name,
        authorityEmail: currentCase.primaryAuthority.email,
        portalUrl: data.officialPortalUrl,
        mailtoUrl: data.mailtoUrl,
        gmailComposeUrl: data.gmailComposeUrl,
      });
    }
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      <div className="soft-card rounded-3xl p-6 sm:p-8 bg-gradient-to-r from-teal-50/80 via-white to-emerald-50/60">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="inline-block rounded-full bg-teal-100/80 px-3 py-0.5 text-xs font-semibold text-teal-800">
              Live AI Voice &amp; Legal Assistant
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              بول کر یا لکھ کر اپنا مسئلہ بتائیں
            </h1>
            <p className="text-sm text-slate-600">
              Speak or type any legal question in Urdu, Roman Urdu, Punjabi, or
              English—listen to the live AI response and forward your complaint
              in 1 click.
            </p>
          </div>

          <button
            type="button"
            onClick={() =>
              window.dispatchEvent(new Event("haqai-open-registration-modal"))
            }
            className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-xs shadow-sm hover:border-teal-300 transition shrink-0"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-teal-50 text-teal-600">
              <UserCheck className="h-4 w-4" />
            </div>
            <div className="text-left">
              <span className="block font-semibold text-slate-800">
                {citizenProfile?.fullName || "Register Citizen Profile"}
              </span>
              <span className="block font-mono text-[11px] text-teal-600">
                {citizenProfile?.haqId || "Click to Register"}
              </span>
            </div>
          </button>
        </div>
      </div>

      {/* Main Composer Card */}
      <div className="soft-card rounded-3xl p-6 sm:p-8 space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap gap-1.5 rounded-2xl bg-slate-100 p-1.5">
            {LANGUAGE_OPTIONS.map((lang) => (
              <button
                key={lang.id}
                type="button"
                onClick={() => setLanguage(lang.id)}
                className={`rounded-xl px-3.5 py-2 text-xs sm:text-sm font-semibold transition ${
                  language === lang.id
                    ? "bg-white text-teal-700 shadow-sm font-bold"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                {lang.label}
              </button>
            ))}
          </div>

          <label className="inline-flex items-center gap-2 text-xs font-semibold text-teal-800 cursor-pointer bg-teal-50/70 px-3.5 py-2 rounded-xl border border-teal-200/60">
            <input
              type="checkbox"
              checked={autoSpeak}
              onChange={(e) => setAutoSpeak(e.target.checked)}
              className="h-4 w-4 rounded text-teal-600"
            />
            <span>🔊 جواب خودکار آواز میں سنائیں (Auto-Play Voice)</span>
          </label>
        </div>

        {/* Sleek Microphone Button */}
        <button
          type="button"
          onClick={toggleMicrophone}
          className={`w-full flex flex-col sm:flex-row items-center justify-center gap-3 rounded-2xl py-5 px-6 text-base sm:text-lg font-bold transition-all shadow-md ${
            isRecording
              ? "bg-rose-600 text-white mic-recording"
              : "bg-gradient-to-r from-teal-600 to-emerald-600 text-white hover:from-teal-700 hover:to-emerald-700"
          }`}
        >
          {isRecording ? (
            <>
              <MicOff className="h-6 w-6" />
              <span>آواز ریکارڈ ہو رہی ہے... روکنے کے لیے دبائیں (Tap to Stop)</span>
            </>
          ) : (
            <>
              <Mic className="h-6 w-6" />
              <span>🎤 یہاں دبا کر اپنا مسئلہ بولیں (Tap Here to Speak)</span>
            </>
          )}
        </button>

        {voiceStatus && (
          <p className="text-center text-xs sm:text-sm font-semibold text-teal-800 bg-teal-50 rounded-xl py-2.5 px-4 border border-teal-100">
            {voiceStatus}
          </p>
        )}

        {/* Text Input */}
        <div className="space-y-3">
          <label className="block text-sm font-bold text-slate-700">
            یا یہاں اپنا سوال یا مسئلہ لکھیں (Or Type Your Question Below):
          </label>
          <textarea
            rows={4}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="اپنا قانونی سوال یا مسئلہ یہاں لکھیں..."
            className="w-full rounded-2xl border border-slate-200 bg-slate-50/60 p-4 text-sm sm:text-base text-slate-900 focus:border-teal-500 focus:bg-white focus:outline-none transition"
          />

          <button
            type="button"
            disabled={isLoading || !inputText.trim()}
            onClick={() => handleAnalyze()}
            className="w-full flex items-center justify-center gap-2.5 rounded-2xl bg-slate-900 py-4 px-6 text-sm sm:text-base font-bold text-white shadow-md hover:bg-slate-800 disabled:opacity-50 transition"
          >
            <Send className="h-4 w-4 text-teal-400" />
            <span>
              {isLoading
                ? "قانونی تجزیہ کیا جا رہا ہے اور شکایت لکھی جا رہی ہے..."
                : "قانونی حل سنیں اور تیار شکایت حاصل کریں (Get Solution & Complaint)"}
            </span>
          </button>
        </div>
      </div>

      {/* Results Area */}
      {currentCase && (
        <div className="space-y-6">
          <div className="soft-card rounded-3xl p-6 sm:p-8 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
              <div>
                <span className="rounded-full bg-teal-50 border border-teal-200 px-3 py-0.5 text-xs font-semibold text-teal-700">
                  Case ID: {currentCase.caseId}
                </span>
                <h2 className="mt-2 text-xl sm:text-2xl font-extrabold text-slate-900">
                  {currentCase.categoryTitle}
                </h2>
              </div>

              <button
                type="button"
                onClick={toggleSpeakSummary}
                className={`inline-flex items-center justify-center gap-2.5 rounded-2xl px-5 py-3.5 text-sm font-bold shadow-sm transition ${
                  isSpeaking
                    ? "bg-rose-600 text-white animate-pulse"
                    : "bg-teal-600 text-white hover:bg-teal-700"
                }`}
              >
                {isSpeaking ? (
                  <>
                    <VolumeX className="h-5 w-5" />
                    <span>آواز روکیں (Stop Voice)</span>
                  </>
                ) : (
                  <>
                    <Volume2 className="h-5 w-5" />
                    <span>🔊 جواب صاف اردو آواز میں سنیں (Listen Aloud)</span>
                  </>
                )}
              </button>
            </div>

            {/* Spoken Summary Box */}
            <div className="rounded-2xl bg-teal-50/60 border border-teal-200/70 p-5 space-y-1.5">
              <p className="text-xs font-bold text-teal-800">
                🔊 آسان خلاصہ (Spoken Audio Summary):
              </p>
              <p className="text-base sm:text-lg font-medium text-slate-800 leading-relaxed">
                {currentCase.voiceSummaryText}
              </p>
            </div>

              {/* Detailed Direct Answer Box */}
            <div className="rounded-2xl bg-white border border-slate-200 p-5 sm:p-6 space-y-2 shadow-sm">
              <div className="flex items-center justify-between">
                <p className="text-xs font-bold uppercase tracking-wider text-teal-700">
                  ⚖️ آپ کے سوال کا تفصیلی قانونی جواب (Complete Legal Answer)
                </p>
                <span className="text-[11px] font-medium text-slate-400">
                  Q: &ldquo;{currentCase.userQuery}&rdquo;
                </span>
              </div>
              <div className="whitespace-pre-line text-sm sm:text-base text-slate-800 leading-relaxed">
                {currentCase.replyText}
              </div>
            </div>

            {/* Nearest Helping Station Finder (Location Permission + Turn-by-Turn Directions) */}
            <NearestStationFinder
              categoryId={currentCase.categoryId}
              authorityName={currentCase.primaryAuthority.name}
              citizenCity={
                citizenProfile?.city ||
                currentCase.generatedComplaint.facts.city
              }
            />

            {/* 2 Balanced Option Cards */}
            <div className="space-y-2.5">
              <p className="text-sm font-bold text-slate-700">
                اب آپ کیا کرنا چاہتے ہیں؟ (Choose Your Next Step):
              </p>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <button
                  type="button"
                  onClick={() => setActiveTab("complaint")}
                  className={`flex flex-col justify-between rounded-2xl p-5 text-left border-2 transition-all ${
                    activeTab === "complaint"
                      ? "border-teal-600 bg-teal-600 text-white shadow-md"
                      : "border-slate-200 bg-slate-50/70 text-slate-900 hover:border-teal-300 hover:bg-teal-50/30"
                  }`}
                >
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider opacity-90">
                    <FileCheck2 className="h-5 w-5" />
                    <span>Option 1 • آپشن 1</span>
                  </div>
                  <p className="mt-2 text-lg font-extrabold">
                    📝 آن لائن شکایت بھیجیں (1-Click Complaint)
                  </p>
                  <p
                    className={`mt-1 text-xs ${
                      activeTab === "complaint"
                        ? "text-teal-50"
                        : "text-slate-500"
                    }`}
                  >
                    Forward your pre-filled application in 1 click to{" "}
                    <strong>{currentCase.primaryAuthority.shortName}</strong>.
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab("guidance")}
                  className={`flex flex-col justify-between rounded-2xl p-5 text-left border-2 transition-all ${
                    activeTab === "guidance"
                      ? "border-teal-600 bg-teal-600 text-white shadow-md"
                      : "border-slate-200 bg-slate-50/70 text-slate-900 hover:border-teal-300 hover:bg-teal-50/30"
                  }`}
                >
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider opacity-90">
                    <Scale className="h-5 w-5" />
                    <span>Option 2 • آپشن 2</span>
                  </div>
                  <p className="mt-2 text-lg font-extrabold">
                    📖 مکمل قانونی رہنمائی دیکھیں (Legal Guidance)
                  </p>
                  <p
                    className={`mt-1 text-xs ${
                      activeTab === "guidance"
                        ? "text-teal-50"
                        : "text-slate-500"
                    }`}
                  >
                    View applicable 1973 Constitutional Articles, laws &amp;
                    step-by-step instructions.
                  </p>
                </button>
              </div>
            </div>
          </div>

          {/* OPTION 1: 1-CLICK COMPLAINT */}
          {activeTab === "complaint" ? (
            <div className="soft-card rounded-3xl p-6 sm:p-8 space-y-5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">
                    📝 آپ کی تیار شدہ قانونی درخواست ({currentCase.primaryAuthority.shortName})
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Pre-filled with your Citizen Profile. You can edit any text
                    below before sending.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    router.push(`/complaint?caseId=${currentCase.caseId}`)
                  }
                  className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100"
                >
                  <span>Open Full Studio / Download</span>
                  <ExternalLink className="h-3.5 w-3.5" />
                </button>
              </div>

              <textarea
                rows={14}
                value={editableComplaint}
                onChange={(e) => setEditableComplaint(e.target.value)}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50/70 p-4 font-mono text-xs leading-relaxed text-slate-800 focus:border-teal-500 focus:bg-white focus:outline-none"
              />

              <label className="flex items-start gap-3 rounded-2xl border border-teal-200 bg-teal-50/50 p-4 cursor-pointer">
                <input
                  type="checkbox"
                  checked={userApproved}
                  onChange={(e) => setUserApproved(e.target.checked)}
                  className="mt-1 h-4 w-4 rounded border-slate-300 text-teal-600"
                />
                <span className="text-xs sm:text-sm font-medium text-slate-800 leading-relaxed">
                  ✅ میں نے اپنی درخواست چیک کر لی ہے اور میں اجازت دیتا/دیتی ہوں
                  کہ اسے <strong>{currentCase.primaryAuthority.name}</strong> کو
                  بھیج دیا جائے۔ (I approve forwarding this complaint)
                </span>
              </label>

              <button
                type="button"
                disabled={!userApproved}
                onClick={handleOneClickForward}
                className="w-full flex items-center justify-center gap-2.5 rounded-2xl bg-gradient-to-r from-teal-600 to-emerald-600 px-6 py-4 text-base font-bold text-white shadow-md hover:from-teal-700 hover:to-emerald-700 disabled:opacity-40 transition"
              >
                <Send className="h-5 w-5" />
                <span>
                  1-کلک پر شکایت {currentCase.primaryAuthority.shortName} کو بھیجیں (1-Click Forward)
                </span>
              </button>

              {dispatchResult && (
                <div className="rounded-2xl border border-emerald-300 bg-emerald-50/70 p-5 space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="inline-flex items-center gap-2 text-sm font-bold text-emerald-900">
                      <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                      آپ کی شکایت فارورڈ ہو گئی ہے (Complaint Logged &amp; Ready to Send!)
                    </span>
                    <span className="rounded-md bg-white px-2.5 py-0.5 text-xs font-mono font-semibold text-emerald-800 border border-emerald-200">
                      ID: {dispatchResult.dispatchId}
                    </span>
                  </div>

                  <div className="rounded-xl bg-white/90 border border-emerald-200 p-3.5 text-xs space-y-1 text-slate-700">
                    <p>
                      <strong>Receiving Authority:</strong>{" "}
                      {dispatchResult.authorityName}
                    </p>
                    <p>
                      <strong>Official Grievance Email:</strong>{" "}
                      <span className="font-mono font-semibold text-teal-700">
                        {dispatchResult.authorityEmail}
                      </span>
                    </p>
                    <p>
                      <strong>Official Portal URL:</strong>{" "}
                      <a
                        href={dispatchResult.portalUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="underline text-teal-700 font-semibold"
                      >
                        {dispatchResult.portalUrl}
                      </a>
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2.5 pt-1">
                    <a
                      href={dispatchResult.gmailComposeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 rounded-xl bg-teal-600 px-4 py-2.5 text-xs font-bold text-white hover:bg-teal-700"
                    >
                      <Mail className="h-4 w-4" /> جی میل سے بھیجیں (Send via Gmail Web)
                    </a>
                    <a
                      href={dispatchResult.mailtoUrl}
                      className="inline-flex items-center gap-1.5 rounded-xl bg-slate-900 px-4 py-2.5 text-xs font-bold text-white hover:bg-slate-800"
                    >
                      <Mail className="h-4 w-4" /> ای میل ایپ کھولیں (Default Email App)
                    </a>
                    <a
                      href={dispatchResult.portalUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 rounded-xl bg-white border border-slate-200 px-4 py-2.5 text-xs font-bold text-slate-800 hover:bg-slate-50"
                    >
                      <ExternalLink className="h-4 w-4" /> سرکاری پورٹل کھولیں ({currentCase.primaryAuthority.shortName})
                    </a>
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* OPTION 2: LEGAL GUIDANCE */
            <div className="space-y-6">
              <div className="soft-card rounded-3xl p-6 space-y-3">
                <span className="text-xs font-bold uppercase text-teal-600">
                  🏛️ متعلقہ سرکاری ادارہ (Relevant Institution)
                </span>
                <h3 className="text-lg font-bold text-slate-900">
                  {currentCase.primaryAuthority.name}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600">
                  {currentCase.primaryAuthority.role}
                </p>
                <div className="flex flex-wrap gap-3 pt-1 text-xs font-semibold text-slate-700">
                  <span className="inline-flex items-center gap-1.5 bg-slate-100 px-3 py-1.5 rounded-lg">
                    <PhoneCall className="h-3.5 w-3.5 text-teal-600" /> Helpline:{" "}
                    {currentCase.primaryAuthority.helpline}
                  </span>
                  <span className="inline-flex items-center gap-1.5 bg-slate-100 px-3 py-1.5 rounded-lg">
                    <Mail className="h-3.5 w-3.5 text-teal-600" /> Email:{" "}
                    {currentCase.primaryAuthority.email}
                  </span>
                </div>
                <div className="pt-2 flex flex-wrap gap-2.5">
                  <button
                    type="button"
                    onClick={() => setActiveTab("complaint")}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-teal-600 px-4 py-2.5 text-xs font-bold text-white hover:bg-teal-700"
                  >
                    <FileCheck2 className="h-4 w-4" />
                    <span>ابھی 1-کلک پر شکایت بھیجیں →</span>
                  </button>
                  <a
                    href={currentCase.primaryAuthority.portalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                  >
                    <span>Official Portal</span>
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                </div>
              </div>

              <div className="soft-card rounded-3xl p-6 space-y-4">
                <h3 className="text-base font-bold text-slate-900">
                  ✅ آپ کو کیا کرنا چاہیے؟ (Step-by-Step Instructions)
                </h3>
                <ol className="space-y-2.5">
                  {currentCase.nextSteps.map((step, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-3 rounded-xl bg-slate-50/80 p-3.5 text-sm text-slate-700"
                    >
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-teal-100 text-xs font-bold text-teal-800">
                        {i + 1}
                      </span>
                      <span className="leading-relaxed">{step}</span>
                    </li>
                  ))}
                </ol>
              </div>

              <div className="soft-card rounded-3xl p-6 space-y-4">
                <h3 className="text-base font-bold text-slate-900">
                  ⚖️ آئینِ پاکستان (1973) اور قوانین کے مطابق آپ کے حقوق
                </h3>
                <div className="space-y-3">
                  {currentCase.constitutionalRights.map((c, idx) => (
                    <div
                      key={idx}
                      className="rounded-xl border-l-4 border-teal-500 bg-teal-50/40 p-4"
                    >
                      <p className="text-xs font-bold text-teal-800">
                        {c.article} — {c.title}
                      </p>
                      <p className="mt-1 text-sm text-slate-700 leading-relaxed">
                        {c.summary}
                      </p>
                    </div>
                  ))}

                  {currentCase.statutoryLaws.map((s, idx) => (
                    <div
                      key={idx}
                      className="rounded-xl border-l-4 border-indigo-500 bg-indigo-50/40 p-4"
                    >
                      <p className="text-xs font-bold text-indigo-900">
                        {s.law} ({s.section})
                      </p>
                      <p className="mt-1 text-sm text-slate-700 leading-relaxed">
                        {s.explanation}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="soft-card rounded-3xl p-6 space-y-3">
                <h4 className="text-sm font-bold text-slate-800">
                  مزید کوئی سوال پوچھنا چاہتے ہیں؟ (Ask Any Follow-Up Question)
                </h4>
                <div className="flex flex-col sm:flex-row gap-2.5">
                  <input
                    type="text"
                    value={followUpInput}
                    onChange={(e) => setFollowUpInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && followUpInput.trim()) {
                        handleAnalyze(followUpInput, language, currentCase);
                      }
                    }}
                    placeholder="یہاں اپنا اگلا سوال لکھیں..."
                    className="flex-1 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-900 focus:border-teal-500 focus:bg-white focus:outline-none"
                  />
                  <button
                    type="button"
                    disabled={isLoading || !followUpInput.trim()}
                    onClick={() =>
                      handleAnalyze(followUpInput, language, currentCase)
                    }
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-teal-600 px-5 py-2.5 text-xs font-bold text-white hover:bg-teal-700 disabled:opacity-50"
                  >
                    <Send className="h-3.5 w-3.5" />
                    <span>جواب پوچھیں</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function AssistantPage() {
  return (
    <Suspense
      fallback={
        <div className="p-12 text-center text-sm text-slate-500">
          Loading HaqAI...
        </div>
      }
    >
      <AssistantContent />
    </Suspense>
  );
}
