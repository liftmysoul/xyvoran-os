"use client";

import { BrainCircuit, CircleUserRound, Dna, FlaskConical, Send, Sparkles, WandSparkles } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import type { ChatMessage } from "@/types/database";
import { useI18n } from "@/components/i18n/LanguageProvider";
import { SystemStatus } from "@/components/dashboard/SystemStatus";

export function CoachChat({ initialMessages, contextSources }: { initialMessages: ChatMessage[]; contextSources: { profile: boolean; biomarkers: boolean; labs: boolean; protocols: boolean } }) {
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

  const sources = [
    [copy.coach.profileContext, contextSources.profile, CircleUserRound],
    [copy.coach.biomarkerContext, contextSources.biomarkers, Dna],
    [copy.coach.labContext, contextSources.labs, FlaskConical],
    [copy.coach.protocolContext, contextSources.protocols, WandSparkles]
  ] as const;
  const missionPrompts = [copy.coach.sleepMission, copy.coach.recoveryMission, copy.coach.metabolicMission];

  return (
    <div className="grid min-h-[76vh] gap-4 xl:grid-cols-[280px_1fr]">
      <Card className="p-0">
        <div className="border-b border-signal/10 p-5">
          <p className="system-label">{copy.coach.coreStatus}</p>
          <div className="mt-3 flex items-center justify-between gap-3"><BrainCircuit className="h-7 w-7 text-violet-300" /><SystemStatus label={copy.dashboard.online} tone="intelligence" /></div>
        </div>
        <div className="p-5">
          <p className="text-[10px] font-semibold uppercase text-muted">{copy.coach.contextSources}</p>
          <div className="mt-3 grid grid-cols-2 gap-2 xl:grid-cols-1">
            {sources.map(([label, connected, Icon]) => <div key={label} className="command-surface flex min-w-0 items-center justify-between gap-2 rounded-sm p-3"><span className="flex min-w-0 items-center gap-2 text-xs text-chrome"><Icon className="h-3.5 w-3.5 shrink-0 text-signal" /><span className="truncate">{label}</span></span><span className={`h-1.5 w-1.5 shrink-0 rounded-full ${connected ? "bg-successx shadow-[0_0_8px_rgba(0,230,118,0.8)]" : "bg-warningx"}`} /></div>)}
          </div>
          <p className="mt-6 text-[10px] font-semibold uppercase text-muted">{copy.coach.missionPrompts}</p>
          <div className="mt-3 space-y-2">
            {missionPrompts.map((prompt) => <button key={prompt} type="button" onClick={() => sendMessage(prompt)} disabled={loading} className="w-full rounded-sm border border-signal/10 bg-white/[0.025] p-3 text-left text-xs leading-5 text-chrome transition hover:border-emeraldx/25 hover:text-white disabled:opacity-50">{prompt}</button>)}
          </div>
        </div>
      </Card>

      <Card className="flex min-h-[72vh] flex-col border-signal/15 p-0">
        <div className="border-b border-signal/10 p-5 md:p-6">
          <div className="flex items-start justify-between gap-4"><div><p className="system-label flex items-center gap-2"><span className="status-dot signal-pulse" />{copy.landing.coachSystem}</p><h2 className="mt-3 text-2xl font-semibold text-white">{copy.coach.title}</h2></div><span className="grid h-11 w-11 place-items-center rounded-md border border-violetx/25 bg-violetx/[0.08]"><BrainCircuit className="h-5 w-5 text-violet-200" /></span></div>
          <p className="mt-2 text-sm text-chrome">{copy.coach.description}</p>
          <button type="button" onClick={runContextTest} disabled={loading} className="mt-4 inline-flex items-center gap-2 rounded-md border border-emeraldx/25 bg-emeraldx/[0.04] px-3 py-2 text-sm text-emeraldx transition hover:bg-emeraldx/10 disabled:cursor-not-allowed disabled:opacity-55"><Sparkles className="h-4 w-4" />{copy.coach.test}</button>
        </div>
        <div className="scanline flex-1 space-y-4 overflow-y-auto p-5 md:p-6">
        {messages.map((message, index) => (
          <div key={`${message.created_at ?? index}-${message.role}`} className={message.role === "user" ? "text-right" : ""}>
            <div className={`inline-block max-w-[86%] whitespace-pre-wrap rounded-md border p-4 text-sm leading-6 ${message.role === "user" ? "border-emeraldx bg-emeraldx text-obsidian" : "border-signal/10 bg-graphite/90 text-chrome"}`}>
              {message.content}
            </div>
          </div>
        ))}
        {!messages.length && <p className="rounded-md bg-white/5 p-4 text-sm text-chrome">{copy.coach.empty}</p>}
        {loading && <p className="text-sm text-emeraldx">{copy.coach.analyzing}</p>}
        {error && <p className="text-sm text-red-300">{error}</p>}
        </div>
        <form onSubmit={send} className="flex gap-3 border-t border-signal/10 bg-graphite/65 p-4 md:p-5">
          <input className="field" placeholder={copy.coach.placeholder} value={input} onChange={(e) => setInput(e.target.value)} />
          <Button disabled={loading} aria-label={copy.coach.send}><Send className="h-4 w-4" /></Button>
        </form>
      </Card>
    </div>
  );
}
