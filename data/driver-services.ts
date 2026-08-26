/**
 * Tiles shown on the /for-drivers hub. Each one will eventually deep-link into
 * its own section — until that section exists, mark it `comingSoon` and the
 * tile renders as a disabled card instead of a link. An href starting with
 * http opens in a new tab.
 *
 * Order matters: the hub colours the first four with the brand orange and the
 * rest with the accent green, so live services are listed first and
 * coming-soon ones last. When a service ships, move its entry up.
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
};

/** The Cabin Zindagi driver group invite. The hub card, the popup button and
    the generated QR all read this one constant. */
export const WHATSAPP_GROUP_URL =
  "https://chat.whatsapp.com/IJWXTQb0O657CLtGD3oexl";

export const driverServices: DriverService[] = [
  {
    id: "parking",
    icon: "local_parking",
    label: { en: "Parking Lots", hi: "पार्किंग" },
    href: "/stays?service=parking",
  },
  {
    id: "dhabas",
    icon: "restaurant",
    label: { en: "Dhabas", hi: "ढाबे" },
    href: "/stays?service=dhaba",
  },
  {
    id: "whatsapp",
    icon: "forum",
    label: { en: "WhatsApp Group", hi: "व्हाट्सएप ग्रुप" },
    // Reopens the group popup (QR + join button) rather than jumping straight
    // out — a driver on a laptop needs the QR, not a dead-end tab.
    action: "whatsapp",
  },
  {
    id: "help",
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
