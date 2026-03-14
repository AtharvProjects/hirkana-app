const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

export type SafetyClass = "SAFE" | "CONSUME_WITH_CAUTION" | "AVOID_DURING_PREGNANCY";

export interface ScanResult {
  id: number;
  detected_food: string;
  classification: SafetyClass;
  explanation: string;
  nutrient_insights: { name: string; benefit: string }[];
  references: { title: string; url: string }[];
  alternatives: string[];
  rule_hits: { key: string; severity: string; message: string }[];
  created_at: string;
}

function authHeaders(): Record<string, string> {
  const token = typeof window !== "undefined" ? localStorage.getItem("hirkani_token") : null;
  return token ? { Authorization: `Bearer ${token}` } : {};
}

function buildHeaders(extra?: HeadersInit, includeJson = true): Headers {
  const headers = new Headers(extra);
  if (includeJson) headers.set("Content-Type", "application/json");
  for (const [k, v] of Object.entries(authHeaders())) headers.set(k, v);
  return headers;
}

async function req<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    ...init,
    headers: buildHeaders(init?.headers, true)
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `Request failed (${res.status})`);
  }
  return res.json() as Promise<T>;
}

export const api = {
  signup: (body: { name: string; email: string; password: string }) => req<{ access_token: string }>("/auth/signup", { method: "POST", body: JSON.stringify(body) }),
  login: (body: { email: string; password: string }) => req<{ access_token: string }>("/auth/login", { method: "POST", body: JSON.stringify(body) }),
  saveProfile: (body: unknown) => req("/profile", { method: "PUT", body: JSON.stringify(body) }),
  getProfile: () => req("/profile"),
  analyzeBarcode: (payload: string) => req<ScanResult>("/scan/analyze", { method: "POST", body: JSON.stringify({ scan_type: "barcode", payload }) }),
  analyzeText: (scan_type: "ocr" | "image", payload: string) => req<ScanResult>("/scan/analyze", { method: "POST", body: JSON.stringify({ scan_type, payload }) }),
  uploadImage: async (file: File) => {
    const form = new FormData();
    form.append("file", file);
    const res = await fetch(`${API_URL}/scan/upload`, {
      method: "POST",
      headers: buildHeaders(undefined, false),
      body: form
    });
    if (!res.ok) throw new Error(await res.text());
    return (await res.json()) as ScanResult;
  },
  history: () => req("/scan/history"),
  tips: () => req<{ trimester: number; tips: string[] }>("/tips"),
  favorites: () => req("/favorites"),
  addFavorite: (food_name: string, last_classification: string) => req("/favorites", { method: "POST", body: JSON.stringify({ food_name, last_classification }) })
};
