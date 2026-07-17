"use client";

// lib/locale.ts
// Volba jazyka. Nahrazuje starý lib/googleTranslate.ts.
//
// PROČ VLASTNÍ COOKIE: dřív se jazyk odvozoval z cookie `googtrans`, kterou
// si nastavoval widget Google Translate. Tím byla volba jazyka svázaná se
// službou, která překládala nespolehlivě, přepisovala DOM pod Reactem (proto
// všude ta `notranslate` a `translate="no"`) a posílala obsah stránek Googlu.
// Překlad je teď vlastní (messages/*.json + useT), takže si jazyk držíme sami.
//
// PROČ NA KLIENTOVI A NE V URL: locale se čte až po hydrataci z cookie, takže
// serverové komponenty ho neznají — a komponenty s textem tedy musí být
// klientské. Alternativou by byly prefixy /en, /sk (next-intl routing), což je
// pro SEO lepší, protože by cizojazyčné verze byly indexovatelné. Znamenalo by
// to ale přesunout všech 18 stránek pod app/[locale]/ a přepsat každý odkaz.
// Čtení cookie na serveru přes cookies() zase není zdarma: homepage, kategorie
// i detail produktu jedou na ISR (revalidate = 180) a cookies() by je přepnulo
// na dynamické. Cookie na klientovi je proto zvolený kompromis — stejný model
// jako dosud, jen bez Googlu. Na routing se dá přejít později bez zahazování
// překladů.

export type Locale = "cs" | "sk" | "en";

export const LOCALES: Locale[] = ["cs", "sk", "en"];
export const DEFAULT_LOCALE: Locale = "cs";

export const LOCALE_COOKIE = "hp_lang";
const ONE_YEAR_SECONDS = 60 * 60 * 24 * 365;

export const LOCALE_LABELS: Record<Locale, string> = {
  cs: "Čeština",
  sk: "Slovenčina",
  en: "English",
};

// Pro Intl / toLocaleDateString — "cs" samo o sobě funguje, ale explicitní
// region drží formát data předvídatelný (en → 17/07/2026, ne 7/17/2026).
export const LOCALE_TAGS: Record<Locale, string> = {
  cs: "cs-CZ",
  sk: "sk-SK",
  en: "en-GB",
};

function isLocale(value: string | null | undefined): value is Locale {
  return !!value && (LOCALES as string[]).includes(value);
}

/** Jazyk uložený v cookie, nebo výchozí čeština. */
export function readLocale(): Locale {
  if (typeof document === "undefined") return DEFAULT_LOCALE;
  const raw = document.cookie.match(new RegExp(`${LOCALE_COOKIE}=(\\w+)`))?.[1];
  return isLocale(raw) ? raw : DEFAULT_LOCALE;
}

/** Uloží volbu jazyka na rok. */
export function writeLocale(locale: Locale): void {
  if (typeof document === "undefined") return;
  document.cookie = `${LOCALE_COOKIE}=${locale}; path=/; max-age=${ONE_YEAR_SECONDS}; SameSite=Lax`;
}

// Cookie googtrans nastavoval widget Google Translate a přežila by jeho
// odstranění — návštěvník by pak měl v prohlížeči ležet mrtvý záznam navždy.
// Uklidíme ji při první návštěvě (viz LangContext). Smazat lze až po nějaké
// době, kdy se vrátí i řídcí návštěvníci; do té doby je to pár řádků navíc.
export function clearLegacyGoogtransCookie(): void {
  if (typeof document === "undefined") return;
  if (!document.cookie.includes("googtrans=")) return;
  const expired = "googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
  document.cookie = expired;
  document.cookie = `${expired} domain=${location.hostname};`;
  document.cookie = `${expired} domain=.${location.hostname};`;
}

/**
 * Jazyk zvoleny u starého překladače — použije se jednorázově, aby vracející
 * se návštěvník neskončil zpátky v češtině. Vrací null, když cookie není.
 */
export function readLegacyGoogtransLocale(): Locale | null {
  if (typeof document === "undefined") return null;
  const raw = document.cookie.match(/googtrans=\/\w+\/(\w+)/)?.[1];
  return isLocale(raw) ? raw : null;
}
