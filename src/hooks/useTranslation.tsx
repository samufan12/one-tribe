import { createContext, useCallback, useContext, useEffect, useMemo, useState, ReactNode } from "react";
import { translations, type Language, type TranslationKey } from "@/i18n/translations";

const LANG_KEY = "onetribe:lang";
const SIMPLE_KEY = "onetribe:simple";

interface I18nContextValue {
  lang: Language;
  setLang: (l: Language) => void;
  simpleMode: boolean;
  setSimpleMode: (v: boolean) => void;
  toggleSimpleMode: () => void;
  t: (key: TranslationKey, vars?: Record<string, string>) => string;
}

const I18nContext = createContext<I18nContextValue | null>(null);

const readLang = (): Language => {
  if (typeof window === "undefined") return "en";
  const v = localStorage.getItem(LANG_KEY);
  return v === "am" || v === "ti" || v === "en" ? v : "en";
};

const readSimple = (): boolean => {
  if (typeof window === "undefined") return false;
  return localStorage.getItem(SIMPLE_KEY) === "1";
};

export const I18nProvider = ({ children }: { children: ReactNode }) => {
  const [lang, setLangState] = useState<Language>(readLang);
  const [simpleMode, setSimpleModeState] = useState<boolean>(readSimple);

  useEffect(() => {
    localStorage.setItem(LANG_KEY, lang);
    document.documentElement.lang = lang;
  }, [lang]);

  useEffect(() => {
    localStorage.setItem(SIMPLE_KEY, simpleMode ? "1" : "0");
    document.documentElement.classList.toggle("simple-mode", simpleMode);
  }, [simpleMode]);

  const setLang = useCallback((l: Language) => setLangState(l), []);
  const setSimpleMode = useCallback((v: boolean) => setSimpleModeState(v), []);
  const toggleSimpleMode = useCallback(() => setSimpleModeState((v) => !v), []);

  const t = useCallback(
    (key: TranslationKey, vars?: Record<string, string>) => {
      const dict = translations[lang] as Record<string, string>;
      const fallback = translations.en as Record<string, string>;
      let str = dict[key] ?? fallback[key] ?? key;
      if (vars) {
        for (const [k, v] of Object.entries(vars)) {
          str = str.replace(new RegExp(`\\{${k}\\}`, "g"), v);
        }
      }
      return str;
    },
    [lang]
  );

  const value = useMemo(
    () => ({ lang, setLang, simpleMode, setSimpleMode, toggleSimpleMode, t }),
    [lang, setLang, simpleMode, setSimpleMode, toggleSimpleMode, t]
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
};

export const useTranslation = () => {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useTranslation must be used within I18nProvider");
  return ctx;
};
