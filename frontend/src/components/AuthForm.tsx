"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

import { api } from "@/lib/api";

export function AuthForm({ mode }: { mode: "login" | "signup" }) {
  const router = useRouter();
  const [name, setName] = useState("Aarohi");
  const [email, setEmail] = useState("aarohi@example.com");
  const [password, setPassword] = useState("Password123!");
  const [loading, setLoading] = useState(false);
  const isLogin = mode === "login";

  const submit = async () => {
    setLoading(true);
    try {
      const data = isLogin
        ? await api.login({ email, password })
        : await api.signup({ name, email, password });
      localStorage.setItem("hirkani_token", data.access_token);
      router.push("/home");
    } catch (e) {
      alert((e as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass-card p-4 space-y-2">
      <div className="text-sm font-semibold">{isLogin ? "Welcome back" : "Create your account"}</div>
      {!isLogin ? (
        <input
          className="h-11 w-full rounded-pill bg-white/45 px-3"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Name"
        />
      ) : null}
      <input className="h-11 w-full rounded-pill bg-white/45 px-3" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
      <input className="h-11 w-full rounded-pill bg-white/45 px-3" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" />
      <button disabled={loading} className="h-11 w-full rounded-pill bg-gradient-to-r from-[#e37f2f] to-[#f1a965] text-white" onClick={submit}>
        {loading ? "Please wait..." : isLogin ? "Login" : "Sign up"}
      </button>
      <div className="text-center text-xs">
        {isLogin ? "No account? " : "Already have account? "}
        <Link className="underline" href={isLogin ? "/signup" : "/login"}>
          {isLogin ? "Sign up" : "Login"}
        </Link>
      </div>
    </div>
  );
}
