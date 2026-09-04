"use client";

import { ThemeProvider } from "next-themes";
import { LanguageProvider } from "@/lib/language-context";
import type { ReactNode } from "react";

// `disableTransitionOnChange` suppresses every CSS transition for the one frame
// the theme flips. Without it a theme switch is visibly ragged: text that sets
// its own colour (most of it, via Tailwind) snaps instantly, while anything
// inheriting from body faded over body's 300ms colour transition, and the
// handful of components carrying `transition duration-200` animated on their
// own timing again — so the page recoloured in several passes.
//
// Hover and other interaction transitions are untouched; this applies only
// while the theme is changing.
export function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <LanguageProvider>{children}</LanguageProvider>
    </ThemeProvider>
  );
}
