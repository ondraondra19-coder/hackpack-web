// lib/useCartSync.ts
// ─────────────────────────────────────────────────────────────────────────────
// Synchronizuje košík s rezervačním systémem:
// - při odebrání položky okamžitě uvolní rezervaci
// - při změně množství ověří dostupnost a případně ořeže
// ─────────────────────────────────────────────────────────────────────────────
"use client";

import { useCallback } from "react";
import { getSessionId } from "./session";

// Sestaví variantKey stejně jako ProduktClient a stock.ts
// variants = { Barva: "Černá", Model: "Apple Pencil Pro" } → "Černá|Apple Pencil Pro"
function buildVariantKey(slug: string, variants?: Record<string, string>): string {
  if (!variants || Object.keys(variants).length === 0) return "-|-";
  const values = Object.values(variants);
  if (values.length === 1) return `${values[0]}|-`;
  return `${values[0]}|${values[1]}`;
}

export function useCartSync() {
  /**
   * Zavolat při odebrání položky z košíku.
   * Okamžitě uvolní rezervaci na serveru (nemusí čekat na 20min TTL).
   */
  const releaseOnRemove = useCallback(async (
    slug: string,
    variants?: Record<string, string>,
  ) => {
    const sessionId = getSessionId();
    const variantKey = buildVariantKey(slug, variants);
    try {
      await fetch("/api/stock-availability", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug, variant: variantKey, sessionId, quantity: 0 }),
      });
    } catch {
      // tichý fail — rezervace expiruje sama po 20 minutách
    }
  }, []);

  /**
   * Zavolat při změně množství (+/-) v košíku.
   * Ověří dostupnost a vrátí maximální povolené množství.
   * Pokud server dovolí víc nebo stejně, vrátí požadované množství.
   */
  const checkAndSync = useCallback(async (
    slug: string,
    variants: Record<string, string> | undefined,
    newQuantity: number,
  ): Promise<number> => {
    const sessionId = getSessionId();
    const variantKey = buildVariantKey(slug, variants);
    try {
      const res = await fetch("/api/stock-availability", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug, variant: variantKey, sessionId, quantity: newQuantity }),
      });
      const json = await res.json();
      if (json.ok) return json.reservedQuantity ?? newQuantity;
      if (json.reason === "out_of_stock") return json.available ?? 0;
    } catch {}
    return newQuantity; // fallback — neblokuj uživatele při síťové chybě
  }, []);

  return { releaseOnRemove, checkAndSync };
}