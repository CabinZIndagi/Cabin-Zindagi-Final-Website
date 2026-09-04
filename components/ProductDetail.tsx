"use client";

import Link from "next/link";
import Image from "next/image";
import { useLanguage } from "@/lib/language-context";
import { dictionaries, type Locale } from "@/lib/dictionaries";
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

export function ProductDetail({ id }: { id: string }) {
  const { t, locale } = useLanguage();
  // Product copy comes from the dictionary (lib/dictionaries.ts composes it
  // from data/), so it is translated like everything else. `products` is
  // still the source for ids, images and layout flags.
  // Falls back to the English entry rather than asserting non-null: a missing id
  // should render English copy, not crash the page.
  const copy = (id: string) =>
    t.catalog.products.find((item) => item.id === id) ??
    dictionaries.en.catalog.products.find((item) => item.id === id)!;
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
  const details = t.catalog.productDetails[prod.id];

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
            {copy(prod.id).name}
          </h1>
          <p className="mt-4 max-w-md text-base leading-relaxed opacity-75">
            {copy(prod.id).tagline}
          </p>

          <div className="mt-6">
            <span className="text-4xl font-extrabold tracking-tight">
              {copy(prod.id).price}
            </span>
            <span className="ml-2 text-sm opacity-60">{copy(prod.id).unit}</span>
          </div>

          <ul className="mt-8 space-y-3">
            {copy(prod.id).features.map((f) => (
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
                  alt={copy(prod.id).name}
                  className="max-h-full w-auto object-contain"
                />
              </div>
            ) : (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img
                src={heroImage[prod.id]}
                alt={copy(prod.id).name}
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
                    ? `${copy(prod.id).name} में क्या है`
                    : `What's inside the ${copy(prod.id).name}`}
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
