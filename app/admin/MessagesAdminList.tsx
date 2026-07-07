"use client";

import { useState } from "react";
import type { Message } from "@/lib/messages";

type MessagesAdminListProps = {
  messages: Message[];
  onChange: (messages: Message[]) => void;
};

export default function MessagesAdminList({ messages, onChange }: MessagesAdminListProps) {
  const [busyId, setBusyId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleToggleRead(msg: Message) {
    setBusyId(msg.id);
    setError(null);
    try {
      const res = await fetch("/api/admin/messages", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: msg.id, read: !msg.read }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? "Úprava se nezdařila.");
      }
      onChange(messages.map((m) => (m.id === msg.id ? { ...m, read: !msg.read } : m)));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Úprava se nezdařila.");
    } finally {
      setBusyId(null);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Opravdu smazat tuto zprávu?")) return;

    setBusyId(id);
    setError(null);
    try {
      const res = await fetch(`/api/admin/messages?id=${encodeURIComponent(id)}`, { method: "DELETE" });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? "Smazání se nezdařilo.");
      }
      onChange(messages.filter((m) => m.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Smazání se nezdařilo.");
    } finally {
      setBusyId(null);
    }
  }

  if (messages.length === 0) {
    return <p className="text-sm text-zinc-500">Zatím žádné zprávy.</p>;
  }

  return (
    <div className="space-y-3">
      {error && <p className="text-sm text-primary">{error}</p>}

      {messages.map((msg) => (
        <div
          key={msg.id}
          className={`border rounded-xl p-4 flex justify-between gap-4 transition-colors ${
            msg.read ? "border-[#e5e7eb] bg-white" : "border-zinc-300 bg-[#fafafa]"
          }`}
        >
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              {!msg.read && <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />}
              <span className="text-sm font-semibold text-[#0f0f10]">{msg.name}</span>
              <span className="text-[11px] text-zinc-400">
                {new Date(msg.date).toLocaleString("cs-CZ")}
              </span>
            </div>

            <p className="text-xs text-zinc-600 leading-relaxed whitespace-pre-wrap mb-2">
              {msg.text}
            </p>

            <a href={`mailto:${msg.email}`} className="text-[11px] text-zinc-400 hover:text-[#0f0f10] hover:underline">
              {msg.email}
            </a>
          </div>

          <div className="flex flex-col items-end gap-2 shrink-0">
            <button
              onClick={() => handleToggleRead(msg)}
              disabled={busyId === msg.id}
              className="text-xs font-semibold text-zinc-500 hover:text-[#0f0f10] disabled:opacity-50"
            >
              {msg.read ? "Označit jako nepřečtené" : "Označit jako přečtené"}
            </button>
            <button
              onClick={() => handleDelete(msg.id)}
              disabled={busyId === msg.id}
              className="text-xs font-semibold text-primary hover:text-primary/80 disabled:opacity-50"
            >
              {busyId === msg.id ? "Pracuji…" : "Smazat"}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}