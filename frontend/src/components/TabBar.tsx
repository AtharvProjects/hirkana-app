"use client";

import { AnimatePresence, motion } from "framer-motion";
import { House, ScanLine, Settings, UserRound } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const tabs = [
  { href: "/home", label: "Home", icon: House },
  { href: "/scan", label: "Scan", icon: ScanLine },
  { href: "/profile", label: "Profile", icon: UserRound },
  { href: "/settings", label: "Settings", icon: Settings }
];

export function TabBar() {
  const pathname = usePathname();

  return (
    <nav className="absolute bottom-4 left-4 right-4 z-20 rounded-[28px] border border-white/40 bg-white/35 p-2 backdrop-blur-2xl">
      <div className="grid grid-cols-4 gap-1">
        {tabs.map((tab) => {
          const active = pathname === tab.href;
          const Icon = tab.icon;

          return (
            <Link key={tab.href} href={tab.href} className="relative flex items-center justify-center py-2">
              <AnimatePresence>
                {active ? (
                  <motion.span
                    layoutId="tab-pill"
                    className="absolute inset-0 rounded-2xl bg-white/70"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                ) : null}
              </AnimatePresence>
              <span className={`relative flex flex-col items-center gap-1 ${active ? "text-[#5f321d]" : "text-[#8a5a40]"}`}>
                <Icon size={16} />
                <span className="text-[11px] font-medium">{tab.label}</span>
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
