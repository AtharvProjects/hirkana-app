"use client";

import { useEffect, useState } from "react";
import { Baby, Salad, ShieldAlert } from "lucide-react";

import { GlassCard } from "@/components/GlassCard";
import { OnboardingProfile } from "@/components/OnboardingProfile";
import { PageTransition } from "@/components/mobile/PageTransition";
import { ScreenHeader } from "@/components/mobile/ScreenHeader";
import { getMobileState } from "@/components/mobile/auth";
import { api } from "@/lib/api";

type ProfileData = {
  age: number;
  pregnancy_week: number;
  trimester: number;
  diet_preference: string;
  allergies: string[];
  medical_conditions: string[];
  doctor_restrictions: string;
};

export default function ProfileScreen() {
  const [authed, setAuthed] = useState(false);
  const [profile, setProfile] = useState<ProfileData | null>(null);

  async function load() {
    const p = await api.getProfile();
    setProfile((p ?? null) as ProfileData | null);
  }

  useEffect(() => {
    getMobileState().then(async (state) => {
      setAuthed(state.authed);
      if (state.authed) await load();
    });
  }, []);

  return (
    <PageTransition>
      <ScreenHeader title="Profile" subtitle="Personalized pregnancy safety settings" />

      {!authed ? (
        <GlassCard>
          <p className="text-sm">Sign in from Home to access your profile.</p>
        </GlassCard>
      ) : null}

      {authed && !profile ? <OnboardingProfile onDone={load} /> : null}

      {authed && profile ? (
        <>
          <GlassCard title="Pregnancy Details">
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2"><Baby size={14} /> Week {profile.pregnancy_week} • Trimester {profile.trimester}</div>
              <div>Age: {profile.age}</div>
              <div>Diet: {profile.diet_preference}</div>
            </div>
          </GlassCard>
          <GlassCard title="Health Alerts">
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2"><ShieldAlert size={14} /> Conditions: {profile.medical_conditions.join(", ") || "None"}</div>
              <div className="flex items-center gap-2"><Salad size={14} /> Allergies: {profile.allergies.join(", ") || "None"}</div>
              <div>Doctor restrictions: {profile.doctor_restrictions || "None"}</div>
            </div>
          </GlassCard>
          <button className="h-11 w-full rounded-pill bg-white/60" onClick={() => setProfile(null)}>Edit Profile</button>
        </>
      ) : null}
    </PageTransition>
  );
}
