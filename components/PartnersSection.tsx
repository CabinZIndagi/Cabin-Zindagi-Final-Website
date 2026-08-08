"use client";

import { motion } from "motion/react";
import { useLanguage } from "@/lib/language-context";

/**
 * Full-viewport "partners" moment on the home page, sitting directly above the
 * Impact CTA. The two partner logos are the hero here — big white cards under an
 * emotional framing line — rather than tiles in a photo wall.
 */
export function PartnersSection() {
  const { t } = useLanguage();
  const p = t.home.partners;

  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden border-t border-black/10 bg-[var(--background)] px-6 py-28 dark:border-white/10">
      {/* Soft brand glow to lift the logos off the page */}
      <div className="pointer-events-none absolute inset-0 [background:radial-gradient(ellipse_at_center,rgba(254,104,15,0.10),transparent_65%)]" />

      <div className="relative mx-auto w-full max-w-4xl text-center">
        <motion.div
          initial={{ opacity: 0, y: 28, filter: "blur(6px)" }}
          whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          viewport={{ once: true, margin: "-120px" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <h2 className="mx-auto max-w-2xl text-4xl font-bold leading-tight tracking-tight sm:text-6xl">
            {p.title}
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-lg font-medium opacity-70 sm:text-xl">
            {p.body}
          </p>
          {/* Eyebrow flanked by rules on both sides */}
          <div className="mt-10 flex items-center justify-center gap-4">
            <span className="h-px w-12 bg-brand/30 sm:w-20" />
            <p className="whitespace-nowrap text-sm font-bold uppercase tracking-[0.3em] text-brand-light">
              {p.eyebrow}
            </p>
            <span className="h-px w-12 bg-brand/30 sm:w-20" />
          </div>
        </motion.div>

        {/* Logos — no container in light mode (white blends in via multiply);
            a clean white chip in dark mode so the marks stay legible. */}
        <div className="mt-10 grid gap-10 sm:grid-cols-2 sm:gap-6">
          {p.list.map((partner, i) => (
            <motion.div
              key={partner.alt}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.6, ease: "easeOut", delay: 0.15 + i * 0.12 }}
              className="group flex flex-col items-center"
            >
              <div className="flex h-24 w-full items-center justify-center dark:rounded-2xl dark:bg-white dark:px-8 dark:shadow-lg dark:ring-1 dark:ring-black/5">
                <img
                  src={partner.logo}
                  alt={partner.alt}
                  className="max-h-16 max-w-[85%] object-contain mix-blend-multiply transition duration-300 group-hover:scale-[1.03] dark:mix-blend-normal"
                />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
