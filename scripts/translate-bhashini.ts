/**
 * Translates the English dictionary into the Eighth Schedule languages using
 * Bhashini (https://bhashini.gov.in), and writes the result to
 * lib/i18n/generated/<code>.json.
 *
 *   npm run translate            # every locale that has no file yet
 *   npm run translate -- ta te   # just these
 *   npm run translate -- --force # redo locales already written
 *   npm run translate -- --dry   # no API calls: writes «marked» English, so you
 *                                # can see exactly which strings the site would
 *                                # translate and which it leaves alone
 *
 * WHY THIS IS A SCRIPT AND NOT A REQUEST HANDLER
 * Translating at build time means a visitor pays no latency, the copy is in the
 * server-rendered HTML (so it is indexable), the API is called ~300 times total
 * instead of once per pageview, and — most importantly — a wrong translation can
 * be fixed by hand in lib/i18n/overrides/ and stays fixed.
 *
 * CREDENTIALS (.env.local, both from https://bhashini.gov.in → ULCA dashboard)
 *   BHASHINI_USER_ID=...
 *   BHASHINI_API_KEY=...
 * Bhashini's free tier is for proof-of-concept use; contact them for a paid plan
 * before running this against production copy you intend to sell against.
 */

import { readFileSync, writeFileSync, existsSync, mkdirSync } from "node:fs";
import { resolve } from "node:path";
import { dictionaries } from "../lib/dictionaries";
import { TRANSLATED_LOCALES, localeMeta } from "../lib/i18n/locales";
import {
  collect,
  scatter,
  writeBarrel,
  normalize,
  DO_NOT_TRANSLATE,
  OUT_DIR,
  ROOT,
  type Leaf,
} from "./lib/strings";

const CONFIG_URL =
  "https://meity-auth.ulcacontrib.org/ulca/apis/v0/model/getModelsPipeline";
/** Published pipeline id for the MeitY-hosted Bhashini models. */
const PIPELINE_ID = "64392f96daac500b55c543cd";

// ── Bhashini plumbing ───────────────────────────────────────────────────────

type PipelineConfig = {
  serviceId: string;
  callbackUrl: string;
  headerName: string;
  headerValue: string;
};

function credentials() {
  const userId = process.env.BHASHINI_USER_ID;
  const apiKey = process.env.BHASHINI_API_KEY;
  if (!userId || !apiKey) {
    throw new Error(
      "Missing BHASHINI_USER_ID / BHASHINI_API_KEY. Register at " +
        "https://bhashini.gov.in, then put both in .env.local " +
        "(see .env.local.example).",
    );
  }
  return { userId, apiKey };
}

async function getPipelineConfig(target: string): Promise<PipelineConfig> {
  const { userId, apiKey } = credentials();

  const res = await fetch(CONFIG_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      userID: userId,
      ulcaApiKey: apiKey,
    },
    body: JSON.stringify({
      pipelineTasks: [
        {
          taskType: "translation",
          config: { language: { sourceLanguage: "en", targetLanguage: target } },
        },
      ],
      pipelineRequestConfig: { pipelineId: PIPELINE_ID },
    }),
  });

  if (!res.ok) {
    throw new Error(
      `Config call failed for "${target}" (${res.status}): ${await res.text()}`,
    );
  }

  const json = await res.json();
  const serviceId = json?.pipelineResponseConfig?.[0]?.config?.[0]?.serviceId;
  const endpoint = json?.pipelineInferenceAPIEndPoint;
  const callbackUrl = endpoint?.callbackUrl;
  const headerName = endpoint?.inferenceApiKey?.name;
  const headerValue = endpoint?.inferenceApiKey?.value;

  if (!serviceId || !callbackUrl || !headerName || !headerValue) {
    throw new Error(
      `Bhashini returned no usable translation model for "${target}". ` +
        `Not every Eighth Schedule language has a public en→xx model yet.`,
    );
  }
  return { serviceId, callbackUrl, headerName, headerValue };
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

/**
 * One compute call, with backoff.
 *
 * Bhashini publishes no rate limits, so rather than guess a safe pace we go at
 * full speed and back off when told to. A 429 or a 5xx is retried with
 * exponential delay; anything else (a bad key, an unsupported language pair) is
 * a real error and fails immediately rather than being retried pointlessly.
 *
 * Without this a rate limit would cascade: the caller marks the language failed
 * and moves straight on to the next one, so a single 429 would burn through
 * every remaining language in seconds instead of waiting a moment.
 */
const MAX_RETRIES = 5;

async function translateBatch(
  cfg: PipelineConfig,
  target: string,
  texts: string[],
  attempt = 1,
): Promise<string[]> {
  const res = await fetch(cfg.callbackUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      [cfg.headerName]: cfg.headerValue,
    },
    body: JSON.stringify({
      pipelineTasks: [
        {
          taskType: "translation",
          config: {
            language: { sourceLanguage: "en", targetLanguage: target },
            serviceId: cfg.serviceId,
          },
        },
      ],
      inputData: { input: texts.map((source) => ({ source })) },
    }),
  });

  if (!res.ok) {
    const retryable = res.status === 429 || res.status >= 500;
    if (retryable && attempt <= MAX_RETRIES) {
      // Honour Retry-After when the server sends one, else 2s, 4s, 8s…
      const header = Number(res.headers.get("retry-after"));
      const waitMs = Number.isFinite(header) && header > 0
        ? header * 1000
        : 2 ** attempt * 1000;
      process.stdout.write(`\n    ${res.status} — retrying in ${waitMs / 1000}s `);
      await sleep(waitMs);
      return translateBatch(cfg, target, texts, attempt + 1);
    }
    throw new Error(`Compute call failed (${res.status}): ${await res.text()}`);
  }

  const json = await res.json();
  const out = json?.pipelineResponse?.[0]?.output;
  if (!Array.isArray(out) || out.length !== texts.length) {
    throw new Error(
      `Expected ${texts.length} segments back, got ${out?.length ?? "none"}.`,
    );
  }
  return out.map((seg: { target?: string }, i) => seg?.target?.trim() || texts[i]);
}

// ── Driver ──────────────────────────────────────────────────────────────────

const BATCH_SIZE = 25;

async function translateLocale(target: string, leaves: Leaf[], dry: boolean) {
  const meta = localeMeta(target);
  process.stdout.write(`  ${meta.english} (${target}) `);

  const result = new Map<string, string>();

  if (dry) {
    // Marks every string the pipeline WOULD send, without spending a call.
    leaves.forEach((leaf) => result.set(leaf.path, `«${leaf.value}»`));
  } else {
    const cfg = await getPipelineConfig(target);
    for (let i = 0; i < leaves.length; i += BATCH_SIZE) {
      const chunk = leaves.slice(i, i + BATCH_SIZE);
      const translated = await translateBatch(
        cfg,
        target,
        chunk.map((l) => l.value),
      );
      chunk.forEach((leaf, j) =>
      result.set(leaf.path, normalize(leaf.value, translated[j])),
    );
      process.stdout.write(".");
    }
  }

  const file = resolve(OUT_DIR, `${target}.json`);
  writeFileSync(file, JSON.stringify(scatter(result), null, 2) + "\n", "utf8");
  process.stdout.write(` ✓ ${result.size} strings\n`);
}

async function main() {
  loadEnvLocal();
  mkdirSync(OUT_DIR, { recursive: true });

  const args = process.argv.slice(2);
  const force = args.includes("--force");
  const dry = args.includes("--dry");
  const requested = args.filter((a) => !a.startsWith("--"));

  const targets = (requested.length ? requested : TRANSLATED_LOCALES).filter(
    (code) => force || dry || !existsSync(resolve(OUT_DIR, `${code}.json`)),
  );

  if (!dry) credentials(); // fail fast rather than once per locale
  const leaves = collect(dictionaries.en);
  console.log(
    `\n${leaves.length} translatable strings, ` +
      `${DO_NOT_TRANSLATE.length} do-not-translate rules applied\n`,
  );

  if (!targets.length) {
    console.log("Nothing to do — pass --force to redo existing locales.\n");
    writeBarrel();
    return;
  }

  const failed: string[] = [];
  for (const target of targets) {
    try {
      await translateLocale(target, leaves, dry);
    } catch (err) {
      failed.push(target);
      process.stdout.write(` ✗ ${(err as Error).message}\n`);
    }
  }

  const present = writeBarrel();
  console.log(`\nLocales available: ${present.join(", ")}`);
  if (failed.length) {
    console.log(
      `Failed: ${failed.join(", ")} — these fall back to English until re-run.`,
    );
  }
  console.log(
    "\nReview the output before shipping. Corrections go in " +
      "lib/i18n/overrides/<code>.json, which is never overwritten.\n",
  );
}

/** Minimal .env.local reader — avoids adding dotenv for one script. */
function loadEnvLocal() {
  const file = resolve(ROOT, ".env.local");
  if (!existsSync(file)) return;
  for (const line of readFileSync(file, "utf8").split("\n")) {
    const match = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (match && !process.env[match[1]]) {
      process.env[match[1]] = match[2].replace(/^["']|["']$/g, "");
    }
  }
}

main().catch((err) => {
  console.error(`\n${(err as Error).message}\n`);
  process.exit(1);
});
