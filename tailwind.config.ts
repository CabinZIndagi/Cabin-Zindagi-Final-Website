import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    // data/ holds class names too (the driver service tile gradients) — without
    // this they'd be stripped from the build and the tiles would render blank.
    "./data/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      // Large display sizes default to line-height 1, which clips Devanagari's
      // stacked top marks (and the gradient bg-clip-text headings then drop
      // them entirely). Give the big sizes a script-safe line-height.
      fontSize: {
        "4xl": ["2.25rem", { lineHeight: "1.25" }],
        "5xl": ["3rem", { lineHeight: "1.25" }],
        "6xl": ["3.75rem", { lineHeight: "1.2" }],
        "7xl": ["4.5rem", { lineHeight: "1.2" }],
        "8xl": ["6rem", { lineHeight: "1.15" }],
      },
      colors: {
        // Lead accent — the "Zindagi" orange from the logo
        brand: {
          DEFAULT: "#FE680F",
          light: "#FE8A1C",
          dark: "#E25600",
        },
        // Support accent — the shield green from the logo
        accent: {
          DEFAULT: "#2D8D46",
          light: "#3FB860",
          dark: "#24793B",
        },
        // Theme-aware orange for TEXT (keeps contrast ≥ AA on both themes)
        brandtext: "var(--brand-text)",
        // Warm tint for soft section bands
        cream: "#FFF7E6",
      },
    },
  },
  plugins: [],
};

export default config;
