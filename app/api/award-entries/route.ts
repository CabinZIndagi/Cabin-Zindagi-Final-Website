import { NextResponse } from "next/server";
import {
  EXPERIENCE_OPTIONS,
  SHEET_HEADERS,
  SHEET_TAB,
  VEHICLE_TYPES,
  STATES,
  windowState,
} from "@/lib/smart-driver-awards";
import { appendSheetRow, sheetsConfigured } from "@/lib/google-sheets";

/**
 * Records one Smart Driver Awards entry as a row in the Google Sheet.
 *
 * Validation mirrors /api/driver-leads: the same Indian mobile pattern, the
 * same trim-and-check shape, and the same quiet fallback to a console log when
 * the backing store is not configured yet, so the form is still usable in dev.
 */

// node:crypto signs the service-account JWT, which the edge runtime cannot do.
export const runtime = "nodejs";

const PHONE_RE = /^(?:\+?91[-\s]?|0)?[6-9]\d{9}$/;

const clean = (value: unknown) =>
  typeof value === "string" ? value.trim() : "";

export async function POST(request: Request) {
  // Re-checked here and not only on the page: a closed form still has a live
  // endpoint, and a late entry in the sheet is worse than a rejected one.
  const state = windowState();
  if (state !== "open") {
    return NextResponse.json({ error: `entries_${state}` }, { status: 403 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const { name, phone, state: stateName, city, experience, vehicleTypes, employer } =
    (body ?? {}) as Record<string, unknown>;

  const cleanName = clean(name);
  // "+91 98765 43210" and "9876543210" should land in the sheet identically.
  const cleanPhone = clean(phone).replace(/[^\d+]/g, "");
  const cleanState = clean(stateName);
  const cleanCity = clean(city);
  const cleanExperience = clean(experience);
  const cleanEmployer = clean(employer);

  // Only accept vehicle types we offered — the sheet is judged off these, so a
  // hand-rolled POST should not be able to invent a category.
  const vehicles = Array.isArray(vehicleTypes)
    ? (vehicleTypes.filter(
        (v): v is string =>
          typeof v === "string" &&
          (VEHICLE_TYPES as readonly string[]).includes(v)
      ) as string[])
    : [];

  if (cleanName.length < 2 || cleanName.length > 80) {
    return NextResponse.json({ error: "invalid_name" }, { status: 400 });
  }
  if (!PHONE_RE.test(cleanPhone)) {
    return NextResponse.json({ error: "invalid_phone" }, { status: 400 });
  }
  if (!(STATES as readonly string[]).includes(cleanState)) {
    return NextResponse.json({ error: "invalid_state" }, { status: 400 });
  }
  if (cleanCity.length < 2 || cleanCity.length > 80) {
    return NextResponse.json({ error: "invalid_city" }, { status: 400 });
  }
  if (!(EXPERIENCE_OPTIONS as readonly string[]).includes(cleanExperience)) {
    return NextResponse.json({ error: "invalid_experience" }, { status: 400 });
  }
  if (vehicles.length === 0) {
    return NextResponse.json({ error: "invalid_vehicle" }, { status: 400 });
  }
  if (cleanEmployer.length > 120) {
    return NextResponse.json({ error: "invalid_employer" }, { status: 400 });
  }

  const row = [
    new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" }),
    cleanName,
    // Leading apostrophe, or Sheets reads a 10-digit number as a number and
    // drops any leading zero while right-aligning the column.
    `'${cleanPhone}`,
    cleanState,
    cleanCity,
    cleanExperience,
    vehicles.join(", "),
    cleanEmployer,
  ];

  if (!sheetsConfigured()) {
    console.warn(
      "Google Sheets not configured. Copy .env.local.example to .env.local and add " +
        "GOOGLE_SHEETS_ID / GOOGLE_SERVICE_ACCOUNT_EMAIL / GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY."
    );
    console.log("Smart Driver Awards entry:", row);
    return NextResponse.json({ ok: true, stored: false });
  }

  try {
    await appendSheetRow(SHEET_TAB, row, SHEET_HEADERS);
  } catch (err) {
    console.error("Sheets append threw:", err);
    return NextResponse.json({ error: "storage_failed" }, { status: 502 });
  }

  return NextResponse.json({ ok: true, stored: true });
}
