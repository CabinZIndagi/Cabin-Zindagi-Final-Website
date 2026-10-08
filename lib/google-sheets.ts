import { createSign } from "node:crypto";

/**
 * Appends rows to a Google Sheet as a service account.
 *
 * The OAuth dance is done by hand rather than through googleapis: signing a
 * JWT is about twenty lines, and the alternative drags a large dependency tree
 * into the bundle for one HTTP call. Same reasoning as the direct Supabase REST
 * call in /api/driver-leads.
 *
 * Node runtime only — the edge runtime has no node:crypto signing.
 */

const TOKEN_URL = "https://oauth2.googleapis.com/token";
const SCOPE = "https://www.googleapis.com/auth/spreadsheets";

const b64url = (input: string | Buffer) =>
  Buffer.from(input)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");

/** Cached across requests on a warm lambda; Google's tokens last an hour. */
let cachedToken: { value: string; expiresAt: number } | null = null;

function serviceAccount() {
  const email = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  // Private keys carry literal newlines. Dashboards and .env files usually
  // store them escaped as "\n", so put the real newlines back either way.
  const key = process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY?.replace(
    /\\n/g,
    "\n"
  );
  const sheetId = process.env.GOOGLE_SHEETS_ID;
  if (!email || !key || !sheetId) return null;
  return { email, key, sheetId };
}

/** True when the sheet credentials are present; lets callers degrade quietly. */
export function sheetsConfigured() {
  return serviceAccount() !== null;
}

async function accessToken(email: string, key: string) {
  const now = Math.floor(Date.now() / 1000);
  // Refresh a minute early so a token can't expire mid-flight.
  if (cachedToken && cachedToken.expiresAt > now + 60) return cachedToken.value;

  const header = b64url(JSON.stringify({ alg: "RS256", typ: "JWT" }));
  const claim = b64url(
    JSON.stringify({
      iss: email,
      scope: SCOPE,
      aud: TOKEN_URL,
      iat: now,
      exp: now + 3600,
    })
  );
  const signature = b64url(
    createSign("RSA-SHA256").update(`${header}.${claim}`).sign(key)
  );

  const res = await fetch(TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion: `${header}.${claim}.${signature}`,
    }),
  });

  if (!res.ok) {
    throw new Error(`Google token request failed: ${res.status} ${await res.text()}`);
  }

  const json = (await res.json()) as { access_token: string; expires_in: number };
  cachedToken = {
    value: json.access_token,
    expiresAt: now + json.expires_in,
  };
  return json.access_token;
}

/** Tabs whose header row has been confirmed on this warm instance. */
const headedTabs = new Set<string>();

// What the API writes in column A (en-IN, e.g. "8/10/2026, 11:02:47 am").
// Used to tell a data row in row 1 from a header someone typed by hand.
const LOOKS_LIKE_TIMESTAMP = /^\d{1,2}\/\d{1,2}\/\d{4}/;

/** Sheets usually parses that timestamp into a date, which reads back
 *  unformatted as a serial number; if not, it stays the string above. */
const isTimestampCell = (cell: unknown) =>
  typeof cell === "number" || LOOKS_LIKE_TIMESTAMP.test(String(cell ?? "").trim());

/**
 * Makes sure row 1 of `tab` is `headers`, so the sheet reads as a table rather
 * than bare data:
 *   - row 1 empty         → headers written there
 *   - row 1 is a data row → a row is inserted above it for the headers
 *     (a sheet that took entries before this check existed)
 *   - anything else       → left alone; someone labelled it by hand
 * Checked once per warm instance, not on every entry.
 */
async function ensureHeaderRow(
  sheetId: string,
  token: string,
  tab: string,
  headers: readonly string[]
) {
  if (headedTabs.has(tab)) return;

  const base = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}`;
  const auth = { Authorization: `Bearer ${token}` };

  const rowRes = await fetch(
    `${base}/values/${encodeURIComponent(`${tab}!1:1`)}?valueRenderOption=UNFORMATTED_VALUE`,
    { headers: auth }
  );
  if (!rowRes.ok) {
    throw new Error(`Sheets header read failed: ${rowRes.status} ${await rowRes.text()}`);
  }
  const row = ((await rowRes.json()) as { values?: unknown[][] }).values?.[0] ?? [];
  const empty = row.every((cell) => !String(cell).trim());

  if (!empty && !isTimestampCell(row[0])) {
    headedTabs.add(tab);
    return;
  }

  if (!empty) {
    // insertDimension wants the tab's numeric id, not its name.
    const metaRes = await fetch(
      `${base}?fields=sheets.properties(sheetId,title)`,
      { headers: auth }
    );
    if (!metaRes.ok) {
      throw new Error(`Sheets metadata read failed: ${metaRes.status} ${await metaRes.text()}`);
    }
    const meta = (await metaRes.json()) as {
      sheets: { properties: { sheetId: number; title: string } }[];
    };
    const gid = meta.sheets.find((s) => s.properties.title === tab)?.properties.sheetId;
    if (gid === undefined) throw new Error(`No tab named "${tab}" in the sheet.`);

    const insertRes = await fetch(`${base}:batchUpdate`, {
      method: "POST",
      headers: { ...auth, "Content-Type": "application/json" },
      body: JSON.stringify({
        requests: [
          {
            insertDimension: {
              range: { sheetId: gid, dimension: "ROWS", startIndex: 0, endIndex: 1 },
              inheritFromBefore: false,
            },
          },
        ],
      }),
    });
    if (!insertRes.ok) {
      throw new Error(`Sheets row insert failed: ${insertRes.status} ${await insertRes.text()}`);
    }
  }

  const putRes = await fetch(
    `${base}/values/${encodeURIComponent(`${tab}!A1`)}?valueInputOption=RAW`,
    {
      method: "PUT",
      headers: { ...auth, "Content-Type": "application/json" },
      body: JSON.stringify({ values: [headers] }),
    }
  );
  if (!putRes.ok) {
    throw new Error(`Sheets header write failed: ${putRes.status} ${await putRes.text()}`);
  }
  headedTabs.add(tab);
}

/**
 * Appends one row to `tab`, after putting `headers` in row 1 if they are
 * missing (see ensureHeaderRow). Values are written as-is (USER_ENTERED), so a
 * leading apostrophe is the only thing keeping a long phone number from being
 * reformatted as a number by Sheets — see the caller.
 */
export async function appendSheetRow(
  tab: string,
  row: (string | number)[],
  headers?: readonly string[]
) {
  const account = serviceAccount();
  if (!account) throw new Error("Google Sheets is not configured.");

  const token = await accessToken(account.email, account.key);
  if (headers) {
    // A header problem shouldn't cost the entry itself; log it and append.
    try {
      await ensureHeaderRow(account.sheetId, token, tab, headers);
    } catch (err) {
      console.error("Sheets header check failed:", err);
    }
  }
  const range = encodeURIComponent(`${tab}!A:Z`);
  const url =
    `https://sheets.googleapis.com/v4/spreadsheets/${account.sheetId}` +
    `/values/${range}:append?valueInputOption=USER_ENTERED&insertDataOption=INSERT_ROWS`;

  const res = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ values: [row] }),
  });

  if (!res.ok) {
    throw new Error(`Sheets append failed: ${res.status} ${await res.text()}`);
  }
}
