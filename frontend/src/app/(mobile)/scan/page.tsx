"use client";

import { useEffect, useMemo, useState } from "react";

import { SafetyBadge } from "@/components/Badge";
import { GlassCard } from "@/components/GlassCard";
import { LiveBarcodeScanner } from "@/components/LiveBarcodeScanner";
import { ScanPanel } from "@/components/ScanPanel";
import { PageTransition } from "@/components/mobile/PageTransition";
import { ScreenHeader } from "@/components/mobile/ScreenHeader";
import { getMobileState } from "@/components/mobile/auth";
import { api, ScanResult } from "@/lib/api";

export default function ScanScreen() {
  const [authed, setAuthed] = useState(false);
  const [profileDone, setProfileDone] = useState(false);
  const [result, setResult] = useState<ScanResult | null>(null);

  const badgeTone = useMemo(() => {
    if (!result) return "text-[#63361f]";
    if (result.classification === "SAFE") return "text-emerald-700";
    if (result.classification === "CONSUME_WITH_CAUTION") return "text-amber-700";
    return "text-red-700";
  }, [result]);

  useEffect(() => {
    getMobileState().then((state) => {
      setAuthed(state.authed);
      setProfileDone(state.profileDone);
    });
  }, []);

  async function handleQuickBarcode(code: string) {
    const res = await api.analyzeBarcode(code);
    setResult(res);
  }

  if (!authed || !profileDone) {
    return (
      <PageTransition>
        <ScreenHeader title="Scan" subtitle="Barcode, label OCR, or food image" />
        <GlassCard>
          <p className="text-sm">Complete sign-in and profile setup on Home first, then scan here.</p>
        </GlassCard>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <ScreenHeader title="Scan" subtitle="Tap camera or enter label details" />

      <LiveBarcodeScanner onDetected={(code) => handleQuickBarcode(code).catch((e) => alert((e as Error).message))} />
      <ScanPanel onResult={setResult} />

      {result ? (
        <>
          <SafetyBadge classification={result.classification} />
          <GlassCard title="Why this result">
            <p className={`text-sm font-medium ${badgeTone}`}>{result.explanation}</p>
          </GlassCard>
          <GlassCard title="Nutrient Insights">
            <div className="space-y-2 text-sm">
              {result.nutrient_insights.map((n) => (
                <div key={n.name}><span className="font-semibold">{n.name}</span> - {n.benefit}</div>
              ))}
            </div>
          </GlassCard>
          <GlassCard title="Healthy Alternatives">
            <div className="flex flex-wrap gap-2 text-sm">
              {result.alternatives.length ? result.alternatives.map((a) => <span key={a} className="rounded-pill bg-white/55 px-3 py-1">{a}</span>) : "No alternatives needed"}
            </div>
            <button onClick={() => api.addFavorite(result.detected_food, result.classification)} className="mt-2 h-11 w-full rounded-pill bg-white/60">Save to Favorites</button>
          </GlassCard>
        </>
      ) : null}
    </PageTransition>
  );
}
