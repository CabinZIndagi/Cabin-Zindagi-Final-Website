// Parking / dhaba rest-stops for drivers, shown as listings. Only one location is live
// today (Taloja, Navi Mumbai); add more entries here as they come online.

export type StayAmenity =
  | "parking"
  | "dhaba"
  | "washroom"
  | "water"
  | "security"
  | "tea"
  | "wifi"
  | "shower";

export type StayPrice = {
  label: string; // e.g. "6 Hrs", "Overnight"
  hours: number; // used by the duration filter
  price: number; // ₹ — PLACEHOLDER pricing, replace with real rates
};

export type Stay = {
  id: string;
  name: string;
  area: string;
  city: string;
  address: string;
  lat: number;
  lng: number;
  mapUrl: string;
  rating: number;
  reviews: number;
  premium?: boolean;
  tags: string[];
  amenities: StayAmenity[];
  pricing: StayPrice[];
};

export const stays: Stay[] = [
  {
    id: "taloja-truck-parking",
    name: "New Parking Truck 🚛 Taloja",
    area: "Taloja",
    city: "Navi Mumbai",
    address: "Taloja, Navi Mumbai, Maharashtra",
    lat: 19.068746,
    lng: 73.129317,
    mapUrl:
      "https://www.google.com/maps/place/New+parking+truck+%F0%9F%9A%9B+taloja+parking/@19.0686463,73.1290334,17.82z/data=!4m6!3m5!1s0x3be7eb007e7649bf:0xd5522c8cf812eae6!8m2!3d19.068746!4d73.129317!16s%2Fg%2F11wb5_v_sn",
    rating: 4.5,
    reviews: 8,
    premium: true,
    tags: ["Truck Friendly", "Overnight Parking", "Dhaba On-site"],
    amenities: ["parking", "dhaba", "washroom", "water", "security", "tea"],
    // PLACEHOLDER rates — replace with the real tariff for this yard.
    pricing: [
      { label: "3 Hrs", hours: 3, price: 120 },
      { label: "6 Hrs", hours: 6, price: 200 },
      { label: "12 Hrs", hours: 12, price: 350 },
      { label: "Overnight", hours: 24, price: 500 },
    ],
  },
];

export const AREAS = Array.from(new Set(stays.map((s) => s.area))).sort();
export const POPULAR_TAGS = Array.from(
  new Set(stays.flatMap((s) => s.tags)),
).sort();
