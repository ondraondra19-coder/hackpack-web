// lib/shipping/zasilkovna.ts
// Packeta / Zásilkovna — vytvoření zásilky (createPacket) po objednávce.
// Jediný nabízený dopravce — pokrývá jak výdejní místa (Z-BOX/Z-Point,
// order.zboxId nastaven), tak doručení kurýrem na adresu (order.zboxId je null).
//
// TODO až budou API přístupy hotové (registrace na
// https://client.packeta.com/cs/registration/choose-type, schválení do ~3 dnů):
// 1. Doplnit PACKETA_API_PASSWORD do .env.local (API heslo z admin sekce Packeta,
//    NE totéž co NEXT_PUBLIC_PACKETA_API_KEY, který je jen pro widget výdejních míst).
// 2. Ověřit přesný formát requestu podle aktuální dokumentace na docs.packeta.com
//    — pro výdejní místo se posílá addressId (id Z-BOXu/pobočky), pro doručení
//    na adresu se místo toho posílá plná adresa (viz "Home delivery" v docs).
//    Pole typicky: number, name, surname, email, value, currency, cod, weight, eshop.
// Bez ověřených přístupů nejde formát requestu otestovat, proto zatím jen
// jasná chyba místo tichého (a možná špatného) volání API.

import type { Order } from "@/lib/orders";
import type { ShippingProvider, ShipmentResult } from "./types";
import { ShippingProviderNotConfiguredError } from "./types";

export const zasilkovnaProvider: ShippingProvider = {
  id: "zasilkovna",
  async createShipment(_order: Order): Promise<ShipmentResult> {
    const apiPassword = process.env.PACKETA_API_PASSWORD;
    if (!apiPassword) {
      throw new ShippingProviderNotConfiguredError("zasilkovna", ["PACKETA_API_PASSWORD"]);
    }
    throw new Error(
      "Vytvoření zásilky přes Packeta API zatím není implementováno — je potřeba ověřit " +
      "přesný formát requestu proti docs.packeta.com, jakmile bude k dispozici testovací účet."
    );
  },
};
