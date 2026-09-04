"use client";

import Image from "next/image";
import { useLanguage } from "@/lib/language-context";
import { display } from "@/lib/fonts";

const YOUTUBE = "https://www.youtube.com/@cabinzindagi";

// Gallery images (files live in /public/gallery). Add or remove freely;
// placeholder tiles show automatically if this list is empty.
const GALLERY: { src: string; alt: string }[] = [
  { src: "/gallery/n5.jpg", alt: "On site with drivers in Mumbai" },
  { src: "/gallery/n7.jpg", alt: "Inside the cabin with a driver" },
  { src: "/gallery/n8.jpg", alt: "Inside a decorated truck cabin" },
  { src: "/gallery/n1.jpg", alt: "With drivers at the truck yard" },
  { src: "/gallery/n2.jpg", alt: "With drivers beside their trucks" },
  { src: "/gallery/n3.jpg", alt: "In the cabin with a driver" },
  { src: "/gallery/n9.jpg", alt: "On the highway with a driver" },
  { src: "/gallery/n4.jpg", alt: "Meeting drivers at night" },
];

function VideoCard({ id, title }: { id: string; title: string }) {
  return (
    <a
      href={`https://www.youtube.com/watch?v=${id}`}
      target="_blank"
      rel="noopener noreferrer"
      className="group block overflow-hidden rounded-2xl border border-black/10 bg-white/[0.02] shadow-sm transition duration-200 hover:-translate-y-1 hover:border-brand/40 hover:shadow-xl dark:border-white/10"
    >
      <div className="relative aspect-video overflow-hidden bg-black">
        <Image
          src={`https://img.youtube.com/vi/${id}/hqdefault.jpg`}
          alt={title}
          fill
          unoptimized
          className="object-cover transition duration-300 group-hover:scale-105"
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-black/15" />
        <span className="absolute left-3 top-3 flex items-center gap-1.5 rounded-full bg-black/55 px-2.5 py-1 text-[11px] font-semibold text-white backdrop-blur">
          <span className="material-symbols-outlined text-[14px] text-red-500">
            smart_display
          </span>
          Cabin Zindagi
        </span>
      </div>
      <div className="p-5">
        <h3 className="line-clamp-2 font-semibold leading-snug">{title}</h3>
        <p className="mt-2 inline-flex items-center gap-1 text-sm font-semibold text-brandtext">
          Watch on YouTube
          <span aria-hidden className="transition group-hover:translate-x-0.5">
            →
          </span>
        </p>
      </div>
    </a>
  );
}

function formatCount(n: number): string {
  if (n >= 1e6) return (n / 1e6).toFixed(1).replace(/\.0$/, "") + "M";
  if (n >= 1e3) return (n / 1e3).toFixed(1).replace(/\.0$/, "") + "K";
  return String(n);
}

export function Stories({
  latestVideos,
  subscribers,
}: {
  latestVideos?: { id: string; title: string }[];
  subscribers?: number | null;
}) {
  const { t } = useLanguage();
  const s = t.stories;
  // Use the live channel feed when available; otherwise the curated fallback.
  const latest = latestVideos?.length ? latestVideos : s.latestVideos;

  return (
    <section className="mx-auto max-w-6xl px-4 py-24 sm:py-28">
      {/* Hero */}
      <div>
        {/* Eyebrow row — subscriber count sits at the far right */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="pt-1 text-xs font-semibold uppercase leading-relaxed tracking-[0.28em] text-brandtext">
            {s.eyebrow}
          </p>
          {typeof subscribers === "number" && (
            <a
              href={YOUTUBE}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex shrink-0 items-center gap-2 rounded-full border border-black/10 bg-white/[0.03] px-4 py-2 text-sm transition hover:border-brand/40 dark:border-white/10"
            >
              <span className="material-symbols-outlined text-[18px] text-red-500">
                smart_display
              </span>
              <span>
                <span className="text-base font-bold">
                  {formatCount(subscribers)}
                </span>{" "}
                <span className="opacity-70 font-bold italic">Subscribers</span>              </span>
            </a>
          )}
        </div>

        <div className="max-w-2xl">
          <h1
            className={`${display.className} mt-3 bg-gradient-to-r from-brand via-brand-light to-accent bg-clip-text py-1 text-4xl font-bold tracking-tight text-transparent sm:text-6xl`}
          >
            {s.heading}
          </h1>
          <p className="mt-5 text-lg leading-relaxed opacity-75">{s.sub}</p>
        </div>
      </div>

      {/* Featured stories */}
      <p className="mt-16 text-xs font-semibold uppercase tracking-[0.2em] text-black dark:text-white">
        {s.featured}
      </p>
      <div className="mt-5 grid gap-6 md:grid-cols-3">
        {s.featuredVideos.map((v) => (
          <VideoCard key={v.id} id={v.id} title={v.title} />
        ))}
      </div>

      {/* Latest uploads */}
      <p className="mt-14 text-xs font-semibold uppercase tracking-[0.2em] text-black dark:text-white">
        {s.latest}
      </p>
      <div className="mt-5 grid gap-6 md:grid-cols-3">
        {latest.map((v) => (
          <VideoCard key={v.id} id={v.id} title={v.title} />
        ))}
      </div>

      {/* Watch-all CTA */}
      <div className="mt-10">
        <a
          href={YOUTUBE}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-full bg-red-600 px-7 py-3 font-semibold text-white shadow-lg shadow-red-900/30 transition hover:bg-red-500"
        >
          <span className="material-symbols-outlined text-[20px]">smart_display</span>
          {s.watchAll}
          <span aria-hidden>→</span>
        </a>
      </div>

      {/* Gallery */}
      <div className="mt-24 border-t border-black/10 pt-16 dark:border-white/10">
        <h2 className={`${display.className} text-3xl font-bold tracking-tight sm:text-4xl`}>
          {s.galleryTitle}
        </h2>
        <p className="mt-3 max-w-xl opacity-70">{s.gallerySub}</p>

        <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {(GALLERY.length ? GALLERY : Array.from({ length: 8 })).map((g, i) =>
            g ? (
              <div
                key={(g as { src: string }).src}
                className="relative aspect-square w-full overflow-hidden rounded-xl border border-black/5 dark:border-white/10"
              >
                <Image
                  src={(g as { src: string; alt: string }).src}
                  alt={(g as { src: string; alt: string }).alt}
                  fill
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  className="object-cover"
                />
              </div>
            ) : (
              <div
                key={i}
                className="flex aspect-square items-center justify-center rounded-xl border border-dashed border-black/15 bg-black/[0.02] dark:border-white/15 dark:bg-white/[0.03]"
              >
                <span className="material-symbols-outlined text-3xl opacity-25">
                  image
                </span>
              </div>
            ),
          )}
        </div>
      </div>
    </section>
  );
}
