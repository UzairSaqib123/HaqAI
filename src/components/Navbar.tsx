"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Scale,
  Mic,
  FileCheck2,
  BookOpen,
  HeartHandshake,
  UserCheck,
  Menu,
  X,
  Moon,
  Sun,
} from "lucide-react";

const NAV_ITEMS = [
  { href: "/", label: "Home", sub: "ہوم", icon: Scale },
  { href: "/assistant", label: "Ask AI", sub: "بول کر پوچھیں", icon: Mic },
  {
    href: "/complaint",
    label: "1-Click Complaint",
    sub: "شکایت بھیجیں",
    icon: FileCheck2,
  },
  {
    href: "/volunteer",
    label: "Availability Switch",
    sub: "قانونی مددگار",
    icon: HeartHandshake,
  },
  {
    href: "/rights",
    label: "Laws & Rights",
    sub: "قوانین",
    icon: BookOpen,
  },
];

export default function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeHaqId, setActiveHaqId] = useState("Register");
  const [citizenName, setCitizenName] = useState("My Profile");
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    try {
      const savedTheme = localStorage.getItem("haqai_theme");
      if (savedTheme === "dark") {
        setIsDark(true);
        document.documentElement.classList.add("dark");
      } else {
        setIsDark(false);
        document.documentElement.classList.remove("dark");
      }
    } catch {
      // ignore
    }

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

  function toggleDarkMode() {
    const nextDark = !isDark;
    setIsDark(nextDark);
    try {
      if (nextDark) {
        document.documentElement.classList.add("dark");
        localStorage.setItem("haqai_theme", "dark");
      } else {
        document.documentElement.classList.remove("dark");
        localStorage.setItem("haqai_theme", "light");
      }
    } catch {
      // ignore
    }
  }

  function openProfileModal() {
    window.dispatchEvent(new Event("haqai-open-registration-modal"));
  }

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/85 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-teal-600 to-emerald-600 text-white shadow-sm transition-transform group-hover:scale-105">
            <Scale className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-extrabold tracking-tight text-slate-900">
                Haq<span className="text-teal-600">AI</span>
              </span>
              <span className="rounded-full bg-teal-50 px-2.5 py-0.5 text-[11px] font-semibold text-teal-700 border border-teal-200/60">
                حق اے آئی
              </span>
            </div>
            <p className="text-[11px] text-slate-500 hidden sm:block">
              Citizen Rights &amp; 1-Click Complaint Assistant
            </p>
          </div>
        </Link>

        {/* Clean Pill Navigation */}
        <nav className="hidden lg:flex items-center gap-1.5 rounded-2xl bg-slate-100/80 p-1.5 border border-slate-200/60">
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
                className={`flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-semibold transition-all ${
                  active
                    ? "bg-white text-teal-700 shadow-sm font-bold"
                    : "text-slate-600 hover:text-slate-900 hover:bg-white/50"
                }`}
              >
                <Icon
                  className={`h-4 w-4 ${
                    active ? "text-teal-600" : "text-slate-400"
                  }`}
                />
                <span>{item.label}</span>
                <span className="text-[11px] text-slate-400 font-normal">
                  ({item.sub})
                </span>
              </Link>
            );
          })}
        </nav>

        {/* Right Controls: Dark Mode Toggle + Citizen Profile Pill */}
        <div className="hidden sm:flex items-center gap-2.5">
          <button
            type="button"
            onClick={toggleDarkMode}
            title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
            className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50/80 px-3 py-2 text-xs font-semibold text-slate-700 hover:border-teal-300 hover:bg-teal-50/40 transition"
          >
            {isDark ? (
              <>
                <Sun className="h-4 w-4 text-amber-400" />
                <span>Light</span>
              </>
            ) : (
              <>
                <Moon className="h-4 w-4 text-teal-600" />
                <span>Dark</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={openProfileModal}
            className="flex items-center gap-2.5 rounded-xl border border-slate-200 bg-slate-50/80 px-3.5 py-2 text-xs hover:border-teal-300 hover:bg-teal-50/40 transition"
          >
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-teal-100 text-teal-700">
              <UserCheck className="h-4 w-4" />
            </div>
            <div className="text-left">
              <span className="block font-semibold text-slate-800 truncate max-w-[120px]">
                {citizenName}
              </span>
              <span className="block font-mono text-[10px] text-teal-600 font-medium">
                {activeHaqId}
              </span>
            </div>
          </button>
        </div>

        {/* Mobile Controls */}
        <div className="flex items-center gap-2 lg:hidden">
          <button
            type="button"
            onClick={toggleDarkMode}
            aria-label="Toggle Dark Mode"
            className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-slate-50 p-2 text-slate-700 sm:hidden"
          >
            {isDark ? (
              <Sun className="h-5 w-5 text-amber-400" />
            ) : (
              <Moon className="h-5 w-5 text-teal-600" />
            )}
          </button>

          <button
            type="button"
            onClick={() => setMobileOpen(!mobileOpen)}
            className="inline-flex items-center justify-center rounded-xl p-2 text-slate-600 hover:bg-slate-100"
            aria-label="Toggle Menu"
          >
            {mobileOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="border-t border-slate-200 bg-white px-4 pt-3 pb-5 lg:hidden space-y-1.5 shadow-lg">
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
                className={`flex items-center justify-between rounded-xl px-4 py-3 text-sm font-semibold ${
                  active
                    ? "bg-teal-50 text-teal-700 font-bold"
                    : "text-slate-700 hover:bg-slate-50"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className="h-4 w-4 text-teal-600" />
                  <span>{item.label}</span>
                </div>
                <span className="text-xs text-slate-400">{item.sub}</span>
              </Link>
            );
          })}
          <button
            type="button"
            onClick={() => {
              setMobileOpen(false);
              openProfileModal();
            }}
            className="w-full mt-2 flex items-center justify-between rounded-xl border border-teal-200 bg-teal-50/60 px-4 py-3 text-xs font-bold text-teal-800"
          >
            <span className="flex items-center gap-2">
              <UserCheck className="h-4 w-4 text-teal-600" />
              Profile: {citizenName}
            </span>
            <span className="font-mono">{activeHaqId}</span>
          </button>
        </div>
      )}
    </header>
  );
}
