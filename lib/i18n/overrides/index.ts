/**
 * Hand corrections layered on top of machine translation — the last word on any
 * string. The translation scripts NEVER write here, so anything fixed by hand
 * survives a `--force` re-run. See README.md for the workflow and the reasoning.
 *
 * Each file holds ONLY the keys it corrects; everything else falls through to
 * the generated translation, and then to English.
 *
 * Lazy-loaded to match lib/i18n/generated/index.ts — an override file rides in
 * the same chunk as the locale it corrects, so no reader downloads corrections
 * for a language they are not reading.
 */
const LOADERS: Record<
  string,
  () => Promise<{ default: Record<string, unknown> }>
> = {
  bn: () => import("./bn.json"),
  gu: () => import("./gu.json"),
  kn: () => import("./kn.json"),
  mr: () => import("./mr.json"),
  pa: () => import("./pa.json"),
  ta: () => import("./ta.json"),
  te: () => import("./te.json"),
};

export async function loadOverrides(
  locale: string,
): Promise<Record<string, unknown> | undefined> {
  const load = LOADERS[locale];
  if (!load) return undefined;
  return (await load()).default;
}
