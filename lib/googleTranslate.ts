"use client";

// lib/googleTranslate.ts
// Google Translate se načítá až na vyžádání — ne pro každého návštěvníka.
//
// Dřív se skript z translate.google.com vkládal v app/layout.tsx na každé
// načtení stránky, takže se IP adresa každého návštěvníka poslala Googlu
// dřív, než vůbec viděl cookie lištu, a widget si nastavil cookie googtrans.
// Web je primárně česky, takže drtivá většina návštěv překladač nepotřebuje.
//
// Teď se skript vkládá jen ve dvou případech:
//   1) návštěvník si sám zvolí jiný jazyk než češtinu (Header),
//   2) vrací se s jazykem, který si dřív zvolil (cookie googtrans existuje).
// V obou případech jde o službu, o kterou návštěvník výslovně požádal.

const SCRIPT_ID = "google-translate-script";

/** Jazyk zvolený v překladači, nebo null pro výchozí češtinu. */
export function readGoogtransLang(): string | null {
  if (typeof document === "undefined") return null;
  return document.cookie.match(/googtrans=\/\w+\/(\w+)/)?.[1] ?? null;
}

/** Smaže cookie googtrans (návrat na češtinu). */
export function clearGoogtransCookie(): void {
  if (typeof document === "undefined") return;
  const expired = "googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
  document.cookie = expired;
  // Widget cookie zapisuje i na doménu s tečkou (.example.cz), aby platila
  // napříč subdoménami — bez tohohle by po reloadu zůstal starý jazyk.
  document.cookie = `${expired} domain=${location.hostname};`;
  document.cookie = `${expired} domain=.${location.hostname};`;
}

export function isGoogleTranslateLoaded(): boolean {
  if (typeof document === "undefined") return false;
  return document.getElementById(SCRIPT_ID) !== null;
}

export function loadGoogleTranslate(): void {
  if (typeof window === "undefined" || isGoogleTranslateLoaded()) return;

  // Callback musí na window existovat dřív, než se skript stáhne — jméno je
  // v query parametru ?cb= níž.
  (window as unknown as Record<string, unknown>).googleTranslateElementInit = () => {
    const google = (window as unknown as { google?: any }).google;
    if (!google?.translate) return;
    new google.translate.TranslateElement(
      { pageLanguage: "cs", includedLanguages: "cs,sk,en", autoDisplay: false },
      "google_translate_element",
    );
  };

  const script = document.createElement("script");
  script.id = SCRIPT_ID;
  script.src = "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
  script.async = true;
  document.body.appendChild(script);
}
