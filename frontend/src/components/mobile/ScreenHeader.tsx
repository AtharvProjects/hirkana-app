import { ReactNode } from "react";

export function ScreenHeader({ title, subtitle, right }: { title: string; subtitle?: string; right?: ReactNode }) {
  return (
    <header className="mb-4 flex items-start justify-between">
      <div>
        <div className="text-xs uppercase tracking-[0.2em] text-[#8d5537]">HIRKANI</div>
        <h1 className="mt-1 text-2xl font-semibold leading-tight">{title}</h1>
        {subtitle ? <p className="mt-1 text-xs text-[#7d5640]">{subtitle}</p> : null}
      </div>
      {right}
    </header>
  );
}
