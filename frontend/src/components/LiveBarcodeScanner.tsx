"use client";

import { useRef, useState } from "react";

type BrowserBarcodeDetector = {
  detect: (input: ImageBitmapSource) => Promise<Array<{ rawValue?: string }>>;
};

export function LiveBarcodeScanner({ onDetected }: { onDetected: (value: string) => void }) {
  const [active, setActive] = useState(false);
  const [error, setError] = useState("");
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const timerRef = useRef<number | null>(null);

  async function start() {
    setError("");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
      setActive(true);

      if ("BarcodeDetector" in window) {
        const DetectorCtor = (window as unknown as { BarcodeDetector: new (opts: { formats: string[] }) => BrowserBarcodeDetector }).BarcodeDetector;
        const detector = new DetectorCtor({ formats: ["ean_13", "ean_8", "upc_a", "upc_e", "code_128"] });

        const tick = async () => {
          if (!videoRef.current || !active) return;
          try {
            const codes = await detector.detect(videoRef.current);
            if (codes?.length && codes[0].rawValue) {
              onDetected(String(codes[0].rawValue));
              stop();
              return;
            }
          } catch {
            // Ignore frame errors.
          }
          timerRef.current = window.setTimeout(tick, 400);
        };
        timerRef.current = window.setTimeout(tick, 400);
      } else {
        setError("Live camera scan is not supported in this browser. Use manual barcode input.");
      }
    } catch (e) {
      setError((e as Error).message || "Unable to start camera");
    }
  }

  function stop() {
    if (timerRef.current) {
      window.clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    setActive(false);
  }

  return (
    <div className="glass-card p-3">
      <button className="h-10 w-full rounded-pill bg-white/60" onClick={() => (active ? stop() : start())}>
        {active ? "Stop Camera Scan" : "Start Camera Barcode Scan"}
      </button>
      <video ref={videoRef} className={`mt-3 w-full rounded-card ${active ? "block" : "hidden"}`} playsInline muted />
      {error ? <p className="mt-2 text-xs text-red-700">{error}</p> : null}
    </div>
  );
}
