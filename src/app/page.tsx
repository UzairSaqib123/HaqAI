import React from "react";
import Link from "next/link";
import {
  Mic,
  Volume2,
  Send,
  GraduationCap,
  ShieldAlert,
  Home as HomeIcon,
  Briefcase,
  HeartHandshake,
  Smartphone,
  ExternalLink,
  ArrowRight,
  CheckCircle2,
  Sparkles,
} from "lucide-react";

const COMMON_PROBLEMS = [
  {
    titleUr: "یونیورسٹی ڈگری یا اصل اسناد واپس نہیں کر رہی",
    titleRoman: "University original degree ya documents wapas nahi kar rahi",
    titleEn: "University withholding degree or original documents",
    icon: GraduationCap,
    badgeColor: "bg-teal-50 text-teal-700 border-teal-200/60",
    iconBg: "bg-teal-100/80 text-teal-700",
    query:
      "Meri university meri original degree aur educational documents wapas nahi kar rahi jabke meri tamam fees aur clearance mukammal hai. Main kya kar sakta hoon?",
  },
  {
    titleUr: "پولیس تھانہ ایف آئی آر (FIR) درج نہیں کر رہا",
    titleRoman: "Police Station (Thana) FIR darj nahi kar raha",
    titleEn: "Police refusing to register FIR",
    icon: ShieldAlert,
    badgeColor: "bg-rose-50 text-rose-700 border-rose-200/60",
    iconBg: "bg-rose-100/80 text-rose-600",
    query:
      "Mere sath wardat hui hai lekin Police Station ka SHO meri FIR darj karne se inkar kar raha hai. Main kya karoon?",
  },
  {
    titleUr: "وراثت یا جائیداد میں حصہ نہیں مل رہا / ناجائز قبضہ",
    titleRoman: "Wirasat mein hissa nahi mil raha ya zameen par qabza hai",
    titleEn: "Denial of inheritance share (Wirasat) or property dispute",
    icon: HomeIcon,
    badgeColor: "bg-indigo-50 text-indigo-700 border-indigo-200/60",
    iconBg: "bg-indigo-100/80 text-indigo-600",
    query:
      "Walid ke intiqal ke baad mere rishtedar mujhe aur meri walida ko wirasat ki jaidad mein se qanooni hissa nahi de rahe.",
  },
  {
    titleUr: "تنخواہ روک لی گئی ہے یا نوکری سے نکال دیا گیا",
    titleRoman: "Company tankhwah (salary) nahi de rahi ya nokri se nikal diya",
    titleEn: "Unpaid salary or unlawful job termination",
    icon: Briefcase,
    badgeColor: "bg-sky-50 text-sky-700 border-sky-200/60",
    iconBg: "bg-sky-100/80 text-sky-600",
    query:
      "Meri company ne pichle 3 mahinay se meri tankhwah (salary) roki hui hai aur maangne par nokri se nikalne ki dhamki de rahe hain.",
  },
  {
    titleUr: "حق مہر، بچوں کا خرچہ یا فیملی کورٹ کے مسائل",
    titleRoman: "Haq Mehr, bachon ka kharcha (maintenance) ya family masla",
    titleEn: "Haq Mehr, child maintenance, or family law issue",
    icon: HeartHandshake,
    badgeColor: "bg-violet-50 text-violet-700 border-violet-200/60",
    iconBg: "bg-violet-100/80 text-violet-600",
    query:
      "Mere shohar ne mujhe ghar se nikal diya hai aur na Haq Mehr de rahe hain na bachon ka kharcha. Qanoon meri kya madad kar sakta hai?",
  },
  {
    titleUr: "آن لائن فراڈ، بلیک میلنگ، بینک یا بجلی بل کا مسئلہ",
    titleRoman: "Online fraud, blackmailing, bank katoti ya ghalat bijli bill",
    titleEn: "Online fraud, cyber blackmail, bank or utility overbilling",
    icon: Smartphone,
    badgeColor: "bg-amber-50 text-amber-800 border-amber-200/60",
    iconBg: "bg-amber-100/80 text-amber-700",
    query:
      "Mere sath online fraud aur blackmailing ho rahi hai aur mere account se paise nikal liye gaye hain. Main kahan shikayat karoon?",
  },
];

export default function HomePage() {
  const whatsappNum =
    process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "923001234567";
  const realWhatsappUrl = `https://wa.me/${whatsappNum}?text=${encodeURIComponent(
    "Assalam-o-Alaikum HaqAI! Mujhe apne maslay par qanooni madad aur online complaint ka link chahiye."
  )}`;

  return (
    <div className="space-y-16 pb-20">
      {/* Modern, Airy Mesh-Gradient Hero Section */}
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

          {/* 2 Clean, Modern Action Buttons */}
          <div className="pt-3 flex flex-col sm:flex-row items-center justify-center gap-3.5">
            <Link
              href="/assistant"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-teal-600 to-emerald-600 px-8 py-4 text-base font-bold text-white shadow-lg shadow-teal-600/20 hover:from-teal-700 hover:to-emerald-700 transition-all hover:-translate-y-0.5"
            >
              <Mic className="h-5 w-5" />
              <span>Speak or Type Your Problem (مسئلہ بولیں)</span>
              <ArrowRight className="h-4 w-4" />
            </Link>

            <a
              href={realWhatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 rounded-2xl border border-slate-200 bg-white px-7 py-4 text-base font-semibold text-slate-800 shadow-sm hover:border-teal-300 hover:bg-teal-50/40 transition-all"
            >
              <span>Voice Note on WhatsApp (واٹس ایپ)</span>
              <ExternalLink className="h-4 w-4 text-teal-600" />
            </a>
          </div>

          {/* Subtle Trust Pills */}
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

      {/* 6 Everyday Citizen Problem Cards with Soft Attractive Accents */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="text-center space-y-1.5">
          <span className="text-xs font-bold uppercase tracking-wider text-teal-600">
            Instant Legal Help
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            آپ کو کیا مسئلہ درپیش ہے؟ نیچے اپنے مسئلے پر کلک کریں
          </h2>
          <p className="text-sm text-slate-500">
            Tap any common issue below to immediately hear your rights and get
            your ready-made complaint
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {COMMON_PROBLEMS.map((item, idx) => {
            const Icon = item.icon;
            return (
              <Link
                key={idx}
                href={`/assistant?q=${encodeURIComponent(item.query)}`}
                className="group soft-card flex flex-col justify-between rounded-2xl p-6 hover:border-teal-300 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div
                      className={`flex h-11 w-11 items-center justify-center rounded-xl ${item.iconBg} transition`}
                    >
                      <Icon className="h-5 w-5" />
                    </div>
                    <span
                      className={`rounded-full border px-2.5 py-0.5 text-[11px] font-semibold ${item.badgeColor}`}
                    >
                      فوری مدد →
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 leading-snug">
                    {item.titleUr}
                  </h3>
                  <p className="text-xs font-medium text-slate-600">
                    {item.titleRoman}
                  </p>
                  <p className="text-xs text-slate-400">{item.titleEn}</p>
                </div>

                <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-teal-600">
                  <span>جواب سنیں اور شکایت بھیجیں</span>
                  <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
}
