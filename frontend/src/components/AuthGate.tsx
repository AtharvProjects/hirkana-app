"use client";

import { useState } from "react";
import { api } from "@/lib/api";

export function AuthGate({ onDone }: { onDone: () => void }) {
  const [isLogin, setIsLogin] = useState(false);
  const [name, setName] = useState("Aarohi");
  const [email, setEmail] = useState("aarohi@example.com");
  const [password, setPassword] = useState("Password123!");
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    setLoading(true);
    try {
      const data = isLogin
        ? await api.login({ email, password })
        : await api.signup({ name, email, password });
      localStorage.setItem("hirkani_token", data.access_token);
      onDone();
    } catch (e) {
      alert((e as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass-card p-4 space-y-2">
      <div className="text-sm font-semibold">{isLogin ? "Sign in" : "Create account"}</div>
      {!isLogin ? <input className="h-11 w-full rounded-pill bg-white/45 px-3" value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" /> : null}
      <input className="h-11 w-full rounded-pill bg-white/45 px-3" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
      <input className="h-11 w-full rounded-pill bg-white/45 px-3" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" />
      <button disabled={loading} className="h-11 w-full rounded-pill bg-gradient-to-r from-[#e37f2f] to-[#f1a965] text-white" onClick={submit}>{loading ? "Please wait..." : isLogin ? "Login" : "Sign up"}</button>
      <button className="h-10 w-full rounded-pill bg-white/45" onClick={() => setIsLogin((v) => !v)}>{isLogin ? "Need account? Sign up" : "Have account? Login"}</button>
    </div>
  );
}
