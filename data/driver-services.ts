/**
 * Tiles shown on the /for-drivers hub. Each one will eventually deep-link into
 * its own section — until that section exists, mark it `comingSoon` and the
 * tile renders as a disabled card instead of a link. An href starting with
 * http opens in a new tab.
 *
 * Order matters, and so does colour: a live service carries a `tint` and a
 * coming-soon one does not. That is the whole availability signal — a tinted
 * tile can be tapped, a grey one cannot — so list live services first, and when
 * one ships, move its entry up and give it a tint.
 */

export type DriverService = {
  id: string;
  icon: string; // Material Symbols name
  label: { en: string; hi: string };
  href?: string;
  /** Opens a popup instead of navigating. */
  action?: "whatsapp";
  comingSoon?: boolean;
  /**
   * Artwork anchored to the tile's bottom-right corner, cropped by the tile.
   * Put files in public/services/ and reference them as "/services/<file>".
   * Cut-outs on a transparent background (PNG/WebP) sit best; a plain photo
   * will show its own rectangle. Falls back to the icon when unset.
   */
  image?: string;
  /**
   * Brand colour for a LIVE tile. Coming-soon tiles leave this unset and stay
   * neutral glass, which is what tells a driver at a glance which half of the
   * grid actually goes anywhere.
   *
   * Full class strings, not fragments: Tailwind only emits classes it can read
   * literally, and tailwind.config.ts scans data/ for exactly this reason.
   * Every value is a logo colour — brand orange and accent green — so the grid
   * reads warm-to-cool across the two rows without inventing a new palette.
   */
  tint?: { wash: string; border: string; icon: string };
};

/** The Cabin Zindagi driver group invite. The hub card, the popup button and
    the generated QR all read this one constant. */
export const WHATSAPP_GROUP_URL =
  "https://chat.whatsapp.com/IJWXTQb0O657CLtGD3oexl";

export const driverServices: DriverService[] = [
  {
    id: "parking",
    tint: {
      wash: "from-brand/35 dark:from-brand/25",
      border: "border-brand/45 dark:border-brand/30",
      icon: "text-brand/55 dark:text-brand/45",
    },
    icon: "local_parking",
    label: { en: "Parking Lots", hi: "पार्किंग" },
    href: "/stays?service=parking",
  },
  {
    id: "dhabas",
    tint: {
      wash: "from-brand-light/35 dark:from-brand-light/25",
      border: "border-brand-light/45 dark:border-brand-light/30",
      icon: "text-brand-light/55 dark:text-brand-light/45",
    },
    icon: "restaurant",
    label: { en: "Dhabas", hi: "ढाबे" },
    href: "/stays?service=dhaba",
  },
  {
    id: "whatsapp",
    tint: {
      wash: "from-accent/35 dark:from-accent/25",
      border: "border-accent/45 dark:border-accent/30",
      icon: "text-accent/55 dark:text-accent-light/45",
    },
    icon: "forum",
    label: { en: "WhatsApp Group", hi: "व्हाट्सएप ग्रुप" },
    // Reopens the group popup (QR + join button) rather than jumping straight
    // out — a driver on a laptop needs the QR, not a dead-end tab.
    action: "whatsapp",
  },
  {
    id: "help",
    tint: {
      wash: "from-accent-light/35 dark:from-accent-light/25",
      border: "border-accent-light/45 dark:border-accent-light/30",
      icon: "text-accent-light/60 dark:text-accent-light/45",
    },
    icon: "support_agent",
    label: { en: "Help & Support", hi: "मदद" },
    href: "/contact",
  },
  {
    id: "music",
    icon: "music_note",
    label: { en: "Music", hi: "संगीत" },
    comingSoon: true,
  },
  {
    id: "fuel",
    icon: "local_gas_station",
    label: { en: "Fuel Stops", hi: "फ्यूल पंप" },
    comingSoon: true,
  },
];
