// lib/blog.ts
// Magazín (SEO články) — uložený v Upstash Redis, spravovaný z admin panelu
// (dřív to byl natvrdo zapsaný TS soubor, na každý článek bylo nutné
// upravit kód a redeploynout).
//
// ── Formát obsahu článku ─────────────────────────────────────────────────
// `content` je jednoduchý vlastní markdown-like formát (ne plný Markdown
// balíček), stejný, jaký se používal v původních článcích:
//   - blok začínající "## " → nadpis (tučný, větší písmo)
//   - řádek začínající "- " → odrážka v seznamu
//   - "**text**" uvnitř odstavce → tučný text
//   - prázdný řádek odděluje odstavce/bloky
// Vykreslování viz renderBlogContent() níže — používá ho jak web
// (app/blog/[slug]/page.tsx), tak živý náhled v adminu.
//
// POZN.: Dřív tu byl jednorázový seed (LEGACY_SEED + ensureSeeded), který při
// prázdném Redisu automaticky nahrál původní články. Způsoboval ale, že po
// smazání VŠECH článků z adminu se při dalším načtení magazínu znovu objevily.
// Migrace je dávno hotová, takže seed byl odstraněn — magazín teď čte čistě to,
// co je v Redisu, a smazání drží.
import { getRedis } from "./redis";

export type BlogPost = {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  date: string; // zobrazovaný text, např. "22. 4. 2026" — Ondřej ho vyplňuje ručně
  tag: string;
  img: string;
  createdAt: number; // pro řazení "od nejnovějšího" nezávisle na formátu date
};

const HASH_KEY = "blog:posts";

function parseCzechDate(dateStr: string): number {
  const match = dateStr.match(/(\d{1,2})\.\s*(\d{1,2})\.\s*(\d{4})/);
  if (!match) return Date.now();
  const [, day, month, year] = match;
  return new Date(Number(year), Number(month) - 1, Number(day)).getTime();
}

export function slugify(title: string): string {
  return title
    .toLowerCase()
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "") // odstraní diakritiku
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

// ── Čtení / zápis ────────────────────────────────────────────────────────

function parsePost(raw: string | BlogPost): BlogPost {
  return typeof raw === "string" ? (JSON.parse(raw) as BlogPost) : raw;
}

export async function getAllPosts(): Promise<BlogPost[]> {
  const redis = getRedis();
  const raw = await redis.hgetall<Record<string, string | BlogPost>>(HASH_KEY);
  if (!raw) return [];
  return Object.values(raw)
    .map(parsePost)
    .sort((a, b) => b.createdAt - a.createdAt);
}

export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  const redis = getRedis();
  const raw = await redis.hget<string | BlogPost>(HASH_KEY, slug);
  if (!raw) return null;
  return parsePost(raw);
}

// Vytvoří nebo přepíše článek pod daným slugem (upsert).
export async function savePost(post: Omit<BlogPost, "createdAt"> & { createdAt?: number }): Promise<BlogPost> {
  const redis = getRedis();
  const full: BlogPost = { ...post, createdAt: post.createdAt ?? parseCzechDate(post.date) };
  await redis.hset(HASH_KEY, { [post.slug]: JSON.stringify(full) });
  return full;
}

export async function deletePost(slug: string): Promise<void> {
  const redis = getRedis();
  await redis.hdel(HASH_KEY, slug);
}

// ── Vykreslení obsahu (web i živý náhled v adminu) ──────────────────────────
// Podporuje: "## " nadpisy, "- " odrážky, "**tučně**" uvnitř textu.
// Vrací pole popisných bloků — konzumují je React komponenty na webu i
// v admin náhledu, každá si je vykreslí svými vlastními styly.
export type BlogContentBlock =
  | { type: "heading"; text: string }
  | { type: "paragraph"; text: string }
  | { type: "list"; items: string[] };

export function parseBlogContent(text: string): BlogContentBlock[] {
  const blocks = text.trim().split(/\n\s*\n/);
  const result: BlogContentBlock[] = [];

  for (const block of blocks) {
    const trimmed = block.trim();
    if (!trimmed) continue;

    if (trimmed.startsWith("## ")) {
      result.push({ type: "heading", text: trimmed.slice(3).trim() });
      continue;
    }

    const lines = trimmed.split("\n").map((l) => l.trim()).filter(Boolean);
    if (lines.every((l) => l.startsWith("- "))) {
      result.push({ type: "list", items: lines.map((l) => l.slice(2).trim()) });
      continue;
    }

    result.push({ type: "paragraph", text: trimmed });
  }

  return result;
}

// Rozseká text s "**tučně**" značkami na kusy pro React render — použití:
// {splitBold(text).map((part, i) => part.bold ? <strong key={i}>{part.text}</strong> : part.text)}
export function splitBold(text: string): { text: string; bold: boolean }[] {
  const parts = text.split(/(\*\*[^*]+\*\*)/g).filter(Boolean);
  return parts.map((p) =>
    p.startsWith("**") && p.endsWith("**")
      ? { text: p.slice(2, -2), bold: true }
      : { text: p, bold: false },
  );
}