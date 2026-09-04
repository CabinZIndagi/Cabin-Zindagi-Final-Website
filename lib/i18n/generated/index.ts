/**
 * Barrel for machine-translated copy. GENERATED FILE — rewritten by the
 * translation scripts. Add locales with `npm run translate` (Bhashini) or
 * `npm run translate:indictrans2`, and put hand corrections in
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
  "bn": () => import("./bn.json"),
  "mr": () => import("./mr.json"),
  "te": () => import("./te.json"),
  "ta": () => import("./ta.json"),
  "gu": () => import("./gu.json"),
  "kn": () => import("./kn.json"),
  "pa": () => import("./pa.json"),
};

/** Locales that have generated copy — used to label the language picker
 *  without pulling any of the dictionaries into the bundle. */
export const TRANSLATED: readonly string[] = [
  "bn",
  "mr",
  "te",
  "ta",
  "gu",
  "kn",
  "pa",
];

export async function loadGenerated(
  locale: string,
): Promise<Record<string, unknown> | undefined> {
  const load = LOADERS[locale];
  if (!load) return undefined;
  return (await load()).default;
}
