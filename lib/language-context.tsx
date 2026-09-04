"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import type { Dictionary } from "./dictionaries";
import { getDictionary, loadDictionary } from "./i18n/dictionary";
import { applyScriptFont } from "./i18n/fonts";
import { isLocale, localeMeta, LOCALES, type Locale } from "./i18n/locales";

type LanguageContextValue = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  /** Kept for the components that still just flip English ↔ Hindi. */
  toggleLocale: () => void;
  locales: typeof LOCALES;
  t: Dictionary;
};

const LanguageContext = createContext<LanguageContextValue | null>(null);

const STORAGE_KEY = "site-locale";

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("en");
  // The resolved copy. Translated locales arrive in their own chunk, so this
  // holds English until that chunk lands and the real dictionary thereafter.
  const [dictionary, setDictionary] = useState<Dictionary>(() =>
    getDictionary("en"),
  );
  const firstRun = useRef(true);

  // Restore saved choice on mount.
  useEffect(() => {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (isLocale(saved)) setLocaleState(saved);
  }, []);

  // Fetch the locale's chunk. `cancelled` guards against a fast switcher
  // landing an earlier locale's dictionary after a later one.
  useEffect(() => {
    let cancelled = false;
    setDictionary(getDictionary(locale)); // cached or English, immediately
    loadDictionary(locale).then((next) => {
      if (!cancelled) setDictionary(next);
    });
    return () => {
      cancelled = true;
    };
  }, [locale]);

  // Keep <html lang>/<html dir> and the script webfont in sync, and persist.
  useEffect(() => {
    const meta = localeMeta(locale);
    document.documentElement.lang = locale;
    document.documentElement.dir = meta.dir;
    applyScriptFont(meta.script);

    // Skip the very first pass: it runs with the "en" default, before the
    // restore effect's state update has landed, and would overwrite a saved
    // locale with "en" on every reload.
    if (firstRun.current) {
      firstRun.current = false;
      return;
    }
    window.localStorage.setItem(STORAGE_KEY, locale);
  }, [locale]);

  const value = useMemo<LanguageContextValue>(
    () => ({
      locale,
      setLocale: setLocaleState,
      toggleLocale: () =>
        setLocaleState((prev) => (prev === "en" ? "hi" : "en")),
      locales: LOCALES,
      t: dictionary,
    }),
    [locale, dictionary],
  );

  return (
    <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return ctx;
}
