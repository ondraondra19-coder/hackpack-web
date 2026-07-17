// app/api/stock/notify/route.ts
// Veřejný endpoint — "Připomenout, až bude skladem" z detailu produktu.
// Uloží zájemce (viz lib/stockWatch.ts); mail odejde automaticky až při
// naskladnění, které rozpozná lib/stock.ts.
//
// Chyby vrací `code`, ne hotovou větu: text se skládá až na klientovi podle
// zvoleného jazyka (messages/*.json → namespace `product`). Stejný vzor jako
// /api/newsletter a /api/messages.
import { NextResponse } from "next/server";
import { addWatcher, isValidWatchEmail } from "@/lib/stockWatch";
import { getProductBySlug } from "@/lib/products";
import { checkRateLimit } from "@/lib/rateLimit";
import { getClientIp } from "@/lib/clientIp";

export type StockNotifyErrorCode =
  | "invalid_email"
  | "invalid_product"
  | "rate_limited"
  | "failed";

// Klíč varianty ve tvaru "color|size" — přesně jak ho počítá ProduktClient
// (stockKeys) a jak ho skládá lib/stock.ts (makeKey). Pouštíme dál jen tenhle
// tvar, ať si nikdo nezaregistruje hlídání na vymyšlené pole.
const STOCK_KEY_REGEX = /^[^|]+\|[^|]+$/;
const MAX_KEYS = 2; // vrstvené barvy = tělo + hlavička, víc jich nikdy není

function fail(code: StockNotifyErrorCode, error: string, status: number) {
  return NextResponse.json({ code, error }, { status });
}

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => null);
    const { email, slug, stockKeys } = body ?? {};

    if (!isValidWatchEmail(email)) {
      return fail("invalid_email", "Zadejte platný e-mail.", 400);
    }

    // Produkt ověřujeme proti katalogu — jméno do e-mailu si pak bereme odtud,
    // ne z požadavku, takže do mailu nejde propašovat cizí text.
    if (typeof slug !== "string" || !getProductBySlug(slug)) {
      return fail("invalid_product", "Neznámý produkt.", 400);
    }

    const keys: unknown[] = Array.isArray(stockKeys) ? stockKeys : [stockKeys];
    if (
      keys.length === 0 ||
      keys.length > MAX_KEYS ||
      !keys.every((k) => typeof k === "string" && STOCK_KEY_REGEX.test(k))
    ) {
      return fail("invalid_product", "Neplatná varianta.", 400);
    }

    // 10 hlídání z jedné IP za hodinu — pokrývá i člověka, který si proklikne
    // několik vyprodaných variant, ale zastaví skript.
    const ip = getClientIp(req);
    if (!(await checkRateLimit(`stocknotify:${ip}`, 10, 3600))) {
      return fail("rate_limited", "Příliš mnoho pokusů. Zkuste to prosím později.", 429);
    }

    await addWatcher({
      email,
      slug,
      fields: (keys as string[]).map((k) => `${slug}|${k}`),
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Stock notify POST error:", err);
    return fail("failed", "Uložení se nezdařilo.", 500);
  }
}
