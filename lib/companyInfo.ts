// lib/companyInfo.ts
// ─────────────────────────────────────────────────────────────────────────────
// POZOR: údaje se teď píšou na jednom místě v `lib/udaje.ts`.
// Tenhle soubor zůstává jen kvůli zpětné kompatibilitě — obchodní podmínky
// a zásady ochrany údajů importují `COMPANY` a `companyField` odsud. Data
// bere z `UDAJE`, takže je uprav TAM, ne tady.
// ─────────────────────────────────────────────────────────────────────────────

import { UDAJE, adresaSidla, companyField } from "./udaje";

export type CompanyInfo = {
  /** Obchodní firma, např. "Slingr s.r.o." */
  name: string;
  /** IČO */
  companyId: string;
  /** DIČ — nepovinné, když firma není plátce DPH */
  vatId: string;
  /** Sídlo — ulice, č.p., PSČ, město */
  address: string;
  /** Spisová značka, např. "Městským soudem v Praze, oddíl C, vložka 12345" */
  registration: string;
  /** Adresa skladu pro vrácené zboží — může být jiná než sídlo */
  warehouseAddress: string;
  email: string;
  phone: string;
  /** Hranice pro dopravu zdarma v Kč; 0 = dopravu zdarma nenabízíme */
  freeShippingOverCZK: number;
};

export const COMPANY: CompanyInfo = {
  name: UDAJE.name,
  companyId: UDAJE.companyId,
  vatId: UDAJE.vatId,
  address: adresaSidla,
  registration: UDAJE.registration,
  warehouseAddress: UDAJE.warehouseAddress,
  email: UDAJE.email,
  phone: UDAJE.phone,
  freeShippingOverCZK: UDAJE.freeShippingOverCZK,
};

export { companyField };
