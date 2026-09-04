import type { Authored } from "@/lib/i18n/locales";

/**
 * Copy for the scroll panels on the home and impact pages.
 *
 * This lived inside TyreScroll.tsx, which meant the translation pipeline could
 * not see it — scripts/export-strings.ts walks the dictionary, and the
 * dictionary composes what lives in data/. Anything authored inside a component
 * silently stays English in every locale, which is exactly what happened here.
 */
type JourneyEntry = {
  title: string;
  variant: string;
  intro: string;
  cards: { title: string; text: string }[];
};

// Opening block ("Why this matters") shown while the wheel is parked far left.
type CrisisCopy = {
  eyebrow: string;
  heading: string;
  intro: string;
  cards: { title: string; text: string }[];
};

export const INVISIBLE_CRISIS: Authored< CrisisCopy> = {
  en: {
    eyebrow: "Why this matters",
    heading: "The Invisible Crisis on India's Highways",
    intro:
      "India's ₹14 lakh crore logistics industry runs on the backs of truck drivers. Yet they remain one of the country's most neglected workforces — no healthcare, no rest infrastructure, no voice. When drivers break down, supply chains break down.",
    cards: [
      { title: "Police Harassment", text: "Routine extortion and harassment on highways. Drivers lose earnings and dignity every single trip." },
      { title: "Zero Health Coverage", text: "No insurance, no access to healthcare. A single accident can destroy an entire family financially." },
      { title: "No Safe Rest Stops", text: "Drivers park wherever they can — unsafe, unhygienic, undignified. Fatigue is a leading cause of highway deaths." },
      { title: "Family Separation", text: "8 to 10 months away from home annually. Mental health, marriages, and children's upbringing — all suffer silently." },
    ],
  },
  hi: {
    eyebrow: "यह क्यों मायने रखता है",
    heading: "भारत के हाईवे पर अनदेखा संकट",
    intro:
      "भारत का ₹14 लाख करोड़ का लॉजिस्टिक्स उद्योग ट्रक ड्राइवरों के दम पर चलता है। फिर भी वे देश के सबसे उपेक्षित कामगारों में से हैं — न स्वास्थ्य सेवा, न आराम की सुविधा, न आवाज़। जब ड्राइवर टूटते हैं, तो सप्लाई चेन टूट जाती है।",
    cards: [
      { title: "पुलिस उत्पीड़न", text: "हाईवे पर रोज़मर्रा की वसूली और उत्पीड़न। ड्राइवर हर सफ़र में कमाई और सम्मान खोते हैं।" },
      { title: "शून्य स्वास्थ्य कवरेज", text: "न बीमा, न स्वास्थ्य सेवा तक पहुँच। एक दुर्घटना पूरे परिवार को आर्थिक रूप से बर्बाद कर सकती है।" },
      { title: "सुरक्षित विश्राम स्थल नहीं", text: "ड्राइवर जहाँ जगह मिले वहीं रुकते हैं — असुरक्षित, अस्वच्छ, बिना सम्मान के। थकान हाईवे मौतों का बड़ा कारण है।" },
      { title: "परिवार से दूरी", text: "साल में 8 से 10 महीने घर से दूर। मानसिक सेहत, रिश्ते और बच्चों की परवरिश — सब चुपचाप पीड़ित होते हैं।" },
    ],
  },
};

export const OUTCOME_EXTRA: Authored< { title: string; text: string }[]> = {
  en: [
    { title: "Stronger retention", text: "Drivers treated with dignity stay in the job longer" },
    { title: "Policy momentum", text: "Welfare standards moving into boardrooms and policy" },
  ],
  hi: [
    { title: "बेहतर रिटेंशन", text: "सम्मान के साथ रखे गए ड्राइवर नौकरी में ज़्यादा समय टिकते हैं" },
    { title: "नीति में गति", text: "वेलफेयर मानक बोर्डरूम और नीति में पहुँच रहे हैं" },
  ],
};

type AsideCopy = {
  eyebrow: string;
  title: string;
  intro: string;
  cards: { title: string; text: string }[];
};

export const PRODUCTS_ASIDE: Authored<AsideCopy> = {
  en: {
    eyebrow: "What it means for drivers",
    title: "Rest that restores",
    intro: "What we build gives drivers back what the road takes away — sleep, hygiene and a moment to recover.",
    cards: [
      { title: "A real night's sleep", text: "A clean bed and a quiet bay instead of a cramped cabin, so drivers start the next leg fresh." },
      { title: "Dignity and hygiene", text: "Showers and toilets let drivers wash up and feel human again before they roll out." },
      { title: "Healthier on the road", text: "Clean water and travel kits cut fatigue and keep drivers well across long hauls." },
    ],
  },
  hi: {
    eyebrow: "ड्राइवरों के लिए इसका मतलब",
    title: "आराम जो फिर से तरोताज़ा करे",
    intro: "हम जो बनाते हैं वह ड्राइवरों को वह लौटाता है जो सड़क छीन लेती है — नींद, साफ़-सफ़ाई और संभलने का एक पल।",
    cards: [
      { title: "एक सच्ची रात की नींद", text: "तंग केबिन के बजाय एक साफ़ बिस्तर और शांत जगह, ताकि ड्राइवर अगला सफ़र तरोताज़ा होकर शुरू करें।" },
      { title: "सम्मान और साफ़-सफ़ाई", text: "शावर और शौचालय ड्राइवरों को नहाने और रवाना होने से पहले फिर से इंसान जैसा महसूस करने देते हैं।" },
      { title: "सड़क पर ज़्यादा स्वस्थ", text: "साफ़ पानी और ट्रैवल किट थकान कम करते हैं और लंबे सफ़र में ड्राइवरों को स्वस्थ रखते हैं।" },
    ],
  },
};
