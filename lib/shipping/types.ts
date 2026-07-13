// lib/shipping/types.ts
// Společné rozhraní pro vytvoření zásilky u libovolného dopravce.
// Každý provider (Zásilkovna, PPL, DPD) implementuje createShipment —
// admin API route (app/api/admin/orders/[id]/shipment/route.ts) volá
// providera podle order.shippingProviderId, aniž by věděl o rozdílech
// mezi jejich API.

import type { Order, ShippingProviderId } from "@/lib/orders";

export type ShipmentResult = {
  carrierShipmentId: string;
  trackingNumber: string;
  labelUrl?: string;
};

export interface ShippingProvider {
  id: ShippingProviderId;
  /** Vytvoří zásilku u dopravce a vrátí tracking číslo + odkaz na štítek. */
  createShipment(order: Order): Promise<ShipmentResult>;
}

/** Vyhozeno, když pro daného dopravce chybí API přístupy v env proměnných. */
export class ShippingProviderNotConfiguredError extends Error {
  constructor(providerId: ShippingProviderId, missing: string[]) {
    super(`Dopravce "${providerId}" není nakonfigurován — chybí: ${missing.join(", ")}`);
    this.name = "ShippingProviderNotConfiguredError";
  }
}
