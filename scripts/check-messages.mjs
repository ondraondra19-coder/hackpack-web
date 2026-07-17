// scripts/check-messages.mjs
// Kontrola překladů. Spouštěj `node scripts/check-messages.mjs`.
//
// Hlídá tři věci:
//   1. Každý klíč z cs.json existuje i v sk.json a en.json (a naopak).
//   2. Každý t("klic") / t.plural(n, "klic") v kódu má odpovídající klíč.
//   3. Žádný klíč v messages není mrtvý (nikde se nepoužívá).
//
// PROČ: klíče se doplňují ručně do tří souborů a chybějící klíč se v UI
// projeví až tím, že na stránce svítí holé "namespace.key". Tohle to najde
// dřív než zákazník.

import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, extname } from "node:path";

const ROOT = new URL("..", import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1");

const load = (l) => JSON.parse(readFileSync(join(ROOT, "messages", `${l}.json`), "utf8"));
const messages = { cs: load("cs"), sk: load("sk"), en: load("en") };

// Angličtina má jen dva tvary množného čísla (one/many), čeština a slovenština
// tři (one/few/many). Chybějící `_few` v en.json je tedy správně, ne chyba.
const isCzechSlovakOnly = (key) => key.endsWith("_few");

const flatten = (obj) =>
  Object.entries(obj).flatMap(([ns, section]) =>
    Object.keys(section).map((k) => `${ns}.${k}`)
  );

const keys = Object.fromEntries(
  Object.entries(messages).map(([l, m]) => [l, new Set(flatten(m))])
);

const errors = [];

// ── 1. Shoda klíčů mezi jazyky ───────────────────────────────────────────────
for (const locale of ["sk", "en"]) {
  for (const key of keys.cs) {
    if (keys[locale].has(key)) continue;
    if (locale === "en" && isCzechSlovakOnly(key)) continue;
    errors.push(`${locale}.json: chybí klíč "${key}" (je v cs.json)`);
  }
  for (const key of keys[locale]) {
    if (!keys.cs.has(key)) errors.push(`cs.json: chybí klíč "${key}" (je v ${locale}.json)`);
  }
}

// ── 2. Klíče použité v kódu ──────────────────────────────────────────────────
function walk(dir) {
  return readdirSync(dir).flatMap((name) => {
    if (name === "node_modules" || name === ".next" || name.startsWith(".")) return [];
    const path = join(dir, name);
    if (statSync(path).isDirectory()) return walk(path);
    return [".ts", ".tsx"].includes(extname(name)) ? [path] : [];
  });
}

// Komentáře pryč — v useT.ts je v hlavičce ukázka `t.plural(n, "item")`, která
// by se jinak počítala jako skutečné použití neexistujícího klíče.
const stripComments = (src) =>
  src.replace(/\/\*[\s\S]*?\*\//g, "").replace(/^\s*\/\/.*$/gm, "");

const used = new Set();
for (const file of [...walk(join(ROOT, "app")), ...walk(join(ROOT, "components")), ...walk(join(ROOT, "lib"))]) {
  const src = stripComments(readFileSync(file, "utf8"));

  // Namespace se bere z `const t = useT("product")`. Soubor může mít víc
  // překladačů (t, tn, tc…), proto se páruje název proměnné → namespace.
  const namespaces = new Map();
  for (const m of src.matchAll(/(?:const|let)\s+(\w+)\s*=\s*useT\(\s*"([^"]+)"\s*\)/g)) {
    namespaces.set(m[1], m[2]);
  }
  if (namespaces.size === 0) continue;

  for (const [varName, ns] of namespaces) {
    const call = new RegExp(`\\b${varName}\\(\\s*"([^"]+)"`, "g");
    for (const m of src.matchAll(call)) used.add(`${ns}.${m[1]}`);

    const plural = new RegExp(`\\b${varName}\\.plural\\(\\s*[^,]+,\\s*"([^"]+)"`, "g");
    for (const m of src.matchAll(plural)) {
      for (const suffix of ["one", "few", "many"]) used.add(`${ns}.${m[1]}_${suffix}`);
    }
  }
}

for (const key of used) {
  if (!keys.cs.has(key)) errors.push(`cs.json: kód používá "${key}", ale klíč neexistuje`);
}

// ── 3. Mrtvé klíče ───────────────────────────────────────────────────────────
const dead = [...keys.cs].filter((k) => !used.has(k));

// ── Výstup ───────────────────────────────────────────────────────────────────
if (dead.length) {
  console.log(`\n⚠  Nepoužité klíče (${dead.length}):`);
  for (const k of dead) console.log(`   ${k}`);
}

if (errors.length) {
  console.error(`\n✖ ${errors.length} chyb:`);
  for (const e of errors) console.error(`   ${e}`);
  process.exit(1);
}

console.log(`\n✓ Překlady v pořádku — ${keys.cs.size} klíčů × 3 jazyky, ${used.size} použitých.`);
