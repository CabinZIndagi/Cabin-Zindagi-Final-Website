/**
 * Writes the strings worth translating to scripts/.cache/strings.json, for the
 * Python backend (scripts/translate_indictrans2.py) to pick up.
 *
 * The dictionary is TypeScript, so Python cannot read it directly. Rather than
 * duplicate the walk — and let the two backends drift apart on which strings
 * they skip — this exports the result of the one shared implementation in
 * scripts/lib/strings.ts. Run by the Python script automatically; you should not
 * need to invoke it by hand.
 */

import { mkdirSync, writeFileSync } from "node:fs";
import { dirname } from "node:path";
import { dictionaries } from "../lib/dictionaries";
import { LOCALES } from "../lib/i18n/locales";
import { collect, STRINGS_FILE } from "./lib/strings";

const leaves = collect(dictionaries.en);

mkdirSync(dirname(STRINGS_FILE), { recursive: true });
writeFileSync(
  STRINGS_FILE,
  JSON.stringify(
    {
      // Everything the Python side needs, so it never imports TypeScript.
      locales: LOCALES.map(({ code, english, flores }) => ({
        code,
        english,
        flores,
      })),
      paths: leaves.map((l) => l.path),
      texts: leaves.map((l) => l.value),
    },
    null,
    2,
  ) + "\n",
  "utf8",
);

console.log(`Exported ${leaves.length} strings → ${STRINGS_FILE}`);
