"use client";

import { useLanguage } from "@/lib/language-context";
import { DriverModal } from "./DriverModal";

/**
 * Shown on /for-drivers right after the Smart Driver Awards registration
 * (/sda-registration) is submitted: the form hands the entrant over to the hub
 * and this card confirms their entry landed. Same shape as the WhatsApp card so
 * the two read as one flow when they follow each other.
 */
export function DriverSubmittedStep({ onDone }: { onDone: () => void }) {
  const { t } = useLanguage();

  return (
    <DriverModal onDismiss={onDone} dismissLabel={t.drivers.dismiss}>
      <div className="text-center">
        <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-[#25D366]/15 text-[#128C7E] dark:text-[#25D366]">
          <span className="material-symbols-outlined text-[26px]">task_alt</span>
        </span>
        <h2 className="mt-3 text-xl font-extrabold">{t.drivers.submittedTitle}</h2>
        <p className="mt-2 text-sm leading-relaxed opacity-60">
          {t.drivers.submittedBody}
        </p>
      </div>

      <button
        type="button"
        onClick={onDone}
        className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-[#25D366] px-6 py-4 text-base font-bold text-[#04231a] transition active:scale-[0.98] hover:bg-[#1ebe5a]"
      >
        {t.drivers.submittedCta}
        <span aria-hidden>→</span>
      </button>
    </DriverModal>
  );
}
