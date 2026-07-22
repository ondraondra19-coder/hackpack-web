"use client";

import { useState } from "react";
import { ChevronDown, Mail, Phone } from "lucide-react";
import type { ClaimStatus, ClaimWithOrder } from "@/lib/claims";
import { CURRENCIES, formatPrice, type CurrencyCode } from "@/lib/currency";

type ClaimsAdminListProps = {
  claims: ClaimWithOrder[];
  onChange: (claims: ClaimWithOrder[]) => void;
};

// Stavy vrácení popisují CESTU zásilky, ať admin hned ví, co má přijít a co
// přišlo. Hodnoty enumu zůstávají (novy/vyrizuje_se/vyrizeno), mění se jen
// význam a popisky — žádná migrace uložených dat.
const STATUS_LABELS: Record<ClaimStatus, string> = {
  novy: "Čeká na zásilku",
  vyrizuje_se: "Zboží dorazilo",
  vyrizeno: "Vyřízeno",
};

function statusClasses(status: ClaimStatus): string {
  // Minimalisticky: neutrální šedá, vyřízené jen ztlumené.
  if (status === "vyrizeno") return "border-zinc-200 bg-white text-zinc-400";
  return "border-zinc-200 bg-zinc-50 text-zinc-600";
}

// Jaké přechody nabídnout u daného stavu (a jak je pojmenovat).
function nextActions(status: ClaimStatus): { to: ClaimStatus; label: string }[] {
  if (status === "novy")
    return [
      { to: "vyrizuje_se", label: "Zboží dorazilo" },
      { to: "vyrizeno", label: "Vyřídit (peníze vráceny)" },
    ];
  if (status === "vyrizuje_se")
    return [
      { to: "vyrizeno", label: "Vyřídit (peníze vráceny)" },
      { to: "novy", label: "Zpět na „čeká“" },
    ];
  return [{ to: "vyrizuje_se", label: "Znovu otevřít" }];
}

function money(total: number, currency: string): string {
  return formatPrice(total, CURRENCIES[currency as CurrencyCode] ?? CURRENCIES.CZK);
}

// Součet částek k vrácení, seskupený podle měny (obvykle jen CZK).
function refundTotals(claims: ClaimWithOrder[]): string {
  const byCurrency = new Map<string, number>();
  for (const c of claims) {
    if (!c.order) continue;
    byCurrency.set(c.order.currency, (byCurrency.get(c.order.currency) ?? 0) + c.order.total);
  }
  if (byCurrency.size === 0) return "—";
  return Array.from(byCurrency.entries())
    .map(([cur, sum]) => money(sum, cur))
    .join(" + ");
}

function ClaimCard({
  claim,
  busy,
  onSetStatus,
  onDelete,
}: {
  claim: ClaimWithOrder;
  busy: boolean;
  onSetStatus: (claim: ClaimWithOrder, status: ClaimStatus) => void;
  onDelete: (id: string) => void;
}) {
  const isDone = claim.status === "vyrizeno";

  return (
    <div className={`border rounded-xl p-4 transition-colors ${isDone ? "border-[#e5e7eb] bg-white" : "border-zinc-300 bg-[#fafafa]"}`}>
      <div className="flex justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
            <span className="text-xs font-mono font-bold text-primary-ink bg-primary/5 border border-primary/10 px-1.5 py-0.5 rounded">
              {claim.ticket}
            </span>
            <span className="text-sm font-semibold text-[#0f0f10]">{claim.jmeno}</span>
            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${statusClasses(claim.status)}`}>
              {STATUS_LABELS[claim.status]}
            </span>
            <span className="text-[11px] text-zinc-400">{new Date(claim.date).toLocaleString("cs-CZ")}</span>
          </div>

          {/* Co se vrací + kolik peněz vrátit (z napárované objednávky) */}
          <div className="rounded-lg border border-zinc-200 bg-white px-3 py-2 mb-2">
            <div className="flex items-center justify-between gap-3 flex-wrap">
              <span className="text-[11px] text-zinc-500">
                obj. <span className="font-mono text-zinc-700">{claim.cisloObjednavky}</span>
              </span>
              <span className="text-xs font-semibold text-[#0f0f10]">
                {claim.order ? `Vrátit ${money(claim.order.total, claim.order.currency)}` : "Objednávka nenalezena"}
              </span>
            </div>
            {claim.order && claim.order.items.length > 0 && (
              <p className="mt-1.5 text-[11px] text-zinc-600 leading-relaxed">
                <span className="text-zinc-400">Vrací se:</span>{" "}
                {claim.order.items.map((i) => `${i.quantity}× ${i.name}`).join(", ")}
              </p>
            )}
          </div>

          <div className="mb-2 text-[11px] text-zinc-500">
            účet <span className="font-mono text-zinc-600">{claim.cisloUctu}</span>
          </div>

          {claim.duvod && (
            <p className="text-xs text-zinc-600 leading-relaxed whitespace-pre-wrap mb-2">
              <span className="text-zinc-400">Důvod: </span>
              {claim.duvod}
            </p>
          )}

          <div className="flex items-center gap-3 flex-wrap">
            <a
              href={`mailto:${claim.email}?subject=${encodeURIComponent(`Vrácení ${claim.ticket} — Slingr`)}`}
              className="inline-flex items-center gap-1 text-[11px] text-zinc-400 hover:text-[#0f0f10] hover:underline"
            >
              <Mail size={11} /> {claim.email}
            </a>
            <a
              href={`tel:${claim.telefon.replace(/\s/g, "")}`}
              className="inline-flex items-center gap-1 text-[11px] text-zinc-400 hover:text-[#0f0f10] hover:underline"
            >
              <Phone size={11} /> {claim.telefon}
            </a>
          </div>
        </div>

        <div className="flex flex-col items-end gap-2 shrink-0">
          {nextActions(claim.status).map((a) => (
            <button
              key={a.to}
              onClick={() => onSetStatus(claim, a.to)}
              disabled={busy}
              className="text-xs font-semibold text-zinc-500 hover:text-[#0f0f10] disabled:opacity-50 whitespace-nowrap"
            >
              {a.label}
            </button>
          ))}
          <button
            onClick={() => onDelete(claim.id)}
            disabled={busy}
            className="text-xs font-semibold text-primary-ink hover:text-primary-ink/80 disabled:opacity-50"
          >
            {busy ? "Pracuji…" : "Smazat"}
          </button>
        </div>
      </div>
    </div>
  );
}

function SummaryTile({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-zinc-200 bg-white px-4 py-3">
      <p className="text-lg font-bold leading-none text-[#0f0f10]">{value}</p>
      <p className="text-[11px] text-zinc-500 mt-1">{label}</p>
    </div>
  );
}

export default function ClaimsAdminList({ claims, onChange }: ClaimsAdminListProps) {
  const [busyId, setBusyId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showDone, setShowDone] = useState(false);

  async function handleSetStatus(claim: ClaimWithOrder, status: ClaimStatus) {
    setBusyId(claim.id);
    setError(null);
    try {
      const res = await fetch("/api/admin/claims", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: claim.id, status }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? "Úprava se nezdařila.");
      }
      onChange(claims.map((c) => (c.id === claim.id ? { ...c, status } : c)));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Úprava se nezdařila.");
    } finally {
      setBusyId(null);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Opravdu smazat toto vrácení? Zákazník se na jeho číslo případu může odkazovat.")) return;

    setBusyId(id);
    setError(null);
    try {
      const res = await fetch(`/api/admin/claims?id=${encodeURIComponent(id)}`, { method: "DELETE" });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? "Smazání se nezdařilo.");
      }
      onChange(claims.filter((c) => c.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Smazání se nezdařilo.");
    } finally {
      setBusyId(null);
    }
  }

  if (claims.length === 0) {
    return <p className="text-sm text-zinc-500">Zatím žádná vrácení.</p>;
  }

  const waiting = claims.filter((c) => c.status === "novy");
  const arrived = claims.filter((c) => c.status === "vyrizuje_se");
  const done = claims.filter((c) => c.status === "vyrizeno");
  const openClaims = [...waiting, ...arrived];

  return (
    <div className="space-y-4">
      {error && <p className="text-sm text-primary-ink">{error}</p>}

      {/* Souhrn: co má přijít, co přišlo, kolik celkem vrátit */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <SummaryTile label="Čeká na zásilku (má přijít)" value={String(waiting.length)} />
        <SummaryTile label="Zboží dorazilo (k vrácení peněz)" value={String(arrived.length)} />
        <SummaryTile label="Celkem k vrácení (otevřené)" value={refundTotals(openClaims)} />
      </div>

      {/* Čeká na zásilku */}
      <section className="space-y-2">
        <h4 className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
          Čeká na zásilku
          <span className="text-zinc-400 font-normal normal-case"> ({waiting.length})</span>
        </h4>
        {waiting.length === 0 ? (
          <p className="text-xs text-zinc-400">Nic nečeká na doručení.</p>
        ) : (
          waiting.map((claim) => (
            <ClaimCard key={claim.id} claim={claim} busy={busyId === claim.id} onSetStatus={handleSetStatus} onDelete={handleDelete} />
          ))
        )}
      </section>

      {/* Zboží dorazilo */}
      <section className="space-y-2">
        <h4 className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
          Zboží dorazilo — vrátit peníze
          <span className="text-zinc-400 font-normal normal-case"> ({arrived.length})</span>
        </h4>
        {arrived.length === 0 ? (
          <p className="text-xs text-zinc-400">Žádná doručená zásilka nečeká na vyřízení.</p>
        ) : (
          arrived.map((claim) => (
            <ClaimCard key={claim.id} claim={claim} busy={busyId === claim.id} onSetStatus={handleSetStatus} onDelete={handleDelete} />
          ))
        )}
      </section>

      {/* Vyřízené */}
      {done.length > 0 && (
        <div className="pt-1">
          <button
            onClick={() => setShowDone((v) => !v)}
            className="w-full flex items-center justify-between gap-2 px-1 py-2 text-xs font-semibold text-zinc-500 hover:text-[#0f0f10] transition-colors"
          >
            <span>
              Vyřízená vrácení <span className="text-zinc-400 font-normal">({done.length})</span>
            </span>
            <ChevronDown size={15} className={`transition-transform duration-150 ${showDone ? "rotate-180" : ""}`} />
          </button>

          {showDone && (
            <div className="space-y-3 mt-1">
              {done.map((claim) => (
                <ClaimCard key={claim.id} claim={claim} busy={busyId === claim.id} onSetStatus={handleSetStatus} onDelete={handleDelete} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
