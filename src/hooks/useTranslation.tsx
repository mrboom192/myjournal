// hooks/useTranslation.ts
import { useLanguage } from "@/src/contexts/LanguageContext";
import i18n from "@/src/locales";

export const useTranslation = () => {
  const { locale } = useLanguage();

  return (key: string, options?: Record<string, any>) =>
    i18n.t(key, { locale, ...options });
};
