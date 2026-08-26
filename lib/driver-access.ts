/**
 * Tracks what this browser has already told us on /for-drivers — the language
 * they picked and whether they've handed over their details.
 *
 * This is a lead-capture gate, not security — the listings in `data/stays.ts`
 * ship with the bundle either way. It only makes sure the form is seen before
 * the directory is.
 */

const ACCESS_KEY = "cz-driver-access";
const LANG_KEY = "cz-driver-lang-chosen";
const WHATSAPP_KEY = "cz-driver-wa-seen";

export type DriverAccess = {
  name: string;
  grantedAt: string;
};

export function readDriverAccess(): DriverAccess | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(ACCESS_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<DriverAccess>;
    return parsed?.grantedAt
      ? { name: parsed.name ?? "", grantedAt: parsed.grantedAt }
      : null;
  } catch {
    return null;
  }
}

export function grantDriverAccess(name: string) {
  write(ACCESS_KEY, JSON.stringify({ name, grantedAt: new Date().toISOString() }));
}

/** Whether the driver has explicitly picked a language on this device. */
export function hasChosenLanguage(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return window.localStorage.getItem(LANG_KEY) === "1";
  } catch {
    return false;
  }
}

export function markLanguageChosen() {
  write(LANG_KEY, "1");
}

/** The group invite is shown once — joined or dismissed, it stays closed. */
export function hasSeenWhatsapp(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return window.localStorage.getItem(WHATSAPP_KEY) === "1";
  } catch {
    return false;
  }
}

export function markWhatsappSeen() {
  write(WHATSAPP_KEY, "1");
}


function write(key: string, value: string) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(key, value);
  } catch {
    // Private-browsing mode with storage blocked — the visitor just answers
    // again next time.
  }
}
