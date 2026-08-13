"use client";

import { useEffect, useLayoutEffect } from "react";

// The snap has to be torn down before the browser lays out the next route, so
// this runs as a layout effect in the browser (and is a no-op on the server).
const useSnapEffect = typeof window === "undefined" ? useEffect : useLayoutEffect;

/**
 * Enables vertical scroll-snapping on the root scroller for the current page only
 * (cleaned up on navigate away). "mandatory" forces the scroll to land on a beat
 * where the text is fully shown, instead of resting mid-transition. Snap targets
 * are the elements marked with `snap-start`.
 */
export function SectionSnap() {
  useSnapEffect(() => {
    const el = document.documentElement;
    const prev = el.style.scrollSnapType;
    el.style.scrollSnapType = "y mandatory";
    return () => {
      // Cleared during the commit that swaps routes, before the next page lays
      // out. If mandatory snapping is still live when that page resets the
      // scroll to the top, the browser re-snaps the reset to the nearest snap
      // position and the new page opens part-way down — /impact was landing at
      // the very end of its 400dvh scroll experience.
      el.style.scrollSnapType = prev;
    };
  }, []);
  return null;
}
