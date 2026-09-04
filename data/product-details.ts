import type { Authored } from "@/lib/i18n/locales";

/**
 * Long-form copy for each /products/[id] page.
 *
 * Moved out of ProductDetail.tsx so the translation pipeline can reach it:
 * scripts/export-strings.ts walks the dictionary, and lib/dictionaries.ts
 * composes what lives in data/. While this sat inside the component it stayed
 * English in every locale no matter how many translation runs you did.
 */
type ProductDetails = {
  description: string[];
  contents?: string[];
  useCases: { heading: string; points: string[] }[];
  closing?: string;
};

export const productDetails: Record<string, Authored<ProductDetails>> = {
  "water-bottle": {
    en: {
      description: [
        "Every truck driver spends 10–14 hours on the road every single day. Access to clean, cold water isn't a luxury — it's basic safety and health.",
        "The bottle is durable enough for rough roads, easy to use inside the cabin, and reliable for the long haul.",
      ],
      useCases: [
        {
          heading: "For drivers",
          points: [
            "Keeps water cool for hours during hot-day driving",
            "Leak-proof and sturdy — built for bumpy highways and dusty dhabas",
            "Easy to grip, clean, and refill on the go",
          ],
        },
        {
          heading: "For logistics companies & fleet owners",
          points: [
            "A practical everyday welfare product your drivers will actually use",
            "Simple to distribute across your fleet, branches, or depots",
            "Option for bulk orders with branding (company logo on the bottle)",
            "Ideal for driver onboarding kits, safety programs, and annual gifting",
          ],
        },
        {
          heading: "For CSR & driver welfare programs",
          points: [
            "High-impact, low-complexity initiative focused on driver health and road safety",
            "Directly supports hydration, reduces fatigue, and encourages safer driving behaviour",
            "Works well alongside health camps, awareness drives, and rest-stop welfare programs",
            "Suitable for NGOs, foundations, and corporate CSR teams in trucking and logistics",
          ],
        },
      ],
      closing:
        "Planning a bulk order for your fleet or CSR program? Reach out with your quantity, locations, and timelines — we'll help you plan supply and distribution.",
    },
    hi: {
      description: [
        "हर ट्रक ड्राइवर रोज़ 10–14 घंटे सड़क पर बिताता है। साफ़, ठंडा पानी कोई विलासिता नहीं — यह बुनियादी सुरक्षा और सेहत है।",
        "यह बोतल खराब सड़कों के लिए मज़बूत है, केबिन में इस्तेमाल करने में आसान है, और लंबे सफ़र के लिए भरोसेमंद है।",
      ],
      useCases: [
        {
          heading: "ड्राइवरों के लिए",
          points: [
            "गर्मी के दिनों में घंटों पानी ठंडा रखती है",
            "लीक-प्रूफ और मज़बूत — ऊबड़-खाबड़ हाईवे और धूल भरे ढाबों के लिए बनी",
            "पकड़ने, साफ़ करने और चलते-फिरते भरने में आसान",
          ],
        },
        {
          heading: "लॉजिस्टिक्स कंपनियों और फ्लीट मालिकों के लिए",
          points: [
            "एक व्यावहारिक रोज़मर्रा का वेलफेयर प्रोडक्ट जिसे आपके ड्राइवर सचमुच इस्तेमाल करेंगे",
            "अपने बेड़े, शाखाओं या डिपो में बाँटना आसान",
            "ब्रांडिंग के साथ बल्क ऑर्डर का विकल्प (बोतल पर कंपनी का लोगो)",
            "ड्राइवर ऑनबोर्डिंग किट, सुरक्षा कार्यक्रमों और सालाना गिफ्टिंग के लिए आदर्श",
          ],
        },
        {
          heading: "CSR और ड्राइवर वेलफेयर कार्यक्रमों के लिए",
          points: [
            "ड्राइवर सेहत और सड़क सुरक्षा पर केंद्रित उच्च-प्रभाव, कम-जटिलता वाली पहल",
            "हाइड्रेशन में सीधे मदद, थकान कम करती है, और सुरक्षित ड्राइविंग को बढ़ावा देती है",
            "हेल्थ कैंप, जागरूकता अभियानों और रेस्ट-स्टॉप वेलफेयर कार्यक्रमों के साथ अच्छी तरह काम करती है",
            "ट्रकिंग और लॉजिस्टिक्स में NGO, फाउंडेशन और कॉर्पोरेट CSR टीमों के लिए उपयुक्त",
          ],
        },
      ],
      closing:
        "अपने बेड़े या CSR कार्यक्रम के लिए बल्क ऑर्डर की योजना बना रहे हैं? अपनी मात्रा, स्थान और समयसीमा बताएं — हम सप्लाई और वितरण की योजना में मदद करेंगे।",
    },
  },
  "care-kit": {
    en: {
      description: [
        "A truck driver's life is on the road — days away from home, long shifts, and limited access to basic personal care. The Driver Travel Kit is packed with daily hygiene essentials so your driver can feel fresh and confident on every trip.",
      ],
      contents: [
        "1 × Dental kit (toothbrush + toothpaste)",
        "1 × Shaving kit (razor + cream)",
        "1 × Comb",
        "1 × Hair oil",
        "2 × Bath soap bars",
      ],
      useCases: [
        {
          heading: "For drivers",
          points: [
            "All essential personal-care items in one compact, easy-to-carry pack",
            "Helps maintain daily hygiene even during multi-day trips and night halts",
            "Lightweight and fits easily in the cabin or a small bag",
          ],
        },
        {
          heading: "For logistics companies & fleet owners",
          points: [
            "A practical and thoughtful welfare kit to distribute to your drivers",
            "Great for driver onboarding, safety programs, or festive gifting",
            "Available in bulk — easy to plan and distribute across your fleet",
            "Option to customise with your company branding",
          ],
        },
        {
          heading: "For CSR & driver welfare programs",
          points: [
            "A simple, high-impact initiative that directly improves driver wellbeing",
            "Ideal for NGOs, foundations, and corporate CSR teams in the logistics sector",
            "Easy to procure, pack, and distribute at scale across regions",
          ],
        },
      ],
      closing:
        "Looking to order in bulk for your fleet or CSR initiative? Share your requirement and we'll help you plan and deliver.",
    },
    hi: {
      description: [
        "ट्रक ड्राइवर की ज़िंदगी सड़क पर बीतती है — घर से दूर दिन, लंबी शिफ्ट और बुनियादी पर्सनल केयर तक सीमित पहुँच। ड्राइवर ट्रैवल किट रोज़मर्रा की हाइजीन ज़रूरतों से भरी है ताकि आपका ड्राइवर हर सफ़र पर तरोताज़ा और आत्मविश्वासी महसूस करे।",
      ],
      contents: [
        "1 × डेंटल किट (टूथब्रश + टूथपेस्ट)",
        "1 × शेविंग किट (रेज़र + क्रीम)",
        "1 × कंघी",
        "1 × हेयर ऑयल",
        "2 × नहाने के साबुन",
      ],
      useCases: [
        {
          heading: "ड्राइवरों के लिए",
          points: [
            "सभी ज़रूरी पर्सनल-केयर चीज़ें एक छोटे, ले जाने में आसान पैक में",
            "कई दिनों के सफ़र और रात के पड़ावों में भी रोज़ाना हाइजीन बनाए रखने में मदद",
            "हल्का और केबिन या छोटे बैग में आसानी से फिट",
          ],
        },
        {
          heading: "लॉजिस्टिक्स कंपनियों और फ्लीट मालिकों के लिए",
          points: [
            "अपने ड्राइवरों को बाँटने के लिए एक व्यावहारिक और विचारशील वेलफेयर किट",
            "ड्राइवर ऑनबोर्डिंग, सुरक्षा कार्यक्रमों या त्योहारी गिफ्टिंग के लिए बढ़िया",
            "बल्क में उपलब्ध — अपने बेड़े में योजना बनाना और बाँटना आसान",
            "अपनी कंपनी की ब्रांडिंग के साथ कस्टमाइज़ करने का विकल्प",
          ],
        },
        {
          heading: "CSR और ड्राइवर वेलफेयर कार्यक्रमों के लिए",
          points: [
            "एक सरल, उच्च-प्रभाव वाली पहल जो ड्राइवर की भलाई को सीधे बेहतर बनाती है",
            "लॉजिस्टिक्स क्षेत्र में NGO, फाउंडेशन और कॉर्पोरेट CSR टीमों के लिए आदर्श",
            "बड़े पैमाने पर खरीदना, पैक करना और क्षेत्रों में बाँटना आसान",
          ],
        },
      ],
      closing:
        "अपने बेड़े या CSR पहल के लिए बल्क ऑर्डर करना चाहते हैं? अपनी ज़रूरत बताएं और हम योजना बनाने और डिलीवर करने में मदद करेंगे।",
    },
  },
};
