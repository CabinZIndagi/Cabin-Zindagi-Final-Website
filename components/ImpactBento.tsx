"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";

/**
 * A brick/masonry-style bento gallery. Six fixed frames are laid out in an
 * offset-brick pattern (see impact section). Most frames sit empty; only a few
 * hold a photo at any moment. On a gentle interval one filled frame fades out
 * and a different empty frame fades a fresh photo in — so both the active
 * frames and the images they show keep shifting, cycling the whole pool through
 * without ever filling every frame at once.
 */

// Content pool that rotates through the frames: field photos plus the two
// partner logos. Logos render on a white chip (contained) so they read as
// brand marks; photos fill the frame (cover).
type Item = { src: string; type: "photo" | "logo" };

const PHOTOS: Item[] = [
  { src: "/gallery/n1.jpg", type: "photo" },
  { src: "/gallery/n2.jpg", type: "photo" },
  { src: "/gallery/n3.jpg", type: "photo" },
  { src: "/gallery/n4.jpg", type: "photo" },
  { src: "/gallery/n5.jpg", type: "photo" },
  { src: "/gallery/n7.jpg", type: "photo" },
  { src: "/gallery/n8.jpg", type: "photo" },
  { src: "/gallery/n9.jpg", type: "photo" },
  { src: "/logos/cdrm.jpeg", type: "logo" },
  { src: "/logos/natraj.jpeg", type: "logo" },
];

// Six frames in an offset-brick layout. `area` is a CSS grid-area shorthand
// (row-start / col-start / row-end / col-end) over a 6-col × 4-row grid; it
// only kicks in at md+ — on small screens the frames stack into a simple grid.
const TILES = [
  { area: "md:[grid-area:1/1/3/3]" }, // large top-left
  { area: "md:[grid-area:1/3/2/5]" }, // wide top-middle
  { area: "md:[grid-area:1/5/3/7]" }, // tall right
  { area: "md:[grid-area:2/3/3/5]" }, // wide middle
  { area: "md:[grid-area:3/1/5/4]" }, // wide bottom-left
  { area: "md:[grid-area:3/4/5/7]" }, // wide bottom-right
];

// How many frames hold a photo at once, how many swap each tick, and how often.
const ACTIVE_COUNT = 3;
const SWAP_COUNT = 2;
const CYCLE_MS = 2600;

const pick = <T,>(arr: T[]) => arr[Math.floor(Math.random() * arr.length)];

export function ImpactBento() {
  // active[i] = photo index shown in frame i, or null for an empty frame.
  const [active, setActive] = useState<(number | null)[]>(() => {
    const slots: (number | null)[] = TILES.map(() => null);
    // Seed a spread of filled frames with distinct photos.
    const spread = [0, 3, 5]; // top-left, middle, bottom-right
    spread.slice(0, ACTIVE_COUNT).forEach((tile, n) => {
      slots[tile] = n % PHOTOS.length;
    });
    return slots;
  });

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;

    const id = window.setInterval(() => {
      setActive((prev) => {
        const copy = [...prev];
        // Swap SWAP_COUNT frames this tick: each clears a filled frame and
        // fills a different empty one with a photo not currently on screen.
        for (let n = 0; n < SWAP_COUNT; n++) {
          const filled = copy.map((v, i) => (v !== null ? i : -1)).filter((i) => i >= 0);
          const empty = copy.map((v, i) => (v === null ? i : -1)).filter((i) => i >= 0);
          if (!filled.length || !empty.length) break;

          const from = pick(filled);
          const to = pick(empty);
          const shown = new Set(copy.filter((v): v is number => v !== null));
          const poolIdx = PHOTOS.map((_, i) => i).filter((i) => !shown.has(i));
          const photo = poolIdx.length ? pick(poolIdx) : pick(PHOTOS.map((_, i) => i));

          copy[from] = null;
          copy[to] = photo;
        }
        return copy;
      });
    }, CYCLE_MS);

    return () => window.clearInterval(id);
  }, []);

  return (
    <div className="grid aspect-[3/2] w-full grid-cols-2 gap-2.5 sm:gap-3 md:aspect-[16/9] md:grid-cols-6 md:grid-rows-4">
      {TILES.map((tile, i) => (
        // The frame itself is transparent — empty tiles vanish into the page
        // background; only a filled tile paints a rounded card + ring.
        <div key={i} className={`relative ${tile.area}`}>
          <AnimatePresence>
            {active[i] !== null && (
              <motion.div
                key={active[i]}
                initial={{ opacity: 0, scale: 1.06 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.02 }}
                transition={{ duration: 0.9, ease: "easeInOut" }}
                className={`absolute inset-0 flex items-center justify-center overflow-hidden rounded-2xl ring-1 ring-black/5 dark:ring-white/10 ${
                  PHOTOS[active[i] as number].type === "logo"
                    ? "bg-white p-5 sm:p-7"
                    : ""
                }`}
              >
                <img
                  src={PHOTOS[active[i] as number].src}
                  alt=""
                  loading="lazy"
                  className={
                    PHOTOS[active[i] as number].type === "logo"
                      ? "max-h-full max-w-full object-contain"
                      : "h-full w-full object-cover"
                  }
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}
    </div>
  );
}
