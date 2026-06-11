"use client";

import { Send } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import type { ChatMessage } from "@/types/database";
import { useI18n } from "@/components/i18n/LanguageProvider";

export function CoachChat({ initialMessages }: { initialMessages: ChatMessage[] }) {
  const { copy } = useI18n();
  const [messages, setMessages] = useState(initialMessages);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function sendMessage(question: string) {
    if (!question.trim() || loading) return;
    const messageText = question.trim();
    setMessages((current) => [...current, { role: "user", content: messageText }]);
    setInput("");
    setLoading(true);
    setError("");
    const response = await fetch("/api/coach", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: messageText })
    });
    const data = await response.json();
    setLoading(false);
    if (data.reply) {
      setMessages((current) => [...current, { role: "assistant", content: data.reply }]);
    }
    if (!response.ok) {
      setError(data.error ?? copy.coach.unavailable);
      return;
    }
  }

  async function send(event: React.FormEvent) {
    event.preventDefault();
    await sendMessage(input);
  }

  async function runContextTest() {
    await sendMessage(copy.coach.testPrompt);
  }

  return (
    <Card className="flex min-h-[72vh] flex-col">
      <div>
        <h2 className="text-xl font-semibold text-white">{copy.coach.title}</h2>
        <p className="mt-2 text-sm text-chrome">{copy.coach.description}</p>
        <button
          type="button"
          onClick={runContextTest}
          disabled={loading}
          className="mt-4 rounded-md border border-emeraldx/30 px-3 py-2 text-sm text-emeraldx transition hover:bg-emeraldx/10 disabled:cursor-not-allowed disabled:opacity-55"
        >
          {copy.coach.test}
        </button>
      </div>
      <div className="mt-6 flex-1 space-y-3 overflow-y-auto">
        {messages.map((message, index) => (
          <div key={`${message.created_at ?? index}-${message.role}`} className={message.role === "user" ? "text-right" : ""}>
            <div className={`inline-block max-w-[86%] whitespace-pre-wrap rounded-lg p-4 text-sm leading-6 ${message.role === "user" ? "bg-emeraldx text-obsidian" : "bg-white/7 text-chrome"}`}>
              {message.content}
            </div>
          </div>
        ))}
        {!messages.length && <p className="rounded-md bg-white/5 p-4 text-sm text-chrome">{copy.coach.empty}</p>}
        {loading && <p className="text-sm text-emeraldx">{copy.coach.analyzing}</p>}
        {error && <p className="text-sm text-red-300">{error}</p>}
      </div>
      <form onSubmit={send} className="mt-5 flex gap-3">
        <input className="field" placeholder={copy.coach.placeholder} value={input} onChange={(e) => setInput(e.target.value)} />
        <Button disabled={loading} aria-label={copy.coach.send}><Send className="h-4 w-4" /></Button>
      </form>
    </Card>
  );
}
