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