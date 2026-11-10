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
} from "lucide-react";

const COMMON_PROBLEMS = [
  {
    titleUr: "یونیورسٹی ڈگری یا اصل اسناد واپس نہیں کر رہی",
    titleRoman: "University original degree ya documents wapas nahi kar rahi",
    titleEn: "University withholding degree or original documents",
    icon: GraduationCap,
    query:
      "Meri university meri original degree aur educational documents wapas nahi kar rahi jabke meri tamam fees aur clearance mukammal hai. Main kya kar sakta hoon?",
  },
  {
    titleUr: "پولیس تھانہ ایف آئی آر (FIR) درج نہیں کر رہا",
    titleRoman: "Police Station (Thana) FIR darj nahi kar raha",
    titleEn: "Police refusing to register FIR",
    icon: ShieldAlert,
    query:
      "Mere sath wardat hui hai lekin Police Station ka SHO meri FIR darj karne se inkar kar raha hai. Main kya karoon?",
  },
  {
    titleUr: "وراثت یا جائیداد میں حصہ نہیں مل رہا / ناجائز قبضہ",
    titleRoman: "Wirasat mein hissa nahi mil raha ya zameen par qabza hai",
    titleEn: "Denial of inheritance share (Wirasat) or property dispute",
    icon: HomeIcon,
    query:
      "Walid ke intiqal ke baad mere rishtedar mujhe aur meri walida ko wirasat ki jaidad mein se qanooni hissa nahi de rahe.",
  },
  {
    titleUr: "تنخواہ روک لی گئی ہے یا نوکری سے نکال دیا گیا",
    titleRoman: "Company tankhwah (salary) nahi de rahi ya nokri se nikal diya",
    titleEn: "Unpaid salary or unlawful job termination",
    icon: Briefcase,
    query:
      "Meri company ne pichle 3 mahinay se meri tankhwah (salary) roki hui hai aur maangne par nokri se nikalne ki dhamki de rahe hain.",
  },
  {
    titleUr: "حق مہر، بچوں کا خرچہ یا فیملی کورٹ کے مسائل",
    titleRoman: "Haq Mehr, bachon ka kharcha (maintenance) ya family masla",
    titleEn: "Haq Mehr, child maintenance, or family law issue",
    icon: HeartHandshake,
    query:
      "Mere shohar ne mujhe ghar se nikal diya hai aur na Haq Mehr de rahe hain na bachon ka kharcha. Qanoon meri kya madad kar sakta hai?",
  },
  {
    titleUr: "آن لائن فراڈ، بلیک میلنگ، بینک یا بجلی بل کا مسئلہ",
    titleRoman: "Online fraud, blackmailing, bank katoti ya ghalat bijli bill",
    titleEn: "Online fraud, cyber blackmail, bank or utility overbilling",
    icon: Smartphone,
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
    <div className="space-y-14 pb-16">
      {/* Ultra-Clear, Citizen-Friendly Hero Section */}
      <section className="bg-gradient-to-br from-[#01411C] via-[#035327] to-[#012911] text-white py-14 sm:py-20">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full bg-amber-400/20 border border-amber-300/40 px-4 py-1.5 text-sm font-bold text-amber-300">
            <span>🇵🇰 ہر پاکستانی شہری کا آسان قانونی مددگار (HaqAI)</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold leading-tight">
            اپنا مسئلہ بول کر بتائیں — اپنے قانونی حقوق جانیں اور{" "}
            <span className="text-[#D4AF37]">ایک کلک</span> پر شکایت بھیجیں
          </h1>

          <p className="text-lg sm:text-xl text-emerald-100 max-w-3xl mx-auto leading-relaxed">
            پڑھنا لکھنا مشکل ہے یا قانونی الفاظ سمجھ نہیں آتے؟ پریشان نہ ہوں!
            مائیک کا بٹن دبا کر <strong>اردو، پنجابی یا آسان الفاظ</strong> میں
            اپنا مسئلہ بولیں۔ حق اے آئی آپ کو صاف اردو آواز میں جواب سنائے گا
            اور آپ کی تیار درخواست متعلقہ سرکاری ادارے کو بھیج دے گا۔
          </p>

          {/* 2 Giant Action Buttons */}
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/assistant"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-3 rounded-2xl bg-[#D4AF37] px-8 py-5 text-lg font-extrabold text-[#01411C] shadow-2xl hover:bg-amber-400 transition transform hover:scale-[1.02]"
            >
              <Mic className="h-7 w-7" />
              <span>🎤 یہاں دبا کر اپنا مسئلہ بولیں (Speak Now)</span>
            </Link>

            <a
              href={realWhatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-3 rounded-2xl bg-green-500 px-8 py-5 text-lg font-extrabold text-slate-950 shadow-2xl hover:bg-green-400 transition"
            >
              <span>💬 واٹس ایپ پر وائس نوٹ بھیجیں (WhatsApp)</span>
              <ExternalLink className="h-5 w-5" />
            </a>
          </div>

          <div className="pt-4 flex flex-wrap items-center justify-center gap-6 text-sm text-emerald-100/90">
            <span className="inline-flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-[#D4AF37]" /> صاف اردو آواز میں جواب سنیں
            </span>
            <span className="inline-flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-[#D4AF37]" /> آئینِ پاکستان 1973 اور تمام قوانین شامل
            </span>
            <span className="inline-flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-[#D4AF37]" /> خودکار تیار شدہ درخواست (1-Click Complaint)
            </span>
          </div>
        </div>
      </section>

      {/* Simple 3-Step Visual Guide */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-2">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            صرف 3 آسان مراحل میں اپنا حق حاصل کریں (How It Works in 3 Easy Steps)
          </h2>
          <p className="text-sm text-slate-600">
            کسی وکیل یا مشکل فارم کی ضرورت نہیں — سب کچھ آپ کی اپنی زبان میں:
          </p>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-3">
          <div className="rounded-3xl border-2 border-emerald-200 bg-white p-6 text-center shadow-sm space-y-3">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#01411C] text-[#D4AF37]">
              <Mic className="h-8 w-8" />
            </div>
            <span className="inline-block rounded-full bg-emerald-100 px-3 py-1 text-xs font-extrabold text-[#01411C]">
              پہلا قدم (Step 1)
            </span>
            <h3 className="text-xl font-extrabold text-slate-900">
              مائیک دبا کر مسئلہ بولیں
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              ویب سائٹ یا واٹس ایپ پر اپنی زبان (اردو، پنجابی، رومن اردو یا
              انگریزی) میں بول کر یا لکھ کر اپنا مسئلہ بتائیں۔
            </p>
          </div>

          <div className="rounded-3xl border-2 border-amber-300 bg-white p-6 text-center shadow-sm space-y-3">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#D4AF37] text-[#01411C]">
              <Volume2 className="h-8 w-8" />
            </div>
            <span className="inline-block rounded-full bg-amber-100 px-3 py-1 text-xs font-extrabold text-amber-900">
              دوسرا قدم (Step 2)
            </span>
            <h3 className="text-xl font-extrabold text-slate-900">
              صاف اردو آواز میں اپنا حق سنیں
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              حق اے آئی آئینِ پاکستان اور قوانین چیک کر کے آپ کو صاف اور آسان
              اردو آواز میں بتائے گا کہ آپ کا قانونی حق کیا ہے اور کون سا ادارہ
              مدد کرے گا۔
            </p>
          </div>

          <div className="rounded-3xl border-2 border-[#01411C] bg-emerald-50/60 p-6 text-center shadow-md space-y-3">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#01411C] text-white">
              <Send className="h-8 w-8 text-[#D4AF37]" />
            </div>
            <span className="inline-block rounded-full bg-[#01411C] px-3 py-1 text-xs font-extrabold text-[#D4AF37]">
              تیسرا قدم (Step 3)
            </span>
            <h3 className="text-xl font-extrabold text-slate-900">
              1-کلک پر شکایت آگے بھیجیں
            </h3>
            <p className="text-sm text-slate-700 leading-relaxed">
              آپ کے نام، شناختی کارڈ اور پتے کے ساتھ تیار شدہ قانونی درخواست
              چیک کریں اور صرف <strong>ایک کلک</strong> پر متعلقہ سرکاری ادارے
              کو بھیج دیں۔
            </p>
          </div>
        </div>
      </section>

      {/* 1-Tap Everyday Citizen Problems */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            آپ کو کیا مسئلہ درپیش ہے؟ نیچے اپنے مسئلے پر کلک کریں
          </h2>
          <p className="text-sm text-slate-600">
            Click on your problem below to immediately hear your rights and get
            your ready-made complaint:
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {COMMON_PROBLEMS.map((item, idx) => {
            const Icon = item.icon;
            return (
              <Link
                key={idx}
                href={`/assistant?q=${encodeURIComponent(item.query)}`}
                className="group flex flex-col justify-between rounded-3xl border-2 border-slate-200 bg-white p-6 shadow-sm hover:border-[#01411C] hover:shadow-lg transition"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-[#01411C] group-hover:bg-[#01411C] group-hover:text-[#D4AF37] transition">
                      <Icon className="h-6 w-6" />
                    </div>
                    <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-extrabold text-amber-900">
                      فوری مدد حاصل کریں →
                    </span>
                  </div>

                  <h3 className="text-lg font-extrabold text-slate-900 leading-snug">
                    {item.titleUr}
                  </h3>
                  <p className="text-xs font-semibold text-emerald-800">
                    {item.titleRoman}
                  </p>
                  <p className="text-xs text-slate-500">{item.titleEn}</p>
                </div>

                <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-extrabold text-[#01411C]">
                  <span>جواب سنیں اور شکایت بھیجیں</span>
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition" />
                </div>
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
}
