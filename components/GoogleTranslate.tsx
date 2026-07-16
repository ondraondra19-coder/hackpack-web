"use client";

// components/GoogleTranslate.tsx
// Skrytý cíl pro widget Google Translate, ovládaný z Headeru.
//
// Samotný skript se odsud NEnačítá pro každého — jen pro návštěvníka, který
// se vrací s jazykem, co si dřív sám zvolil (cookie googtrans). První návštěva
// v češtině tak neposílá na Google nic. Zbytek viz lib/googleTranslate.ts.
import { useEffect } from "react";
import { loadGoogleTranslate, readGoogtransLang } from "@/lib/googleTranslate";

export default function GoogleTranslate() {
  useEffect(() => {
    // Div níž už je v DOM (useEffect běží po vykreslení), takže se widget
    // má kam pověsit.
    if (readGoogtransLang()) loadGoogleTranslate();
  }, []);

  return (
    <>
      <div id="google_translate_element" className="hidden" />

      {/* Skryj lištu Google Translate nahoře a jeho tooltipy */}
      <style>{`
        .goog-te-banner-frame, #goog-gt-tt, .goog-te-balloon-frame { display: none !important; }
        body { top: 0 !important; }
        .skiptranslate { display: none !important; }
      `}</style>
    </>
  );
}
