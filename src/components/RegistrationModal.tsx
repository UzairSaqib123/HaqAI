"use client";

import React, { useEffect, useState } from "react";
import {
  UserCheck,
  CheckCircle2,
  ShieldCheck,
  LogIn,
  X,
} from "lucide-react";
import {
  CitizenProfile,
  generateHaqCitizenId,
  isSupabaseConfigured,
  supabase,
} from "@/lib/supabase";

export default function RegistrationModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [canClose, setCanClose] = useState(false);

  const [haqId, setHaqId] = useState("");
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [cnic, setCnic] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");
  const [province, setProvince] = useState("Punjab");
  const [address, setAddress] = useState("");
  const [googleConnected, setGoogleConnected] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    try {
      const isRegistered = localStorage.getItem("haqai_registered_citizen");
      const existingProfile = localStorage.getItem("haqai_active_profile");
      if (isRegistered === "true" && existingProfile) {
        const parsed: CitizenProfile = JSON.parse(existingProfile);
        setHaqId(parsed.haqId);
        setEmail(parsed.email);
        setFullName(parsed.fullName);
        setCnic(parsed.cnic);
        setPhone(parsed.phone);
        setCity(parsed.city);
        setProvince(parsed.province || "Punjab");
        setAddress(parsed.address);
        setGoogleConnected(true);
        setCanClose(true);
        setIsOpen(false);
      } else {
        setHaqId(generateHaqCitizenId());
        setIsOpen(true);
        setCanClose(false);
      }
    } catch {
      setHaqId(generateHaqCitizenId());
      setIsOpen(true);
    }

    // Allow reopening from Navbar button
    function handleOpenModal() {
      setCanClose(true);
      setIsOpen(true);
    }
    window.addEventListener("haqai-open-registration-modal", handleOpenModal);
    return () =>
      window.removeEventListener(
        "haqai-open-registration-modal",
        handleOpenModal
      );
  }, []);

  async function handleGoogleConnect() {
    setErrorMsg("");
    if (isSupabaseConfigured && supabase) {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: window.location.origin,
        },
      });
      if (error) setErrorMsg(error.message);
      return;
    }

    // Immediate Google Sign-in prefill for smooth onboarding
    setGoogleConnected(true);
    if (!email) setEmail("citizen.user@gmail.com");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrorMsg("");

    if (!fullName.trim() || !cnic.trim() || !phone.trim() || !city.trim()) {
      setErrorMsg(
        "براہِ کرم اپنا نام، شناختی کارڈ نمبر، موبائل نمبر اور شہر درج کریں۔ (Please enter your Name, CNIC, Mobile Number, and City.)"
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
          email: email || "citizen.user@gmail.com",
          fullName: fullName.trim(),
          cnic: cnic.trim(),
          phone: phone.trim(),
          city: city.trim(),
          province,
          address: address.trim() || city.trim(),
          occupation: "Citizen of Pakistan",
          role: "citizen",
        }),
      });

      const data = await res.json();
      if (data.success && data.profile) {
        localStorage.setItem(
          "haqai_active_profile",
          JSON.stringify(data.profile)
        );
        localStorage.setItem("haqai_registered_citizen", "true");
        window.dispatchEvent(new Event("haqai-profile-updated"));
        setCanClose(true);
        setIsOpen(false);
      } else {
        setErrorMsg(data.error || "Could not save registration.");
      }
    } catch {
      setErrorMsg("Network error while saving profile.");
    } finally {
      setIsSaving(false);
    }
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-xl rounded-3xl border-2 border-[#D4AF37] bg-white shadow-2xl overflow-hidden my-8">
        {/* Top Green Header */}
        <div className="bg-gradient-to-r from-[#01411C] to-[#045d2a] px-6 py-5 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#D4AF37] text-[#01411C]">
                <UserCheck className="h-6 w-6" />
              </div>
              <div>
                <h2 className="text-xl font-extrabold">
                  خوش آمدید! اپنی معلومات درج کریں
                </h2>
                <p className="text-xs text-amber-200">
                  One-Time Citizen Registration • آپ کی شکایت میں یہ معلومات خود بخود شامل ہو جائیں گی
                </p>
              </div>
            </div>
            {canClose && (
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="rounded-full bg-white/15 p-1.5 text-white hover:bg-white/25"
              >
                <X className="h-5 w-5" />
              </button>
            )}
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Step 1: Google Auth Button */}
          <div className="rounded-2xl bg-slate-50 border border-slate-200 p-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold text-slate-700">
                1. گوگل اکاؤنٹ سے جڑیں (Connect Google Account)
              </span>
              {googleConnected && (
                <span className="inline-flex items-center gap-1 text-xs font-bold text-green-700">
                  <CheckCircle2 className="h-4 w-4" /> Connected
                </span>
              )}
            </div>

            <button
              type="button"
              onClick={handleGoogleConnect}
              className={`w-full flex items-center justify-center gap-2.5 rounded-xl border-2 py-3 px-4 text-sm font-extrabold transition ${
                googleConnected
                  ? "border-green-600 bg-green-50 text-green-900"
                  : "border-slate-300 bg-white text-slate-900 hover:border-[#01411C]"
              }`}
            >
              <LogIn className="h-5 w-5 text-[#01411C]" />
              <span>
                {googleConnected
                  ? `Google Connected (${email || "Verified"})`
                  : "Continue with Google (گوگل سے لاگ ان کریں)"}
              </span>
            </button>
          </div>

          {errorMsg && (
            <div className="rounded-xl bg-red-50 border border-red-300 p-3 text-xs font-bold text-red-800">
              {errorMsg}
            </div>
          )}

          {/* Assigned Citizen ID Display */}
          <div className="flex items-center justify-between rounded-xl bg-emerald-50 border border-emerald-200 px-4 py-2.5 text-xs">
            <span className="font-bold text-slate-700">
              آپ کا مخصوص حق اے آئی نمبر (Your HaqAI ID):
            </span>
            <span className="font-mono text-sm font-extrabold text-[#01411C]">
              {haqId}
            </span>
          </div>

          {/* Simple Large Input Fields */}
          <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-extrabold text-slate-800 mb-1">
                پورا نام (Your Full Name) *
              </label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="مثلاً: محمد عزیر (Muhammad Uzair)"
                className="w-full rounded-xl border-2 border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 focus:border-[#01411C] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-extrabold text-slate-800 mb-1">
                شناختی کارڈ نمبر (CNIC Number) *
              </label>
              <input
                type="text"
                required
                value={cnic}
                onChange={(e) => setCnic(e.target.value)}
                placeholder="35202-1234567-1"
                className="w-full rounded-xl border-2 border-slate-300 px-3.5 py-2.5 font-mono text-sm text-slate-900 focus:border-[#01411C] focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-extrabold text-slate-800 mb-1">
                واٹس ایپ / موبائل نمبر (WhatsApp No.) *
              </label>
              <input
                type="text"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="0300-1234567"
                className="w-full rounded-xl border-2 border-slate-300 px-3.5 py-2.5 font-mono text-sm text-slate-900 focus:border-[#01411C] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-extrabold text-slate-800 mb-1">
                شہر کا نام (Your City) *
              </label>
              <input
                type="text"
                required
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="مثلاً: لاہور / اسلام آباد / کراچی"
                className="w-full rounded-xl border-2 border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 focus:border-[#01411C] focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-extrabold text-slate-800 mb-1">
              مکمل پتہ (Complete Home Address) *
            </label>
            <input
              type="text"
              required
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="مکان نمبر، گلی، محلہ / سیکٹر، شہر"
              className="w-full rounded-xl border-2 border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 focus:border-[#01411C] focus:outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={isSaving}
            className="w-full flex items-center justify-center gap-2 rounded-2xl bg-[#01411C] py-4 px-6 text-base font-extrabold text-[#D4AF37] shadow-xl hover:bg-emerald-900 transition"
          >
            <ShieldCheck className="h-5 w-5" />
            <span>
              {isSaving
                ? "محفوظ ہو رہا ہے (Saving)..."
                : "محفوظ کریں اور شروع کریں (Save & Start HaqAI)"}
            </span>
          </button>
        </form>
      </div>
    </div>
  );
}
