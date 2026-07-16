"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { readGoogtransLang } from "@/lib/googleTranslate";

type Locale = "cs" | "sk" | "en";

function readLocale(): Locale {
  const code = readGoogtransLang();
  if (code === "en" || code === "sk") return code;
  return "cs";
}

const LangContext = createContext<{
  locale: Locale;
  setLocale: (l: Locale) => void;
}>({ locale: "cs", setLocale: () => {} });

export function LangProvider({ children }: { children: React.ReactNode }) {
  // ← Vždy začínáme s "cs" — stejně na serveru i klientovi
  const [locale, setLocale] = useState<Locale>("cs");

  // ← Cookie čteme až po mountu na klientovi
  useEffect(() => {
    setLocale(readLocale());
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