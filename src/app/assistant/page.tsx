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

const QUICK_SCENARIOS = [
  {
    key: "degree_ur",
    badge: "🎓 یونیورسٹی ڈگری کا مسئلہ (University Degree)",
    lang: "ur" as SupportedLanguage,
    text: "میری یونیورسٹی میری اصل ڈگری اور تعلیمی اسناد واپس نہیں کر رہی حالانکہ میری تمام کلیئرنس مکمل ہے۔ میں کیا کر سکتا ہوں؟",
  },
  {
    key: "police_fir",
    badge: "🚓 پولیس ایف آئی آر درج نہیں کر رہی (Police FIR)",
    lang: "ur" as SupportedLanguage,
    text: "میرے ساتھ چوری اور فراڈ ہوا ہے لیکن پولیس اسٹیشن کا ایس ایچ او میری ایف آئی آر درج کرنے سے انکار کر رہا ہے۔",
  },
  {
    key: "inheritance",
    badge: "🏠 وراثت اور جائیداد میں حصہ (Inheritance / Wirasat)",
    lang: "ur" as SupportedLanguage,
    text: "والد کے انتقال کے بعد میرے رشتہ دار مجھے اور میری والدہ کو وراثت کی جائیداد میں سے قانونی حصہ نہیں دے رہے۔",
  },
  {
    key: "salary",
    badge: "💼 تنخواہ روک لی گئی ہے (Unpaid Salary)",
    lang: "ur" as SupportedLanguage,
    text: "میری کمپنی نے پچھلے 3 مہینے سے میری تنخواہ روکی ہوئی ہے اور مانگنے پر نوکری سے نکالنے کی دھمکی دے رہے ہیں۔",
  },
];

function AssistantContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const caseIdParam = searchParams.get("caseId");
  const demoParam = searchParams.get("demo");
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
    portalUrl: string;
    mailtoUrl: string;
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
      fetch("/api/profile")
        .then((r) => r.json())
        .then((d) => {
          if (d.profile) setCitizenProfile(d.profile);
        })
        .catch(() => {});
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
    } else if (demoParam === "degree") {
      const demoScenario = QUICK_SCENARIOS[0];
      setLanguage(demoScenario.lang);
      setInputText(demoScenario.text);
      handleAnalyze(demoScenario.text, demoScenario.lang);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [caseIdParam, demoParam, qParam]);

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
      setVoiceStatus("آپ کی آواز سنی جا رہی ہے... (Listening...)");
      setIsRecording(true);
      setTimeout(async () => {
        const res = await fetch("/api/transcribe", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({}),
        });
        const data = await res.json();
        setIsRecording(false);
        if (data.transcript) {
          setInputText(data.transcript);
          setVoiceStatus("آواز لکھ لی گئی ہے! جواب تیار ہو رہا ہے...");
          handleAnalyze(data.transcript, language);
        }
      }, 1200);
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
          "مائیک دستیاب نہیں ہے — نیچے دیے گئے بٹن دبائیں یا اپنا مسئلہ لکھیں۔"
        );
      };

      recognition.onend = () => {
        setIsRecording(false);
        setVoiceStatus(
          "آواز ریکارڈ ہو گئی! اب پیلے بٹن پر کلک کریں۔"
        );
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
      setDispatchResult({
        dispatchId: data.dispatchRecord.dispatchId,
        authorityName: currentCase.primaryAuthority.name,
        portalUrl: data.officialPortalUrl,
        mailtoUrl: data.mailtoUrl,
      });
    }
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      {/* Simple Citizen Header */}
      <div className="rounded-3xl bg-gradient-to-r from-[#01411C] to-[#045d2a] p-6 sm:p-8 text-white shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <h1 className="text-2xl sm:text-3xl font-extrabold">
              🎤 بول کر یا لکھ کر اپنا مسئلہ بتائیں
            </h1>
            <p className="text-sm sm:text-base text-emerald-100">
              حق اے آئی آپ کو صاف اردو آواز میں قانونی حل سنائے گا اور آپ کی
              تیار درخواست متعلقہ ادارے کو بھیج دے گا۔
            </p>
          </div>

          <button
            type="button"
            onClick={() =>
              window.dispatchEvent(new Event("haqai-open-registration-modal"))
            }
            className="flex items-center gap-3 rounded-2xl bg-black/25 border border-amber-400/40 px-4 py-3 text-xs hover:bg-black/35 transition shrink-0"
          >
            <UserCheck className="h-5 w-5 text-[#D4AF37]" />
            <div className="text-left">
              <span className="block font-mono font-extrabold text-[#D4AF37]">
                {citizenProfile?.haqId || "HAQ-PK-104829"}
              </span>
              <span className="block text-emerald-100">
                {citizenProfile?.fullName || "پروفائل اپڈیٹ کریں"}
              </span>
            </div>
          </button>
        </div>
      </div>

      {/* Main Step 1 Box: Big Microphone + Big Textarea */}
      <div className="rounded-3xl border-2 border-slate-200 bg-white p-6 sm:p-8 shadow-md space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap gap-2">
            {LANGUAGE_OPTIONS.map((lang) => (
              <button
                key={lang.id}
                type="button"
                onClick={() => setLanguage(lang.id)}
                className={`rounded-xl px-4 py-2.5 text-sm font-extrabold border-2 transition ${
                  language === lang.id
                    ? "border-[#01411C] bg-[#01411C] text-[#D4AF37]"
                    : "border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100"
                }`}
              >
                {lang.label}
              </button>
            ))}
          </div>

          <label className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-[#01411C] cursor-pointer bg-emerald-50 px-3.5 py-2 rounded-xl border border-emerald-200">
            <input
              type="checkbox"
              checked={autoSpeak}
              onChange={(e) => setAutoSpeak(e.target.checked)}
              className="h-4 w-4 rounded text-[#01411C]"
            />
            <span>🔊 جواب خودکار آواز میں سنائیں (Auto-Play Clear Urdu Voice)</span>
          </label>
        </div>

        {/* Giant Mic Button */}
        <button
          type="button"
          onClick={toggleMicrophone}
          className={`w-full flex flex-col sm:flex-row items-center justify-center gap-3 rounded-3xl py-6 px-6 text-lg sm:text-xl font-extrabold transition shadow-lg ${
            isRecording
              ? "bg-red-600 text-white mic-recording"
              : "bg-gradient-to-r from-[#01411C] to-emerald-800 text-white hover:brightness-110"
          }`}
        >
          {isRecording ? (
            <>
              <MicOff className="h-8 w-8" />
              <span>آواز ریکارڈ ہو رہی ہے... روکنے کے لیے دبائیں (Tap to Stop)</span>
            </>
          ) : (
            <>
              <Mic className="h-8 w-8 text-[#D4AF37]" />
              <span>🎤 یہاں دبا کر اپنا مسئلہ بولیں (Tap Here to Speak)</span>
            </>
          )}
        </button>

        {voiceStatus && (
          <p className="text-center text-sm font-bold text-emerald-900 bg-emerald-50 rounded-xl py-2.5 px-4 border border-emerald-200">
            {voiceStatus}
          </p>
        )}

        {/* Or Type Box */}
        <div className="space-y-3">
          <label className="block text-base font-extrabold text-slate-800">
            یا یہاں اپنا مسئلہ لکھیں (Or Type Your Problem Here):
          </label>
          <textarea
            rows={3}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="مثلاً: میری یونیورسٹی میری اصل ڈگری واپس نہیں کر رہی۔ میں کیا کروں؟"
            className="w-full rounded-2xl border-2 border-slate-300 bg-slate-50 p-4 text-base text-slate-900 focus:border-[#01411C] focus:bg-white focus:outline-none"
          />

          <button
            type="button"
            disabled={isLoading || !inputText.trim()}
            onClick={() => handleAnalyze()}
            className="w-full flex items-center justify-center gap-3 rounded-2xl bg-[#D4AF37] py-4 px-6 text-lg font-extrabold text-[#01411C] shadow-lg hover:bg-amber-400 disabled:opacity-50 transition"
          >
            <Send className="h-5 w-5" />
            <span>
              {isLoading
                ? "قانون چیک کیا جا رہا ہے اور شکایت لکھی جا رہی ہے..."
                : "قانونی حل سنیں اور تیار شکایت حاصل کریں (Get Solution & Complaint)"}
            </span>
          </button>
        </div>

        {/* Quick 1-Tap Buttons for Non-Technical Users */}
        <div className="pt-2 border-t border-slate-100">
          <p className="text-xs font-extrabold text-slate-500 mb-2.5">
            یا نیچے دیے گئے کسی عام مسئلے پر ایک کلک کریں (Or Click Any Common Problem):
          </p>
          <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
            {QUICK_SCENARIOS.map((item) => (
              <button
                key={item.key}
                type="button"
                onClick={() => {
                  setLanguage(item.lang);
                  setInputText(item.text);
                  handleAnalyze(item.text, item.lang);
                }}
                className="text-left rounded-2xl border-2 border-slate-200 p-3.5 hover:border-[#01411C] hover:bg-emerald-50/50 transition"
              >
                <span className="block text-sm font-extrabold text-[#01411C]">
                  {item.badge}
                </span>
                <span className="mt-1 block text-xs text-slate-600 line-clamp-1">
                  {item.text}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Results Area: Huge Speaker Button + 2 Unmistakable Options */}
      {currentCase && (
        <div className="space-y-6">
          {/* Big Audio Player Bar + 2 Giant Action Buttons */}
          <div className="rounded-3xl border-4 border-[#01411C] bg-white p-6 sm:p-8 shadow-xl space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
              <div>
                <span className="rounded-lg bg-emerald-100 px-3 py-1 text-xs font-extrabold text-[#01411C]">
                  کیس نمبر: {currentCase.caseId}
                </span>
                <h2 className="mt-2 text-2xl font-extrabold text-slate-900">
                  {currentCase.categoryTitle}
                </h2>
              </div>

              {/* HUGE CLEAR URDU AUDIO SPEAKER BUTTON */}
              <button
                type="button"
                onClick={toggleSpeakSummary}
                className={`inline-flex items-center justify-center gap-3 rounded-2xl px-6 py-4 text-base font-extrabold shadow-lg transition ${
                  isSpeaking
                    ? "bg-red-600 text-white animate-pulse"
                    : "bg-[#D4AF37] text-[#01411C] hover:bg-amber-400"
                }`}
              >
                {isSpeaking ? (
                  <>
                    <VolumeX className="h-6 w-6" />
                    <span>آواز روکیں (Stop Voice)</span>
                  </>
                ) : (
                  <>
                    <Volume2 className="h-6 w-6" />
                    <span>🔊 جواب صاف اردو آواز میں سنیں (Listen Aloud)</span>
                  </>
                )}
              </button>
            </div>

            {/* Spoken Urdu Summary Box (Easy to read & hear) */}
            <div className="rounded-2xl bg-emerald-50 border-2 border-emerald-200 p-5 space-y-2">
              <p className="text-xs font-extrabold text-[#01411C]">
                🔊 آسان خلاصہ (Simple Summary):
              </p>
              <p className="text-lg font-bold text-slate-900 leading-relaxed">
                {currentCase.voiceSummaryText}
              </p>
            </div>

            {/* THE 2 HUGE CITIZEN CHOICE BUTTONS */}
            <div className="space-y-3">
              <p className="text-base font-extrabold text-slate-900">
                اب آپ کیا کرنا چاہتے ہیں؟ نیچے دو میں سے ایک بٹن دبائیں:
              </p>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <button
                  type="button"
                  onClick={() => setActiveTab("complaint")}
                  className={`flex flex-col justify-between rounded-2xl p-5 text-left border-4 transition ${
                    activeTab === "complaint"
                      ? "border-[#01411C] bg-[#01411C] text-white shadow-xl"
                      : "border-emerald-600 bg-emerald-50 text-slate-900 hover:bg-emerald-100"
                  }`}
                >
                  <div className="flex items-center gap-2 text-sm font-extrabold text-[#D4AF37]">
                    <FileCheck2 className="h-6 w-6" />
                    <span>آپشن 1 (Option 1)</span>
                  </div>
                  <p className="mt-2 text-xl font-extrabold">
                    📝 آن لائن شکایت بھیجیں (1-Click Complaint)
                  </p>
                  <p
                    className={`mt-1 text-xs ${
                      activeTab === "complaint"
                        ? "text-emerald-100"
                        : "text-slate-700"
                    }`}
                  >
                    آپ کی تیار شدہ درخواست کو ایک کلک پر{" "}
                    <strong>{currentCase.primaryAuthority.shortName}</strong> کو
                    فارورڈ کریں۔
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab("guidance")}
                  className={`flex flex-col justify-between rounded-2xl p-5 text-left border-4 transition ${
                    activeTab === "guidance"
                      ? "border-[#01411C] bg-[#01411C] text-white shadow-xl"
                      : "border-slate-300 bg-slate-50 text-slate-900 hover:bg-slate-100"
                  }`}
                >
                  <div className="flex items-center gap-2 text-sm font-extrabold text-amber-400">
                    <Scale className="h-6 w-6" />
                    <span>آپشن 2 (Option 2)</span>
                  </div>
                  <p className="mt-2 text-xl font-extrabold">
                    📖 مکمل قانونی رہنمائی دیکھیں (Legal Guidance)
                  </p>
                  <p
                    className={`mt-1 text-xs ${
                      activeTab === "guidance"
                        ? "text-emerald-100"
                        : "text-slate-700"
                    }`}
                  >
                    آئینِ پاکستان کی دفعات، قوانین اور طریقہ کار تفصیل سے دیکھیں۔
                  </p>
                </button>
              </div>
            </div>
          </div>

          {/* OPTION 1 VIEW: SIMPLE 1-CLICK COMPLAINT */}
          {activeTab === "complaint" ? (
            <div className="rounded-3xl border-2 border-slate-200 bg-white p-6 sm:p-8 shadow-md space-y-5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <h3 className="text-xl font-extrabold text-slate-900">
                    📝 آپ کی تیار شدہ قانونی درخواست ({currentCase.primaryAuthority.shortName})
                  </h3>
                  <p className="text-xs text-slate-600 mt-1">
                    اس میں آپ کا نام، شناختی کارڈ اور پتہ شامل کر دیا گیا ہے۔ آپ
                    اس میں کوئی بھی تبدیلی کر سکتے ہیں۔
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    router.push(`/complaint?caseId=${currentCase.caseId}`)
                  }
                  className="inline-flex items-center gap-1.5 rounded-xl border-2 border-[#01411C] px-4 py-2 text-xs font-extrabold text-[#01411C] hover:bg-emerald-50"
                >
                  <span>فل اسکرین میں کھولیں / ڈاؤن لوڈ کریں</span>
                  <ExternalLink className="h-4 w-4" />
                </button>
              </div>

              <textarea
                rows={14}
                value={editableComplaint}
                onChange={(e) => setEditableComplaint(e.target.value)}
                className="w-full rounded-2xl border-2 border-slate-300 bg-slate-50 p-4 font-mono text-xs leading-relaxed text-slate-900 focus:border-[#01411C] focus:bg-white focus:outline-none"
              />

              <label className="flex items-start gap-3 rounded-2xl border-2 border-amber-400 bg-amber-50 p-4 cursor-pointer">
                <input
                  type="checkbox"
                  checked={userApproved}
                  onChange={(e) => setUserApproved(e.target.checked)}
                  className="mt-1 h-5 w-5 rounded border-slate-300 text-[#01411C]"
                />
                <span className="text-sm font-bold text-slate-900 leading-relaxed">
                  ✅ میں نے اپنی درخواست چیک کر لی ہے اور میں اجازت دیتا/دیتی ہوں
                  کہ اسے <strong>{currentCase.primaryAuthority.name}</strong> کو
                  بھیج دیا جائے۔ (I approve forwarding this complaint)
                </span>
              </label>

              <button
                type="button"
                disabled={!userApproved}
                onClick={handleOneClickForward}
                className="w-full flex items-center justify-center gap-3 rounded-2xl bg-[#01411C] px-6 py-5 text-lg font-extrabold text-[#D4AF37] shadow-xl hover:bg-emerald-900 disabled:opacity-40 transition"
              >
                <Send className="h-6 w-6" />
                <span>
                  🚀 1-کلک پر شکایت {currentCase.primaryAuthority.shortName} کو بھیجیں (1-Click Forward)
                </span>
              </button>

              {dispatchResult && (
                <div className="rounded-2xl border-2 border-green-600 bg-green-50 p-6 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center gap-2 text-base font-extrabold text-green-900">
                      <CheckCircle2 className="h-6 w-6 text-green-600" />
                      مبارک ہو! آپ کی شکایت فارورڈ ہو گئی ہے (Dispatched!)
                    </span>
                    <span className="rounded-md bg-green-200 px-3 py-1 text-xs font-mono font-bold text-green-900">
                      رسید نمبر: {dispatchResult.dispatchId}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-3 pt-2">
                    <a
                      href={dispatchResult.mailtoUrl}
                      className="inline-flex items-center gap-2 rounded-xl bg-green-700 px-5 py-3 text-sm font-extrabold text-white hover:bg-green-800"
                    >
                      <Mail className="h-4 w-4" /> سرکاری ای میل بھیجیں (Send Email)
                    </a>
                    <a
                      href={dispatchResult.portalUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 rounded-xl bg-[#01411C] px-5 py-3 text-sm font-extrabold text-[#D4AF37]"
                    >
                      <ExternalLink className="h-4 w-4" /> سرکاری پورٹل کھولیں ({currentCase.primaryAuthority.shortName})
                    </a>
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* OPTION 2 VIEW: CLEAR LEGAL GUIDANCE */
            <div className="space-y-6">
              {/* Relevant Government Authority Card */}
              <div className="rounded-3xl border-2 border-[#01411C] bg-emerald-50/70 p-6 space-y-3">
                <span className="text-xs font-extrabold uppercase text-[#01411C]">
                  🏛️ متعلقہ سرکاری ادارہ (Where to Complain)
                </span>
                <h3 className="text-xl font-extrabold text-slate-900">
                  {currentCase.primaryAuthority.name}
                </h3>
                <p className="text-sm text-slate-700">
                  {currentCase.primaryAuthority.role}
                </p>
                <div className="flex flex-wrap gap-4 pt-2 text-sm font-bold text-slate-900">
                  <span className="inline-flex items-center gap-1.5 bg-white px-3.5 py-2 rounded-xl border border-emerald-200">
                    <PhoneCall className="h-4 w-4 text-[#01411C]" /> ہیلپ لائن:{" "}
                    {currentCase.primaryAuthority.helpline}
                  </span>
                  <span className="inline-flex items-center gap-1.5 bg-white px-3.5 py-2 rounded-xl border border-emerald-200">
                    <Mail className="h-4 w-4 text-[#01411C]" /> ای میل:{" "}
                    {currentCase.primaryAuthority.email}
                  </span>
                </div>
                <div className="pt-2 flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={() => setActiveTab("complaint")}
                    className="inline-flex items-center gap-2 rounded-xl bg-[#01411C] px-5 py-3 text-sm font-extrabold text-[#D4AF37]"
                  >
                    <FileCheck2 className="h-4 w-4" />
                    <span>ابھی 1-کلک پر شکایت بھیجیں →</span>
                  </button>
                  <a
                    href={currentCase.primaryAuthority.portalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-xl bg-white border border-slate-300 px-5 py-3 text-sm font-bold text-slate-800"
                  >
                    <span>سرکاری ویب سائٹ کھولیں</span>
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </div>
              </div>

              {/* Practical Steps */}
              <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
                <h3 className="text-lg font-extrabold text-slate-900">
                  ✅ آپ کو کیا کرنا چاہیے؟ (Step-by-Step Instructions)
                </h3>
                <ol className="space-y-3">
                  {currentCase.nextSteps.map((step, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-3 rounded-2xl bg-slate-50 p-4 text-sm sm:text-base font-medium text-slate-800"
                    >
                      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#01411C] text-xs font-extrabold text-[#D4AF37]">
                        {i + 1}
                      </span>
                      <span className="leading-relaxed">{step}</span>
                    </li>
                  ))}
                </ol>
              </div>

              {/* Constitutional & Statutory Rights */}
              <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
                <h3 className="text-lg font-extrabold text-slate-900">
                  ⚖️ آئینِ پاکستان (1973) اور قوانین کے مطابق آپ کے حقوق
                </h3>
                <div className="space-y-3">
                  {currentCase.constitutionalRights.map((c, idx) => (
                    <div
                      key={idx}
                      className="rounded-2xl border-l-4 border-[#01411C] bg-emerald-50/50 p-4"
                    >
                      <p className="text-sm font-extrabold text-[#01411C]">
                        {c.article} — {c.title}
                      </p>
                      <p className="mt-1 text-sm text-slate-800 leading-relaxed">
                        {c.summary}
                      </p>
                    </div>
                  ))}

                  {currentCase.statutoryLaws.map((s, idx) => (
                    <div
                      key={idx}
                      className="rounded-2xl border-l-4 border-[#D4AF37] bg-amber-50/50 p-4"
                    >
                      <p className="text-sm font-extrabold text-amber-950">
                        {s.law} ({s.section})
                      </p>
                      <p className="mt-1 text-sm text-slate-800 leading-relaxed">
                        {s.explanation}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Follow-Up Question Input */}
              <div className="rounded-3xl border-2 border-emerald-200 bg-emerald-50/50 p-6 space-y-3">
                <h4 className="text-base font-extrabold text-[#01411C]">
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
                    className="flex-1 rounded-xl border-2 border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 focus:border-[#01411C] focus:outline-none"
                  />
                  <button
                    type="button"
                    disabled={isLoading || !followUpInput.trim()}
                    onClick={() =>
                      handleAnalyze(followUpInput, language, currentCase)
                    }
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#01411C] px-6 py-3 text-sm font-extrabold text-[#D4AF37] disabled:opacity-50"
                  >
                    <Send className="h-4 w-4" />
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
        <div className="p-12 text-center text-sm text-slate-600">
          لوڈ ہو رہا ہے (Loading HaqAI)...
        </div>
      }
    >
      <AssistantContent />
    </Suspense>
  );
}
