"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  UserCheck,
  ShieldCheck,
  CreditCard,
  Save,
  CheckCircle2,
  ArrowRight,
  Mic,
  FileCheck2,
  LogIn,
  Sparkles,
  ExternalLink,
} from "lucide-react";
import {
  CitizenProfile,
  generateHaqCitizenId,
  isSupabaseConfigured,
  supabase,
} from "@/lib/supabase";

const PROVINCES = [
  "Punjab",
  "Sindh",
  "Khyber Pakhtunkhwa (KP)",
  "Balochistan",
  "Islamabad Capital Territory (ICT)",
  "Azad Jammu & Kashmir (AJK)",
  "Gilgit-Baltistan (GB)",
];

export default function CitizenProfilePage() {
  const [haqId, setHaqId] = useState("HAQ-PK-104829");
  const [email, setEmail] = useState("uzair.citizen@gmail.com");
  const [fullName, setFullName] = useState("Muhammad Uzair");
  const [cnic, setCnic] = useState("35202-4829104-1");
  const [phone, setPhone] = useState("+923001234567");
  const [city, setCity] = useState("Islamabad");
  const [province, setProvince] = useState("Islamabad Capital Territory (ICT)");
  const [address, setAddress] = useState(
    "House 14, Street 8, Sector G-10/2, Islamabad"
  );
  const [occupation, setOccupation] = useState(
    "University Student / Citizen"
  );
  const [role, setRole] = useState<"citizen" | "admin">("citizen");

  const [isGoogleAuthenticated, setIsGoogleAuthenticated] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    // 1. Check localStorage for active citizen profile
    try {
      const stored = localStorage.getItem("haqai_active_profile");
      if (stored) {
        const p: CitizenProfile = JSON.parse(stored);
        setHaqId(p.haqId);
        setEmail(p.email);
        setFullName(p.fullName);
        setCnic(p.cnic);
        setPhone(p.phone);
        setCity(p.city);
        setProvince(p.province);
        setAddress(p.address);
        setOccupation(p.occupation || "");
        setRole(p.role || "citizen");
        setIsGoogleAuthenticated(true);
        return;
      }
    } catch {
      // ignore
    }

    // 2. Check Supabase Auth session if configured
    if (isSupabaseConfigured && supabase) {
      supabase.auth.getUser().then(({ data }) => {
        if (data?.user) {
          setIsGoogleAuthenticated(true);
          setEmail(data.user.email || "");
          if (data.user.user_metadata?.full_name) {
            setFullName(data.user.user_metadata.full_name);
          }
        }
      });
    }

    // 3. Load default/existing profile from backend
    fetch("/api/profile")
      .then((r) => r.json())
      .then((data) => {
        if (data.profile) {
          const p: CitizenProfile = data.profile;
          setHaqId(p.haqId);
          setEmail(p.email);
          setFullName(p.fullName);
          setCnic(p.cnic);
          setPhone(p.phone);
          setCity(p.city);
          setProvince(p.province);
          setAddress(p.address);
          setOccupation(p.occupation || "");
          setRole(p.role || "citizen");
        }
      })
      .catch(() => {});
  }, []);

  async function handleGoogleSignIn() {
    setErrorMsg("");
    if (isSupabaseConfigured && supabase) {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/profile`,
        },
      });
      if (error) {
        setErrorMsg(error.message);
      }
      return;
    }

    // Instant Google Sign-In session for local dev before Supabase keys are pasted
    setIsGoogleAuthenticated(true);
    if (!haqId) {
      setHaqId(generateHaqCitizenId());
    }
  }

  function handleGenerateNewId() {
    setHaqId(generateHaqCitizenId());
    setSavedSuccess(false);
  }

  async function handleSaveProfile(e: React.FormEvent) {
    e.preventDefault();
    setErrorMsg("");
    setSavedSuccess(false);

    if (!fullName.trim() || !cnic.trim() || !phone.trim() || !city.trim()) {
      setErrorMsg(
        "Please fill in your Full Name, CNIC, Mobile/WhatsApp Number, and City."
      );
      return;
    }

    setIsSaving(true);
    try {
      const res = await fetch("/api/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          haqId,
          email,
          fullName,
          cnic,
          phone,
          city,
          province,
          address,
          occupation,
          role,
        }),
      });
      const data = await res.json();
      if (data.success && data.profile) {
        localStorage.setItem(
          "haqai_active_profile",
          JSON.stringify(data.profile)
        );
        window.dispatchEvent(new Event("haqai-profile-updated"));
        setIsGoogleAuthenticated(true);
        setSavedSuccess(true);
      } else {
        setErrorMsg(data.error || "Failed to save profile");
      }
    } catch {
      setErrorMsg("Error saving profile");
    } finally {
      setIsSaving(false);
    }
  }

  const whatsappNum =
    process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "923001234567";
  const realWhatsappUrl = `https://wa.me/${whatsappNum}?text=${encodeURIComponent(
    `Assalam-o-Alaikum HaqAI! Meri Citizen ID ${haqId} hai (${fullName}). Mujhe qanooni madad aur online complaint darj karni hai.`
  )}`;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      {/* Top Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-[#01411C] to-[#045d2a] p-6 sm:p-8 text-white shadow-lg">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-400/20 px-3 py-1 text-xs font-bold text-amber-300">
              <UserCheck className="h-3.5 w-3.5" /> Google Auth + Unique HaqAI Citizen ID (ہر شہری کی اپنی آئی ڈی)
            </span>
            <h1 className="mt-2 text-2xl sm:text-3xl font-extrabold">
              Citizen Login, Unique HaqAI ID &amp; One-Time Profile Setup
            </h1>
            <p className="mt-1 text-sm text-emerald-100/90 max-w-2xl">
              Sign in with Google and save your details (Name, CNIC, WhatsApp
              Number, City, Address) <strong>once</strong>. HaqAI assigns you a
              unique <strong>Citizen ID (`{haqId}`)</strong> and automatically
              pre-fills all your details into every formal complaint and links
              your real WhatsApp number!
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 items-start">
        {/* Left: Digital HaqAI Citizen Identity Card + Google Auth Button */}
        <div className="lg:col-span-5 space-y-6">
          {/* Google Sign-In Card */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Step 1 • Google Authentication (Supabase Auth)
              </span>
              {isGoogleAuthenticated && (
                <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-bold text-green-800">
                  <CheckCircle2 className="h-3.5 w-3.5" /> Verified
                </span>
              )}
            </div>

            <button
              type="button"
              onClick={handleGoogleSignIn}
              className="w-full flex items-center justify-center gap-3 rounded-xl border-2 border-slate-300 bg-white px-5 py-3.5 text-sm font-extrabold text-slate-900 shadow-sm hover:border-[#01411C] hover:bg-slate-50 transition"
            >
              <LogIn className="h-5 w-5 text-[#01411C]" />
              <span>
                {isGoogleAuthenticated
                  ? `Signed in with Google (${email})`
                  : "Continue with Google (Sign In / Sign Up)"}
              </span>
            </button>

            <p className="text-[11px] text-slate-500 leading-relaxed">
              {isSupabaseConfigured
                ? "✅ Connected to live Supabase Google OAuth."
                : "💡 Local Mode Active: Add NEXT_PUBLIC_SUPABASE_URL & NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local to enable live Supabase OAuth redirect."}
            </p>
          </div>

          {/* Digital HaqAI Citizen Identity Card */}
          <div className="rounded-3xl bg-gradient-to-br from-[#01411C] via-[#035426] to-[#012911] p-6 text-white shadow-2xl border border-amber-400/30 space-y-5">
            <div className="flex items-center justify-between border-b border-emerald-800/80 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#D4AF37] text-[#01411C] font-extrabold">
                  <CreditCard className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-[#D4AF37]">
                    HaqAI Citizen Pass
                  </p>
                  <p className="text-[11px] text-emerald-200">
                    Islamic Republic of Pakistan • Verified Profile
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={handleGenerateNewId}
                className="rounded-lg bg-emerald-900/90 border border-emerald-600 px-2.5 py-1 text-[11px] font-semibold text-amber-300 hover:bg-emerald-800"
              >
                New ID
              </button>
            </div>

            <div className="space-y-3">
              <div className="rounded-xl bg-black/25 p-3 border border-emerald-800/60 flex items-center justify-between">
                <span className="text-xs text-emerald-200">
                  Unique HaqAI Citizen ID:
                </span>
                <span className="font-mono text-base font-extrabold text-[#D4AF37]">
                  {haqId}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-emerald-300/80 block text-[10px] uppercase">
                    Full Name
                  </span>
                  <span className="font-bold text-sm">{fullName}</span>
                </div>
                <div>
                  <span className="text-emerald-300/80 block text-[10px] uppercase">
                    CNIC Number
                  </span>
                  <span className="font-mono font-bold text-sm">{cnic}</span>
                </div>
                <div>
                  <span className="text-emerald-300/80 block text-[10px] uppercase">
                    WhatsApp / Mobile
                  </span>
                  <span className="font-mono font-bold">{phone}</span>
                </div>
                <div>
                  <span className="text-emerald-300/80 block text-[10px] uppercase">
                    City &amp; Province
                  </span>
                  <span className="font-bold">{city}</span>
                </div>
              </div>

              <div className="text-xs pt-1">
                <span className="text-emerald-300/80 block text-[10px] uppercase">
                  Registered Address
                </span>
                <span className="text-emerald-50">{address}</span>
              </div>
            </div>

            {/* Direct Link to Real WhatsApp App */}
            <div className="pt-3 border-t border-emerald-800/80 space-y-2">
              <a
                href={realWhatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-green-500 px-4 py-3 text-xs font-extrabold text-slate-950 shadow hover:bg-green-400 transition"
              >
                <span>Open Real WhatsApp with My HaqAI ID ({haqId})</span>
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            </div>
          </div>
        </div>

        {/* Right: One-Time Citizen Details Form */}
        <div className="lg:col-span-7">
          <form
            onSubmit={handleSaveProfile}
            className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm space-y-5"
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#01411C]">
                  Step 2 • Complete Your Citizen Profile Once
                </span>
                <h2 className="text-xl font-extrabold text-slate-900">
                  Personal &amp; Contact Information (ایک بار اپنی تفصیلات درج کریں)
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  These details will be automatically filled into all your
                  formal complaints and linked to your WhatsApp number.
                </p>
              </div>
              <ShieldCheck className="h-8 w-8 text-[#01411C] shrink-0" />
            </div>

            {errorMsg && (
              <div className="rounded-xl bg-red-50 border border-red-200 p-3 text-xs font-semibold text-red-800">
                {errorMsg}
              </div>
            )}

            {savedSuccess && (
              <div className="rounded-xl bg-green-50 border-2 border-green-500 p-4 space-y-2">
                <div className="flex items-center gap-2 text-sm font-extrabold text-green-900">
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                  <span>
                    Profile Saved! Your HaqAI Citizen ID is{" "}
                    <span className="font-mono underline">{haqId}</span>
                  </span>
                </div>
                <p className="text-xs text-green-800">
                  Your details are now active across HaqAI. Whenever you ask a
                  question or generate a complaint, your Name, CNIC, Phone,
                  Email, and Address will be pre-filled automatically!
                </p>
                <div className="flex flex-wrap gap-2.5 pt-1">
                  <Link
                    href="/assistant"
                    className="inline-flex items-center gap-1.5 rounded-lg bg-[#01411C] px-3.5 py-2 text-xs font-bold text-[#D4AF37]"
                  >
                    <Mic className="h-3.5 w-3.5" /> Go to AI Legal Assistant →
                  </Link>
                  <Link
                    href="/complaint"
                    className="inline-flex items-center gap-1.5 rounded-lg bg-green-700 px-3.5 py-2 text-xs font-bold text-white"
                  >
                    <FileCheck2 className="h-3.5 w-3.5" /> Go to Pre-Filled 1-Click Complaint →
                  </Link>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Your Unique HaqAI ID:
                </label>
                <input
                  type="text"
                  readOnly
                  value={haqId}
                  className="w-full rounded-xl border border-slate-300 bg-emerald-50/70 px-3.5 py-2.5 font-mono text-xs font-extrabold text-[#01411C]"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Google Account Email:
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-xs text-slate-900 focus:border-[#01411C] focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Full Name (پورا نام بمطابق شناختی کارڈ) *
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Muhammad Uzair"
                  className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-xs text-slate-900 focus:border-[#01411C] focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  CNIC Number (قومی شناختی کارڈ نمبر) *
                </label>
                <input
                  type="text"
                  required
                  value={cnic}
                  onChange={(e) => setCnic(e.target.value)}
                  placeholder="XXXXX-XXXXXXX-X"
                  className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 font-mono text-xs text-slate-900 focus:border-[#01411C] focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  WhatsApp / Mobile Number (واٹس ایپ نمبر) *
                </label>
                <input
                  type="text"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+923001234567"
                  className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 font-mono text-xs text-slate-900 focus:border-[#01411C] focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Province / Territory (صوبہ) *
                </label>
                <select
                  value={province}
                  onChange={(e) => setProvince(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-xs text-slate-900 focus:border-[#01411C] focus:outline-none"
                >
                  {PROVINCES.map((p) => (
                    <option key={p} value={p}>
                      {p}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  City / District (شہر / ضلع) *
                </label>
                <input
                  type="text"
                  required
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="e.g. Islamabad / Lahore / Karachi"
                  className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-xs text-slate-900 focus:border-[#01411C] focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Occupation / Student / Organization:
                </label>
                <input
                  type="text"
                  value={occupation}
                  onChange={(e) => setOccupation(e.target.value)}
                  placeholder="e.g. University Student / Private Employee"
                  className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-xs text-slate-900 focus:border-[#01411C] focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Complete Residential / Mailing Address (مکمل پتہ برائے سرکاری خط و کتابت) *
              </label>
              <textarea
                rows={2}
                required
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="House #, Street #, Sector/Mohalla, City"
                className="w-full rounded-xl border border-slate-300 p-3 text-xs text-slate-900 focus:border-[#01411C] focus:outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={isSaving}
              className="w-full flex items-center justify-center gap-2 rounded-2xl bg-[#01411C] px-6 py-4 text-sm font-extrabold text-[#D4AF37] shadow-lg hover:bg-emerald-900 disabled:opacity-50 transition"
            >
              <Save className="h-4 w-4" />
              <span>
                {isSaving
                  ? "Saving Citizen Profile to Supabase..."
                  : `Save My Profile & Activate HaqAI ID (${haqId})`}
              </span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
