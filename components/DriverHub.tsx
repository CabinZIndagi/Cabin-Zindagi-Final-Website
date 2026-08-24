"use client";

import Link from "next/link";
import { useLanguage } from "@/lib/language-context";
import { driverServices, WHATSAPP_GROUP_URL } from "@/data/driver-services";

// Tiles are coloured by position, not by service: the first four carry the
// brand orange, the rest the accent green. Only the surface is tinted — icons
// and labels stay the page's normal text colour in both themes, so they read
// like any other body copy.
const TILE_GROUPS = [
  {
    surface:
      "bg-gradient-to-br from-brand/[0.14] to-brand/[0.05] border-brand/20 dark:from-brand/20 dark:to-brand/[0.07] dark:border-brand/25",
    badge: "bg-brand/20 dark:bg-brand/30",
  },
  {
    surface:
      "bg-gradient-to-br from-accent/[0.14] to-accent/[0.05] border-accent/20 dark:from-accent/20 dark:to-accent/[0.07] dark:border-accent/25",
    badge: "bg-accent/20 dark:bg-accent/30",
  },
];
const FIRST_GROUP_SIZE = 4;

/**
 * What sits behind the popups and stays once they're answered: the WhatsApp
 * group card plus a Spotify-style grid of service tiles. Two columns on a
 * phone, wider on desktop.
 */
export function DriverHub({ name }: { name: string | null }) {
  const { t, locale } = useLanguage();

  const tileBase =
    "relative flex aspect-[5/3] flex-col justify-between overflow-hidden rounded-2xl border p-4 text-left";

  return (
    <div className="mx-auto w-full max-w-4xl px-4 pb-20">
      {/* Greeting */}
      {/* Language is changed from the navbar toggle, which is site-wide. */}
      <div className="min-w-0 pt-2">
        <h2 className="truncate text-2xl font-extrabold tracking-tight sm:text-3xl">
          {name ? t.drivers.welcomeBack.replace("{name}", name) : t.drivers.heading}
        </h2>
        <p className="mt-1 text-sm opacity-60">{t.drivers.hubSub}</p>
      </div>

      {/* WhatsApp group */}
      <a
        href={WHATSAPP_GROUP_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-6 flex flex-col gap-4 rounded-3xl bg-gradient-to-br from-[#25D366] to-[#128C7E] p-6 text-white shadow-lg transition active:scale-[0.99] sm:flex-row sm:items-center sm:justify-between sm:p-7"
      >
        <div className="flex items-start gap-4">
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/20">
            <span className="material-symbols-outlined text-[26px]">forum</span>
          </span>
          <div>
            <h3 className="text-lg font-bold">{t.drivers.whatsappTitle}</h3>
            <p className="mt-1 max-w-md text-sm leading-relaxed text-white/85">
              {t.drivers.whatsappBody}
            </p>
          </div>
        </div>
        <span className="inline-flex shrink-0 items-center justify-center gap-1.5 rounded-full bg-white px-6 py-3 text-sm font-bold text-[#128C7E]">
          {t.drivers.whatsappCta}
          <span aria-hidden>→</span>
        </span>
      </a>

      {/* Service tiles */}
      <h3 className="mt-10 mb-4 text-lg font-extrabold">
        {t.drivers.browseTitle}
      </h3>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
        {driverServices.map((service, i) => {
          const label = service.label[locale];
          const group = TILE_GROUPS[i < FIRST_GROUP_SIZE ? 0 : 1];
          const inner = (
            <>
              <span className="material-symbols-outlined text-[26px]">
                {service.icon}
              </span>
              <span className="text-sm font-bold leading-tight sm:text-base">
                {label}
              </span>
              {service.comingSoon && (
                <span
                  className={`absolute right-2 top-2 rounded-full px-2 py-0.5 text-[10px] font-semibold ${group.badge}`}
                >
                  {t.drivers.comingSoon}
                </span>
              )}
            </>
          );

          if (service.comingSoon || !service.href) {
            return (
              <div
                key={service.id}
                aria-disabled="true"
                className={`${tileBase} ${group.surface} opacity-80`}
              >
                {inner}
              </div>
            );
          }

          return (
            <Link
              key={service.id}
              href={service.href}
              className={`${tileBase} ${group.surface} transition active:scale-[0.97] hover:border-current/40 hover:shadow-md`}
            >
              {inner}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
