import { Noto_Sans_Devanagari, Roboto, Space_Grotesk } from "next/font/google";

// Distinctive display font used for section headings / card titles.
export const display = Space_Grotesk({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  display: "swap",
});

/**
 * Faces for /sda-registration only — that page is a deliberate replica of
 * the Google Form it replaces, and Roboto is a large part of why a Form looks
 * like a Form.
 *
 * Roboto is paired with Noto Sans Devanagari rather than asked for a
 * devanagari subset, because Google Fonts does not serve one for Roboto: the
 * Devanagari design is a separate family. Most of that page's copy is Hindi,
 * and the site's own Devanagari face loads only when a reader picks an Indic
 * locale — which an entrant arriving on an English page has not done — so
 * without this the Hindi falls back to whatever the device happens to have.
 */
export const forms = Roboto({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-forms",
  display: "swap",
});

export const formsDevanagari = Noto_Sans_Devanagari({
  subsets: ["devanagari"],
  weight: ["400", "500"],
  variable: "--font-forms-deva",
  display: "swap",
});
