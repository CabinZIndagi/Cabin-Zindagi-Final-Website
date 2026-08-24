"use client";

import { useEffect, type ReactNode } from "react";
import { motion } from "motion/react";

/**
 * Centred popup card used by the /for-drivers flow, modelled on the Spotify
 * in-app promo sheet: dimmed backdrop, the hub still visible behind it, card
 * pinned to the middle on mobile.
 *
 * The scrim stays dark in both themes; the card itself follows light/dark.
 * Steps that must be answered (language, details) pass no `onDismiss`, so the
 * only way past them is to answer.
 */
export function DriverModal({
  children,
  onDismiss,
  dismissLabel,
}: {
  children: ReactNode;
  onDismiss?: () => void;
  dismissLabel?: string;
}) {
  // Stop the page behind from scrolling under the sheet on mobile.
  useEffect(() => {
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, []);

  // Escape closes only the dismissible cards.
  useEffect(() => {
    if (!onDismiss) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onDismiss();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onDismiss]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-[60] flex items-center justify-center overflow-y-auto overscroll-contain bg-black/60 p-4 backdrop-blur-sm dark:bg-black/70"
    >
      <div className="my-auto flex w-full max-w-md flex-col items-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className="w-full rounded-3xl border border-black/10 bg-white p-6 text-neutral-900 shadow-2xl dark:border-white/10 dark:bg-neutral-900 dark:text-white sm:p-8"
        >
          {children}
        </motion.div>

        {onDismiss && (
          <button
            type="button"
            onClick={onDismiss}
            // Sits on the dark scrim in both themes, so it stays white.
            className="mt-5 rounded-full px-6 py-2 text-sm font-bold uppercase tracking-[0.15em] text-white/80 transition hover:text-white"
          >
            {dismissLabel}
          </button>
        )}
      </div>
    </div>
  );
}
