/**
 * The languages the site can render: English, Hindi, and the seven other
 * languages of India's main freight corridors.
 *
 * Deliberately not all 22 Eighth Schedule languages. Every locale here is copy
 * somebody has to review and keep current, and weight every visitor downloads —
 * so this is the set that actually covers the routes Cabin Zindagi's drivers
 * run. Adding one back is a single line plus a translation run.
 *
 * `code` is the ISO-639 code Bhashini expects in a pipeline request (see
 * scripts/translate-bhashini.ts). `script` decides which Noto webfont gets
 * pulled in at runtime (lib/i18n/fonts.ts) — Geist covers Latin only, so every
 * Indic locale needs its own face or the browser falls back to whatever the
 * device happens to ship.
 */
export type Script =
  | "latin"
  | "devanagari"
  | "bengali"
  | "gujarati"
  | "gurmukhi"
  | "kannada"
  | "malayalam"
  | "odia"
  | "tamil"
  | "telugu"
  | "arabic"
  | "olchiki"
  | "meeteimayek";

export type LocaleMeta = {
  code: string;
  /** Endonym — shown in the language picker, always in its own script. */
  native: string;
  /** English name, for aria-labels and the translation script's logs. */
  english: string;
  script: Script;
  dir: "ltr" | "rtl";
  /**
   * FLORES-200 tag, which names the script explicitly — IndicTrans2 keys on
   * these rather than ISO codes (scripts/translate_indictrans2.py). For the
   * languages written in more than one script this is where the choice is made:
   * `mni_Beng` vs `mni_Mtei`, `kas_Arab` vs `kas_Deva`, `snd_Arab` vs
   * `snd_Deva`. Change the tag and the matching `script` field together.
   */
  flores: string;
};

export const LOCALES = [
  { code: "en", native: "English", english: "English", script: "latin", dir: "ltr", flores: "eng_Latn" },
  { code: "hi", native: "हिन्दी", english: "Hindi", script: "devanagari", dir: "ltr", flores: "hin_Deva" },
  { code: "bn", native: "বাংলা", english: "Bengali", script: "bengali", dir: "ltr", flores: "ben_Beng" },
  { code: "mr", native: "मराठी", english: "Marathi", script: "devanagari", dir: "ltr", flores: "mar_Deva" },
  { code: "te", native: "తెలుగు", english: "Telugu", script: "telugu", dir: "ltr", flores: "tel_Telu" },
  { code: "ta", native: "தமிழ்", english: "Tamil", script: "tamil", dir: "ltr", flores: "tam_Taml" },
  { code: "gu", native: "ગુજરાતી", english: "Gujarati", script: "gujarati", dir: "ltr", flores: "guj_Gujr" },
  { code: "kn", native: "ಕನ್ನಡ", english: "Kannada", script: "kannada", dir: "ltr", flores: "kan_Knda" },
  { code: "pa", native: "ਪੰਜਾਬੀ", english: "Punjabi", script: "gurmukhi", dir: "ltr", flores: "pan_Guru" },
  // Bhashini returns Meitei in Bengali script for `mni`; if you switch it to a
  // Meetei Mayek model, change `script` to "meeteimayek" to match.
] as const satisfies readonly LocaleMeta[];

export type Locale = (typeof LOCALES)[number]["code"];

/** The two locales whose copy is hand-written in lib/dictionaries.ts. */
export const AUTHORED_LOCALES = ["en", "hi"] as const;

/** Everything else is produced by scripts/translate-bhashini.ts. */
export const TRANSLATED_LOCALES = LOCALES.map((l) => l.code).filter(
  (code): code is Exclude<Locale, "en" | "hi"> =>
    !(AUTHORED_LOCALES as readonly string[]).includes(code),
);

const BY_CODE = new Map(LOCALES.map((l) => [l.code as string, l as LocaleMeta]));

export function localeMeta(code: string): LocaleMeta {
  return BY_CODE.get(code) ?? BY_CODE.get("en")!;
}

export function isLocale(value: unknown): value is Locale {
  return typeof value === "string" && BY_CODE.has(value);
}

/**
 * Copy authored as an en/hi pair in data/ — product names and features, the
 * scroll panels, the driver hub tiles, the product detail pages.
 *
 * `Authored<T>` types those maps honestly: two hand-written languages, not nine.
 * They are NOT read directly by components any more — lib/dictionaries.ts folds
 * them into the dictionary, so they translate along with everything else. That
 * fold is what stopped roughly a hundred strings from silently rendering English
 * in every locale.
 *
 * `authored()` remains for narrowing a locale onto one of these maps directly,
 * which is now only needed inside that fold.
 */
export type AuthoredLocale = (typeof AUTHORED_LOCALES)[number];

export type Authored<T> = Record<AuthoredLocale, T>;

export function authored(locale: Locale): AuthoredLocale {
  return locale === "hi" ? "hi" : "en";
}
