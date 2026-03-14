"use client";

import { api } from "@/lib/api";

export type MobileState = {
  authed: boolean;
  profileDone: boolean;
};

export async function getMobileState(): Promise<MobileState> {
  const token = localStorage.getItem("hirkani_token");
  if (!token) return { authed: false, profileDone: false };

  try {
    const profile = await api.getProfile();
    return { authed: true, profileDone: Boolean(profile) };
  } catch {
    return { authed: false, profileDone: false };
  }
}
