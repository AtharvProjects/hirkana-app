"use client";

import { useState } from "react";
import { Bell, Shield, Smartphone } from "lucide-react";

import { GlassCard } from "@/components/GlassCard";
import { PageTransition } from "@/components/mobile/PageTransition";
import { ScreenHeader } from "@/components/mobile/ScreenHeader";

export default function SettingsScreen() {
  const [tips, setTips] = useState(true);
  const [haptics, setHaptics] = useState(true);

  return (
    <PageTransition>
      <ScreenHeader title="Settings" subtitle="Privacy, notifications, and app preferences" />

      <GlassCard title="Notifications">
        <label className="flex items-center justify-between rounded-card bg-white/40 p-3 text-sm">
          <span className="flex items-center gap-2"><Bell size={14} /> Daily nutrition tips</span>
          <input type="checkbox" checked={tips} onChange={(e) => setTips(e.target.checked)} />
        </label>
      </GlassCard>

      <GlassCard title="Experience">
        <label className="flex items-center justify-between rounded-card bg-white/40 p-3 text-sm">
          <span className="flex items-center gap-2"><Smartphone size={14} /> iOS-like haptic behavior</span>
          <input type="checkbox" checked={haptics} onChange={(e) => setHaptics(e.target.checked)} />
        </label>
      </GlassCard>

      <GlassCard title="Privacy">
        <div className="text-sm">
          <div className="flex items-center gap-2"><Shield size={14} /> Sensitive profile fields are encrypted at rest.</div>
          <p className="mt-2 text-xs opacity-80">This tool provides guidance and does not replace professional medical advice.</p>
        </div>
      </GlassCard>

      <button
        className="h-11 w-full rounded-pill bg-white/60"
        onClick={() => {
          localStorage.removeItem("hirkani_token");
          window.location.href = "/home";
        }}
      >
        Log Out
      </button>
    </PageTransition>
  );
}
