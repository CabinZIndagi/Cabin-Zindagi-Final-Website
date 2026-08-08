"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { useLanguage } from "@/lib/language-context";

/**
 * Closing section that bridges the page into the Impact page. It scroll-reveals
 * (blur + rise) and the CTA navigates to /impact. The background returns to the
 * page background so it flows continuously out of the Outcome section above and
 * into the Impact page below.
 */
export function ImpactTransition() {
  const { t } = useLanguage();
  const c = t.impact.cta;

  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden border-t border-black/10 bg-[var(--background)] px-6 py-32 dark:border-white/10">
      {/* Soft brand glow leading the eye toward the CTA */}
      <div className="pointer-events-none absolute inset-0 [background:radial-gradient(ellipse_at_center,rgba(254,104,15,0.10),transparent_65%)]" />

      <motion.div
        initial={{ opacity: 0, y: 32, filter: "blur(6px)" }}
        whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        viewport={{ once: true, margin: "-120px" }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative mx-auto max-w-3xl text-center"
      >
        <p className="text-sm font-bold uppercase tracking-[0.3em] text-brand-light">
          {t.nav.impact}
        </p>

        <h2 className="mt-4 text-4xl font-bold leading-tight tracking-tight sm:text-6xl">
          {c.headLead}{" "}
          <span className="bg-gradient-to-r from-brand via-brand-light to-accent bg-clip-text text-transparent">
            {c.headStrong}
          </span>
        </h2>

        <p className="mx-auto mt-6 max-w-xl text-lg font-medium opacity-80 sm:text-xl">
          {c.subLead} <strong className="font-bold text-brandtext">{c.subWord1}</strong>{" "}
          {c.subMid}{" "}
          <strong className="font-bold text-brandtext">{c.subWord2}</strong> {c.subTail}
        </p>

        <Link
          href="/impact"
          className="group mt-10 inline-flex items-center gap-2 rounded-full bg-brand px-8 py-4 text-base font-semibold text-[#1f2a33] shadow-lg shadow-brand/30 transition hover:bg-brand-light"
        >
          {t.home.ctaSecondary}
          <span className="material-symbols-outlined text-xl transition-transform group-hover:translate-x-1">
            arrow_forward
          </span>
        </Link>
      </motion.div>
    </section>
  );
}
