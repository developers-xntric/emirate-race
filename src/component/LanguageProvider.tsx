"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { homeData } from "@/data/home-data";
import { arabicData } from "@/data/home-data/arabic-index";

const LanguageContext = createContext({
  data: homeData as typeof homeData | typeof arabicData,
  language: "en" as "en" | "ar",
  toggleLanguage: () => {},
});

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<"en" | "ar">("en");
  const data = language === "ar" ? arabicData : homeData;

  useEffect(() => {
    try {
      if (localStorage.getItem("evrs-language") === "ar") {
        queueMicrotask(() => setLanguage("ar"));
      }
    } catch { /* Storage is optional. */ }
  }, []);

  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = language === "ar" ? "rtl" : "ltr";
    document.title = data.metadata.title;
    document.querySelector('meta[name="description"]')?.setAttribute("content", data.metadata.description);
  }, [language, data]);

  function toggleLanguage() {
    const next = language === "en" ? "ar" : "en";
    setLanguage(next);
    try { localStorage.setItem("evrs-language", next); } catch { /* Storage is optional. */ }
  }

  return <LanguageContext.Provider value={{ data, language, toggleLanguage }}>{children}</LanguageContext.Provider>;
}

export const useHomeData = () => useContext(LanguageContext).data;
export const useLanguage = () => useContext(LanguageContext);
