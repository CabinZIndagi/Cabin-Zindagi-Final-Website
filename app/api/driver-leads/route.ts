import { NextResponse } from "next/server";

/**
 * Stores a driver's details (name + phone; email and truck number optional)
 * in the Supabase `driver_leads` table before the driver services unlock.
 *
 * The service-role key never reaches the browser, so the insert has to happen
 * here. Supabase's REST endpoint is called directly — a single insert doesn't
 * justify pulling in the client SDK.
 */

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Indian mobile numbers, with or without a +91 / 0 prefix and loose spacing.
const PHONE_RE = /^(?:\+?91[-\s]?|0)?[6-9]\d{9}$/;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const clean = (value: unknown) =>
  typeof value === "string" ? value.trim() : "";

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const { name, phone, email, truckNumber, locale } = (body ?? {}) as Record<
    string,
    unknown
  >;

  const cleanName = clean(name);
  // Keep only digits and a leading +, so "+91 98765 43210" and "9876543210"
  // both land in the table the same way.
  const cleanPhone = clean(phone).replace(/[^\d+]/g, "");
  const cleanEmail = clean(email);
  // Plate numbers get written every which way ("MH 04 AB 1234", "mh04ab1234");
  // normalise to uppercase alphanumerics so duplicates are spottable.
  const cleanTruck = clean(truckNumber).toUpperCase().replace(/[^A-Z0-9]/g, "");

  if (cleanName.length < 2 || cleanName.length > 80) {
    return NextResponse.json({ error: "invalid_name" }, { status: 400 });
  }
  if (!PHONE_RE.test(cleanPhone)) {
    return NextResponse.json({ error: "invalid_phone" }, { status: 400 });
  }
  if (cleanEmail && !EMAIL_RE.test(cleanEmail)) {
    return NextResponse.json({ error: "invalid_email" }, { status: 400 });
  }
  if (cleanTruck && (cleanTruck.length < 6 || cleanTruck.length > 12)) {
    return NextResponse.json({ error: "invalid_truck" }, { status: 400 });
  }

  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    // No Supabase keys yet: log the lead so the gate still works in dev.
    console.warn(
      "Supabase not configured. Copy .env.local.example to .env.local and add SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY."
    );
    console.log("Driver lead:", {
      name: cleanName,
      phone: cleanPhone,
      email: cleanEmail,
      truckNumber: cleanTruck,
    });
    return NextResponse.json({ ok: true, stored: false });
  }

  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/driver_leads`, {
      method: "POST",
      headers: {
        apikey: SUPABASE_SERVICE_ROLE_KEY,
        Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
        "Content-Type": "application/json",
        Prefer: "return=minimal",
      },
      body: JSON.stringify({
        name: cleanName,
        phone: cleanPhone,
        email: cleanEmail || null,
        truck_number: cleanTruck || null,
        locale: clean(locale) || null,
      }),
    });

    if (!res.ok) {
      console.error("Supabase insert failed:", res.status, await res.text());
      return NextResponse.json({ error: "storage_failed" }, { status: 502 });
    }
  } catch (err) {
    console.error("Supabase insert threw:", err);
    return NextResponse.json({ error: "storage_failed" }, { status: 502 });
  }

  return NextResponse.json({ ok: true, stored: true });
}
