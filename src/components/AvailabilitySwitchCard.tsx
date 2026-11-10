"use client";

import React, { useEffect, useState } from "react";
import {
  CheckCircle2,
  Clock,
  HeartHandshake,
  MapPin,
  Scale,
  Sparkles,
  UserCheck,
  Briefcase,
  Mail,
  Phone,
  ArrowRight,
  Cpu,
} from "lucide-react";
import Link from "next/link";
import {
  AvailabilityTimeSlot,
  HelpTypeOption,
  LegalHelperAvailability,
} from "@/lib/store";
import {
  ALL_LEGAL_CATEGORIES,
  LegalCategoryId,
} from "@/lib/legal-knowledge";
import type { PreferenceMatch } from "@/app/api/availability/route";
import {
  getActiveClientProfile,
  getClientHelpers,
  saveClientHelper,
} from "@/lib/client-storage";

const TIME_SLOTS: {
  id: AvailabilityTimeSlot;
  label: string;
  sub: string;
}[] = [
  { id: "immediate", label: "Available Now", sub: "Immediate Response" },
  { id: "morning", label: "Morning Slot", sub: "9:00 AM – 1:00 PM" },
  { id: "evening", label: "Evening Slot", sub: "5:00 PM – 10:00 PM" },
  { id: "weekends", label: "Weekends", sub: "Sat & Sun Pro-Bono" },
];

const HELP_TYPES: {
  id: HelpTypeOption;
  label: string;
  desc: string;
}[] = [
  {
    id: "drafting",
    label: "Complaint Drafting",
    desc: "Review & refine formal applications",
  },
  {
    id: "consultation",
    label: "Legal Guidance",
    desc: "1-on-1 citizen rights advice",
  },
  {
    id: "representation",
    label: "Pro-Bono Representation",
    desc: "Ombudsman / tribunal representation",
  },
  {
    id: "verification",
    label: "Citation & Evidence Check",
    desc: "Verify statutory sections & docs",
  },
];

const LEGAL_CATEGORIES: { id: LegalCategoryId; label: string }[] =
  ALL_LEGAL_CATEGORIES.map((cat) => ({
    id: cat.id,
    label: cat.title.en,
  }));

export default function AvailabilitySwitchCard({
  compact = false,
}: {
  compact?: boolean;
}) {
  const [isAvailable, setIsAvailable] = useState<boolean>(false);
  const [timeSlot, setTimeSlot] = useState<AvailabilityTimeSlot>("immediate");
  const [helpTypes, setHelpTypes] = useState<HelpTypeOption[]>([
    "drafting",
    "consultation",
  ]);
  const [selectedCategories, setSelectedCategories] = useState<
    LegalCategoryId[]
  >(["education", "cybercrime", "police"]);

  const [fullName, setFullName] = useState("");
  const [roleTitle, setRoleTitle] = useState("Advocate / Legal Aid Volunteer");
  const [city, setCity] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [haqId, setHaqId] = useState("");
  const [helperId, setHelperId] = useState("");

  const [helpers, setHelpers] = useState<LegalHelperAvailability[]>([]);
  const [matches, setMatches] = useState<PreferenceMatch[]>([]);
  const [saving, setSaving] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  // Citizen filter for Preference-Based Matching
  const [citizenNeedCategory, setCitizenNeedCategory] = useState<
    LegalCategoryId | "all"
  >("all");
  const [citizenNeedHelpType, setCitizenNeedHelpType] = useState<
    HelpTypeOption | "all"
  >("all");

  useEffect(() => {
    try {
      const parsed = getActiveClientProfile();
      if (parsed) {
        if (parsed.fullName) setFullName(parsed.fullName);
        if (parsed.city) setCity(parsed.city);
        if (parsed.phone) setPhone(parsed.phone);
        if (parsed.email) setEmail(parsed.email);
        if (parsed.haqId) setHaqId(parsed.haqId);
        if (parsed.occupation) setRoleTitle(parsed.occupation);
      }

      const savedHelperRaw = localStorage.getItem("haqai_helper_availability");
      if (savedHelperRaw) {
        const parsedHelper = JSON.parse(
          savedHelperRaw
        ) as LegalHelperAvailability;
        setHelperId(parsedHelper.helperId || "");
        setIsAvailable(Boolean(parsedHelper.isAvailable));
        if (parsedHelper.fullName) setFullName(parsedHelper.fullName);
        if (parsedHelper.roleTitle) setRoleTitle(parsedHelper.roleTitle);
        if (parsedHelper.city) setCity(parsedHelper.city);
        if (parsedHelper.phone) setPhone(parsedHelper.phone);
        if (parsedHelper.email) setEmail(parsedHelper.email);
        if (parsedHelper.timeSlot) setTimeSlot(parsedHelper.timeSlot);
        if (parsedHelper.helpTypes?.length)
          setHelpTypes(parsedHelper.helpTypes);
        if (parsedHelper.legalCategories?.length)
          setSelectedCategories(parsedHelper.legalCategories);
        saveClientHelper(parsedHelper);
        // Ensure server also has this volunteer record
        fetch("/api/availability", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(parsedHelper),
        }).catch(() => {});
      }
    } catch {
      // ignore localStorage read errors
    }

    fetchAvailabilityData();
  }, []);

  async function fetchAvailabilityData() {
    try {
      const res = await fetch(`/api/availability?t=${Date.now()}`, {
        cache: "no-store",
      });
      if (res.ok) {
        const data = await res.json();
        const serverHelpers: LegalHelperAvailability[] = data.helpers || [];
        const localHelpers = getClientHelpers();
        const mergedMap = new Map<string, LegalHelperAvailability>();
        for (const h of localHelpers) {
          if (h?.helperId) mergedMap.set(h.helperId, h);
        }
        for (const h of serverHelpers) {
          if (h?.helperId) mergedMap.set(h.helperId, h);
        }
        setHelpers(Array.from(mergedMap.values()));
        setMatches(data.matches || []);
      }
    } catch {
      setHelpers(getClientHelpers());
    }
  }

  function toggleHelpType(id: HelpTypeOption) {
    setHelpTypes((prev) =>
      prev.includes(id)
        ? prev.length > 1
          ? prev.filter((x) => x !== id)
          : prev
        : [...prev, id]
    );
  }

  function toggleCategory(id: LegalCategoryId) {
    setSelectedCategories((prev) =>
      prev.includes(id)
        ? prev.length > 1
          ? prev.filter((x) => x !== id)
          : prev
        : [...prev, id]
    );
  }

  async function handleSaveOrToggle(nextAvailableState: boolean) {
    if (!fullName.trim()) {
      setStatusMessage(
        "Please enter your Name below before switching on 'I can help'."
      );
      return;
    }

    setIsAvailable(nextAvailableState);
    setSaving(true);
    setStatusMessage(null);

    try {
      const res = await fetch("/api/availability", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          helperId: helperId || haqId || undefined,
          haqId: haqId || undefined,
          fullName,
          roleTitle,
          phone,
          email,
          city: city || "Pakistan",
          isAvailable: nextAvailableState,
          timeSlot,
          helpTypes,
          legalCategories: selectedCategories,
        }),
      });

      const data = await res.json();
      if (res.ok && data.helper) {
        setHelperId(data.helper.helperId);
        saveClientHelper(data.helper);
        setHelpers(data.helpers || []);
        setMatches(data.matches || []);
        setStatusMessage(
          nextAvailableState
            ? "Availability Switch ON: You are now live for Preference-Based Legal Matching!"
            : "Availability Switch OFF: Your status is paused."
        );
      } else {
        setStatusMessage(data.error || "Could not update availability.");
      }
    } catch {
      setStatusMessage("Network error while saving availability.");
    } finally {
      setSaving(false);
    }
  }

  const activeHelpers = helpers.filter((h) => {
    if (!h.isAvailable) return false;
    if (
      citizenNeedCategory !== "all" &&
      !h.legalCategories.includes(citizenNeedCategory)
    ) {
      return false;
    }
    if (
      citizenNeedHelpType !== "all" &&
      !h.helpTypes.includes(citizenNeedHelpType)
    ) {
      return false;
    }
    return true;
  });

  const step1Done = isAvailable;
  const step2Done = Boolean(timeSlot);
  const step3Done = helpTypes.length > 0 && selectedCategories.length > 0;
  const step4Done =
    isAvailable && (matches.length > 0 || activeHelpers.length > 0);

  return (
    <div className="rounded-3xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-2 border-slate-900/15 dark:border-emerald-500/30 shadow-xl overflow-hidden transition-all">
      {/* Top Card 9 Header */}
      <div className="bg-gradient-to-r from-slate-900 via-emerald-950 to-slate-900 text-white px-6 py-5 border-b border-emerald-500/20 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-bold tracking-wider uppercase mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            CARD 9: THE AVAILABILITY SWITCH
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight text-white flex items-center gap-2.5">
            <HeartHandshake className="w-6 h-6 text-emerald-400" />
            Pro-Bono Legal Aid Availability Switch
          </h2>
          <p className="text-xs sm:text-sm text-emerald-100/80 mt-0.5">
            Lawyers, law students &amp; paralegals: toggle when and how you can
            help citizens with legal rights &amp; complaints.
          </p>
        </div>

        {/* TECHSOC Emblem */}
        <div className="flex items-center gap-2.5 px-4 py-2.5 rounded-2xl bg-white/10 border border-white/15 backdrop-blur-sm">
          <Cpu className="w-6 h-6 text-amber-400" />
          <div className="text-right">
            <div className="text-xs font-black tracking-widest uppercase text-white">
              TECHSOC
            </div>
            <div className="text-[11px] font-urdu text-amber-300">
              ٹیک سوس • کارڈ 9
            </div>
          </div>
        </div>
      </div>

      <div className="p-6 sm:p-8 space-y-7">
        {/* 4 Numbered Steps + Interactive Big Switch (Mirrors Card 9 Diagram) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          {/* Left: 1, 2, 3, 4 Steps */}
          <div className="lg:col-span-7 space-y-3.5">
            {[
              {
                num: 1,
                title: "Toggle: I can help",
                sub: isAvailable
                  ? "Switch is ON — Ready to assist citizens"
                  : "Turn on the switch when you are ready to volunteer",
                active: step1Done,
              },
              {
                num: 2,
                title: "Select when",
                sub: `Selected slot: ${
                  TIME_SLOTS.find((t) => t.id === timeSlot)?.label
                } (${TIME_SLOTS.find((t) => t.id === timeSlot)?.sub})`,
                active: step2Done,
              },
              {
                num: 3,
                title: "Select help type",
                sub: `${helpTypes.length} help modes • ${selectedCategories.length} legal categories selected`,
                active: step3Done,
              },
              {
                num: 4,
                title: "Match with needs",
                sub: `${matches.length} preference-based case matches • ${activeHelpers.length} active volunteers`,
                active: step4Done,
              },
            ].map((item) => (
              <div
                key={item.num}
                className={`flex items-center gap-4 p-3.5 rounded-2xl border transition-all ${
                  item.active
                    ? "bg-emerald-50/70 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-700/60"
                    : "bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700"
                }`}
              >
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center font-extrabold text-sm shrink-0 transition-colors ${
                    item.active
                      ? "bg-emerald-700 text-white shadow-sm"
                      : "bg-slate-800 dark:bg-slate-700 text-white"
                  }`}
                >
                  {item.num}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="font-bold text-slate-900 dark:text-white text-base">
                    {item.title}
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 truncate">
                    {item.sub}
                  </div>
                </div>
                {item.active && (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                )}
              </div>
            ))}
          </div>

          {/* Right: Card 9 Status Bar + Giant Toggle Switch */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center p-6 rounded-3xl bg-slate-50 dark:bg-slate-800/50 border-2 border-slate-200 dark:border-slate-700 space-y-6">
            {/* 4-Column Status Pill from Card 9 Image */}
            <div className="w-full rounded-2xl border-2 border-slate-800 dark:border-slate-300 bg-white dark:bg-slate-900 px-2 py-3.5 grid grid-cols-4 divide-x-2 divide-slate-800/80 dark:divide-slate-400/50 text-center shadow-sm">
              {[
                { label: "Available", active: isAvailable },
                { label: "Time", active: Boolean(timeSlot) },
                { label: "Help type", active: helpTypes.length > 0 },
                {
                  label: "Match",
                  active:
                    isAvailable &&
                    (matches.length > 0 || activeHelpers.length > 0),
                },
              ].map((col) => (
                <div
                  key={col.label}
                  className="flex flex-col items-center justify-center gap-1.5 px-1"
                >
                  <span
                    className={`w-3 h-3 rounded-full transition-all ${
                      col.active
                        ? "bg-emerald-500 ring-4 ring-emerald-500/25 scale-110"
                        : "bg-slate-800 dark:bg-slate-500"
                    }`}
                  />
                  <span className="text-[11px] sm:text-xs font-bold text-slate-800 dark:text-slate-200">
                    {col.label}
                  </span>
                </div>
              ))}
            </div>

            {/* Giant Interactive Pill Switch from Card 9 Image */}
            <div className="flex flex-col items-center gap-2.5">
              <button
                type="button"
                onClick={() => handleSaveOrToggle(!isAvailable)}
                disabled={saving}
                aria-label="Toggle I can help availability switch"
                className={`relative w-36 h-16 rounded-full border-4 transition-all duration-300 flex items-center px-2 shadow-inner ${
                  isAvailable
                    ? "bg-emerald-600 border-slate-900 dark:border-emerald-300 justify-end"
                    : "bg-white dark:bg-slate-900 border-slate-900 dark:border-slate-300 justify-start"
                }`}
              >
                <span
                  className={`w-11 h-11 rounded-full transition-all duration-300 shadow-md flex items-center justify-center ${
                    isAvailable
                      ? "bg-white text-emerald-700"
                      : "bg-slate-800 dark:bg-slate-300 text-white dark:text-slate-900"
                  }`}
                >
                  <HeartHandshake className="w-5 h-5" />
                </span>
              </button>
              <span
                className={`text-xs font-extrabold uppercase tracking-wider ${
                  isAvailable
                    ? "text-emerald-700 dark:text-emerald-400"
                    : "text-slate-500 dark:text-slate-400"
                }`}
              >
                {saving
                  ? "Updating Switch..."
                  : isAvailable
                  ? "Switch ON: I Can Help"
                  : "Switch OFF: Click to Help"}
              </span>
            </div>

            {/* Bottom Banner: RESULT: PREFERENCE-BASED MATCHING */}
            <div className="w-full pt-2 border-t border-slate-200 dark:border-slate-700 text-center">
              <div className="text-xs font-black tracking-widest uppercase text-slate-900 dark:text-emerald-400">
                RESULT: PREFERENCE-BASED MATCHING
              </div>
            </div>
          </div>
        </div>

        {/* Helper Profile & Preferences Configuration */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2 border-t border-slate-200 dark:border-slate-800">
          {/* Volunteer Details & Step 2 (Select When) */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-2">
              <UserCheck className="w-4 h-4 text-emerald-600" />
              Step 1 &amp; 2: Volunteer Details &amp; When You Can Help
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Your Full Name (e.g., Adv. Bilal)"
                className="px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-emerald-600"
              />
              <input
                type="text"
                value={roleTitle}
                onChange={(e) => setRoleTitle(e.target.value)}
                placeholder="Role (Advocate / Law Student)"
                className="px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-emerald-600"
              />
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="City (e.g., Lahore, Karachi)"
                className="px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-emerald-600"
              />
              <input
                type="text"
                value={email || phone}
                onChange={(e) => {
                  const val = e.target.value;
                  if (val.includes("@")) setEmail(val);
                  else setPhone(val);
                }}
                placeholder="Contact Email or Phone"
                className="px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-emerald-600"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-2">
                2. Select When (Time Slot Preference)
              </label>
              <div className="grid grid-cols-2 gap-2.5">
                {TIME_SLOTS.map((slot) => (
                  <button
                    key={slot.id}
                    type="button"
                    onClick={() => setTimeSlot(slot.id)}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      timeSlot === slot.id
                        ? "bg-emerald-700 text-white border-emerald-700 shadow-sm"
                        : "bg-slate-50 dark:bg-slate-800/70 text-slate-800 dark:text-slate-200 border-slate-200 dark:border-slate-700 hover:border-emerald-400"
                    }`}
                  >
                    <div className="flex items-center gap-1.5 font-bold text-xs">
                      <Clock className="w-3.5 h-3.5" />
                      {slot.label}
                    </div>
                    <div
                      className={`text-[11px] mt-0.5 ${
                        timeSlot === slot.id
                          ? "text-emerald-100"
                          : "text-slate-500 dark:text-slate-400"
                      }`}
                    >
                      {slot.sub}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Step 3: Select Help Type & Legal Categories */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-emerald-600" />
              Step 3: Select Help Type &amp; Legal Areas
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {HELP_TYPES.map((ht) => {
                const active = helpTypes.includes(ht.id);
                return (
                  <button
                    key={ht.id}
                    type="button"
                    onClick={() => toggleHelpType(ht.id)}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      active
                        ? "bg-emerald-50 dark:bg-emerald-950/50 border-emerald-600 text-emerald-950 dark:text-emerald-200"
                        : "bg-slate-50 dark:bg-slate-800/70 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300"
                    }`}
                  >
                    <div className="font-bold text-xs flex items-center justify-between">
                      <span>{ht.label}</span>
                      {active && (
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                      )}
                    </div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                      {ht.desc}
                    </div>
                  </button>
                );
              })}
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-2">
                Preferred Legal Rights Categories
              </label>
              <div className="flex flex-wrap gap-1.5">
                {LEGAL_CATEGORIES.map((cat) => {
                  const active = selectedCategories.includes(cat.id);
                  return (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => toggleCategory(cat.id)}
                      className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                        active
                          ? "bg-emerald-700 text-white border-emerald-700"
                          : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700"
                      }`}
                    >
                      {cat.label}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex items-center justify-between gap-3 pt-1">
              <button
                type="button"
                onClick={() => handleSaveOrToggle(true)}
                disabled={saving}
                className="w-full py-2.5 px-4 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs sm:text-sm shadow-sm transition-all flex items-center justify-center gap-2"
              >
                <HeartHandshake className="w-4 h-4" />
                {saving
                  ? "Saving Preferences..."
                  : isAvailable
                  ? "Update Preferences & Refresh Matches"
                  : "Turn ON Availability & Match With Needs"}
              </button>
            </div>
          </div>
        </div>

        {statusMessage && (
          <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-300 dark:border-emerald-700 text-emerald-900 dark:text-emerald-200 text-xs sm:text-sm font-medium flex items-center justify-between gap-3">
            <span>{statusMessage}</span>
          </div>
        )}

        {/* Step 4: RESULT - PREFERENCE-BASED MATCHING */}
        <div className="pt-4 border-t border-slate-200 dark:border-slate-800 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <span className="text-[11px] font-extrabold uppercase tracking-widest text-emerald-700 dark:text-emerald-400">
                STEP 4 • RESULT: PREFERENCE-BASED MATCHING
              </span>
              <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">
                Live Matched Volunteers &amp; Citizen Legal Needs
              </h3>
            </div>

            {/* Filter by Citizen Need */}
            <div className="flex flex-wrap items-center gap-2">
              <select
                value={citizenNeedCategory}
                onChange={(e) =>
                  setCitizenNeedCategory(
                    e.target.value as LegalCategoryId | "all"
                  )
                }
                className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-semibold text-slate-800 dark:text-slate-200"
              >
                <option value="all">All Legal Categories</option>
                {LEGAL_CATEGORIES.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.label}
                  </option>
                ))}
              </select>

              <select
                value={citizenNeedHelpType}
                onChange={(e) =>
                  setCitizenNeedHelpType(
                    e.target.value as HelpTypeOption | "all"
                  )
                }
                className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-semibold text-slate-800 dark:text-slate-200"
              >
                <option value="all">All Help Types</option>
                {HELP_TYPES.map((h) => (
                  <option key={h.id} value={h.id}>
                    {h.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Matched Citizen Cases & Active Volunteers */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Column 1: Available Pro-Bono Legal Helpers */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  Available Legal Volunteers ({activeHelpers.length})
                </span>
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 dark:text-emerald-400">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  Live Switch ON
                </span>
              </div>

              {activeHelpers.length === 0 ? (
                <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-dashed border-slate-300 dark:border-slate-700 text-xs text-slate-500 dark:text-slate-400 text-center">
                  No volunteers have toggled their Availability Switch ON for
                  this filter yet. Enter your name above and toggle the switch
                  to become the first live helper!
                </div>
              ) : (
                <div className="space-y-2.5 max-h-60 overflow-y-auto pr-1">
                  {activeHelpers.map((h) => (
                    <div
                      key={h.helperId}
                      className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 flex flex-col gap-2 shadow-sm"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-1.5">
                            {h.fullName}
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300">
                              Available
                            </span>
                          </div>
                          <div className="text-xs text-slate-500 dark:text-slate-400">
                            {h.roleTitle} •{" "}
                            <span className="inline-flex items-center gap-0.5">
                              <MapPin className="w-3 h-3" /> {h.city}
                            </span>
                          </div>
                        </div>
                        <span className="px-2 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-[11px] font-semibold text-slate-700 dark:text-slate-300">
                          {
                            TIME_SLOTS.find((t) => t.id === h.timeSlot)
                              ?.label
                          }
                        </span>
                      </div>

                      <div className="flex flex-wrap gap-1">
                        {h.helpTypes.map((ht) => (
                          <span
                            key={ht}
                            className="px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 text-[10px] font-semibold border border-emerald-200 dark:border-emerald-800"
                          >
                            {HELP_TYPES.find((x) => x.id === ht)?.label || ht}
                          </span>
                        ))}
                      </div>

                      {(h.email || h.phone) && (
                        <div className="flex items-center gap-3 pt-1 text-[11px] text-slate-600 dark:text-slate-400">
                          {h.email && (
                            <a
                              href={`mailto:${h.email}?subject=HaqAI%20Citizen%20Legal%20Aid%20Request`}
                              className="inline-flex items-center gap-1 text-emerald-700 dark:text-emerald-400 font-semibold hover:underline"
                            >
                              <Mail className="w-3 h-3" /> {h.email}
                            </a>
                          )}
                          {h.phone && (
                            <span className="inline-flex items-center gap-1">
                              <Phone className="w-3 h-3" /> {h.phone}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Column 2: Preference-Based Case Matches */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  Preference-Based Case Matches ({matches.length})
                </span>
                <Scale className="w-4 h-4 text-emerald-600" />
              </div>

              {matches.length === 0 ? (
                <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-dashed border-slate-300 dark:border-slate-700 text-xs text-slate-500 dark:text-slate-400 text-center">
                  When both a citizen case and an available volunteer match on
                  legal category, help type, and time preference, the pairing
                  appears here automatically.
                </div>
              ) : (
                <div className="space-y-2.5 max-h-60 overflow-y-auto pr-1">
                  {matches.slice(0, 6).map((m) => (
                    <div
                      key={m.matchId}
                      className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-emerald-200 dark:border-emerald-800/70 flex flex-col gap-1.5 shadow-sm"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs font-extrabold text-emerald-800 dark:text-emerald-300">
                          {m.helperName} ↔ Case {m.caseId}
                        </span>
                        <span className="px-2 py-0.5 rounded-full bg-emerald-600 text-white text-[10px] font-bold">
                          {m.matchScore}% Match
                        </span>
                      </div>
                      <div className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                        {m.categoryTitle} • Authority: {m.authorityShortName}
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1">
                        Citizen Need: &ldquo;{m.userQuery}&rdquo;
                      </p>
                      <div className="flex flex-wrap gap-1 pt-0.5">
                        {m.matchReasons.map((r, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-[10px] font-medium text-slate-600 dark:text-slate-300"
                          >
                            ✓ {r}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {compact && (
            <div className="flex justify-end pt-1">
              <Link
                href="/volunteer"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 dark:text-emerald-400 hover:underline"
              >
                Open Full Availability Switch &amp; Matching Portal
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
