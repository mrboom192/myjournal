import React, { createContext, useContext, useState, useEffect } from "react";
import i18n from "@/src/locales";

type LanguageContextType = {
  locale: string;
  changeLanguage: (lang: string) => void;
};

const LanguageContext = createContext<LanguageContextType>({
  locale: "en",
  changeLanguage: () => {},
});

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [locale, setLocale] = useState(i18n.locale);

  useEffect(() => {
    i18n.locale = locale;
  }, [locale]);

  const changeLanguage = (newLocale: string) => {
    setLocale(newLocale);
  };

  return (
    <LanguageContext.Provider value={{ locale, changeLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
