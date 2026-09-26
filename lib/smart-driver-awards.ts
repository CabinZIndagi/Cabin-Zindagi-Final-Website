/**
 * Everything that changes between runs of Smart Driver Awards lives here:
 * the entry window, the dropdown options and the sheet tab name. Imported by
 * both the page (server) and the form (client), so keep it free of secrets.
 */

/**
 * Entry window, IST. Edit these two lines to open or close registration —
 * nothing else needs to change.
 *
 * Both the page and /api/award-entries check this, because a page that has
 * gone read-only does not stop someone re-posting the request by hand.
 *
 * Closing is inclusive of the final day: an entry sent at 23:59 on the closing
 * date still counts, and the first second of the next day does not.
 */
export const ENTRIES_OPEN_AT = new Date("2026-09-26T00:00:00+05:30");
export const ENTRIES_CLOSE_AT = new Date("2026-10-31T23:59:59+05:30");

/** Tab (sheet) name inside the spreadsheet that rows are appended to. */
export const SHEET_TAB = "Entries";

export type WindowState = "before" | "open" | "closed";

export function windowState(now: Date = new Date()): WindowState {
  if (now < ENTRIES_OPEN_AT) return "before";
  if (now > ENTRIES_CLOSE_AT) return "closed";
  return "open";
}

/** Shown on the page as "entries close on ..." — IST, since entrants are in India. */
export function formatWindowDate(date: Date) {
  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "Asia/Kolkata",
  }).format(date);
}

/**
 * Labels are bilingual Hindi/English inline, matching the Smart Driver Awards
 * form these fields come from. The site's own dictionaries are not used here:
 * they carry eight locales, and the source form only ever existed in two.
 */
/**
 * Exactly the states the Smart Driver Awards form offers, in its order —
 * the 28 states plus Delhi. The other union territories are deliberately
 * absent, so do not "complete" this list.
 *
 * Bilingual, matching the source form. Four of its entries are missing their
 * closing bracket (Assam, Haryana, Kerala, Meghalaya); those are fixed here
 * rather than reproduced.
 */
export const STATES = [
  "आंध्र प्रदेश (Andhra Pradesh)",
  "अरुणाचल प्रदेश (Arunachal Pradesh)",
  "असम (Assam)",
  "बिहार (Bihar)",
  "छत्तीसगढ़ (Chhattisgarh)",
  "गोवा (Goa)",
  "गुजरात (Gujarat)",
  "हरियाणा (Haryana)",
  "हिमाचल प्रदेश (Himachal Pradesh)",
  "झारखंड (Jharkhand)",
  "कर्नाटक (Karnataka)",
  "केरल (Kerala)",
  "मध्य प्रदेश (Madhya Pradesh)",
  "महाराष्ट्र (Maharashtra)",
  "मणिपुर (Manipur)",
  "मेघालय (Meghalaya)",
  "मिजोरम (Mizoram)",
  "नागालैंड (Nagaland)",
  "ओडिशा (Odisha)",
  "पंजाब (Punjab)",
  "राजस्थान (Rajasthan)",
  "सिक्किम (Sikkim)",
  "तमिलनाडु (Tamil Nadu)",
  "तेलंगाना (Telangana)",
  "त्रिपुरा (Tripura)",
  "उत्तर प्रदेश (Uttar Pradesh)",
  "उत्तराखंड (Uttarakhand)",
  "पश्चिम बंगाल (West Bengal)",
  "दिल्ली (Delhi)",
] as const;

/**
 * Hindi only, and worded exactly as the Smart Driver Awards form words them —
 * so entries from both forms can be pooled in one sheet without the same band
 * appearing under two different spellings.
 */
export const EXPERIENCE_OPTIONS = [
  "1 साल से कम",
  "1–3 साल",
  "3–5 साल",
  "5–10 साल",
  "10–15 साल",
  "15–20 साल",
  "20 साल से ज्यादा",
] as const;

export const VEHICLE_TYPES = [
  "ट्रक / हेवी कमर्शियल व्हीकल (HCV)",
  "मिनी ट्रक / LCV",
  "टैंकर",
  "ट्रेलर / कंटेनर",
  "इलेक्ट्रिक ट्रक / EV",
] as const;
