import { ReactNode } from "react";

export function GlassCard({ title, children }: { title?: string; children: ReactNode }) {
  return (
    <section className="glass-card p-4">
      {title ? <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-[#63361f]">{title}</h3> : null}
      {children}
    </section>
  );
}
