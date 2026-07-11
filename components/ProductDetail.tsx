"use client";

import Link from "next/link";
import Image from "next/image";
import { useLanguage } from "@/lib/language-context";
import type { Locale } from "@/lib/dictionaries";
import { products } from "@/data/products";

const productIcon: Record<string, string> = {
  "water-bottle": "water_drop",
  "care-kit": "backpack",
  dormitory: "night_shelter",
};

// Hero image per product.
const heroImage: Record<string, string> = {
  "water-bottle": "/products/water-bottle.png",
  "care-kit": "/products/travel-kit.png",
  dormitory: "/products/dormitory-building.png",
};

// Product shots on a light/studio background sit better "contained" on a panel;
// the dormitory photo fills its frame.
const heroContain: Record<string, boolean> = {
  "water-bottle": true,
  "care-kit": true,
};

// Long-form copy per product: overview, what's inside, and use cases by audience.
type ProductDetails = {
  description: string[];
  contents?: string[];
  useCases: { heading: string; points: string[] }[];
  closing?: string;
};

const productDetails: Record<string, Record<Locale, ProductDetails>> = {
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

export function ProductDetail({ id }: { id: string }) {
  const { t, locale } = useLanguage();
  const p = t.products;
  const prod = products.find((x) => x.id === id);

  if (!prod) {
    return (
      <section className="mx-auto flex min-h-[60vh] max-w-3xl flex-col items-center justify-center px-4 text-center">
        <h1 className="text-3xl font-bold">Product not found</h1>
        <Link href="/products" className="mt-6 font-semibold text-brandtext hover:opacity-80">
          ← Back to products
        </Link>
      </section>
    );
  }

  const isDrivers = prod.audience === "drivers";
  const accentText = isDrivers ? "text-brand" : "text-accent";
  const isDormitory = prod.id === "dormitory";
  const details = productDetails[prod.id]?.[locale];

  return (
    <section className="mx-auto max-w-6xl px-4 py-20 sm:py-24">
      <Link
        href="/products"
        className="inline-flex items-center gap-1.5 text-sm font-semibold opacity-70 transition hover:opacity-100"
      >
        <span aria-hidden>←</span> {p.driversHeading}
      </Link>

      {/* Hero */}
      <div className="mt-8 grid items-center gap-12 lg:grid-cols-2">
        <div>
          <span
            className={`inline-flex w-fit items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${
              isDrivers ? "bg-brand/10 text-brandtext" : "bg-accent/10 text-accent"
            }`}
          >
            <span className="material-symbols-outlined text-[14px]">
              {isDrivers ? "local_shipping" : "apartment"}
            </span>
            {isDrivers ? p.forDrivers : p.forCompanies}
          </span>

          <h1 className="mt-5 text-4xl font-bold tracking-tight sm:text-5xl">
            {prod.name[locale]}
          </h1>
          <p className="mt-4 max-w-md text-base leading-relaxed opacity-75">
            {prod.tagline[locale]}
          </p>

          <div className="mt-6">
            <span className="text-4xl font-extrabold tracking-tight">
              {prod.price[locale]}
            </span>
            <span className="ml-2 text-sm opacity-60">{prod.unit[locale]}</span>
          </div>

          <ul className="mt-8 space-y-3">
            {prod.features[locale].map((f) => (
              <li key={f} className="flex items-start gap-3 text-sm">
                <span className={`material-symbols-outlined text-[18px] ${accentText}`}>
                  check_circle
                </span>
                <span className="opacity-85">{f}</span>
              </li>
            ))}
          </ul>

          <div className="mt-9">
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 rounded-full bg-brand px-7 py-3 font-semibold text-[#1f2a33] shadow-lg shadow-brand/30 transition hover:bg-brand-light"
            >
              {p.buyLabel} <span aria-hidden>→</span>
            </Link>
          </div>
        </div>

        {/* Visual — photo if we have one, otherwise an icon panel. Product shots
            (bottle/kit) sit first: above the text on mobile, left on desktop.
            The dormitory photo stays after the text / on the right. */}
        <div className={heroContain[prod.id] ? "order-first" : ""}>
          {heroImage[prod.id] ? (
            heroContain[prod.id] ? (
              <div className="mx-auto flex aspect-square w-full max-w-[15rem] items-center justify-center rounded-3xl border border-black/5 bg-white p-6 dark:border-white/10 lg:max-w-none lg:p-8">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={heroImage[prod.id]}
                  alt={prod.name[locale]}
                  className="max-h-full w-auto object-contain"
                />
              </div>
            ) : (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img
                src={heroImage[prod.id]}
                alt={prod.name[locale]}
                className="w-full rounded-3xl border border-black/5 object-cover dark:border-white/10"
              />
            )
          ) : (
            <div
              className={`flex aspect-square items-center justify-center rounded-3xl border ${
                isDrivers
                  ? "border-brand/20 bg-brand/[0.06]"
                  : "border-accent/20 bg-accent/[0.06]"
              }`}
            >
              <span className={`material-symbols-outlined text-[120px] ${accentText}`}>
                {productIcon[prod.id] ?? "inventory_2"}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Overview, what's inside, and use cases (bottle & travel kit).
          Both columns are equal-height cards so they end on the same level. */}
      {details && (
        <div className="mt-20 grid items-stretch gap-6 lg:grid-cols-2 lg:gap-8">
          {/* Left: overview + contents (closing pinned to the bottom) */}
          <div className="flex flex-col rounded-2xl border border-black/10 p-7 dark:border-white/15">
            {details.description.map((para) => (
              <p
                key={para.slice(0, 24)}
                className="mb-4 text-base leading-relaxed opacity-80"
              >
                {para}
              </p>
            ))}

            {details.contents && (
              <div className="mt-4">
                <h3 className="text-lg font-bold tracking-tight">
                  {locale === "hi"
                    ? `${prod.name[locale]} में क्या है`
                    : `What's inside the ${prod.name[locale]}`}
                </h3>
                <ul className="mt-4 space-y-2">
                  {details.contents.map((c) => (
                    <li key={c} className="flex items-start gap-3 text-sm">
                      <span className={`material-symbols-outlined text-[18px] ${accentText}`}>
                        check_circle
                      </span>
                      <span className="opacity-85">{c}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {details.closing && (
              <p className="mt-auto pt-8 text-sm leading-relaxed opacity-70">
                {details.closing}
              </p>
            )}
          </div>

          {/* Right: use cases for companies & CSR */}
          <div className="flex flex-col rounded-2xl border border-black/10 p-7 dark:border-white/15">
            <h3 className="text-lg font-bold tracking-tight">
              {locale === "hi" ? "इस्तेमाल" : "Use cases"}
            </h3>
            <div className="mt-5 space-y-6">
              {details.useCases.map((group) => (
                <div key={group.heading}>
                  <h4 className="text-sm font-semibold text-brandtext">
                    {group.heading}
                  </h4>
                  <ul className="mt-2 space-y-1.5">
                    {group.points.map((pt) => (
                      <li
                        key={pt}
                        className="flex gap-2 text-sm leading-relaxed opacity-80"
                      >
                        <span className="text-brandtext">•</span>
                        <span>{pt}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Dormitory — reuse the spec table, manufacturing cards, and photos */}
      {isDormitory && (
        <div className="mt-24 space-y-24">
          {/* Body */}
          <div className="max-w-3xl">
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
              {p.dormitoryHeading}
            </h2>
            <p className="mt-4 text-base leading-relaxed opacity-80">
              {p.dormitoryBody}
            </p>
          </div>

          {/* Spec table */}
          <div>
            <h3 className="text-center text-2xl font-bold text-brandtext sm:text-3xl">
              {p.offerHeading}
            </h3>
            <div className="mt-10 overflow-x-auto">
              <div className="min-w-[560px]">
                <div className="grid grid-cols-4 gap-6 pb-3">
                  {p.tableHeaders.map((h, i) => (
                    <div
                      key={h}
                      className={`text-lg font-bold text-brandtext sm:text-xl ${
                        i > 0
                          ? "border-l border-dashed border-black/25 pl-6 dark:border-white/25"
                          : ""
                      }`}
                    >
                      {h}
                    </div>
                  ))}
                </div>
                {p.tableRows.map((row, ri) => (
                  <div
                    key={ri}
                    className="grid grid-cols-4 gap-6 border-t border-black/5 py-5 text-base font-semibold dark:border-white/10"
                  >
                    {row.map((cell, ci) => (
                      <div
                        key={ci}
                        className={
                          ci > 0
                            ? "border-l border-dashed border-black/15 pl-6 dark:border-white/15"
                            : "font-bold"
                        }
                      >
                        {cell}
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Manufacturing & deployment cards */}
          <div className="grid gap-6 md:grid-cols-3">
            {p.offerCards.map((card) => (
              <div
                key={card.title}
                className="rounded-2xl border border-black/10 p-7 dark:border-white/15"
              >
                <h4 className="text-xl font-bold text-brandtext">{card.title}</h4>
                <p className="mt-3 text-sm leading-relaxed opacity-80">
                  {card.body}
                </p>
                <ul className="mt-4 space-y-2">
                  {card.points.map((pt) => (
                    <li key={pt} className="flex gap-2 text-sm opacity-80">
                      <span className="text-brandtext">•</span>
                      <span>{pt}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* A closer look — captioned exterior + interior, with section text */}
          <div>
            <div className="max-w-3xl">
              <h3 className="text-2xl font-bold tracking-tight sm:text-3xl">
                A closer look
              </h3>
              <p className="mt-3 text-base leading-relaxed opacity-80">
                From the yard to the bunk — how a deployed Cabin Zindagi
                dormitory actually looks and lives on site.
              </p>
            </div>

            {/* Exterior */}
            <p className="mt-10 text-xs font-semibold uppercase tracking-[0.2em] text-brandtext">
              On site
            </p>
            <div className="mt-4 grid gap-5 sm:grid-cols-2 sm:gap-6">
              {[
                { src: "/products/dormitory.png", cap: "Stacked 20ft module" },
                { src: "/products/dormitory-night.png", cap: "Lit sleeping bays after dark" },
              ].map((img) => (
                <figure key={img.src}>
                  <div className="relative h-60 w-full overflow-hidden rounded-xl border border-black/5 dark:border-white/10">
                    <Image
                      src={img.src}
                      alt={img.cap}
                      fill
                      sizes="(max-width: 640px) 100vw, 50vw"
                      className="object-cover"
                    />
                  </div>
                  <figcaption className="mt-3 text-center text-sm opacity-60">
                    {img.cap}
                  </figcaption>
                </figure>
              ))}
            </div>

            {/* Interior & layout */}
            <p className="mt-12 text-xs font-semibold uppercase tracking-[0.2em] text-brandtext">
              Interior &amp; layout
            </p>
            <div className="mt-4 grid gap-5 sm:grid-cols-3 sm:gap-6">
              {[
                { src: "/products/dormitory-beds.png", cap: p.bedsCaption, fit: "object-cover" },
                { src: "/products/dormitory-showers.png", cap: p.showerCaption, fit: "object-cover" },
                { src: "/products/dormitory-floorplan.png", cap: p.layoutCaption, fit: "bg-white object-contain p-3" },
              ].map((img) => (
                <figure key={img.src}>
                  <div className={`relative h-56 w-full overflow-hidden rounded-xl border border-black/5 dark:border-white/10 ${img.fit.includes("bg-white") ? "bg-white" : ""}`}>
                    <Image
                      src={img.src}
                      alt={img.cap}
                      fill
                      sizes="(max-width: 640px) 50vw, 33vw"
                      className={img.fit.includes("object-contain") ? "p-3 object-contain" : "object-cover"}
                    />
                  </div>
                  <figcaption className="mt-3 text-center text-sm opacity-60">
                    {img.cap}
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
