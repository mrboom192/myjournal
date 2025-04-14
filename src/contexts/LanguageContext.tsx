import React, { createContext, useContext, useState, useEffect } from "react";
import i18n from "@/src/locales";

type LanguageContextType = {
  language: string;
  setLanguage: (lang: string) => void;
};

const LanguageContext = createContext<LanguageContextType>({
  language: "en",
  setLanguage: () => {},
});

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState("en");

  const setLanguage = (lang: string) => {
    i18n.locale = lang;
    setLanguageState(lang);
  };

  useEffect(() => {
    i18n.locale = language;
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
