"use client";

import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import {
  motion,
  useMotionValue,
  useMotionValueEvent,
  useTransform,
  type MotionValue,
} from "motion/react";
import { useLanguage } from "@/lib/language-context";

// How tall the scroll track is, in viewport heights. Taller = slower scrub + more
// breathing room between beats.
const TRACK_VH = 680;

// Scroll progress (0..1) where each beat is fully shown — used to place scroll-snap
// anchors so users land on a beat instead of scrolling past it: brand, tagline,
// "What We Do", the three pillars, the closing quote.
const SNAP_POINTS = [0, 0.115, 0.265, 0.425, 0.585, 0.745, 0.92];

// One overlay "beat" tied to a scroll window: [fadeInStart, fullStart, fullEnd,
// fadeOutEnd] in scroll progress (0..1).
type Range = [number, number, number, number];

type Reveal = "fade" | "blur" | "wipe" | "mask" | "fadeup";

// Beats share their reveal style + whether they're currently active so the text
// helpers below know when to play the entrance animation.
const BeatContext = createContext<{ reveal: Reveal; active: boolean }>({
  reveal: "fade",
  active: true,
});

// Heading text. In "blur" mode each word blurs/slides in, staggered — the same
// entrance as the home page's "What We Do" heading (Pillars.tsx). In "fade" mode
// it renders as plain text (the Beat's own opacity handles the reveal).
function Words({ text, className }: { text: string; className?: string }) {
  const { reveal, active } = useContext(BeatContext);
  if (reveal === "wipe") {
    // Left-to-right wipe: unclip the right edge as the beat becomes active.
    return (
      <motion.span
        className={`inline-block ${className ?? ""}`}
        initial={false}
        animate={{ clipPath: active ? "inset(0 0 0 0)" : "inset(0 100% 0 0)" }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        {text}
      </motion.span>
    );
  }
  if (reveal === "mask") {
    // Mask rise: the line slides up from behind a clip mask, with a touch of blur.
    return (
      <span className={`inline-block overflow-hidden align-bottom ${className ?? ""}`}>
        <motion.span
          className="inline-block"
          initial={false}
          animate={{
            y: active ? "0%" : "115%",
            filter: active ? "blur(0px)" : "blur(4px)",
          }}
          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
        >
          {text}
        </motion.span>
      </span>
    );
  }
  if (reveal === "fadeup") {
    return (
      <motion.span
        className={`inline-block ${className ?? ""}`}
        initial={false}
        animate={{ opacity: active ? 1 : 0, y: active ? 0 : 16 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        {text}
      </motion.span>
    );
  }
  if (reveal !== "blur") return <span className={className}>{text}</span>;
  return (
    <span className={className}>
      {text.split(" ").map((word, i) => (
        <motion.span
          key={`${word}-${i}`}
          className="mr-[0.25em] inline-block"
          initial={false}
          animate={
            active
              ? { opacity: 1, filter: "blur(0px)", y: 0 }
              : { opacity: 0, filter: "blur(6px)", y: 12 }
          }
          transition={{
            duration: 0.35,
            ease: "easeOut",
            delay: active ? i * 0.08 : 0,
          }}
        >
          {word}
        </motion.span>
      ))}
    </span>
  );
}

// Block text (paragraphs). Blur/slide-in as a single unit in "blur" mode.
function Reveal({
  children,
  className,
  delay = 0.15,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  const { reveal, active } = useContext(BeatContext);
  if (reveal === "wipe") {
    return (
      <motion.p
        className={className}
        initial={false}
        animate={{ clipPath: active ? "inset(0 0 0 0)" : "inset(0 100% 0 0)" }}
        transition={{ duration: 0.9, ease: "easeOut", delay: active ? delay : 0 }}
      >
        {children}
      </motion.p>
    );
  }
  if (reveal === "mask" || reveal === "fadeup") {
    // Sub-lines reveal word-by-word (gentle fade + rise, left to right) so the
    // secondary copy has its own life under the heading.
    if (typeof children === "string") {
      return (
        <p className={className}>
          {children.split(" ").map((word, i) => (
            <motion.span
              key={`${word}-${i}`}
              className="mr-[0.25em] inline-block"
              initial={false}
              animate={{ opacity: active ? 1 : 0, y: active ? 0 : 10 }}
              transition={{
                duration: 0.4,
                ease: "easeOut",
                delay: active ? delay + i * 0.025 : 0,
              }}
            >
              {word}
            </motion.span>
          ))}
        </p>
      );
    }
    return (
      <motion.p
        className={className}
        initial={false}
        animate={{ opacity: active ? 1 : 0, y: active ? 0 : 16 }}
        transition={{ duration: 0.6, ease: "easeOut", delay: active ? delay : 0 }}
      >
        {children}
      </motion.p>
    );
  }
  if (reveal !== "blur") return <p className={className}>{children}</p>;
  return (
    <motion.p
      className={className}
      initial={false}
      animate={
        active
          ? { opacity: 1, filter: "blur(0px)", y: 0 }
          : { opacity: 0, filter: "blur(6px)", y: 12 }
      }
      transition={{ duration: 0.4, ease: "easeOut", delay: active ? delay : 0 }}
    >
      {children}
    </motion.p>
  );
}

function Beat({
  range,
  scrollYProgress,
  reveal,
  children,
}: {
  range: Range;
  scrollYProgress: MotionValue<number>;
  reveal: Reveal;
  children: ReactNode;
}) {
  const opacity = useTransform(scrollYProgress, range, [0, 1, 1, 0]);
  const y = useTransform(scrollYProgress, range, [28, 0, 0, -28]);
  // Drop the layer entirely once invisible, so no compositing ghost lingers.
  const visibility = useTransform(opacity, (o) =>
    o < 0.02 ? "hidden" : "visible",
  );

  // Active while the beat is within its visible window — drives the blur entrance.
  const [active, setActive] = useState(false);
  useMotionValueEvent(scrollYProgress, "change", (p) => {
    const next = p >= range[0] && p <= range[3];
    setActive((prev) => (prev === next ? prev : next));
  });

  return (
    <motion.div
      style={{ opacity, y, visibility }}
      className="pointer-events-none absolute inset-0 flex items-center justify-center px-6"
    >
      <div className="w-full max-w-2xl text-center text-white">
        <BeatContext.Provider value={{ reveal, active }}>
          {children}
        </BeatContext.Provider>
      </div>
    </motion.div>
  );
}

/**
 * Scroll-scrubbed hero video with timed content beats. The clip is pinned and its
 * playback is driven by scroll (currentTime <- scroll progress, eased in a rAF
 * loop). The same progress value reveals the home-page copy in sequence — brand ->
 * tagline -> "What We Do" + the three pillars -> the closing quote.
 *
 * `reveal="blur"` gives the beats the word-by-word blur entrance (like Pillars).
 */
export function ScrollVideo({
  src = "/test/scroll.mp4",
  reveal = "fade",
  brandColor = "logo",
  inset = false,
}: {
  src?: string;
  reveal?: Reveal;
  // "logo" = Cabin orange / Zindagi green; "theme" = black (light) / white (dark).
  brandColor?: "logo" | "theme";
  // false = full-bleed; true = contained card with margins + rounded corners.
  inset?: boolean;
}) {
  const { t, locale } = useLanguage();
  const home = t.home;
  const [brandFirst, ...brandRestParts] = t.brand.split(/\s+/);
  const brandRest = brandRestParts.join(" ");
  const [quoteLead, ...quoteRest] = home.quote.split(",");
  const quoteEmphasis = quoteRest.join(",").trim();

  const sectionRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [ready, setReady] = useState(false);
  const scrollYProgress = useMotionValue(0);

  useEffect(() => {
    const section = sectionRef.current;
    const video = videoRef.current;
    if (!section || !video) return;

    let duration = 0;
    let targetTime = 0;
    let currentTime = 0;
    let raf = 0;
    let isRunning = false;

    const computeProgress = () => {
      const total = section.offsetHeight - window.innerHeight;
      const scrolled = Math.min(
        Math.max(-section.getBoundingClientRect().top, 0),
        Math.max(total, 0),
      );
      return total > 0 ? scrolled / total : 0;
    };

    const tick = () => {
      if (duration > 0) {
        const diff = targetTime - currentTime;
        if (Math.abs(diff) < 0.001) {
          currentTime = targetTime;
          isRunning = false;
        } else {
          currentTime += diff * 0.12;
        }
        if (!video.seeking) {
          try {
            video.currentTime = currentTime;
          } catch {
            /* seek can throw mid-load; ignore and retry next frame */
          }
        }
      } else {
        isRunning = false;
      }
      if (isRunning) {
        raf = requestAnimationFrame(tick);
      }
    };

    const onScroll = () => {
      const p = computeProgress();
      scrollYProgress.set(p);
      if (duration > 0) {
        targetTime = p * duration;
        if (!isRunning) {
          isRunning = true;
          raf = requestAnimationFrame(tick);
        }
      }
    };

    const onMeta = () => {
      duration = video.duration || 0;
      setReady(true);
      const p = computeProgress();
      scrollYProgress.set(p);
      targetTime = p * duration;
      currentTime = targetTime;
      try {
        video.currentTime = currentTime;
      } catch {}
      if (!isRunning) {
        isRunning = true;
        raf = requestAnimationFrame(tick);
      }
    };

    if (video.readyState >= 1) onMeta();
    else video.addEventListener("loadedmetadata", onMeta);

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      video.removeEventListener("loadedmetadata", onMeta);
    };
  }, [scrollYProgress]);

  const pillarRanges: Range[] = [
    [0.35, 0.39, 0.46, 0.51],
    [0.51, 0.55, 0.62, 0.67],
    [0.67, 0.71, 0.78, 0.83],
  ];

  const brandOpacity = useTransform(scrollYProgress, [0, 0.06, 0.1], [1, 1, 0]);
  const brandY = useTransform(scrollYProgress, [0, 0.1], [0, -28]);
  const brandVisibility = useTransform(brandOpacity, (o) =>
    o < 0.02 ? "hidden" : "visible",
  );
  const introOpacity = useTransform(
    scrollYProgress,
    [0.03, 0.08, 0.15, 0.19],
    [0, 1, 1, 0],
  );
  const introY = useTransform(
    scrollYProgress,
    [0.03, 0.08, 0.15, 0.19],
    [24, 0, 0, -16],
  );
  const introVisibility = useTransform(introOpacity, (o) =>
    o < 0.02 ? "hidden" : "visible",
  );

  const barWidth = useTransform(scrollYProgress, (p) => `${p * 100}%`);

  return (
    <section ref={sectionRef} style={{ height: `${TRACK_VH}vh` }} className="relative">
      <div
        className={`sticky top-0 h-screen w-full ${
          inset
            ? "flex flex-col bg-neutral-100 px-4 pb-6 pt-24 dark:bg-neutral-950 sm:px-6 sm:pb-8"
            : "overflow-hidden bg-black"
        }`}
      >
        {/* Stage: full-bleed, or a contained rounded card when inset */}
        <div
          className={
            inset
              ? "relative w-full flex-1 overflow-hidden rounded-[2rem] bg-black shadow-2xl"
              : "relative h-full w-full"
          }
        >
        <video
          ref={videoRef}
          src={src}
          muted
          playsInline
          preload="auto"
          // Playback is driven by scroll, so it must never autoplay.
          className="absolute inset-0 h-full w-full object-cover"
        />

        {/* Scrim for legibility — light wash in light mode (black text), dark wash
            in dark mode (white text). */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/30 to-black/60" />

        {/* Loading hint until metadata is ready */}
        {!ready && (
          <div className="absolute inset-0 grid place-items-center text-white/70">
            <p className="animate-pulse text-sm">Loading…</p>
          </div>
        )}

        {/* Beat 1a — brand wordmark, centered on its own so it sits dead-center on
            the first frame, then fades out first as you scroll. */}
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center px-6">
          <motion.h1
            style={{ opacity: brandOpacity, y: brandY, visibility: brandVisibility }}
            className="mx-auto max-w-5xl text-center text-5xl font-extrabold tracking-tight drop-shadow-lg sm:text-7xl md:text-8xl"
          >
            {brandColor === "theme" ? (
              <span className="text-white">
                {brandFirst}
                {locale === "en" ? "" : " "}
                {brandRest}
              </span>
            ) : (
              <>
                <span className="text-brand/80">{brandFirst}</span>
                {locale === "en" ? "" : " "}
                <span className="text-accent/80">{brandRest}</span>
              </>
            )}
          </motion.h1>
        </div>

        {/* Beat 1b — tagline + subtitle, also centered; fade in on the first scroll
            (so the opening frame shows only the wordmark). */}
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center px-6">
          <motion.div
            style={{ opacity: introOpacity, y: introY, visibility: introVisibility }}
            className="mx-auto w-full max-w-2xl text-center text-white"
          >
            <p className="text-base font-bold uppercase tracking-[0.2em] text-brand-light/90 sm:text-xl">
              {home.tagline}
            </p>
            <p className="mx-auto mt-5 max-w-2xl text-lg font-semibold leading-relaxed text-white/90 sm:text-2xl">
              {home.subtitle}
            </p>
          </motion.div>
        </div>

        {/* Beat 2 — "What We Do" */}
        <Beat range={[0.19, 0.23, 0.3, 0.35]} scrollYProgress={scrollYProgress} reveal={reveal}>
          <h2 className="text-4xl font-bold tracking-tight drop-shadow-lg sm:text-6xl">
            <Words text={home.pillarsHeading} />
          </h2>
          <Reveal className="mx-auto mt-4 max-w-lg text-lg font-semibold opacity-90 sm:text-2xl">
            {home.pillarsSub}
          </Reveal>
        </Beat>

        {/* Beats 3-5 — the three pillars */}
        {home.pillars.map((pillar, i) => (
          <Beat
            key={pillar.title}
            range={pillarRanges[i]}
            scrollYProgress={scrollYProgress}
            reveal={reveal}
          >
            <Reveal
              className="text-base font-bold uppercase tracking-[0.3em] text-brand-light"
              delay={0}
            >
              {`0${i + 1}`}
            </Reveal>
            <h3 className="mt-3 text-4xl font-bold tracking-tight drop-shadow-lg sm:text-6xl">
              <Words text={pillar.title} />
            </h3>
            <Reveal className="mx-auto mt-5 max-w-2xl text-lg font-semibold leading-relaxed opacity-95 sm:text-2xl">
              {pillar.detail}
            </Reveal>
          </Beat>
        ))}

        {/* Beat 6 — closing quote. Fade-out points are past 1 so it stays fully
            visible at the end of the scroll (progress maxes at 1). */}
        <Beat range={[0.83, 0.88, 1.4, 1.5]} scrollYProgress={scrollYProgress} reveal={reveal}>
          <Reveal
            className="text-3xl font-semibold leading-snug tracking-tight drop-shadow-lg sm:text-5xl"
            delay={0}
          >
            <span className="bg-gradient-to-r from-brand via-brand-light to-accent bg-clip-text font-bold text-transparent">
              {quoteLead.trim()},
            </span>
            <span className="mt-1 block">{quoteEmphasis}</span>
          </Reveal>
          <Reveal
            className="mt-8 text-base font-bold uppercase tracking-[0.25em] text-brand-light sm:text-xl"
            delay={0.2}
          >
            {home.quoteSub}
          </Reveal>
        </Beat>

        {/* Scroll progress bar */}
        <div className="absolute bottom-6 left-1/2 h-1 w-48 -translate-x-1/2 overflow-hidden rounded-full bg-white/25">
          <motion.div style={{ width: barWidth }} className="h-full rounded-full bg-brand-light" />
        </div>
        </div>
      </div>

      {/* Scroll-snap anchors at each beat (inert unless the page enables snapping
          via <SectionSnap />). top = progress * scrollable height. */}
      {SNAP_POINTS.map((p, i) => (
        <div
          key={i}
          aria-hidden
          className="pointer-events-none absolute left-0 h-px w-px snap-start"
          style={{ top: `${p * (TRACK_VH - 100)}vh` }}
        />
      ))}
    </section>
  );
}
