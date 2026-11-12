"use client";

import React, { useEffect, useState } from "react";
import { UserCheck, ShieldCheck, X } from "lucide-react";
import { CitizenProfile, generateHaqCitizenId } from "@/lib/supabase";
import { saveClientProfile } from "@/lib/client-storage";

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
        setCanClose(true);
        setIsOpen(false);
        saveClientProfile(parsed);
        // Ensure the server store also has this existing citizen registration
        fetch("/api/profile", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(parsed),
        }).catch(() => {});
      } else {
        setHaqId(generateHaqCitizenId());
        setIsOpen(true);
        setCanClose(false);
      }
    } catch {
      setHaqId(generateHaqCitizenId());
      setIsOpen(true);
    }

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

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrorMsg("");

    if (
      !fullName.trim() ||
      !email.trim() ||
      !cnic.trim() ||
      !phone.trim() ||
      !city.trim()
    ) {
      setErrorMsg(
        "Please enter your Name, Email, CNIC, Mobile Number, and City (اپنا نام، ای میل، شناختی کارڈ، موبائل نمبر اور شہر درج کریں)"
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
          occupation: "",
          role: "citizen",
        }),
      });

      const data = await res.json();
      if (data.success && data.profile) {
        saveClientProfile(data.profile);
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
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-lg rounded-3xl border border-slate-200 bg-white shadow-2xl overflow-hidden my-8">
        <div className="bg-gradient-to-r from-teal-600 to-emerald-600 px-6 py-5 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/20 backdrop-blur text-white">
                <UserCheck className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-lg font-extrabold">
                  Welcome to HaqAI • خوش آمدید
                </h2>
                <p className="text-xs text-teal-100">
                  Save your details once — auto-fills every complaint
                </p>
              </div>
            </div>
            {canClose && (
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="rounded-full bg-white/15 p-1.5 text-white hover:bg-white/25 transition"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {errorMsg && (
            <div className="rounded-xl bg-rose-50 border border-rose-200 p-3 text-xs font-medium text-rose-700">
              {errorMsg}
            </div>
          )}

          <div className="flex items-center justify-between rounded-xl bg-slate-50 border border-slate-200/80 px-4 py-2.5 text-xs">
            <span className="font-medium text-slate-600">
              Your Unique HaqAI ID (آپ کا مخصوص نمبر):
            </span>
            <span className="font-mono text-sm font-bold text-teal-700">
              {haqId}
            </span>
          </div>

          <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Full Name (پورا نام) *
              </label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Enter your full name"
                className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 text-sm text-slate-900 focus:border-teal-500 focus:bg-white focus:outline-none transition"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Email Address (ای میل) *
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 text-sm text-slate-900 focus:border-teal-500 focus:bg-white focus:outline-none transition"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                CNIC Number (شناختی کارڈ) *
              </label>
              <input
                type="text"
                required
                value={cnic}
                onChange={(e) => setCnic(e.target.value)}
                placeholder="XXXXX-XXXXXXX-X"
                className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 font-mono text-sm text-slate-900 focus:border-teal-500 focus:bg-white focus:outline-none transition"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                WhatsApp / Mobile (موبائل نمبر) *
              </label>
              <input
                type="text"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="03XX-XXXXXXX"
                className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 font-mono text-sm text-slate-900 focus:border-teal-500 focus:bg-white focus:outline-none transition"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                City (شہر) *
              </label>
              <input
                type="text"
                required
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="Enter your city"
                className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 text-sm text-slate-900 focus:border-teal-500 focus:bg-white focus:outline-none transition"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Home Address (مکمل پتہ) *
              </label>
              <input
                type="text"
                required
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Enter your residential address"
                className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 text-sm text-slate-900 focus:border-teal-500 focus:bg-white focus:outline-none transition"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSaving}
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-teal-600 to-emerald-600 py-3.5 px-6 text-sm font-bold text-white shadow-md hover:from-teal-700 hover:to-emerald-700 transition"
          >
            <ShieldCheck className="h-4 w-4" />
            <span>
              {isSaving
                ? "Saving Profile..."
                : "Save & Continue (محفوظ کریں اور شروع کریں)"}
            </span>
          </button>
        </form>
      </div>
    </div>
  );
}
