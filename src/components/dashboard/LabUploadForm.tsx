"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { FileUp, LoaderCircle } from "lucide-react";
import { useI18n } from "@/components/i18n/LanguageProvider";

export function LabUploadForm() {
  const { copy } = useI18n();
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function upload() {
    if (!file) return setMessage(copy.labs.chooseFirst);
    setBusy(true);
    setMessage(null);
    const form = new FormData();
    form.append("file", file);
    try {
      const response = await fetch("/api/labs/upload", { method: "POST", body: form });
      const body = await response.json();
      if (!response.ok) throw new Error(body.error ?? copy.labs.uploadFailed);
      setFile(null);
      if (inputRef.current) inputRef.current.value = "";
      setMessage(copy.labs.uploadSuccess);
      router.refresh();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : copy.labs.uploadFailed);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-4">
      <label className="block rounded-md border border-dashed border-emeraldx/40 bg-emeraldx/5 p-6 text-center">
        <FileUp className="mx-auto h-7 w-7 text-emeraldx" />
        <span className="mt-3 block text-sm text-white">{file?.name ?? copy.labs.choosePrompt}</span>
        <span className="mt-1 block text-xs text-chrome">{copy.labs.formatHelp}</span>
        <input ref={inputRef} type="file" accept=".pdf,.jpg,.jpeg,.png,application/pdf,image/jpeg,image/png" className="sr-only" onChange={(event) => setFile(event.target.files?.[0] ?? null)} />
      </label>
      <button onClick={upload} disabled={!file || busy} className="inline-flex min-h-11 items-center gap-2 rounded-md bg-emeraldx px-4 py-2 text-sm font-semibold text-obsidian disabled:cursor-not-allowed disabled:opacity-50">
        {busy ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <FileUp className="h-4 w-4" />}
        {busy ? copy.labs.extracting : copy.labs.uploadAnalyze}
      </button>
      {message && <p className="text-sm text-chrome" role="status">{message}</p>}
    </div>
  );
}
