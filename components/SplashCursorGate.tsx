"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

const SplashCursor = dynamic(() => import("./SplashCursor"), { ssr: false });

/*
  Only mount the WebGL fluid cursor when it makes sense:
  - the device has a real (fine) pointer + hover → skips phones/tablets/touch
  - the user hasn't asked to reduce motion → accessibility / battery
  When disabled, SplashCursor never mounts, so no WebGL context is created.
*/
export function SplashCursorGate() {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)");
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setEnabled(fine.matches && !reduce.matches);

    update();
    fine.addEventListener("change", update);
    reduce.addEventListener("change", update);
    return () => {
      fine.removeEventListener("change", update);
      reduce.removeEventListener("change", update);
    };
  }, []);

  if (!enabled) return null;

  return (
    <SplashCursor
      DENSITY_DISSIPATION={10}
      VELOCITY_DISSIPATION={0.5}
      PRESSURE={0}
      CURL={0}
      SPLAT_RADIUS={0.11}
      SPLAT_FORCE={1000}
      COLOR_UPDATE_SPEED={17}
      SHADING
      RAINBOW_MODE={false}
      COLOR="#FE680F"
    />
  );
}
