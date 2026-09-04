"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useLanguage } from "@/lib/language-context";
import { localeMeta } from "@/lib/i18n/locales";
import { isTranslated } from "@/lib/i18n/dictionary";

/**
 * Language picker for the navbar. Two languages could be a toggle; twenty-three
 * needs a list, so this is a popover of endonyms — a driver looking for Punjabi
 * scans for "ਪੰਜਾਬੀ", not for "Punjabi".
 */
export function LanguagePicker({ compact = false }: { compact?: boolean }) {
  const { locale, setLocale, locales } = useLanguage();
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);

  // Close on outside click / Escape.
  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (!wrapRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const current = localeMeta(locale);

  return (
    <div ref={wrapRef} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label="Change language"
        aria-haspopup="listbox"
        aria-expanded={open}
        className="flex items-center gap-1 rounded-full bg-black/[0.04] px-3.5 py-1.5 text-xs font-bold transition-all duration-200 hover:bg-brand/10 hover:text-brandtext dark:bg-white/[0.06] dark:hover:bg-brand/20 dark:hover:text-brand-light"
      >
        <span className="material-symbols-outlined text-sm leading-none">
          language
        </span>
        {current.native}
      </button>

      <AnimatePresence>
        {open && (
          <motion.ul
            role="listbox"
            aria-label="Language"
            initial={{ opacity: 0, scale: 0.96, y: -6 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: -6 }}
            transition={{ duration: 0.16, ease: "easeOut" }}
            className={`absolute z-50 mt-2 max-h-80 w-52 overflow-y-auto rounded-2xl border border-black/5 bg-white/95 p-1.5 shadow-2xl backdrop-blur-lg dark:border-white/10 dark:bg-neutral-950/95 ${
              compact ? "right-0 bottom-full mb-2 mt-0" : "right-0"
            }`}
          >
            {locales.map((item) => {
              const active = item.code === locale;
              // Untranslated locales still switch the font, script direction and
              // <html lang>, but read in English. Say so rather than letting it
              // look like the switcher did nothing.
              const translated = isTranslated(item.code);
              return (
                <li key={item.code}>
                  <button
                    role="option"
                    aria-selected={active}
                    lang={item.code}
                    onClick={() => {
                      setLocale(item.code);
                      setOpen(false);
                    }}
                    className={`flex w-full items-baseline justify-between gap-3 rounded-xl px-3 py-2 text-left transition-colors ${
                      active
                        ? "bg-brand/10 text-brandtext dark:bg-brand/20 dark:text-brand"
                        : "hover:bg-black/5 dark:hover:bg-white/5"
                    }`}
                  >
                    <span className="text-sm font-semibold">{item.native}</span>
                    <span
                      className={`text-[0.65rem] font-medium uppercase tracking-wider ${
                        translated ? "opacity-45" : "text-brand/70"
                      }`}
                      title={translated ? undefined : "Not translated yet — shows English"}
                    >
                      {translated ? item.english : "English"}
                    </span>
                  </button>
                </li>
              );
            })}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}
