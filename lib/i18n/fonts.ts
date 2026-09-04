import type { Script } from "./locales";

/**
 * Per-script webfonts, loaded on demand.
 *
 * The site's UI face (Geist, app/layout.tsx) ships Latin glyphs only, so any
 * Indic locale would otherwise render in whatever the device happens to have —
 * which on most Android phones means a mismatched fallback, and on many
 * desktops means tofu for Ol Chiki, Meetei Mayek and Odia.
 *
 * These are NOT declared through next/font: pulling twelve Noto families into
 * the layout would preload every one of them on every visit, for a reader who
 * needs exactly one. Instead LanguageProvider swaps a single <link> when the
 * locale changes, and the loaded family lands on --font-indic, which
 * app/globals.css puts at the front of the body font stack.
 */
const FAMILIES: Record<Script, { family: string; css: string } | null> = {
  latin: null, // Geist already covers it.
  devanagari: { family: "Noto Sans Devanagari", css: "Noto+Sans+Devanagari:wght@400..700" },
  bengali: { family: "Noto Sans Bengali", css: "Noto+Sans+Bengali:wght@400..700" },
  gujarati: { family: "Noto Sans Gujarati", css: "Noto+Sans+Gujarati:wght@400..700" },
  gurmukhi: { family: "Noto Sans Gurmukhi", css: "Noto+Sans+Gurmukhi:wght@400..700" },
  kannada: { family: "Noto Sans Kannada", css: "Noto+Sans+Kannada:wght@400..700" },
  malayalam: { family: "Noto Sans Malayalam", css: "Noto+Sans+Malayalam:wght@400..700" },
  odia: { family: "Noto Sans Oriya", css: "Noto+Sans+Oriya:wght@400..700" },
  tamil: { family: "Noto Sans Tamil", css: "Noto+Sans+Tamil:wght@400..700" },
  telugu: { family: "Noto Sans Telugu", css: "Noto+Sans+Telugu:wght@400..700" },
  arabic: { family: "Noto Nastaliq Urdu", css: "Noto+Nastaliq+Urdu:wght@400..700" },
  olchiki: { family: "Noto Sans Ol Chiki", css: "Noto+Sans+Ol+Chiki:wght@400..700" },
  meeteimayek: { family: "Noto Sans Meetei Mayek", css: "Noto+Sans+Meetei+Mayek:wght@400..700" },
};

const LINK_ID = "indic-font";
const VAR = "--font-indic";

/**
 * Point --font-indic at the face this script needs, loading it first if it is
 * not already in the document. Safe to call on every locale change; repeat
 * calls for the same script are a no-op.
 */
export function applyScriptFont(script: Script) {
  if (typeof document === "undefined") return;
  const entry = FAMILIES[script];
  const root = document.documentElement;

  if (!entry) {
    root.style.removeProperty(VAR);
    document.getElementById(LINK_ID)?.remove();
    return;
  }

  let link = document.getElementById(LINK_ID) as HTMLLinkElement | null;
  const href = `https://fonts.googleapis.com/css2?family=${entry.css}&display=swap`;
  if (!link) {
    link = document.createElement("link");
    link.id = LINK_ID;
    link.rel = "stylesheet";
    document.head.appendChild(link);
  }
  if (link.href !== href) link.href = href;

  root.style.setProperty(VAR, `"${entry.family}"`);
}
