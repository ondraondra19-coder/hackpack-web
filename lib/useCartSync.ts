// lib/useCartSync.ts
"use client";

import { useCallback } from "react";
import { getSessionId } from "./session";

export function useCartSync() {
  /**
   * Zavolat při odebrání položky z košíku.
   * reservationKey = přesný klíč uložený v CartItem.reservationKey
   * Pokud není k dispozici, tichý fail (rezervace expiruje sama po 20 min).
   */
  const releaseOnRemove = useCallback(async (
    slug: string,
    reservationKey?: string,
  ) => {
    if (!reservationKey) return; // starý item bez klíče — necháme expirovat
    const sessionId = getSessionId();
    try {
      await fetch("/api/stock-availability", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          slug,
          variant: reservationKey,
          sessionId,
          quantity: 0, // 0 = smaž rezervaci
        }),
      });
    } catch {}
  }, []);

  /**
   * Zavolat při změně množství v košíku (+/-).
   * Vrátí skutečně přidělené množství ze serveru.
   */
  const checkAndSync = useCallback(async (
    slug: string,
    reservationKey: string,
    newQuantity: number,
  ): Promise<number> => {
    const sessionId = getSessionId();
    try {
      const res = await fetch("/api/stock-availability", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          slug,
          variant: reservationKey,
          sessionId,
          quantity: newQuantity,
        }),
      });
      const json = await res.json();
      if (json.ok) return json.reservedQuantity ?? newQuantity;
      if (json.reason === "out_of_stock") return 0;
    } catch {}
    return newQuantity; // fallback při síťové chybě
  }, []);

  return { releaseOnRemove, checkAndSync };
}