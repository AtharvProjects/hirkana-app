import { HeartPulse } from "lucide-react";

export function AppHeader({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <header className="mb-4 flex items-start justify-between">
      <div>
        <div className="text-xs uppercase tracking-[0.2em] text-[#8d5537]">HIRKANI</div>
        <h1 className="mt-1 text-2xl font-semibold leading-tight">{title}</h1>
        <p className="text-xs text-[#8d5537]">{subtitle}</p>
      </div>
      <div className="glass-card rounded-full p-3">
        <HeartPulse size={18} />
      </div>
    </header>
  );
}
