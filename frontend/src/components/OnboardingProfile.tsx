"use client";

import { useState } from "react";
import { api } from "@/lib/api";

export function OnboardingProfile({ onDone }: { onDone: () => void }) {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    age: 29,
    pregnancy_week: 18,
    diet_preference: "veg",
    allergies: "",
    medical_conditions: "",
    doctor_restrictions: ""
  });

  const submit = async () => {
    setLoading(true);
    try {
      await api.saveProfile({
        age: form.age,
        pregnancy_week: form.pregnancy_week,
        diet_preference: form.diet_preference,
        allergies: form.allergies ? form.allergies.split(",").map((x) => x.trim()) : [],
        medical_conditions: form.medical_conditions ? form.medical_conditions.split(",").map((x) => x.trim()) : [],
        doctor_restrictions: form.doctor_restrictions
      });
      onDone();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass-card p-4 space-y-2">
      <div className="text-sm font-semibold">Pregnancy Profile</div>
      <input className="h-11 w-full rounded-pill bg-white/45 px-3" type="number" value={form.age} onChange={(e) => setForm({ ...form, age: Number(e.target.value) })} placeholder="Age" />
      <input className="h-11 w-full rounded-pill bg-white/45 px-3" type="number" value={form.pregnancy_week} onChange={(e) => setForm({ ...form, pregnancy_week: Number(e.target.value) })} placeholder="Pregnancy week" />
      <select className="h-11 w-full rounded-pill bg-white/45 px-3" value={form.diet_preference} onChange={(e) => setForm({ ...form, diet_preference: e.target.value })}>
        <option value="veg">Veg</option>
        <option value="non veg">Non Veg</option>
        <option value="vegan">Vegan</option>
      </select>
      <input className="h-11 w-full rounded-pill bg-white/45 px-3" value={form.allergies} onChange={(e) => setForm({ ...form, allergies: e.target.value })} placeholder="Allergies (comma separated)" />
      <input className="h-11 w-full rounded-pill bg-white/45 px-3" value={form.medical_conditions} onChange={(e) => setForm({ ...form, medical_conditions: e.target.value })} placeholder="Conditions (diabetes, anemia...)" />
      <input className="h-11 w-full rounded-pill bg-white/45 px-3" value={form.doctor_restrictions} onChange={(e) => setForm({ ...form, doctor_restrictions: e.target.value })} placeholder="Doctor restrictions" />
      <button disabled={loading} className="h-11 w-full rounded-pill bg-gradient-to-r from-[#e37f2f] to-[#f1a965] text-white" onClick={submit}>{loading ? "Saving..." : "Save Profile"}</button>
    </div>
  );
}
