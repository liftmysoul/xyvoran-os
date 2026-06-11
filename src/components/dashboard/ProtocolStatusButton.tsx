"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/Button";

export function ProtocolStatusButton({ id, status }: { id?: string; status?: string | null }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function complete() {
    if (!id) return;
    setLoading(true);
    setError("");
    const response = await fetch("/api/protocol/status", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status: "completed" })
    });
    const data = await response.json();
    setLoading(false);
    if (!response.ok) {
      setError(data.error ?? "Unable to update protocol status.");
      return;
    }
    router.refresh();
  }

  if (status === "completed") {
    return <span className="rounded-md border border-emeraldx/30 px-3 py-2 text-sm text-emeraldx">Completed</span>;
  }

  return (
    <div>
      <Button onClick={complete} disabled={loading || !id} className="bg-white/10 text-white hover:bg-white/15">
        {loading ? "Updating..." : "Mark Completed"}
      </Button>
      {error && <p className="mt-2 max-w-xs text-sm text-red-300">{error}</p>}
    </div>
  );
}
