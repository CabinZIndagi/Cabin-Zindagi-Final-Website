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

/**
 * Appends one row to `tab`. Values are written as-is (USER_ENTERED), so a
 * leading apostrophe is the only thing keeping a long phone number from being
 * reformatted as a number by Sheets — see the caller.
 */
export async function appendSheetRow(tab: string, row: (string | number)[]) {
  const account = serviceAccount();
  if (!account) throw new Error("Google Sheets is not configured.");

  const token = await accessToken(account.email, account.key);
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
