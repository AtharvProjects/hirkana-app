"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Camera, ShieldCheck, Sparkles, ScanLine, PillBottle, FishSymbol } from "lucide-react";

export default function LandingPage() {
  return (
    <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.36 }} className="mobile-shell p-5">
      <header className="mb-4">
        <div className="inline-flex items-center gap-2 rounded-full border border-white/50 bg-white/45 px-3 py-1 text-xs">
          <span className="h-2.5 w-2.5 rounded-full bg-[#df7a2a]" />
          HIRKANI
        </div>
        <h1 className="mt-3 text-3xl font-semibold leading-tight">Pregnancy Food Safety Guide</h1>
        <p className="mt-2 text-sm text-[#6f4a35]">Scan any food and get a simple SAFE, CAUTION, or AVOID result in seconds.</p>
      </header>

      <section className="glass-card p-4">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-[#63361f]">App Simulation</h2>
        <div className="mt-3 grid gap-2">
          <div className="rounded-card bg-white/45 p-3 text-sm">
            <div className="flex items-center gap-2 font-semibold"><ScanLine size={14} /> Scan</div>
            <p className="mt-1 text-xs">Barcode, ingredient label OCR, or restaurant dish image.</p>
          </div>
          <div className="rounded-card bg-white/45 p-3 text-sm">
            <div className="flex items-center gap-2 font-semibold"><ShieldCheck size={14} /> Analyze</div>
            <p className="mt-1 text-xs">Deterministic pregnancy safety rules with profile personalization.</p>
          </div>
          <div className="rounded-card bg-white/45 p-3 text-sm">
            <div className="flex items-center gap-2 font-semibold"><Sparkles size={14} /> Explain</div>
            <p className="mt-1 text-xs">Short reason + nutrient insights + healthier alternatives.</p>
          </div>
        </div>
      </section>

      <section className="mt-3 grid grid-cols-2 gap-2">
        <div className="glass-card p-3 text-xs"><Camera size={14} className="mb-1" /> Live barcode scan</div>
        <div className="glass-card p-3 text-xs"><PillBottle size={14} className="mb-1" /> Additive alerts</div>
        <div className="glass-card p-3 text-xs"><FishSymbol size={14} className="mb-1" /> High-mercury fish warnings</div>
        <div className="glass-card p-3 text-xs"><ShieldCheck size={14} className="mb-1" /> WHO/ICMR/FSSAI references</div>
      </section>

      <section className="mt-4 grid grid-cols-2 gap-2">
        <Link href="/login" className="flex h-12 items-center justify-center rounded-pill bg-white/60 text-sm font-semibold">
          Login
        </Link>
        <Link href="/signup" className="flex h-12 items-center justify-center rounded-pill bg-gradient-to-r from-[#e37f2f] to-[#f1a965] text-sm font-semibold text-white">
          Sign up
        </Link>
      </section>

      <Link href="/home" className="mt-3 block text-center text-xs underline">
        Continue as demo
      </Link>

      <footer className="mt-4 text-[11px] leading-relaxed text-[#6f4a35]">
        This tool provides guidance and does not replace professional medical advice.
      </footer>
    </motion.div>
  );
}
