import React from "react";
import Link from "next/link";
import { Scale, PhoneCall, ExternalLink } from "lucide-react";

export default function Footer() {
  const whatsappNum =
    process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "923001234567";
  const realWhatsappUrl = `https://wa.me/${whatsappNum}?text=${encodeURIComponent(
    "Assalam-o-Alaikum HaqAI! Mujhe Pakistani qanoon ke mutabiq madad aur online complaint darj karni hai."
  )}`;

  return (
    <footer className="border-t border-slate-200 bg-[#0a1f13] text-emerald-50">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          <div>
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#D4AF37] text-[#01411C]">
                <Scale className="h-5 w-5" />
              </div>
              <span className="text-xl font-extrabold text-white">
                Haq<span className="text-[#D4AF37]">AI</span> (حق اے آئی)
              </span>
            </div>
            <p className="mt-3 text-sm text-emerald-100/85 leading-relaxed">
              عام پاکستانی شہریوں کے لیے آسان قانونی مددگار۔ اپنی زبان میں بول
              کر اپنا مسئلہ بتائیں، اپنے قانونی حقوق جانیں اور صرف ایک کلک پر
              سرکاری ادارے کو شکایت بھیجیں۔
            </p>
            <div className="mt-4 flex flex-wrap gap-2 text-xs text-amber-300">
              <span className="inline-flex items-center gap-1 rounded-md bg-emerald-900/70 px-2.5 py-1 border border-emerald-700">
                <PhoneCall className="h-3.5 w-3.5" /> ہیلپ لائنز: انسانی حقوق 1099 | محتسب 1055 | پولیس 1787 | ایف آئی اے 1991
              </span>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-bold text-[#D4AF37]">
              آسان لنکس (Quick Links)
            </h3>
            <ul className="mt-3 space-y-2 text-sm text-emerald-100/90">
              <li>
                <Link href="/assistant" className="hover:text-[#D4AF37] transition">
                  🎤 بول کر مسئلہ بتائیں (Talk to AI)
                </Link>
              </li>
              <li>
                <Link href="/complaint" className="hover:text-[#D4AF37] transition">
                  📝 شکایت جمع کروائیں (1-Click Complaint)
                </Link>
              </li>
              <li>
                <Link href="/rights" className="hover:text-[#D4AF37] transition">
                  📖 پاکستان کے قوانین (Constitution &amp; Laws)
                </Link>
              </li>
              <li>
                <a
                  href={realWhatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-green-400 font-bold hover:underline"
                >
                  💬 واٹس ایپ پر بات کریں (Real WhatsApp) <ExternalLink className="h-3 w-3" />
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-bold text-[#D4AF37]">
              سرکاری شکایت پورٹلز (Official Portals)
            </h3>
            <ul className="mt-3 space-y-2 text-xs text-emerald-100/85">
              <li>
                <a
                  href="https://onlinehelp.hec.gov.pk"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 hover:text-[#D4AF37]"
                >
                  ایچ ای سی (HEC Portal) <ExternalLink className="h-3 w-3" />
                </a>
              </li>
              <li>
                <a
                  href="https://www.mohtasib.gov.pk"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 hover:text-[#D4AF37]"
                >
                  وفاقی محتسب (Wafaqi Mohtasib) <ExternalLink className="h-3 w-3" />
                </a>
              </li>
              <li>
                <a
                  href="https://citizenportal.gov.pk"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 hover:text-[#D4AF37]"
                >
                  پاکستان سٹیزن پورٹل (Citizen Portal) <ExternalLink className="h-3 w-3" />
                </a>
              </li>
              <li>
                <a
                  href="https://fospah.gov.pk"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 hover:text-[#D4AF37]"
                >
                  خواتین جائیداد و ہراسانی محتسب (FOSPAH) <ExternalLink className="h-3 w-3" />
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t border-emerald-900/80 pt-5 text-xs text-emerald-200/75">
          <p>
            <strong>قانونی وضاحت (Disclaimer):</strong> حق اے آئی (HaqAI) آئینِ
            پاکستان 1973 اور پاکستانی قوانین کی بنیاد پر شہریوں کو معلومات اور
            درخواست لکھنے میں مدد فراہم کرتا ہے۔ آپ کی منظوری کے بغیر کوئی شکایت
            آگے نہیں بھیجی جاتی۔
          </p>
        </div>
      </div>
    </footer>
  );
}
