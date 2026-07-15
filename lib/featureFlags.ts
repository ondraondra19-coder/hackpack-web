// lib/featureFlags.ts
// Bankovní převod je dočasně vypnutý V PRODUKCI, dokud není hotová právně
// korektní účtenka (chybí IČO — viz sellerBlock() v lib/email.ts) — nechceme
// posílat reálným zákazníkům "přehled objednávky", co by měl být doklad, ale
// není. V lokálním vývoji (npm run dev, NODE_ENV=development) zůstává vždy
// zapnutý, ať se dá dodělávat a testovat naplno.
//
// Zpátky zapnout v produkci: nastavit NEXT_PUBLIC_ENABLE_BANK_TRANSFER=true
// na Vercelu a redeploy — není potřeba měnit kód.
export function isBankTransferEnabled(): boolean {
  if (process.env.NODE_ENV === "development") return true;
  return process.env.NEXT_PUBLIC_ENABLE_BANK_TRANSFER === "true";
}
