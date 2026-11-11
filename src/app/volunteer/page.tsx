"use client";

import React from "react";
import AvailabilitySwitchCard from "@/components/AvailabilitySwitchCard";
import { HeartHandshake, ShieldCheck, Sparkles, Scale } from "lucide-react";

export default function VolunteerSwitchPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Page Header */}
      <div className="rounded-3xl bg-gradient-to-br from-emerald-950 via-emerald-900 to-slate-900 text-white p-7 sm:p-10 shadow-xl border border-emerald-800/50 relative overflow-hidden">
        <div className="max-w-3xl space-y-3 relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-200 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            Pro-Bono Legal Aid • The Availability Switch
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
            The Availability Switch:{" "}
            <span className="text-amber-300">Preference-Based Legal Aid</span>
          </h1>
          <p className="text-emerald-100/90 text-sm sm:text-base leading-relaxed">
            Connecting Pakistani citizens facing legal grievances with
            pro-bono lawyers, legal clinics, and law students — matched
            automatically by availability status, time slot, help type, and
            constitutional/statutory domain.
          </p>
          <div className="flex flex-wrap gap-3 pt-2 text-xs text-emerald-200">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10">
              <HeartHandshake className="w-3.5 h-3.5 text-amber-300" />
              1. Toggle: I can help
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-300" />
              2. Select when &amp; 3. Select help type
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10">
              <Scale className="w-3.5 h-3.5 text-amber-300" />
              4. Match with citizen needs
            </span>
          </div>
        </div>
      </div>

      {/* Interactive Card 9 Component */}
      <AvailabilitySwitchCard />
    </div>
  );
}
