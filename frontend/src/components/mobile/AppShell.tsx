"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Home, ScanLine, UserRound, Settings } from "lucide-react";

const tabs = [
  { href: "/home", label: "Home", icon: Home },
  { href: "/scan", label: "Scan", icon: ScanLine },
  { href: "/profile", label: "Profile", icon: UserRound },
  { href: "/settings", label: "Settings", icon: Settings }
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <motion.div initial={{ opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, ease: "easeOut" }} className="mobile-shell px-4 py-4 pb-24">
      {children}

      <nav className="ios-tabbar fixed bottom-4 left-1/2 z-50 w-[min(410px,calc(100vw-30px))] -translate-x-1/2 rounded-[26px] px-2 py-2">
        <ul className="grid grid-cols-4 gap-1">
          {tabs.map((tab) => {
            const active = pathname === tab.href;
            const Icon = tab.icon;
            return (
              <li key={tab.href}>
                <Link href={tab.href} className="relative flex h-14 w-full flex-col items-center justify-center rounded-[20px] text-[11px] font-medium">
                  {active ? (
                    <motion.span
                      layoutId="ios-active-pill"
                      className="absolute inset-0 rounded-[20px] bg-white/70"
                      transition={{ type: "spring", stiffness: 480, damping: 42, mass: 0.7 }}
                    />
                  ) : null}
                  <Icon size={16} className={`relative z-10 ${active ? "text-[#6a3318]" : "text-[#8d6e5a]"}`} />
                  <span className={`relative z-10 mt-1 ${active ? "text-[#6a3318]" : "text-[#8d6e5a]"}`}>{tab.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </motion.div>
  );
}
