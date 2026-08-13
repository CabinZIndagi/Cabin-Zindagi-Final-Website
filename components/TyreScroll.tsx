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
import type { Locale } from "@/lib/dictionaries";
import { ImpactEntryContent } from "./ImpactContent";
import { ImpactCTA } from "./ImpactCTA";

// three.js touches the DOM/WebGL, so load the canvas client-side only.
const TyreCanvas = dynamic(() => import("./TyreCanvas"), { ssr: false });

type JourneyEntry = {
  title: string;
  variant: string;
  intro: string;
  cards: { title: string; text: string }[];
};

// Opening block ("Why this matters") shown while the wheel is parked far left.
type CrisisCopy = {
  eyebrow: string;
  heading: string;
  intro: string;
  cards: { title: string; text: string }[];
};
const INVISIBLE_CRISIS: Record<Locale, CrisisCopy> = {
  en: {
    eyebrow: "Why this matters",
    heading: "The Invisible Crisis on India's Highways",
    intro:
      "India's ₹14 lakh crore logistics industry runs on the backs of truck drivers. Yet they remain one of the country's most neglected workforces — no healthcare, no rest infrastructure, no voice. When drivers break down, supply chains break down.",
    cards: [
      { title: "Police Harassment", text: "Routine extortion and harassment on highways. Drivers lose earnings and dignity every single trip." },
      { title: "Zero Health Coverage", text: "No insurance, no access to healthcare. A single accident can destroy an entire family financially." },
      { title: "No Safe Rest Stops", text: "Drivers park wherever they can — unsafe, unhygienic, undignified. Fatigue is a leading cause of highway deaths." },
      { title: "Family Separation", text: "8 to 10 months away from home annually. Mental health, marriages, and children's upbringing — all suffer silently." },
    ],
  },
  hi: {
    eyebrow: "यह क्यों मायने रखता है",
    heading: "भारत के हाईवे पर अनदेखा संकट",
    intro:
      "भारत का ₹14 लाख करोड़ का लॉजिस्टिक्स उद्योग ट्रक ड्राइवरों के दम पर चलता है। फिर भी वे देश के सबसे उपेक्षित कामगारों में से हैं — न स्वास्थ्य सेवा, न आराम की सुविधा, न आवाज़। जब ड्राइवर टूटते हैं, तो सप्लाई चेन टूट जाती है।",
    cards: [
      { title: "पुलिस उत्पीड़न", text: "हाईवे पर रोज़मर्रा की वसूली और उत्पीड़न। ड्राइवर हर सफ़र में कमाई और सम्मान खोते हैं।" },
      { title: "शून्य स्वास्थ्य कवरेज", text: "न बीमा, न स्वास्थ्य सेवा तक पहुँच। एक दुर्घटना पूरे परिवार को आर्थिक रूप से बर्बाद कर सकती है।" },
      { title: "सुरक्षित विश्राम स्थल नहीं", text: "ड्राइवर जहाँ जगह मिले वहीं रुकते हैं — असुरक्षित, अस्वच्छ, बिना सम्मान के। थकान हाईवे मौतों का बड़ा कारण है।" },
      { title: "परिवार से दूरी", text: "साल में 8 से 10 महीने घर से दूर। मानसिक सेहत, रिश्ते और बच्चों की परवरिश — सब चुपचाप पीड़ित होते हैं।" },
    ],
  },
};

// The wheel finishes rolling at this scroll fraction; afterwards it stays parked
// at the right edge and the CTA fades in as the final frame.
const WHEEL_END = 0.85;

// Extra cards added so "The Outcome" fills its wider panel.
const OUTCOME_EXTRA: Record<Locale, { title: string; text: string }[]> = {
  en: [
    { title: "Stronger retention", text: "Drivers treated with dignity stay in the job longer" },
    { title: "Policy momentum", text: "Welfare standards moving into boardrooms and policy" },
  ],
  hi: [
    { title: "बेहतर रिटेंशन", text: "सम्मान के साथ रखे गए ड्राइवर नौकरी में ज़्यादा समय टिकते हैं" },
    { title: "नीति में गति", text: "वेलफेयर मानक बोर्डरूम और नीति में पहुँच रहे हैं" },
  ],
};

// One-off aside shown to the LEFT of the wheel during the "Our Work" stage —
// framed around how what we build helps the driver, not what we sell.
type AsideCopy = {
  eyebrow: string;
  title: string;
  intro: string;
  cards: { title: string; text: string }[];
};
const PRODUCTS_ASIDE: Record<Locale, AsideCopy> = {
  en: {
    eyebrow: "What it means for drivers",
    title: "Rest that restores",
    intro: "What we build gives drivers back what the road takes away — sleep, hygiene and a moment to recover.",
    cards: [
      { title: "A real night's sleep", text: "A clean bed and a quiet bay instead of a cramped cabin, so drivers start the next leg fresh." },
      { title: "Dignity and hygiene", text: "Showers and toilets let drivers wash up and feel human again before they roll out." },
      { title: "Healthier on the road", text: "Clean water and travel kits cut fatigue and keep drivers well across long hauls." },
    ],
  },
  hi: {
    eyebrow: "ड्राइवरों के लिए इसका मतलब",
    title: "आराम जो फिर से तरोताज़ा करे",
    intro: "हम जो बनाते हैं वह ड्राइवरों को वह लौटाता है जो सड़क छीन लेती है — नींद, साफ़-सफ़ाई और संभलने का एक पल।",
    cards: [
      { title: "एक सच्ची रात की नींद", text: "तंग केबिन के बजाय एक साफ़ बिस्तर और शांत जगह, ताकि ड्राइवर अगला सफ़र तरोताज़ा होकर शुरू करें।" },
      { title: "सम्मान और साफ़-सफ़ाई", text: "शावर और शौचालय ड्राइवरों को नहाने और रवाना होने से पहले फिर से इंसान जैसा महसूस करने देते हैं।" },
      { title: "सड़क पर ज़्यादा स्वस्थ", text: "साफ़ पानी और ट्रैवल किट थकान कम करते हैं और लंबे सफ़र में ड्राइवरों को स्वस्थ रखते हैं।" },
    ],
  },
};
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
  const { t, locale } = useLanguage();
  const impact = t.impact;
  const crisis = INVISIBLE_CRISIS[locale];
  const aside = PRODUCTS_ASIDE[locale];
  const outcomeExtra = OUTCOME_EXTRA[locale];
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
  const { t, locale } = useLanguage();
  const impact = t.impact;
  const crisis = INVISIBLE_CRISIS[locale];
  const aside = PRODUCTS_ASIDE[locale];
  const outcomeExtra = OUTCOME_EXTRA[locale];

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

  // Landing at the top on entry is handled by <ScrollTopOnMount /> in
  // app/impact/page.tsx — a one-shot reset here was not enough, see that file.

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
