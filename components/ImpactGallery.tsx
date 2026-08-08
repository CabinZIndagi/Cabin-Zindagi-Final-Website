"use client";

import { motion } from "motion/react";
import { ImpactBento } from "@/components/ImpactBento";

/**
 * Full-viewport section that hosts the crossfading brick-bento gallery. It sits
 * directly above the Impact CTA section on the home page and takes the whole
 * screen, so the wall of field photos + partner logos reads as its own moment.
 */
export function ImpactGallery() {
  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[var(--background)] px-4 py-16 sm:px-6">
      <motion.div
        initial={{ opacity: 0, y: 40, filter: "blur(8px)" }}
        whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="relative z-10 mx-auto w-full max-w-6xl"
      >
        <ImpactBento />
      </motion.div>
    </section>
  );
}
