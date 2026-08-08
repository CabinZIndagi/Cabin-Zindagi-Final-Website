"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import { stays, AREAS, POPULAR_TAGS, type StayAmenity } from "@/data/stays";

/**
 * Driver-facing booking page for parking / dhaba rest-stops. Layout and search
 * features are modelled on Brevistay (a search header + a filter sidebar + a
 * list of bookable cards), restyled into the Cabin Zindagi brand. Only one
 * location is live today (Taloja); all filtering runs client-side over
 * `data/stays.ts`.
 */

const AMENITY: Record<StayAmenity, { icon: string; label: string }> = {
  parking: { icon: "local_parking", label: "Truck Parking" },
  dhaba: { icon: "restaurant", label: "Dhaba On-site" },
  washroom: { icon: "wc", label: "Washrooms" },
  water: { icon: "water_drop", label: "Drinking Water" },
  security: { icon: "shield", label: "24×7 Security" },
  tea: { icon: "local_cafe", label: "Tea Stall" },
  wifi: { icon: "wifi", label: "Wi-Fi" },
  shower: { icon: "shower", label: "Showers" },
};

const DURATIONS = [
  { label: "3 Hrs", hours: 3 },
  { label: "6 Hrs", hours: 6 },
  { label: "12 Hrs", hours: 12 },
  { label: "Overnight", hours: 24 },
];

function Stars({ rating }: { rating: number }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-md bg-neutral-900 px-2 py-0.5 text-xs font-semibold text-white">
      <span className="material-symbols-outlined text-[13px] text-brand [font-variation-settings:'FILL'_1]">
        star
      </span>
      {rating.toFixed(1)}
    </span>
  );
}

export function StaysBooking() {
  const [where, setWhere] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("20:00");
  const [tags, setTags] = useState<Set<string>>(new Set());
  const [areas, setAreas] = useState<Set<string>>(new Set());
  const [minRating, setMinRating] = useState(0);
  const [duration, setDuration] = useState<number | null>(null);
  const [filtersOpen, setFiltersOpen] = useState(false);

  // Default the date to today (client-only to avoid hydration mismatch).
  useEffect(() => {
    setDate(new Date().toISOString().slice(0, 10));
  }, []);

  const toggle = (set: Set<string>, value: string) => {
    const next = new Set(set);
    next.has(value) ? next.delete(value) : next.add(value);
    return next;
  };

  const results = useMemo(() => {
    const q = where.trim().toLowerCase();
    const list = stays.filter((s) => {
      if (
        q &&
        ![s.name, s.area, s.city, s.address]
          .join(" ")
          .toLowerCase()
          .includes(q)
      )
        return false;
      if (areas.size && !areas.has(s.area)) return false;
      if (tags.size && ![...tags].every((tg) => s.tags.includes(tg)))
        return false;
      if (s.rating < minRating) return false;
      return true;
    });
    return list;
  }, [where, areas, tags, minRating]);

  const clearAll = () => {
    setTags(new Set());
    setAreas(new Set());
    setMinRating(0);
    setDuration(null);
    setWhere("");
  };

  return (
    <div className="min-h-screen bg-[var(--background)] pt-28">
      {/* ── Search header — scrolls away with the page (not pinned) ────── */}
      <div className="border-b border-black/5 dark:border-white/10">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-4 md:flex-row md:items-stretch md:gap-2">
          <div className="grid flex-1 grid-cols-1 overflow-hidden rounded-2xl bg-white shadow-sm sm:grid-cols-3 dark:bg-neutral-900">
            <label className="flex flex-col border-black/10 px-4 py-2.5 sm:border-r dark:border-white/10">
              <span className="text-[11px] font-semibold uppercase tracking-wide opacity-50">
                Where?
              </span>
              <input
                list="stay-areas"
                value={where}
                onChange={(e) => setWhere(e.target.value)}
                placeholder="City or area"
                className="bg-transparent text-sm font-semibold outline-none placeholder:font-normal placeholder:opacity-40"
              />
              <datalist id="stay-areas">
                {AREAS.map((a) => (
                  <option key={a} value={a} />
                ))}
              </datalist>
            </label>
            <label className="flex flex-col border-black/10 px-4 py-2.5 sm:border-r dark:border-white/10">
              <span className="text-[11px] font-semibold uppercase tracking-wide opacity-50">
                When?
              </span>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="bg-transparent text-sm font-semibold outline-none"
              />
            </label>
            <label className="flex flex-col px-4 py-2.5">
              <span className="text-[11px] font-semibold uppercase tracking-wide opacity-50">
                What time?
              </span>
              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="bg-transparent text-sm font-semibold outline-none"
              />
            </label>
          </div>
          <button
            type="button"
            onClick={() => setFiltersOpen(false)}
            className="rounded-2xl bg-neutral-900 px-8 py-3 font-semibold text-white transition hover:bg-neutral-800 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-200"
          >
            Search
          </button>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 py-8">
        {/* Breadcrumb */}
        <p className="text-sm opacity-60">
          <Link href="/products" className="hover:text-brandtext hover:underline">
            Products &amp; Services
          </Link>{" "}
          &gt; <span className="font-medium opacity-100">Parking &amp; Dhaba Stays</span>
        </p>

        {/* Mobile filter toggle */}
        <button
          onClick={() => setFiltersOpen((v) => !v)}
          className="mt-4 inline-flex items-center gap-2 rounded-full border border-black/10 px-4 py-2 text-sm font-semibold lg:hidden dark:border-white/15"
        >
          <span className="material-symbols-outlined text-[18px]">tune</span>
          Filters
        </button>

        <div className="mt-6 grid gap-8 lg:grid-cols-[260px_1fr]">
          {/* ── Sidebar filters ──────────────────────────────────────── */}
          <aside
            className={`${filtersOpen ? "block" : "hidden"} space-y-4 lg:block`}
          >
            {/* Popular tags */}
            <FilterCard title="Popular Tags" onClear={() => setTags(new Set())}>
              <div className="flex flex-wrap gap-2">
                {POPULAR_TAGS.map((tag) => {
                  const on = tags.has(tag);
                  return (
                    <button
                      key={tag}
                      onClick={() => setTags((s) => toggle(s, tag))}
                      className={`rounded-full border px-3 py-1.5 text-xs font-medium transition ${
                        on
                          ? "border-brand bg-brand/10 text-brandtext"
                          : "border-black/10 hover:border-brand/50 dark:border-white/15"
                      }`}
                    >
                      {tag}
                    </button>
                  );
                })}
              </div>
            </FilterCard>

            {/* Areas */}
            <FilterCard title="Areas" onClear={() => setAreas(new Set())}>
              <ul className="space-y-2">
                {AREAS.map((area) => (
                  <li key={area}>
                    <label className="flex items-center gap-2.5 text-sm">
                      <input
                        type="checkbox"
                        checked={areas.has(area)}
                        onChange={() => setAreas((s) => toggle(s, area))}
                        className="h-4 w-4 accent-brand"
                      />
                      {area}
                    </label>
                  </li>
                ))}
              </ul>
            </FilterCard>

            {/* Duration / price */}
            <FilterCard title="Duration" onClear={() => setDuration(null)}>
              <div className="flex flex-wrap gap-2">
                {DURATIONS.map((d) => {
                  const on = duration === d.hours;
                  return (
                    <button
                      key={d.hours}
                      onClick={() => setDuration(on ? null : d.hours)}
                      className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition ${
                        on
                          ? "border-brand bg-brand/10 text-brandtext"
                          : "border-black/10 hover:border-brand/50 dark:border-white/15"
                      }`}
                    >
                      {d.label}
                    </button>
                  );
                })}
              </div>
            </FilterCard>

            {/* Ratings */}
            <FilterCard title="Customer Ratings" onClear={() => setMinRating(0)}>
              <div className="flex flex-wrap gap-2">
                {[3, 3.5, 4, 4.5].map((r) => {
                  const on = minRating === r;
                  return (
                    <button
                      key={r}
                      onClick={() => setMinRating(on ? 0 : r)}
                      className={`inline-flex items-center gap-1 rounded-lg border px-3 py-1.5 text-xs font-semibold transition ${
                        on
                          ? "border-brand bg-brand/10 text-brandtext"
                          : "border-black/10 hover:border-brand/50 dark:border-white/15"
                      }`}
                    >
                      <span className="material-symbols-outlined text-[14px] text-brand [font-variation-settings:'FILL'_1]">
                        star
                      </span>
                      {r}+
                    </button>
                  );
                })}
              </div>
            </FilterCard>

            <button
              onClick={clearAll}
              className="w-full rounded-xl border border-black/10 py-2.5 text-sm font-semibold transition hover:border-brand hover:text-brandtext dark:border-white/15"
            >
              Clear all filters
            </button>
          </aside>

          {/* ── Results ──────────────────────────────────────────────── */}
          <div>
            <h1 className="text-xl font-bold sm:text-2xl">
              {results.length > 0
                ? `Showing ${results.length} parking & dhaba ${
                    results.length === 1 ? "stay" : "stays"
                  }`
                : "No stays match your filters"}
              {where.trim() && results.length > 0 ? ` near ${where.trim()}` : ""}
            </h1>
            <p className="mt-1 text-sm opacity-60">
              Safe truck parking, dhaba meals and washrooms — bookable by the hour
              or overnight.
            </p>

            <div className="mt-6 space-y-6">
              {results.map((s, i) => (
                <motion.article
                  key={s.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: i * 0.05 }}
                  className="grid overflow-hidden rounded-3xl border border-black/10 md:grid-cols-[300px_1fr] dark:border-white/15"
                >
                  {/* Live map preview of the actual location */}
                  <div className="relative min-h-[220px] bg-black/5 dark:bg-white/5">
                    <iframe
                      title={`Map — ${s.name}`}
                      src={`https://maps.google.com/maps?q=${s.lat},${s.lng}&z=15&output=embed`}
                      className="absolute inset-0 h-full w-full border-0"
                      loading="lazy"
                    />
                  </div>

                  <div className="flex flex-col p-6">
                    <div className="flex items-center gap-2">
                      <Stars rating={s.rating} />
                      <span className="text-xs opacity-50">({s.reviews})</span>
                      {s.premium && (
                        <span className="rounded-md bg-accent/15 px-2 py-0.5 text-xs font-bold text-accent">
                          PREMIUM
                        </span>
                      )}
                    </div>

                    <h2 className="mt-2 text-lg font-bold">{s.name}</h2>
                    <p className="text-sm opacity-60">
                      {s.area}, {s.city}
                    </p>

                    {/* Tags */}
                    <div className="mt-3 flex flex-wrap gap-2">
                      {s.tags.map((tag) => (
                        <span
                          key={tag}
                          className="rounded-full bg-brand/10 px-2.5 py-1 text-xs font-medium text-brandtext"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    {/* Amenities */}
                    <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2">
                      {s.amenities.map((a) => (
                        <span
                          key={a}
                          className="inline-flex items-center gap-1.5 text-xs opacity-70"
                          title={AMENITY[a].label}
                        >
                          <span className="material-symbols-outlined text-[18px]">
                            {AMENITY[a].icon}
                          </span>
                          {AMENITY[a].label}
                        </span>
                      ))}
                    </div>

                    {/* Actions */}
                    <div className="mt-6 flex flex-wrap gap-3">
                      <a
                        href={s.mapUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-black/15 px-6 py-2.5 text-sm font-semibold transition hover:border-brand hover:text-brandtext dark:border-white/15"
                      >
                        <span className="material-symbols-outlined text-[18px]">
                          location_on
                        </span>
                        View on Map
                      </a>
                    </div>
                  </div>
                </motion.article>
              ))}

              {results.length === 0 && (
                <div className="rounded-3xl border border-dashed border-black/15 p-10 text-center dark:border-white/15">
                  <p className="opacity-60">
                    Nothing here yet. Try clearing filters or a different area.
                  </p>
                  <button
                    onClick={clearAll}
                    className="mt-4 rounded-lg bg-brand px-5 py-2 text-sm font-semibold text-[#1f2a33] hover:bg-brand-light"
                  >
                    Clear filters
                  </button>
                </div>
              )}
            </div>

            <p className="mt-8 text-center text-sm opacity-60">
              More locations coming soon.{" "}
              <Link href="/contact" className="font-semibold text-brandtext hover:underline">
                Run a parking or dhaba? List it with us →
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function FilterCard({
  title,
  onClear,
  children,
}: {
  title: string;
  onClear?: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-black/10 p-5 dark:border-white/15">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-sm font-bold">{title}</h3>
        {onClear && (
          <button
            onClick={onClear}
            className="text-xs font-semibold text-brandtext hover:underline"
          >
            Clear
          </button>
        )}
      </div>
      {children}
    </div>
  );
}
