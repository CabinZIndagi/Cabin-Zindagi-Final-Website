/**
 * Verifies the Google Sheet that /sda-registration writes entries to, and
 * writes the header row for you.
 *
 *   npm run sheet:check                                    # check and fix headers
 *   npm run sheet:check -- --test                          # also append a test row
 *   npm run sheet:check -- --from-json <key.json> --sheet-id <id>
 *                                                          # fill .env.local first
 *
 * --from-json exists because hand-copying the service account's private key is
 * the single most common way this setup fails: the key is a multi-line PEM, and
 * a .env file needs it on one line with its newlines escaped. Let the machine
 * do it.
 *
 * Every failure mode has its own message, because the useful information is
 * always "which of the setup steps did I miss" — a raw 403 from Google does not
 * tell you whether the key is wrong or the sheet simply was not shared.
 */

import { createSign } from "node:crypto";
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");

import { SHEET_HEADERS, SHEET_TAB } from "../lib/smart-driver-awards";

/** The columns /api/award-entries writes, in order. */
const HEADERS: readonly string[] = SHEET_HEADERS;

const TAB = SHEET_TAB;
const TOKEN_URL = "https://oauth2.googleapis.com/token";

const b64url = (input: string | Buffer) =>
  Buffer.from(input).toString("base64url");

/** Minimal .env.local reader — matches scripts/translate-bhashini.ts. */
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

async function accessToken(email: string, key: string) {
  const now = Math.floor(Date.now() / 1000);
  const header = b64url(JSON.stringify({ alg: "RS256", typ: "JWT" }));
  const claim = b64url(
    JSON.stringify({
      iss: email,
      scope: "https://www.googleapis.com/auth/spreadsheets",
      aud: TOKEN_URL,
      iat: now,
      exp: now + 3600,
    })
  );

  let signature: string;
  try {
    signature = b64url(
      createSign("RSA-SHA256").update(`${header}.${claim}`).sign(key)
    );
  } catch {
    throw new Error(
      "GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY is not a usable private key.\n" +
        "Copy the whole \"private_key\" value out of the service account JSON,\n" +
        "including the BEGIN/END lines, wrap it in double quotes, and keep the\n" +
        "\\n escapes exactly as they appear in that file."
    );
  }

  const res = await fetch(TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion: `${header}.${claim}.${signature}`,
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    if (text.includes("invalid_grant")) {
      throw new Error(
        "Google rejected the service account.\n" +
          "Either GOOGLE_SERVICE_ACCOUNT_EMAIL does not match the key, or the\n" +
          "key has been deleted in the Cloud console. Issue a fresh JSON key.\n\n" +
          text
      );
    }
    throw new Error(`Token request failed: ${res.status}\n${text}`);
  }

  return ((await res.json()) as { access_token: string }).access_token;
}

/** Reads/updates a key in .env.local, leaving every other line untouched. */
function setEnvLocal(pairs: Record<string, string>) {
  const file = resolve(ROOT, ".env.local");
  let text = existsSync(file) ? readFileSync(file, "utf8") : "";

  for (const [key, value] of Object.entries(pairs)) {
    const line = `${key}=${JSON.stringify(value)}`;
    const re = new RegExp(`^${key}=.*$`, "m");
    text = re.test(text)
      ? text.replace(re, line)
      : `${text.replace(/\s*$/, "")}\n${line}\n`;
    process.env[key] = value;
  }

  writeFileSync(file, text);
}

/** `--from-json key.json --sheet-id ID` → writes the three vars into .env.local. */
function importServiceAccount() {
  const argv = process.argv;
  const jsonPath = argv[argv.indexOf("--from-json") + 1];
  const sheetIdArg = argv.includes("--sheet-id")
    ? argv[argv.indexOf("--sheet-id") + 1]
    : undefined;

  if (!jsonPath || jsonPath.startsWith("--")) {
    throw new Error("--from-json needs a path to the service account JSON file.");
  }
  const file = resolve(process.cwd(), jsonPath);
  if (!existsSync(file)) throw new Error(`No such file: ${file}`);

  let parsed: { client_email?: string; private_key?: string; type?: string };
  try {
    parsed = JSON.parse(readFileSync(file, "utf8"));
  } catch {
    throw new Error(`${jsonPath} is not valid JSON.`);
  }

  if (!parsed.client_email || !parsed.private_key) {
    throw new Error(
      `${jsonPath} has no client_email/private_key.\n` +
        "Download the SERVICE ACCOUNT key (Credentials → your service account →\n" +
        "Keys → Add key → JSON), not an OAuth client secret."
    );
  }

  // A sheet id can be pasted as the whole URL; keep only the id.
  const sheetId = sheetIdArg?.match(/[-\w]{25,}/)?.[0] ?? sheetIdArg;

  const pairs: Record<string, string> = {
    GOOGLE_SERVICE_ACCOUNT_EMAIL: parsed.client_email,
    GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY: parsed.private_key,
  };
  if (sheetId) pairs.GOOGLE_SHEETS_ID = sheetId;

  setEnvLocal(pairs);

  console.log("\nWrote to .env.local:");
  console.log(`  GOOGLE_SERVICE_ACCOUNT_EMAIL       = ${parsed.client_email}`);
  console.log("  GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY = (hidden)");
  if (sheetId) console.log(`  GOOGLE_SHEETS_ID                   = ${sheetId}`);
  console.log(
    `\nShare the sheet with ${parsed.client_email} as an Editor if you have not already.`
  );
}

async function main() {
  loadEnvLocal();
  if (process.argv.includes("--from-json")) importServiceAccount();

  const sheetId = process.env.GOOGLE_SHEETS_ID;
  const email = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  const key = process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY?.replace(
    /\\n/g,
    "\n"
  );

  const missing = [
    !sheetId && "GOOGLE_SHEETS_ID",
    !email && "GOOGLE_SERVICE_ACCOUNT_EMAIL",
    !key && "GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY",
  ].filter(Boolean);

  if (missing.length) {
    throw new Error(
      `Missing in .env.local: ${missing.join(", ")}\n` +
        "See the Google Sheets section of .env.local.example for where each comes from."
    );
  }

  console.log(`\nService account : ${email}`);
  console.log(`Spreadsheet     : ${sheetId}\n`);

  const token = await accessToken(email!, key!);
  console.log("✓ Credentials accepted by Google");

  const auth = { Authorization: `Bearer ${token}` };

  // Does the service account actually have access, and does the tab exist?
  const metaRes = await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}?fields=properties.title,sheets.properties.title`,
    { headers: auth }
  );

  if (metaRes.status === 403) {
    throw new Error(
      "Google says 403 — the credentials work, but this service account cannot\n" +
        "open that spreadsheet. Open the sheet, press Share, and add\n" +
        `  ${email}\n` +
        "as an EDITOR. This is the step almost everyone misses."
    );
  }
  if (metaRes.status === 404) {
    throw new Error(
      "Google says 404 — no spreadsheet with that id.\n" +
        "GOOGLE_SHEETS_ID is only the middle part of the URL:\n" +
        "  docs.google.com/spreadsheets/d/<THIS PART>/edit"
    );
  }
  if (!metaRes.ok) {
    throw new Error(`Could not read the sheet: ${metaRes.status}\n${await metaRes.text()}`);
  }

  const meta = (await metaRes.json()) as {
    properties: { title: string };
    sheets: { properties: { title: string } }[];
  };
  const tabs = meta.sheets.map((s) => s.properties.title);
  console.log(`✓ Sheet reachable: "${meta.properties.title}"`);
  console.log(`  tabs: ${tabs.join(", ")}`);

  if (!tabs.includes(TAB)) {
    throw new Error(
      `No tab named "${TAB}" in this spreadsheet.\n` +
        `Rename a tab to exactly "${TAB}" (bottom left of the sheet), or change\n` +
        "SHEET_TAB in lib/smart-driver-awards.ts to match one of the tabs above."
    );
  }
  console.log(`✓ Tab "${TAB}" exists`);

  // Header row: write it if row 1 is empty, warn if it disagrees with the API.
  const rowRes = await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${encodeURIComponent(`${TAB}!A1:H1`)}`,
    { headers: auth }
  );
  const row = ((await rowRes.json()) as { values?: string[][] }).values?.[0];

  if (!row || row.every((cell) => !cell)) {
    const put = await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${encodeURIComponent(`${TAB}!A1`)}?valueInputOption=RAW`,
      {
        method: "PUT",
        headers: { ...auth, "Content-Type": "application/json" },
        body: JSON.stringify({ values: [HEADERS] }),
      }
    );
    if (!put.ok) throw new Error(`Could not write headers: ${await put.text()}`);
    console.log("✓ Header row written");
  } else if (row.join("|") !== HEADERS.join("|")) {
    console.log("! Header row does not match what the form writes:");
    console.log(`    sheet : ${row.join(" | ")}`);
    console.log(`    form  : ${HEADERS.join(" | ")}`);
    console.log("  Entries still append correctly — only the labels differ.");
  } else {
    console.log("✓ Header row already correct");
  }

  if (process.argv.includes("--test")) {
    const append = await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${encodeURIComponent(`${TAB}!A:H`)}:append?valueInputOption=USER_ENTERED&insertDataOption=INSERT_ROWS`,
      {
        method: "POST",
        headers: { ...auth, "Content-Type": "application/json" },
        body: JSON.stringify({
          values: [
            [
              new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" }),
              "TEST ROW — delete me",
              "'9999999999",
              "Maharashtra",
              "Nashik",
              "5–10 साल",
              "टैंकर",
              "check-sheet script",
            ],
          ],
        }),
      }
    );
    if (!append.ok) throw new Error(`Test append failed: ${await append.text()}`);
    console.log('✓ Test row appended — delete the "TEST ROW" line in the sheet');
  }

  console.log(
    "\nAll good. Entries from /sda-registration will land in this sheet.\n" +
      "Download as Excel any time: File ▸ Download ▸ Microsoft Excel (.xlsx)\n"
  );
}

main().catch((err) => {
  console.error(`\n✗ ${(err as Error).message}\n`);
  process.exit(1);
});
