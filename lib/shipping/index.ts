// lib/shipping/index.ts
import type { ShippingProviderId } from "@/lib/orders";
import type { ShippingProvider } from "./types";
import { zasilkovnaProvider } from "./zasilkovna";

export { ShippingProviderNotConfiguredError } from "./types";
export type { ShipmentResult } from "./types";

const PROVIDERS: Record<ShippingProviderId, ShippingProvider> = {
  zasilkovna: zasilkovnaProvider,
};

export function getShippingProvider(id: ShippingProviderId): ShippingProvider {
  return PROVIDERS[id];
}
