"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useLanguage } from "@/lib/language-context";

/**
 * A brick/masonry-style bento gallery. Six fixed frames are laid out in an
 * offset-brick pattern (see impact section). The two central rectangular slots
 * are reserved for the partner logos (held static); the other four frames
 * always hold a field photo and, on a gentle interval, a couple of them
 * crossfade in place to fresh photos — so the wall keeps shifting through the
 * whole pool while staying completely filled. On-screen photos never duplicate.
 */

// Field photos that rotate through the four photo frames.
const PHOTOS = [
  "/gallery/n1.jpg",
  "/gallery/n2.jpg",
  "/gallery/n3.jpg",
  "/gallery/n4.jpg",
  "/gallery/n5.jpg",
  "/gallery/n7.jpg",
  "/gallery/n8.jpg",
  "/gallery/n9.jpg",
];

// Six frames in an offset-brick layout. `area` is a CSS grid-area shorthand
// (row-start / col-start / row-end / col-end) over a 6-col × 4-row grid; it
// only kicks in at md+ — on small screens the frames stack into a simple grid.
// `logo` pins a frame to a partner mark (never part of the photo rotation).
const TILES = [
  { area: "md:[grid-area:1/1/3/3]" }, // large top-left — photo
  {
    area: "md:[grid-area:1/3/2/5]", // rectangular slot — CDRM logo (captioned)
    logo: {
      src: "/logos/cdrm.jpeg",
      alt: "Centre for Driver Relationship Management",
      label: true,
    },
  },
  { area: "md:[grid-area:1/5/3/7]" }, // tall right — photo
  {
    area: "md:[grid-area:2/3/3/5]", // rectangular slot — Natraj logo
    logo: { src: "/logos/natraj.jpeg", alt: "Natraj Roadways Private Limited" },
  },
  { area: "md:[grid-area:3/1/5/4]" }, // wide bottom-left — photo
  { area: "md:[grid-area:3/4/5/7]" }, // wide bottom-right — photo
] as const;

// Tile indices that show rotating photos (everything without a pinned logo).
const PHOTO_TILES = TILES.map((t, i) => ("logo" in t ? -1 : i)).filter((i) => i >= 0);

// How many photo frames crossfade to a new image each tick, and how often.
const SWAP_COUNT = 2;
const CYCLE_MS = 3200;
// Crossfade duration (seconds) — gentle, unhurried transitions.
const FADE_S = 1.5;

const pick = <T,>(arr: T[]) => arr[Math.floor(Math.random() * arr.length)];

export function ImpactBento() {
  const { t } = useLanguage();
  // active[i] = photo index for photo frames; ignored for logo frames.
  const [active, setActive] = useState<number[]>(() =>
    TILES.map((_, i) => i % PHOTOS.length),
  );

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;

    const id = window.setInterval(() => {
      setActive((prev) => {
        const copy = [...prev];
        // Crossfade SWAP_COUNT distinct photo frames to photos not on screen.
        const order = [...PHOTO_TILES].sort(() => Math.random() - 0.5);
        for (let n = 0; n < SWAP_COUNT && n < order.length; n++) {
          const tile = order[n];
          const shown = new Set(PHOTO_TILES.map((t) => copy[t]));
          const poolIdx = PHOTOS.map((_, i) => i).filter((i) => !shown.has(i));
          const next = poolIdx.length
            ? pick(poolIdx)
            : pick(PHOTOS.map((_, i) => i).filter((i) => i !== copy[tile]));
          copy[tile] = next;
        }
        return copy;
      });
    }, CYCLE_MS);

    return () => window.clearInterval(id);
  }, []);

  return (
    <div className="grid h-[65vh] w-full grid-cols-2 grid-rows-3 gap-2.5 sm:gap-3 md:h-[82vh] md:grid-cols-6 md:grid-rows-4">
      {TILES.map((tile, i) => (
        <div key={i} className={`relative overflow-hidden rounded-2xl ${tile.area}`}>
          {"logo" in tile ? (
            // Reserved logo slot — static, on a white chip so the mark reads.
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 overflow-hidden rounded-2xl bg-white px-5 py-4 ring-1 ring-black/5 sm:px-7 sm:py-5 dark:ring-white/10">
              {"label" in tile.logo && tile.logo.label && (
                <span className="text-[10px] font-semibold uppercase tracking-[0.25em] text-black/40 sm:text-xs">
                  {t.impact.associatedWith}
                </span>
              )}
              <img
                src={tile.logo.src}
                alt={tile.logo.alt}
                className="max-h-full min-h-0 max-w-full flex-1 object-contain"
              />
            </div>
          ) : (
            <AnimatePresence>
              <motion.div
                key={active[i]}
                initial={{ opacity: 0, scale: 1.06 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.02 }}
                transition={{ duration: FADE_S, ease: "easeInOut" }}
                className="absolute inset-0 overflow-hidden rounded-2xl ring-1 ring-black/5 dark:ring-white/10"
              >
                <img
                  src={PHOTOS[active[i]]}
                  alt=""
                  loading="lazy"
                  className="h-full w-full object-cover"
                />
              </motion.div>
            </AnimatePresence>
          )}
        </div>
      ))}
    </div>
  );
}
