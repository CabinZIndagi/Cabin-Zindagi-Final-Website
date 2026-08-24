/**
 * Tiles shown on the /for-drivers hub. Each one will eventually deep-link into
 * its own section — until that section exists, mark it `comingSoon` and the
 * tile renders as a disabled card instead of a link.
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
  comingSoon?: boolean;
};

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
    id: "stays",
    icon: "hotel",
    label: { en: "Stays & Rest", hi: "विश्राम" },
    href: "/stays?service=stay",
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
    id: "washrooms",
    icon: "shower",
    label: { en: "Washrooms", hi: "शौचालय" },
    comingSoon: true,
  },
  {
    id: "fuel",
    icon: "local_gas_station",
    label: { en: "Fuel Stops", hi: "फ्यूल पंप" },
    comingSoon: true,
  },
  {
    id: "health",
    icon: "medical_services",
    label: { en: "Health Camps", hi: "स्वास्थ्य शिविर" },
    comingSoon: true,
  },
];

/** The Cabin Zindagi driver group invite. The hub card, the popup button and
    the generated QR all read this one constant. */
export const WHATSAPP_GROUP_URL =
  "https://chat.whatsapp.com/IJWXTQb0O657CLtGD3oexl";
