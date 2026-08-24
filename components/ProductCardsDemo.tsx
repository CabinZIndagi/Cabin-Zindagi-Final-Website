"use client";

import Link from "next/link";
import { useLanguage } from "@/lib/language-context";
import { products } from "@/data/products";

// Suggestion #2 — a product icon per item.
const productIcon: Record<string, string> = {
  "water-bottle": "water_drop",
  "care-kit": "backpack",
  dormitory: "night_shelter",
};

export function ProductCardsDemo() {
  const { t, locale } = useLanguage();
  const p = t.products;

  return (
    <section className="mx-auto max-w-6xl px-4 pt-32 pb-24 sm:pt-40 sm:pb-32">
      {/* Production product-page header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
          {p.driversHeading}
        </h2>
        <p className="mx-auto mt-3 max-w-lg text-base opacity-70">
          {p.driversSub}
        </p>
      </div>

      <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3 lg:items-stretch">
        {products.map((prod) => {
          const isDrivers = prod.audience === "drivers";
          const popular = prod.popular;
          return (
            <div
              key={prod.id}
              className={`relative flex flex-col rounded-3xl border p-7 transition duration-200 hover:-translate-y-1 hover:shadow-xl ${
                popular
                  ? "border-brand ring-1 ring-brand/30 shadow-lg shadow-brand/10"
                  : "border-black/10 dark:border-white/15"
              }`}
            >
              {popular && (
                <span className="absolute right-6 top-6 rounded-full bg-brand px-3 py-1 text-xs font-semibold text-[#1f2a33]">
                  {p.popular}
                </span>
              )}

              {/* Suggestion #3 — explicit audience tag (orange = drivers, green = companies) */}
              <span
                className={`inline-flex w-fit items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${
                  isDrivers
                    ? "bg-brand/10 text-brandtext"
                    : "bg-accent/10 text-accent"
                }`}
              >
                <span className="material-symbols-outlined text-[14px]">
                  {isDrivers ? "local_shipping" : "apartment"}
                </span>
                {isDrivers ? p.forDrivers : p.forCompanies}
              </span>

              {/* Product icon */}
              <div
                className={`mt-6 flex h-12 w-12 items-center justify-center rounded-xl ${
                  isDrivers
                    ? "bg-brand/10 text-brand"
                    : "bg-accent/10 text-accent"
                }`}
              >
                <span className="material-symbols-outlined text-[26px]">
                  {productIcon[prod.id] ?? "inventory_2"}
                </span>
              </div>

              <h3 className="mt-5 text-xl font-bold">{prod.name[locale]}</h3>
              <p className="mt-2 text-sm leading-relaxed opacity-70">
                {prod.tagline[locale]}
              </p>

              <div className="mt-5">
                <span className="text-3xl font-extrabold tracking-tight">
                  {prod.price[locale]}
                </span>
                <span className="ml-2 text-sm opacity-60">
                  {prod.unit[locale]}
                </span>
              </div>

              <ul className="mt-6 space-y-3">
                {prod.features[locale].map((f) => (
                  <li key={f} className="flex items-start gap-3 text-sm">
                    <span className="material-symbols-outlined text-[18px] text-brand">
                      check_circle
                    </span>
                    <span className="opacity-80">{f}</span>
                  </li>
                ))}
              </ul>

              {/* Suggestion #8 — popular pick gets the filled primary CTA.
                  Each card links to its own detail page. */}
              <Link
                href={`/products/${prod.id}`}
                className={`mt-8 inline-flex items-center justify-center gap-1.5 rounded-lg px-6 py-3 text-center font-semibold transition ${
                  popular
                    ? "bg-brand text-[#1f2a33] hover:bg-brand-light"
                    : "border border-black/15 hover:border-brand hover:text-brandtext dark:border-white/15"
                }`}
              >
                {p.learnMore}
                <span aria-hidden>→</span>
              </Link>
            </div>
          );
        })}
      </div>
    </section>
  );
}
