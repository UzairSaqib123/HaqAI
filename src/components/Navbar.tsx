"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Scale,
  Mic,
  FileCheck2,
  BookOpen,
  UserCheck,
  Menu,
  X,
} from "lucide-react";

const NAV_ITEMS = [
  { href: "/", label: "ہوم (Home)", icon: Scale },
  { href: "/assistant", label: "بول کر مسئلہ بتائیں (Ask AI)", icon: Mic },
  { href: "/complaint", label: "شکایت بھیجیں (1-Click Complaint)", icon: FileCheck2 },
  { href: "/rights", label: "قوانین جانیں (Pakistan Laws)", icon: BookOpen },
];

export default function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeHaqId, setActiveHaqId] = useState("رجسٹر کریں");
  const [citizenName, setCitizenName] = useState("پروفائل (My Profile)");

  useEffect(() => {
    function syncProfile() {
      try {
        const raw = localStorage.getItem("haqai_active_profile");
        if (raw) {
          const parsed = JSON.parse(raw);
          if (parsed.haqId) setActiveHaqId(parsed.haqId);
          if (parsed.fullName) setCitizenName(parsed.fullName);
        }
      } catch {
        // ignore
      }
    }
    syncProfile();
    window.addEventListener("haqai-profile-updated", syncProfile);
    return () =>
      window.removeEventListener("haqai-profile-updated", syncProfile);
  }, []);

  function openProfileModal() {
    window.dispatchEvent(new Event("haqai-open-registration-modal"));
  }

  return (
    <header className="sticky top-0 z-50 border-b border-emerald-900/20 bg-[#01411C] text-white shadow-lg">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3.5 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-[#D4AF37] to-amber-500 text-[#01411C] shadow-md transition-transform group-hover:scale-105">
            <Scale className="h-6 w-6 stroke-[2.4]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-extrabold tracking-tight text-white">
                Haq<span className="text-[#D4AF37]">AI</span>
              </span>
              <span className="rounded-full bg-emerald-800 px-2.5 py-0.5 text-xs font-bold text-amber-300 border border-amber-400/30">
                حق اے آئی
              </span>
            </div>
            <p className="text-xs text-emerald-100 hidden sm:block">
              آپ کے حقوق۔ آپ کی آواز۔ آپ کا عمل۔
            </p>
          </div>
        </Link>

        {/* Simple, Big Desktop Navigation (No Admin Button) */}
        <nav className="hidden lg:flex items-center gap-2">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const active =
              item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold transition-all ${
                  active
                    ? "bg-[#D4AF37] text-[#01411C] shadow"
                    : "text-emerald-50 hover:bg-emerald-800/70 hover:text-white"
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Citizen ID / Profile Button (Opens Popup Modal) */}
        <div className="hidden sm:flex items-center gap-2">
          <button
            type="button"
            onClick={openProfileModal}
            className="flex items-center gap-2.5 rounded-xl border border-amber-400/50 bg-emerald-900/90 px-3.5 py-2 text-xs hover:bg-emerald-800 transition"
          >
            <UserCheck className="h-4 w-4 text-[#D4AF37]" />
            <div className="text-left">
              <span className="block font-mono text-xs font-extrabold text-[#D4AF37]">
                {activeHaqId}
              </span>
              <span className="block text-[11px] text-emerald-100 truncate max-w-[130px]">
                {citizenName}
              </span>
            </div>
          </button>
        </div>

        {/* Mobile menu button */}
        <button
          type="button"
          onClick={() => setMobileOpen(!mobileOpen)}
          className="inline-flex items-center justify-center rounded-xl p-2 text-emerald-100 hover:bg-emerald-800 lg:hidden"
          aria-label="Toggle Menu"
        >
          {mobileOpen ? <X className="h-7 w-7" /> : <Menu className="h-7 w-7" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="border-t border-emerald-800 bg-[#013316] px-4 pt-3 pb-5 lg:hidden space-y-2">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const active =
              item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-3 rounded-xl px-4 py-3 text-base font-bold ${
                  active
                    ? "bg-[#D4AF37] text-[#01411C]"
                    : "text-emerald-100 hover:bg-emerald-800/60"
                }`}
              >
                <Icon className="h-5 w-5" />
                <span>{item.label}</span>
              </Link>
            );
          })}
          <button
            type="button"
            onClick={() => {
              setMobileOpen(false);
              openProfileModal();
            }}
            className="w-full flex items-center gap-3 rounded-xl border border-amber-400/40 bg-emerald-900 px-4 py-3 text-sm font-bold text-[#D4AF37]"
          >
            <UserCheck className="h-5 w-5" />
            <span>میرا پروفائل: {citizenName} ({activeHaqId})</span>
          </button>
        </div>
      )}
    </header>
  );
}
