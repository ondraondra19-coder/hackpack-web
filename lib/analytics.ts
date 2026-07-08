// lib/analytics.ts
// Statistiky e-shopu uložené v Upstash Redis.
//
// Rozdělení do dvou nezávislých částí:
//  1) NÁVŠTĚVNOST — sbírá se JEN se souhlasem "Analytické cookies" a JEN
//     JEDNOU ZA CELOU NÁVŠTĚVU (relaci prohlížeče), ne při každém
//     překliknutí na jinou stránku. Klient (AnalyticsTracker) si sám
//     hlídá přes sessionStorage, že za danou návštěvu pošle beacon max.
//     jednou — díky tomu tu NEPOTŘEBUJEME HyperLogLog na odhad unikátů,
//     protože 1 návštěva = 1 záznam už z definice.
//
//  2) OBCHOD (tržby, objednávky, nejprodávanější produkty)
//     — nezávisí na cookie souhlasu, jde o transakční data nutná
//       ke zpracování objednávky (zapisuje se z webhooku Stripe).
//
// ── Poznámka k úspoře Upstash příkazů ────────────────────────────────────
// Upstash účtuje KAŽDÝ příkaz zvlášť a free tier má strop 500 000/měsíc.
// Proto:
//   - denní čítače (návštěvy, objednávky, tržby) žijí v JEDNOM hash klíči
//     na metriku, kde pole hashe = datum → čtení celého rozsahu je 1 příkaz
//   - žebříčky (zdroje, zařízení, vstupní stránky, produkty) se počítají
//     jako running total "od spuštění sledování", ne přepočítávané
//     přes rozsah dní při každém načtení
// Výsledek: zápis = 4 příkazy JEDNOU za celou návštěvu (ne za každý klik),
// čtení admin přehledu = ~10 příkazů bez ohledu na zvolený rozsah dní.

import { getRedis } from "./redis";

const CURRENCIES = ["CZK", "EUR", "USD"] as const;
type Currency = (typeof CURRENCIES)[number];

// ── Pomocné funkce ──────────────────────────────────────────────────────────

function todayKey(d: Date = new Date()): string {
  return d.toISOString().slice(0, 10); // YYYY-MM-DD (UTC)
}

function lastNDays(n: number): string[] {
  const days: string[] = [];
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date();
    d.setUTCDate(d.getUTCDate() - i);
    days.push(todayKey(d));
  }
  return days;
}

/** Zredukuje User-Agent na kategorii zařízení pro graf. */
export function deviceCategory(ua: string | undefined): "Mobil" | "Tablet" | "Desktop" {
  if (!ua) return "Desktop";
  if (/iPad|Tablet/i.test(ua)) return "Tablet";
  if (/iPhone|Android|Mobile/i.test(ua)) return "Mobil";
  return "Desktop";
}

/** Vytáhne "hezkou" doménu z referrer URL, nebo null pro přímou návštěvu. */
export function referrerDomain(referrer: string | undefined, ownHost: string): string | null {
  if (!referrer) return null;
  try {
    const url = new URL(referrer);
    if (url.hostname === ownHost) return null; // interní navigace se nepočítá
    return url.hostname.replace(/^www\./, "");
  } catch {
    return null;
  }
}

function sumRange(hash: Record<string, string> | null, days: string[]): number {
  if (!hash) return 0;
  return days.reduce((sum, day) => sum + (Number(hash[day]) || 0), 0);
}

// ── 1) NÁVŠTĚVNOST — zápis ──────────────────────────────────────────────────
// 4 Redis příkazy, JEDNOU za celou návštěvu (ne za každou zobrazenou stránku).

export type TrackVisitInput = {
  landingPath: string;
  device: "Mobil" | "Tablet" | "Desktop";
  referrerHost: string | null;
};

export async function trackVisit(input: TrackVisitInput): Promise<void> {
  const redis = getRedis();
  const day = todayKey();

  const pipeline = redis.pipeline();
  pipeline.hincrby("analytics:visits:total", day, 1);
  pipeline.hincrby("analytics:visits:landing", input.landingPath, 1);
  pipeline.hincrby("analytics:visits:device", input.device, 1);
  pipeline.hincrby("analytics:visits:ref", input.referrerHost ?? "Přímá návštěva", 1);

  await pipeline.exec();
}

// ── 2) OBCHOD — zápis (voláno z webhooku Stripe) ────────────────────────────
// 2 příkazy na objednávku + 2 na každou položku v ní.

export type TrackOrderInput = {
  currency: string; // "CZK" | "EUR" | "USD" ...
  amountTotal: number; // v hlavních jednotkách (ne v haléřích/centech)
  items: { slug: string; name: string; quantity: number }[];
};

export async function trackOrder(input: TrackOrderInput): Promise<void> {
  const redis = getRedis();
  const day = todayKey();
  const currency = input.currency.toUpperCase();

  const pipeline = redis.pipeline();
  pipeline.hincrby("analytics:orders:count", day, 1);
  pipeline.hincrbyfloat(`analytics:orders:revenue:${currency}`, day, input.amountTotal);

  for (const item of input.items) {
    pipeline.hincrby("analytics:products:alltime", item.slug, item.quantity);
    pipeline.hset("analytics:products:names", { [item.slug]: item.name });
  }

  await pipeline.exec();
}

// ── Čtení pro admin panel ───────────────────────────────────────────────────

export type AnalyticsSummary = {
  rangeDays: number;
  visits: { date: string; count: number }[];
  topLandingPages: { path: string; count: number }[];
  topReferrers: { host: string; count: number }[];
  devices: { device: string; count: number }[];
  orders: { date: string; count: number }[];
  revenueByCurrency: Record<string, number>;
  revenueAllTimeByCurrency: Record<string, number>;
  topProducts: { slug: string; name: string; quantity: number }[];
  totalVisits: number;
  totalOrders: number;
};

// Krátká in-memory cache (podobně jako lib/stock.ts) — ušetří opakované
// dotazy, když admin přepíná záložky nebo komponenta re-renderuje.
const summaryCache = new Map<number, { data: AnalyticsSummary; time: number }>();
const CACHE_TTL = 60 * 1000; // 60s

export async function getAnalyticsSummary(rangeDays: number = 30): Promise<AnalyticsSummary> {
  const cached = summaryCache.get(rangeDays);
  if (cached && Date.now() - cached.time < CACHE_TTL) return cached.data;

  const redis = getRedis();
  const days = lastNDays(rangeDays);

  // Přesně 10 příkazů bez ohledu na zvolený rozsah dní (7/30/90) —
  // žádný z nich se neopakuje "na den".
  const pipeline = redis.pipeline();
  pipeline.hgetall("analytics:visits:total");
  pipeline.hgetall("analytics:orders:count");
  for (const cur of CURRENCIES) pipeline.hgetall(`analytics:orders:revenue:${cur}`);
  pipeline.hgetall("analytics:visits:landing");
  pipeline.hgetall("analytics:visits:ref");
  pipeline.hgetall("analytics:visits:device");
  pipeline.hgetall("analytics:products:alltime");
  pipeline.hgetall("analytics:products:names");

  const results = (await pipeline.exec()) as unknown[];
  let i = 0;
  const visitsTotalHash = results[i++] as Record<string, string> | null;
  const ordersCountHash = results[i++] as Record<string, string> | null;
  const revenueHashes: Record<Currency, Record<string, string> | null> = {} as any;
  for (const cur of CURRENCIES) revenueHashes[cur] = results[i++] as Record<string, string> | null;
  const landingHash = results[i++] as Record<string, string> | null;
  const refHash = results[i++] as Record<string, string> | null;
  const deviceHash = results[i++] as Record<string, string> | null;
  const productsHash = results[i++] as Record<string, string> | null;
  const namesHash = results[i++] as Record<string, string> | null;

  const visits = days.map((date) => ({ date, count: Number(visitsTotalHash?.[date]) || 0 }));
  const orders = days.map((date) => ({ date, count: Number(ordersCountHash?.[date]) || 0 }));

  const revenueByCurrency: Record<string, number> = {};
  const revenueAllTimeByCurrency: Record<string, number> = {};
  for (const cur of CURRENCIES) {
    const hash = revenueHashes[cur];
    revenueByCurrency[cur] = Math.round(sumRange(hash, days) * 100) / 100;
    const allTime = Object.values(hash ?? {}).reduce((s, v) => s + (Number(v) || 0), 0);
    revenueAllTimeByCurrency[cur] = Math.round(allTime * 100) / 100;
  }

  const toSortedList = (hash: Record<string, string> | null) =>
    Object.entries(hash ?? {})
      .map(([key, v]) => [key, Number(v) || 0] as const)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10);

  const topProducts = toSortedList(productsHash).map(([slug, quantity]) => ({
    slug,
    name: namesHash?.[slug] ?? slug,
    quantity,
  }));

  const summary: AnalyticsSummary = {
    rangeDays,
    visits,
    topLandingPages: toSortedList(landingHash).map(([path, count]) => ({ path, count })),
    topReferrers: toSortedList(refHash).map(([host, count]) => ({ host, count })),
    devices: toSortedList(deviceHash).map(([device, count]) => ({ device, count })),
    orders,
    revenueByCurrency,
    revenueAllTimeByCurrency,
    topProducts,
    totalVisits: visits.reduce((s, v) => s + v.count, 0),
    totalOrders: orders.reduce((s, o) => s + o.count, 0),
  };

  summaryCache.set(rangeDays, { data: summary, time: Date.now() });
  return summary;
}