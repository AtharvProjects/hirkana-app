"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

export function MobileShell({ children }: { children: ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16, scale: 0.99 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.36, ease: [0.22, 1, 0.36, 1] }}
      className="mobile-shell relative overflow-hidden px-4 pb-24 pt-5"
    >
      {children}
    </motion.div>
  );
}
