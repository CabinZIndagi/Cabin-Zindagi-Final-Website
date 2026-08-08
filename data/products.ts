import type { Locale } from "@/lib/dictionaries";

export type Product = {
  id: string;
  popular?: boolean;
  audience: "drivers" | "companies";
  name: Record<Locale, string>;
  tagline: Record<Locale, string>;
  price: Record<Locale, string>;
  unit: Record<Locale, string>;
  features: Record<Locale, string[]>;
  // Optional custom link + CTA. When set, the card links here (e.g. a booking
  // flow) instead of the default /products/[id] detail page.
  href?: string;
  cta?: Record<Locale, string>;
};

export const products: Product[] = [
  {
    id: "water-bottle",
    audience: "drivers",
    name: { en: "Water Bottle", hi: "वॉटर बोतल" },
    tagline: {
      en: "Don't just service your trucks — care for the people who drive them. Keep drivers refreshed and your fleet moving.",
      hi: "सिर्फ़ अपने ट्रकों की सर्विस न करें — जो उन्हें चलाते हैं उनका ख्याल रखें। ड्राइवरों को तरोताज़ा और अपने बेड़े को चलते रखें।",
    },
    price: { en: "₹249", hi: "₹249" },
    unit: { en: "per bottle", hi: "प्रति बोतल" },
    features: {
      en: [
        "Insulated stainless steel",
        "Instant energy glucose sachet included",
        "Brand logo print for fleets & logistics",
        "Beats dehydration on long summer routes",
      ],
      hi: [
        "इंसुलेटेड स्टेनलेस स्टील",
        "तुरंत एनर्जी ग्लूकोज़ सैशे शामिल",
        "बेड़े और लॉजिस्टिक्स के लिए ब्रांड लोगो प्रिंट",
        "लंबे गर्मी के रूट पर डिहाइड्रेशन से बचाव",
      ],
    },
  },
  {
    id: "care-kit",
    popular: true,
    audience: "drivers",
    name: { en: "Driver Travel Kit", hi: "ड्राइवर ट्रैवल किट" },
    tagline: {
      en: "Soap, dental and shaving kits, hair oil and a comb — everything a driver needs to stay clean and fresh on the road, in one re-sealable pouch.",
      hi: "साबुन, डेंटल और शेविंग किट, हेयर ऑयल और कंघी — सड़क पर साफ़ और तरोताज़ा रहने की हर ज़रूरत, एक फिर से सील होने वाले पाउच में।",
    },
    price: { en: "₹149", hi: "₹149" },
    unit: { en: "per kit", hi: "प्रति किट" },
    features: {
      en: [
        "Dental kit & shaving kit",
        "Bath soap bars & hair oil",
        "Comb & daily grooming essentials",
        "Re-sealable travel pouch",
        "Brand logo print for fleets & logistics",
      ],
      hi: [
        "डेंटल किट और शेविंग किट",
        "नहाने के साबुन और हेयर ऑयल",
        "कंघी और रोज़मर्रा की ग्रूमिंग ज़रूरतें",
        "फिर से सील होने वाला ट्रैवल पाउच",
        "बेड़े और लॉजिस्टिक्स के लिए ब्रांड लोगो प्रिंट",
      ],
    },
  },
  {
    id: "dormitory",
    audience: "companies",
    name: { en: "Modular Portacabin Dormitory", hi: "मॉड्यूलर पोर्टाकेबिन डॉर्मिटरी" },
    tagline: {
      en: "Rest infrastructure for factories & logistics parks.",
      hi: "कारखानों और लॉजिस्टिक्स पार्कों के लिए विश्राम अवसंरचना।",
    },
    price: { en: "Custom", hi: "कस्टम" },
    unit: { en: "for companies", hi: "कंपनियों के लिए" },
    features: {
      en: [
        "Portable 20ft & 40ft units",
        "Comfortable first-floor sleeping bays",
        "Ground-floor showers & toilets",
        "Built & installed on-site",
        "Dedicated support",
      ],
      hi: [
        "पोर्टेबल 20 फुट और 40 फुट यूनिट",
        "आरामदायक पहली मंज़िल स्लीपिंग बे",
        "भूतल पर शॉवर और शौचालय",
        "साइट पर निर्माण और स्थापना",
        "समर्पित सहायता",
      ],
    },
  },
];
