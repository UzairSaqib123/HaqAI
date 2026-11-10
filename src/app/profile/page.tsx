"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  UserCheck,
  ShieldCheck,
  CreditCard,
  Save,
  CheckCircle2,
  Mic,
  FileCheck2,
  LogIn,
  ExternalLink,
} from "lucide-react";
import {
  CitizenProfile,
  generateHaqCitizenId,
  isSupabaseConfigured,
  supabase,
} from "@/lib/supabase";
import { saveClientProfile } from "@/lib/client-storage";

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
  const [haqId, setHaqId] = useState("");
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [cnic, setCnic] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");
  const [province, setProvince] = useState("Punjab");
  const [address, setAddress] = useState("");
  const [occupation, setOccupation] = useState("");
  const [role, setRole] = useState<"citizen" | "admin">("citizen");

  const [isGoogleAuthenticated, setIsGoogleAuthenticated] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    try {
      const stored = localStorage.getItem("haqai_active_profile");
      if (stored) {
        const p: CitizenProfile = JSON.parse(stored);
        setHaqId(p.haqId || generateHaqCitizenId());
        setEmail(p.email || "");
        setFullName(p.fullName || "");
        setCnic(p.cnic || "");
        setPhone(p.phone || "");
        setCity(p.city || "");
        setProvince(p.province || "Punjab");
        setAddress(p.address || "");
        setOccupation(p.occupation || "");
        setRole(p.role || "citizen");
        setIsGoogleAuthenticated(true);
        saveClientProfile(p);
        fetch("/api/profile", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(p),
        }).catch(() => {});
        return;
      } else {
        setHaqId(generateHaqCitizenId());
      }
    } catch {
      setHaqId(generateHaqCitizenId());
    }

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

    if (
      !fullName.trim() ||
      !email.trim() ||
      !cnic.trim() ||
      !phone.trim() ||
      !city.trim()
    ) {
      setErrorMsg(
        "Please fill in your Full Name, Email, CNIC, Mobile/WhatsApp Number, and City."
      );
      return;
    }

    setIsSaving(true);
    try {
      const finalHaqId = haqId || generateHaqCitizenId();
      const res = await fetch("/api/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          haqId: finalHaqId,
          email: email.trim(),
          fullName: fullName.trim(),
          cnic: cnic.trim(),
          phone: phone.trim(),
          city: city.trim(),
          province,
          address: address.trim() || city.trim(),
          occupation: occupation.trim(),
          role,
        }),
      });
      const data = await res.json();
      if (data.success && data.profile) {
        saveClientProfile(data.profile);
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

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      <div className="soft-card rounded-3xl bg-gradient-to-r from-teal-50/80 via-white to-emerald-50/60 p-6 sm:p-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-teal-100/80 px-3 py-1 text-xs font-bold text-teal-800">
              <UserCheck className="h-3.5 w-3.5" /> Citizen Profile &amp; Unique HaqAI ID
            </span>
            <h1 className="mt-2 text-2xl sm:text-3xl font-extrabold text-slate-900">
              Citizen Login, Unique HaqAI ID &amp; Profile Setup
            </h1>
            <p className="mt-1 text-sm text-slate-600 max-w-2xl">
              Save your details (Name, CNIC, WhatsApp Number, City, Address) so
              HaqAI can automatically populate your formal legal complaints.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 items-start">
        <div className="lg:col-span-5 space-y-6">
          {isSupabaseConfigured && (
            <div className="soft-card rounded-2xl p-6 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Google Authentication (Supabase Auth)
                </span>
                {isGoogleAuthenticated && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-teal-100 px-2.5 py-0.5 text-xs font-bold text-teal-800">
                    <CheckCircle2 className="h-3.5 w-3.5" /> Verified
                  </span>
                )}
              </div>

              <button
                type="button"
                onClick={handleGoogleSignIn}
                className="w-full flex items-center justify-center gap-3 rounded-xl border border-slate-200 bg-white px-5 py-3.5 text-sm font-bold text-slate-900 shadow-sm hover:border-teal-500 transition"
              >
                <LogIn className="h-5 w-5 text-teal-600" />
                <span>
                  {isGoogleAuthenticated && email
                    ? `Signed in (${email})`
                    : "Continue with Google"}
                </span>
              </button>
            </div>
          )}

          <div className="soft-card rounded-3xl p-6 space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-600 text-white font-extrabold">
                  <CreditCard className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-teal-700">
                    HaqAI Citizen Pass
                  </p>
                  <p className="text-[11px] text-slate-500">
                    Registered Citizen Identity
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={handleGenerateNewId}
                className="rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1 text-[11px] font-semibold text-teal-700 hover:bg-slate-100"
              >
                New ID
              </button>
            </div>

            <div className="space-y-3">
              <div className="rounded-xl bg-slate-50 p-3 border border-slate-200 flex items-center justify-between">
                <span className="text-xs text-slate-600">
                  Unique HaqAI Citizen ID:
                </span>
                <span className="font-mono text-base font-extrabold text-teal-700">
                  {haqId || "Not Assigned"}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase">
                    Full Name
                  </span>
                  <span className="font-bold text-sm text-slate-900">
                    {fullName || "—"}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase">
                    CNIC Number
                  </span>
                  <span className="font-mono font-bold text-sm text-slate-900">
                    {cnic || "—"}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase">
                    WhatsApp / Mobile
                  </span>
                  <span className="font-mono font-bold text-slate-900">
                    {phone || "—"}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase">
                    City
                  </span>
                  <span className="font-bold text-slate-900">
                    {city || "—"}
                  </span>
                </div>
              </div>

              <div className="text-xs pt-1">
                <span className="text-slate-400 block text-[10px] uppercase">
                  Registered Address
                </span>
                <span className="text-slate-700">{address || "—"}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-7">
          <form
            onSubmit={handleSaveProfile}
            className="soft-card rounded-3xl p-6 sm:p-8 space-y-5"
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-teal-600">
                  Citizen Profile
                </span>
                <h2 className="text-xl font-extrabold text-slate-900">
                  Personal &amp; Contact Information (اپنی تفصیلات درج کریں)
                </h2>
              </div>
              <ShieldCheck className="h-8 w-8 text-teal-600 shrink-0" />
            </div>

            {errorMsg && (
              <div className="rounded-xl bg-rose-50 border border-rose-200 p-3 text-xs font-semibold text-rose-800">
                {errorMsg}
              </div>
            )}

            {savedSuccess && (
              <div className="rounded-xl bg-teal-50 border border-teal-300 p-4 space-y-2">
                <div className="flex items-center gap-2 text-sm font-extrabold text-teal-900">
                  <CheckCircle2 className="h-5 w-5 text-teal-600" />
                  <span>
                    Profile Saved! Your HaqAI Citizen ID is{" "}
                    <span className="font-mono underline">{haqId}</span>
                  </span>
                </div>
                <div className="flex flex-wrap gap-2.5 pt-1">
                  <Link
                    href="/assistant"
                    className="inline-flex items-center gap-1.5 rounded-xl bg-teal-600 px-3.5 py-2 text-xs font-bold text-white"
                  >
                    <Mic className="h-3.5 w-3.5" /> Go to AI Legal Assistant →
                  </Link>
                  <Link
                    href="/complaint"
                    className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-bold text-slate-800"
                  >
                    <FileCheck2 className="h-3.5 w-3.5" /> Go to 1-Click Complaint →
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
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 font-mono text-xs font-extrabold text-teal-700"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs text-slate-900 focus:border-teal-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Full Name (پورا نام) *
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Enter your full name"
                  className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs text-slate-900 focus:border-teal-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  CNIC Number (شناختی کارڈ نمبر) *
                </label>
                <input
                  type="text"
                  required
                  value={cnic}
                  onChange={(e) => setCnic(e.target.value)}
                  placeholder="XXXXX-XXXXXXX-X"
                  className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 font-mono text-xs text-slate-900 focus:border-teal-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  WhatsApp / Mobile Number (موبائل نمبر) *
                </label>
                <input
                  type="text"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="03XX-XXXXXXX"
                  className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 font-mono text-xs text-slate-900 focus:border-teal-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Province / Territory (صوبہ) *
                </label>
                <select
                  value={province}
                  onChange={(e) => setProvince(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs text-slate-900 focus:border-teal-500 focus:outline-none"
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
                  placeholder="Enter your city"
                  className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs text-slate-900 focus:border-teal-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Occupation / Organization:
                </label>
                <input
                  type="text"
                  value={occupation}
                  onChange={(e) => setOccupation(e.target.value)}
                  placeholder="Optional"
                  className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs text-slate-900 focus:border-teal-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Complete Residential / Mailing Address (مکمل پتہ) *
              </label>
              <textarea
                rows={2}
                required
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Enter your full residential address"
                className="w-full rounded-xl border border-slate-200 p-3 text-xs text-slate-900 focus:border-teal-500 focus:outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={isSaving}
              className="w-full flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-teal-600 to-emerald-600 px-6 py-4 text-sm font-bold text-white shadow-md hover:from-teal-700 hover:to-emerald-700 disabled:opacity-50 transition"
            >
              <Save className="h-4 w-4" />
              <span>
                {isSaving
                  ? "Saving Citizen Profile..."
                  : `Save My Profile (${haqId})`}
              </span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
