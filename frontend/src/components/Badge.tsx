import { SafetyClass } from "@/lib/api";

export function SafetyBadge({ classification }: { classification: SafetyClass }) {
  const map = {
    SAFE: { label: "SAFE", dot: "🟢", cls: "badge-safe" },
    CONSUME_WITH_CAUTION: { label: "CONSUME WITH CAUTION", dot: "🟡", cls: "badge-caution" },
    AVOID_DURING_PREGNANCY: { label: "AVOID DURING PREGNANCY", dot: "🔴", cls: "badge-avoid" }
  }[classification];

  return (
    <div className={`w-full rounded-card px-4 py-4 text-center text-sm font-semibold ${map.cls}`}>
      <div className="text-xl">{map.dot}</div>
      <div className="mt-1 tracking-wide">{map.label}</div>
    </div>
  );
}
