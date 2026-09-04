"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import {
  motion,
  useTransform,
  useMotionValue,
  useMotionValueEvent,
  type MotionValue,
} from "motion/react";
import { useLanguage } from "@/lib/language-context";
import type { Dictionary } from "@/lib/dictionaries";

type JourneyEntry = Dictionary["impact"]["journey"][number];
import { ImpactEntryContent } from "./ImpactContent";
import { ImpactCTA } from "./ImpactCTA";

// three.js touches the DOM/WebGL, so load the canvas client-side only.
const TyreCanvas = dynamic(() => import("./TyreCanvas"), { ssr: false });


// The wheel finishes rolling at this scroll fraction; afterwards it stays parked
// at the right edge and the CTA fades in as the final frame.
const WHEEL_END = 0.85;

// Extra cards added so "The Outcome" fills its wider panel.

// One-off aside shown to the LEFT of the wheel during the "Our Work" stage —
// framed around how what we build helps the driver, not what we sell.
// Matches the "Our Work" slice window so the aside appears only there.
const PRODUCTS_RANGE: [number, number, number, number] = [0.33, 0.36, 0.45, 0.5];

// One scroll slice [fadeInStart, fullStart, fullEnd, fadeOutEnd] + the side the
// card sits on + panel width. Cards sit opposite the wheel (rolls left -> right).
const slices: {
  side: "left" | "right";
  range: [number, number, number, number];
  maxW: string;
}[] = [
  { side: "right", range: [0.13, 0.16, 0.26, 0.31], maxW: "max-w-lg" },
  { side: "right", range: [0.33, 0.36, 0.45, 0.5], maxW: "max-w-md" },
  { side: "left", range: [0.52, 0.55, 0.63, 0.68], maxW: "max-w-2xl" },
  { side: "left", range: [0.7, 0.73, 0.8, 0.84], maxW: "max-w-3xl" },
];

function Stage({
  entry,
  index,
  side,
  range,
  maxW,
  scrollYProgress,
}: {
  entry: JourneyEntry;
  index: number;
  side: "left" | "right";
  range: [number, number, number, number];
  maxW: string;
  scrollYProgress: MotionValue<number>;
}) {
  const [a, b, c, d] = range;
  const opacity = useTransform(scrollYProgress, [a, b, c, d], [0, 1, 1, 0]);
  const y = useTransform(scrollYProgress, [a, b], [40, 0]);

  return (
    <div
      className={`pointer-events-none absolute inset-y-0 z-10 flex w-[90%] ${maxW} items-center [@media(max-height:940px)]:pt-56 ${
        side === "left" ? "left-4 sm:left-12" : "right-4 sm:right-12"
      }`}
    >
      <motion.div style={{ opacity, y }} className="w-full">
        <div className="rounded-2xl border border-black/10 bg-[var(--background)]/70 p-8 shadow-xl backdrop-blur-md dark:border-white/15">
          <ImpactEntryContent entry={entry} index={index} />
        </div>
      </motion.div>
    </div>
  );
}

function TyreScrollDesktop() {
  const { t } = useLanguage();
  const impact = t.impact;
  const { crisis, productsAside: aside, outcomeExtra } = t.catalog;
  const sectionRef = useRef<HTMLDivElement>(null);
  const progress = useRef(0);

  // Manual scroll progress (0 at section top, 1 at section bottom). framer's
  // target-based useScroll silently fails to track in production builds, so we
  // compute it from the section's rect on scroll — reliable everywhere.
  const scrollYProgress = useMotionValue(0);
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const onScroll = () => {
      const total = el.offsetHeight - window.innerHeight;
      const scrolled = Math.min(
        Math.max(-el.getBoundingClientRect().top, 0),
        total,
      );
      scrollYProgress.set(total > 0 ? scrolled / total : 0);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [scrollYProgress]);

  const [trigger, setTrigger] = useState(0);

  // Wheel completes its roll by WHEEL_END, then holds at the right edge.
  const wheelProgress = useTransform(scrollYProgress, [0, WHEEL_END], [0, 1]);
  useMotionValueEvent(wheelProgress, "change", (v) => {
    progress.current = v;
    setTrigger((t) => t + 1);
  });

  // Opening block is full at the very start, then fades as the first entry rolls in.
  const introOpacity = useTransform(scrollYProgress, [0, 0.08, 0.12], [1, 1, 0]);
  // Products/dorm aside fades in/out with the "Our Work" stage.
  const productsOpacity = useTransform(scrollYProgress, PRODUCTS_RANGE, [0, 1, 1, 0]);
  const productsY = useTransform(scrollYProgress, [PRODUCTS_RANGE[0], PRODUCTS_RANGE[1]], [40, 0]);
  // Heading fades out as the CTA takes over.
  const headingOpacity = useTransform(scrollYProgress, [0.8, 0.87], [1, 0]);
  // CTA fades in for the final frame; it's clickable whenever it's visible
  // (pointer-events tracks opacity, so selecting amounts always works).
  const ctaOpacity = useTransform(scrollYProgress, [0.85, 0.93], [0, 1]);
  const ctaPointerEvents = useTransform(ctaOpacity, (o) => (o > 0.6 ? "auto" : "none"));

  return (
    <section ref={sectionRef} className="relative h-[400dvh]">
      <div className="sticky top-0 h-[100dvh] overflow-hidden">
        {/* Persistent heading (fades out before the CTA) */}
        <motion.div
          style={{ opacity: headingOpacity }}
          className="pointer-events-none absolute inset-x-0 top-0 z-20 px-4 pt-32 text-center"
        >
          <h1 className="text-3xl font-bold tracking-tight sm:text-5xl">
            {impact.heading}
          </h1>
          <p className="mx-auto mt-3 max-w-md text-sm opacity-60">
            {impact.subheading}
          </p>
        </motion.div>

        {/* Opening block — fills the centre/right while the wheel is far left */}
        <div className="pointer-events-none absolute inset-y-0 left-4 right-4 z-10 flex items-center [@media(max-height:940px)]:pt-56 sm:left-[28%] sm:right-12">
          <motion.div style={{ opacity: introOpacity }} className="w-full">
            <div className="rounded-2xl border border-black/10 bg-[var(--background)]/70 p-8 shadow-xl backdrop-blur-md dark:border-white/15">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brandtext">
                {crisis.eyebrow}
              </p>
              <h2 className="mt-3 text-2xl font-bold tracking-tight sm:text-3xl">
                {crisis.heading}
              </h2>
              <p className="mt-4 text-sm leading-relaxed opacity-80">
                {crisis.intro}
              </p>
              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                {crisis.cards.map((card) => (
                  <div
                    key={card.title}
                    className="rounded-2xl border border-black/5 bg-black/[0.02] p-5 dark:border-white/10 dark:bg-white/[0.03]"
                  >
                    <h4 className="text-base font-semibold text-brandtext">
                      {card.title}
                    </h4>
                    <p className="mt-1 text-sm opacity-70">{card.text}</p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        {/* One Impact entry per scroll slice, fading in/out opposite the wheel */}
        {impact.journey.map((entry, i) => {
          const e = entry as JourneyEntry;
          // "The Outcome" gets a couple of extra cards to fill its wider panel.
          const filled =
            e.variant === "dark"
              ? { ...e, cards: [...e.cards, ...outcomeExtra] }
              : e;
          return (
            <Stage
              key={e.title}
              entry={filled}
              index={i}
              side={slices[i]?.side ?? (i % 2 === 0 ? "right" : "left")}
              range={slices[i]?.range ?? [0, 0.05, 0.75, 0.8]}
              maxW={slices[i]?.maxW ?? "max-w-lg"}
              scrollYProgress={scrollYProgress}
            />
          );
        })}

        {/* One-off products/dorm aside, left of the wheel during "Our Work" */}
        <div className="pointer-events-none absolute inset-y-0 left-4 z-10 flex w-[90%] max-w-sm items-center [@media(max-height:940px)]:pt-56 sm:left-12">
          <motion.div style={{ opacity: productsOpacity, y: productsY }} className="w-full">
            <div className="rounded-2xl border border-black/10 bg-[var(--background)]/70 p-7 shadow-xl backdrop-blur-md dark:border-white/15">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brandtext">
                {aside.eyebrow}
              </p>
              <h3 className="mt-2 text-xl font-bold tracking-tight">
                {aside.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed opacity-80">
                {aside.intro}
              </p>
              <div className="mt-5 space-y-3">
                {aside.cards.map((card) => (
                  <div
                    key={card.title}
                    className="rounded-2xl border border-black/5 bg-black/[0.02] p-4 dark:border-white/10 dark:bg-white/[0.03]"
                  >
                    <h4 className="text-sm font-semibold text-brandtext">
                      {card.title}
                    </h4>
                    <p className="mt-1 text-xs leading-snug opacity-70">
                      {card.text}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Final frame: CTA fades in behind the parked wheel */}
        <motion.div
          style={{ opacity: ctaOpacity, pointerEvents: ctaPointerEvents }}
          className="absolute inset-0 z-20"
        >
          <ImpactCTA compact />
        </motion.div>

        {/* Wheel sits on top (decorative) so it stays visible at the right edge.
            Force the r3f canvas itself to be click-through so it can't block the
            CTA buttons underneath (the wheel needs no pointer interaction). */}
        <div className="pointer-events-none absolute inset-0 z-30 [&_*]:!pointer-events-none">
          <TyreCanvas progress={progress} trigger={trigger} />
        </div>
      </div>
    </section>
  );
}

// Simple card used in the mobile stacked layout.
function MiniCard({ title, text }: { title: string; text: string }) {
  return (
    <div className="rounded-2xl border border-black/5 bg-black/[0.02] p-5 dark:border-white/10 dark:bg-white/[0.03]">
      <h4 className="text-sm font-semibold text-brandtext">{title}</h4>
      <p className="mt-1 text-sm leading-snug opacity-70">{text}</p>
    </div>
  );
}

// Mobile / narrow screens: no 3D wheel or pinned scroll — just the content,
// stacked and fully scrollable, with the CTA as a normal section.
function TyreScrollMobile() {
  const { t } = useLanguage();
  const impact = t.impact;
  const { crisis, productsAside: aside, outcomeExtra } = t.catalog;

  return (
    <>
      <div className="mx-auto max-w-2xl px-4 pb-16 pt-36">
        <h1 className="text-3xl font-bold tracking-tight">{impact.heading}</h1>
        <p className="mt-3 text-sm opacity-60">{impact.subheading}</p>

        {/* Why this matters */}
        <div className="mt-12">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brandtext">
            {crisis.eyebrow}
          </p>
          <h2 className="mt-2 text-2xl font-bold tracking-tight">
            {crisis.heading}
          </h2>
          <p className="mt-3 text-sm leading-relaxed opacity-80">
            {crisis.intro}
          </p>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {crisis.cards.map((card) => (
              <MiniCard key={card.title} title={card.title} text={card.text} />
            ))}
          </div>
        </div>

        {/* Impact journey */}
        <div className="mt-14 space-y-14">
          {impact.journey.map((entry, i) => {
            const e = entry as JourneyEntry;
            const filled =
              e.variant === "dark"
                ? { ...e, cards: [...e.cards, ...outcomeExtra] }
                : e;
            return <ImpactEntryContent key={e.title} entry={filled} index={i} />;
          })}
        </div>

        {/* Rest infrastructure aside */}
        <div className="mt-14">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brandtext">
            {aside.eyebrow}
          </p>
          <h3 className="mt-2 text-xl font-bold tracking-tight">
            {aside.title}
          </h3>
          <p className="mt-3 text-sm leading-relaxed opacity-80">
            {aside.intro}
          </p>
          <div className="mt-5 space-y-3">
            {aside.cards.map((card) => (
              <MiniCard key={card.title} title={card.title} text={card.text} />
            ))}
          </div>
        </div>
      </div>

      <ImpactCTA />
    </>
  );
}

export function TyreScroll() {
  // Default to the mobile layout for SSR; switch to the 3D pinned experience
  // only on screens that are both wide AND tall enough after mount. (Scroll
  // tracking uses a manual listener, so this late mount no longer breaks the
  // stage animations.)
  const [isDesktop, setIsDesktop] = useState(false);

  // Land at the very top when arriving here — this is a 400dvh scroll
  // experience, and opening it part-way through looks like the wheel has
  // already rolled. `behavior: "instant"` opts this one scroll out of any
  // smooth scrolling: toggling the root's inline `scroll-behavior` around the
  // call instead lets a stylesheet default win, which animated the correction
  // over ~900ms on reload — visibly scrolling the page up from the bottom.
  useEffect(() => {
    const toTop = () =>
      window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    toTop();
    // Re-assert over the next few frames: on a Back navigation the router
    // restores the position we left this page at, and that restore lands after
    // this effect — without these the wheel would pick up mid-roll.
    let n = 0;
    let raf = requestAnimationFrame(function again() {
      toTop();
      if (++n < 4) raf = requestAnimationFrame(again);
    });
    return () => cancelAnimationFrame(raf);
  }, []);

  useEffect(() => {
    // The pinned 3D experience needs both horizontal AND vertical room. Below
    // ~760px tall (short laptops, split-screen, heavy zoom, odd aspect ratios)
    // the fixed heading and the centred panels collide, so fall back to the
    // fully-scrollable stacked layout, which handles any size gracefully.
    const mq = window.matchMedia("(min-width: 1024px) and (min-height: 760px)");
    const update = () => setIsDesktop(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  return isDesktop ? <TyreScrollDesktop /> : <TyreScrollMobile />;
}
