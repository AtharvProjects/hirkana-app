"use client";

import { useRef, useState } from "react";
import { Camera, ImagePlus, ScanLine } from "lucide-react";
import { api, ScanResult } from "@/lib/api";

export function ScanPanel({ onResult }: { onResult: (r: ScanResult) => void }) {
  const [barcode, setBarcode] = useState("");
  const [ingredients, setIngredients] = useState("");
  const [loading, setLoading] = useState(false);
  const fileRef = useRef<HTMLInputElement | null>(null);

  const run = async (fn: () => Promise<ScanResult>) => {
    setLoading(true);
    try {
      const result = await fn();
      onResult(result);
    } catch (err) {
      alert(`Scan failed: ${(err as Error).message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-3">
      <div className="glass-card p-4">
        <div className="mb-2 flex items-center gap-2 text-sm font-semibold"><ScanLine size={16} /> Barcode Scan</div>
        <input
          value={barcode}
          onChange={(e) => setBarcode(e.target.value)}
          placeholder="Enter/scan barcode"
          className="h-12 w-full rounded-pill border border-white/40 bg-white/35 px-3 outline-none"
        />
        <button
          disabled={!barcode || loading}
          onClick={() => run(() => api.analyzeBarcode(barcode))}
          className="mt-3 h-12 w-full rounded-pill bg-gradient-to-r from-[#e37f2f] to-[#f1a965] text-white disabled:opacity-50"
        >
          Analyze Barcode
        </button>
      </div>

      <div className="glass-card p-4">
        <div className="mb-2 flex items-center gap-2 text-sm font-semibold"><Camera size={16} /> Ingredients OCR</div>
        <textarea
          value={ingredients}
          onChange={(e) => setIngredients(e.target.value)}
          placeholder="Paste ingredients text if OCR/manual"
          className="min-h-24 w-full rounded-card border border-white/40 bg-white/35 p-3 outline-none"
        />
        <button
          disabled={!ingredients || loading}
          onClick={() => run(() => api.analyzeText("ocr", ingredients))}
          className="mt-3 h-12 w-full rounded-pill bg-white/55 disabled:opacity-50"
        >
          Analyze Ingredients
        </button>
      </div>

      <div className="glass-card p-4">
        <div className="mb-2 flex items-center gap-2 text-sm font-semibold"><ImagePlus size={16} /> Upload Food Image</div>
        <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={async (e) => {
          const file = e.target.files?.[0];
          if (!file) return;
          await run(() => api.uploadImage(file));
        }} />
        <button onClick={() => fileRef.current?.click()} disabled={loading} className="h-12 w-full rounded-pill bg-white/55 disabled:opacity-50">
          Upload & Analyze
        </button>
      </div>
    </div>
  );
}
