"use client";

import { useEffect, useState } from "react";
import { HeartPulse, ShieldCheck, Sparkles, Star } from "lucide-react";

import { AuthGate } from "@/components/AuthGate";
import { OnboardingProfile } from "@/components/OnboardingProfile";
import { GlassCard } from "@/components/GlassCard";
import { PageTransition } from "@/components/mobile/PageTransition";
import { ScreenHeader } from "@/components/mobile/ScreenHeader";
import { getMobileState } from "@/components/mobile/auth";
import { api } from "@/lib/api";

export default function HomeScreen() {
  const [authed, setAuthed] = useState(false);
  const [profileDone, setProfileDone] = useState(false);
  const [tips, setTips] = useState<string[]>([]);
  const [history, setHistory] = useState<Array<{ id: number; detected_food: string; classification: string; explanation: string }>>([]);

  useEffect(() => {
    getMobileState().then(async (state) => {
      setAuthed(state.authed);
      setProfileDone(state.profileDone);
      if (state.authed) {
        const [t, h] = await Promise.all([api.tips(), api.history()]);
        setTips(t.tips);
        setHistory(h as Array<{ id: number; detected_food: string; classification: string; explanation: string }>);
      }
    });
  }, []);

  return (
    <PageTransition>
      <ScreenHeader title="Home" subtitle="Daily guidance for safer pregnancy nutrition" right={<div className="glass-card rounded-full p-3"><HeartPulse size={18} /></div>} />

      <GlassCard>
        <div className="flex items-center justify-between">
          <p className="text-sm">Track food safety results and trimester tips.</p>
          <ShieldCheck size={16} className="text-[#8d5537]" />
        </div>
      </GlassCard>

      {!authed ? <AuthGate onDone={() => setAuthed(true)} /> : null}
      {authed && !profileDone ? <OnboardingProfile onDone={() => setProfileDone(true)} /> : null}

      {authed && profileDone ? (
        <>
          <GlassCard title="Trimester Tips">
            <div className="space-y-2 text-sm">
              {tips.map((tip) => (
                <div key={tip} className="flex items-start gap-2"><Sparkles size={14} className="mt-1" />{tip}</div>
              ))}
              {!tips.length ? "Loading tips..." : null}
            </div>
          </GlassCard>

          <GlassCard title="Recent Scans">
            <div className="space-y-2 text-sm">
              {history.slice(0, 5).map((h) => (
                <div key={h.id} className="rounded-card bg-white/40 p-2">
                  <div className="flex items-center justify-between"><span>{h.detected_food}</span><Star size={14} /></div>
                  <div className="text-xs opacity-80">{h.classification.replaceAll("_", " ")}</div>
                  <div className="text-xs opacity-70">{h.explanation}</div>
                </div>
              ))}
              {!history.length ? "No scans yet" : null}
            </div>
          </GlassCard>
        </>
      ) : null}

      <footer className="mt-1 glass-card p-3 text-[11px] leading-relaxed">
        This tool provides guidance and does not replace professional medical advice.
      </footer>
    </PageTransition>
  );
}
