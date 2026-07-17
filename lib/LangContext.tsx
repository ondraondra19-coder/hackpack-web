"use client";

// lib/LangContext.tsx
// Drží zvolený jazyk a zpřístupňuje ho přes useLang(). Zápis volby rovnou
// ukládá cookie, takže se jazyk drží i po reloadu (viz lib/locale.ts).

import { createContext, useContext, useState, useEffect, useCallback } from "react";
import {
  DEFAULT_LOCALE,
  type Locale,
  clearLegacyGoogtransCookie,
  readLegacyGoogtransLocale,
  readLocale,
  writeLocale,
} from "@/lib/locale";

const LangContext = createContext<{
  locale: Locale;
  setLocale: (l: Locale) => void;
}>({ locale: DEFAULT_LOCALE, setLocale: () => {} });

export function LangProvider({ children }: { children: React.ReactNode }) {
  // Server i první render klienta musí dát stejný výsledek, jinak hydratace
  // spadne — proto se vždy začíná výchozí češtinou a cookie se čte až v efektu.
  const [locale, setLocaleState] = useState<Locale>(DEFAULT_LOCALE);

  useEffect(() => {
    // Návštěvník, který si dřív zvolil jazyk ve starém Google Translate, má
    // cookie googtrans. Jednorázově ji přebereme, ať nespadne zpátky do
    // češtiny, a hned uklidíme.
    const legacy = readLegacyGoogtransLocale();
    if (legacy) {
      writeLocale(legacy);
      clearLegacyGoogtransCookie();
      // Jazyk zjišťujeme až po mountu (cookie/localStorage nejsou na serveru).
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setLocaleState(legacy);
      return;
    }
    setLocaleState(readLocale());
  }, []);

  // <html lang> musí odpovídat skutečnému jazyku obsahu — čtečky podle něj
  // volí výslovnost a Lighthouse to kontroluje. V layoutu je natvrdo "cs",
  // protože ten se renderuje na serveru, kde jazyk ještě neznáme.
  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  const setLocale = useCallback((l: Locale) => {
    writeLocale(l);
    setLocaleState(l);
  }, []);

  return (
    <LangContext.Provider value={{ locale, setLocale }}>
      {children}
    </LangContext.Provider>
  );
}

export function useLang() {
  return useContext(LangContext);
}
