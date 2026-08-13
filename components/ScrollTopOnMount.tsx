"use client";

import { useEffect, useLayoutEffect } from "react";

const INTENT_EVENTS = ["wheel", "touchstart", "keydown", "pointerdown"] as const;

// The first correction has to land before the browser paints the incoming page,
// otherwise the old offset is visible for a beat and the page appears to scroll
// itself to the top. Layout effects run pre-paint; on the server this is a no-op.
const useBeforePaint = typeof window === "undefined" ? useEffect : useLayoutEffect;

/**
 * Forces the page to open at the very top, and holds it there for a beat.
 *
 * A single scroll-to-top on mount is not enough for the scroll-driven pages:
 * the reset can be undone a frame or two later by the root `scroll-behavior:
 * smooth`, by a mandatory scroll-snap left over from the page we came from, or
 * by the browser re-anchoring once the incoming layout settles. So we pin the
 * position across those frames instead of setting it once, and release as soon
 * as the visitor actually tries to scroll.
 */
export function ScrollTopOnMount({ holdMs = 700 }: { holdMs?: number }) {
  useBeforePaint(() => {
    const root = document.documentElement;
    const prevBehavior = root.style.scrollBehavior;
    const prevSnap = root.style.scrollSnapType;
    // Stop the browser re-applying a remembered offset while we pin. It cannot
    // pre-empt the restore on a hard reload — Chrome commits that before any
    // page script runs — but it does stop it being re-applied as the incoming
    // layout grows.
    if ("scrollRestoration" in history) history.scrollRestoration = "manual";
    // Instant and unsnapped while pinning — smooth would animate every correction,
    // and a leftover mandatory snap would drag the page back off the top.
    root.style.scrollBehavior = "auto";
    root.style.scrollSnapType = "none";

    let raf = 0;
    let released = false;

    const release = () => {
      if (released) return;
      released = true;
      cancelAnimationFrame(raf);
      root.style.scrollBehavior = prevBehavior;
      root.style.scrollSnapType = prevSnap;
      if ("scrollRestoration" in history) history.scrollRestoration = "auto";
      for (const ev of INTENT_EVENTS) window.removeEventListener(ev, release);
      // Nudge scroll-driven animations to re-read the settled position, so the
      // page never renders a mid-scroll frame while sitting at the top.
      window.dispatchEvent(new Event("scroll"));
    };

    const start = performance.now();
    const pin = () => {
      if (released) return;
      if (window.scrollY !== 0) window.scrollTo(0, 0);
      if (performance.now() - start < holdMs) raf = requestAnimationFrame(pin);
      else release();
    };

    window.scrollTo(0, 0);
    raf = requestAnimationFrame(pin);
    for (const ev of INTENT_EVENTS) {
      window.addEventListener(ev, release, { passive: true });
    }

    return release;
  }, [holdMs]);

  return null;
}
