"use client";

import Image from "next/image";
import Link from "next/link";
import { useLanguage } from "@/lib/language-context";
import { driverServices, WHATSAPP_GROUP_URL } from "@/data/driver-services";

// Plain glass, no brand tint: a near-clear white over a blur, held together by
// a bright rim and a soft shadow. The watermark behind the grid is what the
// blur picks up; without it the tiles read as flat panels.
const TILE_SURFACE =
  "bg-white/[0.18] backdrop-blur-md border-white/50 shadow-lg shadow-black/[0.06] dark:bg-white/[0.04] dark:border-white/15 dark:shadow-neutral-950/50";

const TILE_BADGE = "bg-white/45 backdrop-blur-sm dark:bg-white/15";

/**
 * What sits behind the popups and stays once they're answered: a greeting and
 * a Spotify-style grid of service tiles. Two columns on a phone, wider on
 * desktop.
 */
export function DriverHub({ onOpenWhatsapp }: { onOpenWhatsapp: () => void }) {
  const { t, locale } = useLanguage();

  // Label pinned top-left, artwork bleeding out of the bottom-right corner.
  const tileBase =
    "relative block aspect-[2/1] overflow-hidden rounded-2xl border p-3.5 text-left sm:p-4";

  return (
    <div className="relative mx-auto w-full max-w-2xl px-4 pb-20">
      {/* The shield, oversized and faint, is what the glass tiles pick up — a
          blurred flat background would give them nothing to show through. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 flex items-start justify-center overflow-hidden pt-40 sm:items-center sm:pt-0"
      >
        <Image
          src="/logo-mark.png"
          alt=""
          width={210}
          height={207}
          aria-hidden
          className="w-[90%] max-w-none opacity-[0.22] dark:opacity-[0.20] sm:w-[70%]"
        />
      </div>

      <div className="relative">
      {/* Language is changed from the navbar toggle, which is site-wide. */}
      <div className="pt-2">
        <h2 className="text-2xl font-extrabold tracking-tight sm:text-3xl">
          {t.drivers.hubTitle}
        </h2>
        <p className="mt-1 text-sm opacity-60">{t.drivers.hubSub}</p>
      </div>

      {/* Service tiles */}
      <h3 className="mt-8 mb-4 text-lg font-extrabold">
        {t.drivers.browseTitle}
      </h3>
      {/* Two per row at every width, like the reference — keeps the artwork
          large enough to read. */}
      <div className="grid grid-cols-2 gap-x-5 gap-y-5 sm:gap-x-7 sm:gap-y-7">
        {driverServices.map((service) => {
          const label = service.label[locale];
          const inner = (
            <>
              {/* Label and badge share a flex row, so a long label can never
                  run under the badge the way an absolute one did. */}
              <div className="relative z-10 flex items-start justify-between gap-2">
                <span className="min-w-0 text-sm font-bold leading-tight sm:text-base">
                  {label}
                </span>
                {service.comingSoon && (
                  <span
                    className={`shrink-0 whitespace-nowrap rounded-full px-2 py-0.5 text-[10px] font-semibold ${TILE_BADGE}`}
                  >
                    {t.drivers.comingSoon}
                  </span>
                )}
              </div>

              {service.image ? (
                // Decorative: the label already names the tile.
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={service.image}
                  alt=""
                  aria-hidden
                  className="pointer-events-none absolute bottom-0 right-0 h-[95%] w-auto max-w-[58%] object-contain object-right-bottom"
                />
              ) : (
                <span
                  aria-hidden
                  className="material-symbols-outlined pointer-events-none absolute -bottom-2 -right-1 text-[68px] leading-none opacity-20"
                >
                  {service.icon}
                </span>
              )}
            </>
          );

          const linkCls = `${tileBase} ${TILE_SURFACE} transition active:scale-[0.97] hover:border-white/80 hover:shadow-xl dark:hover:border-white/25`;

          if (!service.comingSoon && service.action === "whatsapp") {
            // An anchor, not a button: browsers centre a button's contents via
            // an anonymous inner box that text-align can't reach, and it would
            // sit alone among the other tiles. The href is also a real fallback
            // if the popup ever fails to open.
            return (
              <a
                key={service.id}
                href={WHATSAPP_GROUP_URL}
                onClick={(e) => {
                  e.preventDefault();
                  onOpenWhatsapp();
                }}
                className={linkCls}
              >
                {inner}
              </a>
            );
          }

          if (service.comingSoon || !service.href) {
            return (
              <div
                key={service.id}
                aria-disabled="true"
                className={`${tileBase} ${TILE_SURFACE} opacity-80`}
              >
                {inner}
              </div>
            );
          }

          // An off-site tile, so it gets a real anchor.
          if (/^https?:\/\//.test(service.href)) {
            return (
              <a
                key={service.id}
                href={service.href}
                target="_blank"
                rel="noopener noreferrer"
                className={linkCls}
              >
                {inner}
              </a>
            );
          }

          return (
            <Link key={service.id} href={service.href} className={linkCls}>
              {inner}
            </Link>
          );
        })}
        </div>
      </div>
    </div>
  );
}
