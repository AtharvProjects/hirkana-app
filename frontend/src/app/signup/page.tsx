"use client";

import Link from "next/link";
import { motion } from "framer-motion";

import { AuthForm } from "@/components/AuthForm";

export default function SignupPage() {
  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="mobile-shell p-5">
      <div className="text-xs uppercase tracking-[0.2em] text-[#8d5537]">HIRKANI</div>
      <h1 className="mt-2 text-2xl font-semibold">Sign up</h1>
      <p className="mb-4 text-sm text-[#7d5640]">Start personalized food safety guidance for pregnancy.</p>
      <AuthForm mode="signup" />
      <Link href="/" className="mt-4 block text-center text-xs underline">Back to landing</Link>
    </motion.div>
  );
}
