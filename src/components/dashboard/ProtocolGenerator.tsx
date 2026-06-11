"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import type { ProtocolIntensity } from "@/types/database";

export function ProtocolGenerator() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [intensity, setIntensity] = useState<ProtocolIntensity>("Beginner");

  async function generate() {
    setLoading(true);
    setError("");
    setSuccess("");
    const response = await fetch("/api/protocol", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ intensity })
    });
    const data = await response.json();
    setLoading(false);
    if (!response.ok) return setError(data.error ?? "Unable to generate protocol.");
    setSuccess(`${data.protocol?.title ?? "Protocol"} generated.`);
    router.refresh();
  }

  return (
    <div className="space-y-3">
      <div className="flex rounded-md border border-white/10 bg-black/30 p-1">
        {(["Beginner", "Intermediate", "Advanced"] as ProtocolIntensity[]).map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => setIntensity(option)}
            className={`rounded px-3 py-2 text-xs font-semibold transition ${intensity === option ? "bg-emeraldx text-obsidian" : "text-chrome hover:bg-white/10"}`}
          >
            {option}
          </button>
        ))}
      </div>
      <Button onClick={generate} disabled={loading}>{loading ? "Generating..." : "Generate Protocol"}</Button>
      {error && <p className="mt-3 text-sm text-red-300">{error}</p>}
      {success && <p className="mt-3 text-sm text-emeraldx">{success}</p>}
    </div>
  );
}
