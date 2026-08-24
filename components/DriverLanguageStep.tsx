"use client";

import { useLanguage } from "@/lib/language-context";
import { markLanguageChosen } from "@/lib/driver-access";
import { DriverModal } from "./DriverModal";
import type { Locale } from "@/lib/dictionaries";

/** First thing a driver sees: pick the language, in both languages. */
export function DriverLanguageStep({ onDone }: { onDone: () => void }) {
  const { t, setLocale } = useLanguage();

  const choose = (locale: Locale) => {
    setLocale(locale);
    markLanguageChosen();
    onDone();
  };

  const optionCls =
    "flex w-full items-center justify-between rounded-2xl border border-black/10 bg-black/[0.03] px-5 py-4 text-left text-lg font-bold transition active:scale-[0.98] hover:border-brand hover:bg-brand/10 dark:border-white/15 dark:bg-white/[0.06] dark:hover:bg-brand/15";

  return (
    <DriverModal>
      <div className="text-center">
        <span className="material-symbols-outlined text-4xl text-brand">
          translate
        </span>
        <h2 className="mt-3 text-xl font-extrabold">{t.drivers.langTitle}</h2>
        <p className="mt-1 text-sm opacity-60">{t.drivers.langSub}</p>
      </div>

      <div className="mt-7 space-y-3">
        <button onClick={() => choose("en")} className={optionCls}>
          English
          <span aria-hidden className="text-sm opacity-50">
            →
          </span>
        </button>
        <button onClick={() => choose("hi")} className={optionCls}>
          हिंदी
          <span aria-hidden className="text-sm opacity-50">
            →
          </span>
        </button>
      </div>
    </DriverModal>
  );
}
