// lib/stock.ts
// Skladovost uložená v Upstash Redis — spravovaná přímo z admin panelu.
import { getRedis } from "./redis";

export type StockKey = {
  slug: string;
  color?: string;
  size?: string;
};

export type StockMap = Map<string, number>;

const HASH_KEY = "stock:map";

// Cache — krátké vyhlazení v rámci jedné serverless instance. Na Vercelu se
// mezi jednotlivými invokacemi spolehnout nedá, ale v rámci jednoho běhu pomůže.
let cache: StockMap | null = null;
let cacheTime = 0;
const CACHE_TTL = 30 * 1000; // 30s

export function makeKey(slug: string, color?: string, size?: string): string {
  return `${slug}|${color ?? "-"}|${size ?? "-"}`;
}

async function fetchFromRedis(): Promise<StockMap> {
  const redis = getRedis();
  const raw = await redis.hgetall<Record<string, number | string>>(HASH_KEY);
  const map: StockMap = new Map();
  if (!raw) return map;

  for (const [key, value] of Object.entries(raw)) {
    const num = typeof value === "number" ? value : parseInt(String(value), 10);
    if (!isNaN(num)) map.set(key, num);
  }
  return map;
}

export async function getStockMap(): Promise<StockMap> {
  const now = Date.now();
  if (cache && now - cacheTime < CACHE_TTL) return cache;

  cache = await fetchFromRedis();
  cacheTime = now;
  return cache;
}

export async function getStock(key: StockKey): Promise<number> {
  const map = await getStockMap();
  return map.get(makeKey(key.slug, key.color, key.size)) ?? 0;
}

export async function getProductStock(slug: string): Promise<Record<string, number>> {
  const map = await getStockMap();
  const result: Record<string, number> = {};

  for (const [key, stock] of map.entries()) {
    const [keySlug, color, size] = key.split("|");
    if (keySlug === slug) {
      result[`${color}|${size}`] = stock;
    }
  }

  return result;
}

export function lookupStock(
  stockData: Record<string, number>,
  color?: string,
  size?: string,
): number {
  const key = `${color ?? "-"}|${size ?? "-"}`;
  return stockData[key] ?? 0;
}

// ── Zápis skladu z admin panelu ──────────────────────────────────────────────

export async function setStock(key: StockKey, value: number): Promise<void> {
  const redis = getRedis();
  const field = makeKey(key.slug, key.color, key.size);
  const safeValue = Math.max(0, Math.floor(value));
  await redis.hset(HASH_KEY, { [field]: safeValue });

  if (cache) cache.set(field, safeValue);
}

// Hromadné uložení více variant najednou — jeden HSET požadavek do Redisu
// bez ohledu na to, kolik variant se změnilo.
export async function setStockBulk(
  entries: { key: StockKey; value: number }[],
): Promise<void> {
  if (entries.length === 0) return;

  const redis = getRedis();
  const fields: Record<string, number> = {};

  for (const { key, value } of entries) {
    const field = makeKey(key.slug, key.color, key.size);
    fields[field] = Math.max(0, Math.floor(value));
  }

  await redis.hset(HASH_KEY, fields);

  if (cache) {
    for (const [field, value] of Object.entries(fields)) {
      cache.set(field, value);
    }
  }
}

// ── Automatický odečet při dokončené objednávce ─────────────────────────────
// Vstup: slug produktu, jeho stockKey ("color|size", nebo dvojice u vrstvených
// barev tělo+hlavička) a objednané množství. Používá ATOMICKÝ HINCRBY (ne
// read-modify-write), takže je to bezpečné i při dvou objednávkách naráz.
export type StockDeductionItem = {
  slug: string;
  quantity: number;
  stockKey?: string | string[]; // "color|size" — stejný formát jako CartItem.stockKey
};

export async function deductStockForItems(items: StockDeductionItem[]): Promise<void> {
  const redis = getRedis();

  // Sečteme všechny odečty do jednoho pole (klíč se může u vrstvených barev
  // opakovat napříč položkami, nebo dokonce v rámci jedné položky sdílet
  // barvu s jinou — proto agregujeme přes Map, ne jen naivně pushujeme).
  const totals = new Map<string, number>();

  for (const item of items) {
    if (!item.stockKey) continue; // produkt bez variant nemá sklad podle klíče — nic neodečítáme
    const keys = Array.isArray(item.stockKey) ? item.stockKey : [item.stockKey];
    for (const keyPart of keys) {
      const field = `${item.slug}|${keyPart}`;
      totals.set(field, (totals.get(field) ?? 0) + item.quantity);
    }
  }

  if (totals.size === 0) return;

  const pipeline = redis.pipeline();
  const fields = Array.from(totals.keys());
  for (const field of fields) {
    pipeline.hincrby(HASH_KEY, field, -(totals.get(field) as number));
  }

  const results = (await pipeline.exec()) as number[];

  // Pojistka: kdyby odečet spadl pod 0 (přeprodáno), vrátíme na 0 místo
  // záporného čísla — a zalogujeme, ať o tom Ondřej ví.
  const corrections: Record<string, number> = {};
  fields.forEach((field, i) => {
    const newValue = results[i];
    if (typeof newValue === "number" && newValue < 0) {
      corrections[field] = 0;
      console.warn(`Sklad "${field}" šel do mínusu (${newValue}) — opraveno na 0. Zkontroluj skladovost.`);
    }
  });

  if (Object.keys(corrections).length > 0) {
    await redis.hset(HASH_KEY, corrections);
  }

  // Cache invalidujeme celá (jednodušší a bezpečnější než dopočítávat nové
  // hodnoty ručně) — příští čtení si ji znovu natáhne z Redisu.
  cache = null;
}