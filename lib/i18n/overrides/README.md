# Hand corrections

Anything in this directory is the **last word** on a string. The translation
scripts never write here, so a fix you make survives `--force` re-runs.

## Why these exist

Machine translation is good at sentences and bad at interface labels, because a
label carries context the model cannot see. Three failure modes recur, and all
three need a human:

| Source | What MT produced | Why it is wrong |
| --- | --- | --- |
| `Home` (nav) | "house / dwelling" | It is a page, not a building |
| `Document` (a pillar — a verb) | "a document" (noun) | Wrong part of speech |
| `Straight from the Cabin` | "…from the room" (Tamil) | `cabin` is a truck cab here |

## How to add one

Create `<code>.json` holding **only** the keys you are fixing — same shape as the
English dictionary, no need to repeat anything else — then register it in
`index.ts`:

```ts
import ta from "./ta.json";
export const OVERRIDES = { ta } as Record<string, Record<string, unknown>>;
```

Everything you leave out falls through to the machine translation, and anything
that has no translation at all falls through to English.

## Status

The files here are a **starting point written without native-speaker review**.
They fix the labels that were clearly wrong, but they are not verified. Before
launching a language, someone who speaks it should read the rendered site — an
hour per language covers all 250 strings.
