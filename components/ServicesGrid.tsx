"use client";

import Link from "next/link";
import Image from "next/image";
import { useLanguage } from "@/lib/language-context";
import { dictionaries } from "@/lib/dictionaries";
import { products } from "@/data/products";

const dormitoryImages = [
  { src: "/products/dormitory-building.png", span: "col-span-2 h-72", fit: "object-cover" },
  { src: "/products/dormitory-night.png", span: "h-52", fit: "object-cover" },
  { src: "/products/dormitory.png", span: "h-52", fit: "object-cover" },
];

const ctaClass =
  "inline-block rounded-full bg-brand px-7 py-3 font-semibold text-[#1f2a33] shadow-lg shadow-brand/30 transition hover:bg-brand-light";

export function ServicesGrid() {
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

  return (
    <>
      {/* Section 1 — Products (pricing-style cards) */}
      <section className="mx-auto flex min-h-screen max-w-6xl flex-col items-center justify-center px-4 py-40 sm:py-56">
        <div className="mb-14 text-center">
          <h2 className="text-3xl font-bold sm:text-4xl">{p.driversHeading}</h2>
          <p className="mt-3 opacity-70">{p.driversSub}</p>
        </div>

        <div className="grid w-full gap-6 lg:grid-cols-3 lg:items-start">
          {products.map((prod) => {
            const popular = prod.popular;
            return (
              <div
                key={prod.id}
                className={`relative flex flex-col rounded-3xl border p-8 transition ${popular
                  ? "border-brand bg-brand/[0.05] shadow-xl lg:-mt-4 lg:pb-12"
                  : "border-black/10 bg-black/[0.02] hover:border-brand/40 dark:border-white/10 dark:bg-white/[0.03]"
                  }`}
              >
                {popular && (
                  <span className="absolute right-6 top-6 rounded-full bg-brand px-3 py-1 text-xs font-semibold text-[#1f2a33]">
                    {p.popular}
                  </span>
                )}

                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brandtext">
                  {prod.audience === "drivers" ? p.forDrivers : p.forCompanies}
                </p>
                <h3 className="mt-2 text-xl font-bold">{copy(prod.id).name}</h3>
                <p className="mt-2 text-sm opacity-70">{copy(prod.id).tagline}</p>

                <div className="mt-6">
                  <span className="text-4xl font-extrabold tracking-tight">
                    {copy(prod.id).price}
                  </span>
                  <span className="ml-2 text-sm opacity-60">
                    {copy(prod.id).unit}
                  </span>
                </div>

                <Link
                  href="/contact"
                  className={`mt-6 rounded-lg px-6 py-3 text-center font-semibold transition ${popular
                    ? "bg-brand text-[#1f2a33] hover:bg-brand-light"
                    : "border border-black/15 hover:border-brand dark:border-white/20"
                    }`}
                >
                  {p.buyLabel}
                </Link>

                <ul className="mt-8 space-y-3">
                  {copy(prod.id).features.map((f) => (
                    <li key={f} className="flex items-start gap-3 text-sm">
                      <span className="material-symbols-outlined text-[18px] text-brand">
                        check_circle
                      </span>
                      <span className="opacity-80">{f}</span>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </section>

      {/* What We Offer — heading + spec table (above the dormitory) */}
      <section className="border-t border-black/5 dark:border-white/10">
        <div className="mx-auto max-w-6xl px-4 py-40 sm:py-56">
          <h2 className="text-center text-3xl font-bold text-brandtext sm:text-4xl">
            {p.offerHeading}
          </h2>

          <div className="mt-14 overflow-x-auto">
            <div className="min-w-[560px]">
              <div className="grid grid-cols-4 gap-6 pb-3">
                {p.tableHeaders.map((h, i) => (
                  <div
                    key={h}
                    className={`text-lg font-bold text-brandtext sm:text-xl ${i > 0
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
      </section>

      {/* Section 2 — Driver Dormitory showcase */}
      <section className="border-t border-black/5 dark:border-white/10">
        <div className="mx-auto flex min-h-screen max-w-6xl flex-col justify-center px-4 py-40 sm:py-56">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            {/* Text */}
            <div>
              <h2 className="text-3xl font-bold sm:text-4xl">
                {p.dormitoryHeading}
              </h2>
              <p className="mt-3 opacity-70">{p.dormitorySub}</p>
              <p className="mt-6 text-base leading-relaxed opacity-80">
                {p.dormitoryBody}
              </p>
              <ul className="mt-6 space-y-3">
                {p.dormitoryFeatures.map((f) => (
                  <li key={f} className="flex items-start gap-3">
                    <span className="mt-1 text-accent">▹</span>
                    <span className="opacity-80">{f}</span>
                  </li>
                ))}
              </ul>
              <Link href="/contact" className={`mt-8 ${ctaClass}`}>
                {p.cta}
              </Link>
            </div>

            {/* Image gallery */}
            <div className="grid grid-cols-2 gap-5 sm:gap-6">
              {dormitoryImages.map((img) => (
                <div
                  key={img.src}
                  className={`relative overflow-hidden rounded-xl border border-black/5 dark:border-white/10 ${img.span}`}
                >
                  <Image
                    src={img.src}
                    alt={p.dormitoryHeading}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className={img.fit}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Section 3 — Manufacturing & deployment + interior photos */}
      <section className="border-t border-black/5 dark:border-white/10">
        {/* Vertical cards (left) + interior photos (right) */}
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-40 sm:py-56 lg:grid-cols-2 lg:items-start">
          {/* Left: the three blocks, stacked vertically */}
          <div className="flex flex-col gap-6">
            {p.offerCards.map((card) => (
              <div
                key={card.title}
                className="rounded-2xl border border-black/10 p-7 dark:border-white/15"
              >
                <h3 className="text-xl font-bold text-brandtext">
                  {card.title}
                </h3>
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

          {/* Interior photos + layout */}
          <div className="mt-16 lg:mt-0">
            <div className="grid grid-cols-2 gap-5 sm:gap-6">
              <figure>
                <div className="relative h-52 w-full overflow-hidden rounded-xl border border-black/5 dark:border-white/10">
                  <Image
                    src="/products/dormitory-beds.png"
                    alt={p.bedsCaption}
                    fill
                    sizes="(max-width: 640px) 50vw, 33vw"
                    className="object-cover"
                  />
                </div>
                <figcaption className="mt-2 text-center text-sm opacity-60">
                  {p.bedsCaption}
                </figcaption>
              </figure>
              <figure>
                <div className="relative h-52 w-full overflow-hidden rounded-xl border border-black/5 dark:border-white/10">
                  <Image
                    src="/products/dormitory-showers.png"
                    alt={p.showerCaption}
                    fill
                    sizes="(max-width: 640px) 50vw, 33vw"
                    className="object-cover"
                  />
                </div>
                <figcaption className="mt-2 text-center text-sm opacity-60">
                  {p.showerCaption}
                </figcaption>
              </figure>
              <figure className="col-span-2">
                <div className="relative h-72 w-full overflow-hidden rounded-xl border border-black/5 bg-white p-4 dark:border-white/10">
                  <Image
                    src="/products/dormitory-floorplan.png"
                    alt={p.layoutCaption}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="p-4 object-contain"
                  />
                </div>
                <figcaption className="mt-2 text-center text-sm opacity-60">
                  {p.layoutCaption}
                </figcaption>
              </figure>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
