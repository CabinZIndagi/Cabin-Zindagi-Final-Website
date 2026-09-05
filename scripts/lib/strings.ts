/**
 * Shared between the translation backends (Bhashini and IndicTrans2) so both
 * send exactly the same strings and skip exactly the same ones. A rule added
 * here applies to every backend; a rule added to one script does not.
 */

import { existsSync, writeFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { LOCALES } from "../../lib/i18n/locales";

export const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "../..");
export const OUT_DIR = resolve(ROOT, "lib/i18n/generated");
/** Where export-strings.ts drops the payload the Python backend reads. */
export const STRINGS_FILE = resolve(ROOT, "scripts/.cache/strings.json");

// ── Strings that must survive untranslated ──────────────────────────────────
//
// Machine translation will happily destroy all of these. The brand name becomes
// a literal "cabin life"; the hero slogan comes back as a flat paraphrase that
// loses its rhythm, so each language's version is hand-written in
// lib/i18n/overrides/ instead; YouTube titles stop matching the videos they
// label; and driver names get transliterated into something the driver would
// not recognise.

/** Dot-paths (supporting [] for "every element") that are copied verbatim. */
export const DO_NOT_TRANSLATE = [
  "brand",
  "home.quote",
  "stories.featuredVideos[].id",
  "stories.featuredVideos[].title",
  "stories.latestVideos[].id",
  "stories.latestVideos[].title",
  "contact.emailPlaceholder",
  // Machine keys, not copy. These are matched against data/products.ts and
  // data/driver-services.ts at render time, so translating them silently breaks
  // every product card: "water-bottle" came back as "தண்ணீர் பாட்டில்" and the
  // lookup stopped matching.
  "catalog.products[].id",
  "catalog.driverServices[].id",
];

/** Any leaf whose value matches one of these is left alone wherever it appears —
 *  ids, URLs, emails, phone numbers, and anything with no letters to translate. */
export const VERBATIM = [
  /^https?:\/\//i,
  /^[\w.+-]+@[\w-]+\.[\w.]+$/,
  /^[^\p{L}]*$/u, // digits/punctuation/emoji only
  /^[A-Za-z0-9_-]{11}$/, // YouTube video id
  // Asset paths. Without this "/logos/cdrm.jpeg" comes back as
  // "/ லோகோஸ்/cdrm. jpeg" — a translated, space-mangled path that 404s.
  /^\//,
  // Short stat tokens like "9M+" or "1.2K". The no-letters rule above misses
  // them because of the unit letter, and MT renders "9M+" as "9 எம் +".
  /^[\d][\d.,]*\s?[A-Za-z]{0,3}\+?$/,
];

/**
 * Machine translation likes to end a fragment with a full stop even when the
 * source has none: the nav label "Home" comes back as "வீடு." and "Contact" as
 * "যোগাযোগ করুন।". On a button or a nav item that trailing mark is simply wrong.
 *
 * So: if the source does not end in sentence punctuation, strip it from the
 * translation. Devanagari danda and Urdu/Arabic full stop included.
 *
 * scripts/translate_indictrans2.py carries an identical implementation — keep
 * the two in step, the same way scatter() is mirrored.
 */
const TRAILING = /[.!?।॥۔\s]+$/u;

export function normalize(source: string, translated: string): string {
  const out = translated.trim();
  if (TRAILING.test(source.trim())) return out;
  return out.replace(TRAILING, "");
}

export type Leaf = { path: string; value: string };

function pathMatches(path: string, pattern: string) {
  // "a.b[].c" matches "a.b.0.c"
  const rx = new RegExp(
    "^" +
      pattern
        .replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
        .replace(/\\\[\\\]/g, "\\.\\d+") +
      "$",
  );
  return rx.test(path);
}

export function skip(path: string, value: string) {
  if (DO_NOT_TRANSLATE.some((p) => pathMatches(path, p))) return true;
  return VERBATIM.some((rx) => rx.test(value));
}

/** Flattens the dictionary to the leaves worth translating. */
export function collect(node: unknown, path = "", acc: Leaf[] = []): Leaf[] {
  if (typeof node === "string") {
    if (!skip(path, node)) acc.push({ path, value: node });
    return acc;
  }
  if (Array.isArray(node)) {
    node.forEach((item, i) => collect(item, path ? `${path}.${i}` : `${i}`, acc));
    return acc;
  }
  if (node && typeof node === "object") {
    for (const [key, val] of Object.entries(node)) {
      collect(val, path ? `${path}.${key}` : key, acc);
    }
  }
  return acc;
}

/** Rebuilds the dictionary shape holding only the translated leaves. */
export function scatter(leaves: Map<string, string>) {
  const out: Record<string, unknown> = {};
  for (const [path, value] of leaves) {
    const parts = path.split(".");
    let cursor: Record<string, unknown> = out;
    parts.forEach((part, i) => {
      if (i === parts.length - 1) {
        cursor[part] = value;
        return;
      }
      const nextIsIndex = /^\d+$/.test(parts[i + 1]);
      if (!(part in cursor)) cursor[part] = nextIsIndex ? [] : {};
      cursor = cursor[part] as Record<string, unknown>;
    });
  }
  return out;
}

const ident = (code: string) => code.replace(/[^a-zA-Z0-9]/g, "_");

/** Regenerates lib/i18n/generated/index.ts to lazy-load whatever JSON exists. */
export function writeBarrel() {
  const present = LOCALES.map((l) => l.code).filter((code) =>
    existsSync(resolve(OUT_DIR, `${code}.json`)),
  );
  const loaders = present
    .map((code) => `  "${code}": () => import("./${code}.json"),`)
    .join("\n");

  writeFileSync(
    resolve(OUT_DIR, "index.ts"),
    `/**
 * Barrel for machine-translated copy. GENERATED FILE — rewritten by the
 * translation scripts. Add locales with \`npm run translate\` (Bhashini) or
 * \`npm run translate:indictrans2\`, and put hand corrections in
 * lib/i18n/overrides/ instead of editing here.
 *
 * These are dynamic imports on purpose. Statically importing every locale put
 * all of them in the shared chunk, so a reader in Punjab downloaded the Tamil,
 * Telugu, Kannada, Gujarati, Bengali and Marathi dictionaries too — dead weight
 * on exactly the highway connections this site is built for. Each locale is now
 * its own chunk, fetched only when someone selects it.
 */
const LOADERS: Record<
  string,
  () => Promise<{ default: Record<string, unknown> }>
> = {
${loaders}
};

/** Locales that have generated copy — used to label the language picker
 *  without pulling any of the dictionaries into the bundle. */
export const TRANSLATED: readonly string[] = [
${present.map((code) => `  "${code}",`).join("\n")}
];

export async function loadGenerated(
  locale: string,
): Promise<Record<string, unknown> | undefined> {
  const load = LOADERS[locale];
  if (!load) return undefined;
  return (await load()).default;
}
`,
    "utf8",
  );
  return present;
}
