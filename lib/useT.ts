"use client";

// lib/useT.ts
// Překlady. Klíče žijí v messages/{cs,sk,en}.json, jazyk drží LangContext.
//
// Použití:
//   const t = useT("product");
//   t("addToCart")                 -> "Přidat do košíku"
//   t("lastPieces", { count: 3 })  -> doplní {count} do textu
//   t.plural(n, "item")            -> položka / položky / položek
//
// Chybějící klíč vrátí "namespace.key", takže je v UI hned vidět a tiše
// se nespolkne.

import cs from "@/messages/cs.json";
import en from "@/messages/en.json";
import sk from "@/messages/sk.json";
import { useLang } from "./LangContext";
import type { Locale } from "./locale";

const messages = { cs, en, sk } as const;
type Messages = typeof cs;
export type Namespace = keyof Messages;

type Vars = Record<string, string | number>;

function interpolate(text: string, vars?: Vars): string {
  if (!vars) return text;
  return text.replace(/\{(\w+)\}/g, (m, k) => (k in vars ? String(vars[k]) : m));
}

function lookup(locale: Locale, namespace: string, key: string): string | undefined {
  const section = (messages[locale] as Record<string, unknown>)[namespace];
  if (!section || typeof section !== "object") return undefined;
  const value = (section as Record<string, unknown>)[key];
  return typeof value === "string" ? value : undefined;
}

/**
 * Čeština a slovenština mají tři tvary množného čísla (1 / 2–4 / 5+),
 * angličtina dva. Hledá klíče `<key>_one`, `<key>_few`, `<key>_many`.
 */
function pluralSuffix(locale: Locale, count: number): "one" | "few" | "many" {
  if (locale === "en") return count === 1 ? "one" : "many";
  if (count === 1) return "one";
  if (count >= 2 && count <= 4) return "few";
  return "many";
}

export type T = ((key: string, vars?: Vars) => string) & {
  plural: (count: number, key: string, vars?: Vars) => string;
  locale: Locale;
};

export function useT(namespace: Namespace): T {
  const { locale } = useLang();

  const t = ((key: string, vars?: Vars) => {
    // Fallback na češtinu: klíč zatím doplněný jen do cs.json se zobrazí
    // česky, místo aby v UI svítil holý název klíče.
    const raw = lookup(locale, namespace, key) ?? lookup("cs", namespace, key);
    return raw === undefined ? `${namespace}.${key}` : interpolate(raw, vars);
  }) as T;

  // Metody navěšujeme na callable `t` (překladač + t.plural/t.locale) — záměrná
  // mutace lokálně vytvořeného objektu, ne sdíleného stavu.
  // eslint-disable-next-line react-hooks/immutability
  t.plural = (count: number, key: string, vars?: Vars) =>
    t(`${key}_${pluralSuffix(locale, count)}`, { count, ...vars });
  // eslint-disable-next-line react-hooks/immutability
  t.locale = locale;

  return t;
}
