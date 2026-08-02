"use client";

import Image from "next/image";
import { useLanguage } from "@/lib/language-context";
import { display } from "@/lib/fonts";
import { ContactForm } from "./ContactForm";

export function Contact() {
  const { t } = useLanguage();

  return (
    <section className="mx-auto max-w-6xl px-4 pt-32 pb-20 sm:pt-40">
      <div className="grid items-start gap-12 lg:grid-cols-2">
        {/* Left — info + world map */}
        <div>
          <h1
            className={`${display.className} text-4xl font-bold tracking-tight sm:text-5xl`}
          >
            {t.contact.heading}
          </h1>

          <p className="mt-4 max-w-md text-base opacity-70">
            {t.contact.description}
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-x-3 gap-y-2 text-sm opacity-80">
            <a href="mailto:hello@cabinzindagi.com" className="hover:text-brandtext">
              hello@cabinzindagi.com
            </a>
            <span className="opacity-40">•</span>
            <a
              href="https://www.linkedin.com/company/cabinzindagi"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-brandtext"
            >
              LinkedIn
            </a>
            <span className="opacity-40">•</span>
            <a
              href="https://www.instagram.com/cabinzindagi"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-brandtext"
            >
              Instagram
            </a>
            <span className="opacity-40">•</span>
            <a
              href="https://www.youtube.com/@cabinzindagi"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-brandtext"
            >
              YouTube
            </a>
          </div>

          {/* World map with a "We are here" marker over India */}
          <div className="relative mt-10 max-w-lg">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <Image
              src="/world.svg"
              alt="World map"
              width={512}
              height={290}
              className="w-full h-auto select-none opacity-70 dark:opacity-90"
              draggable={false}
              priority
            />
            <div
              className="absolute flex -translate-x-1/2 -translate-y-full flex-col items-center"
              style={{ left: "73%", top: "48%" }}
            >
              <span className="whitespace-nowrap rounded-md bg-neutral-800 px-2 py-1 text-xs font-medium text-white shadow">
                {t.contact.hereLabel}
              </span>
              <span className="h-10 w-px bg-gradient-to-b from-brand/0 via-brand to-brand" />
              <span className="relative flex h-2.5 w-2.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand opacity-75" />
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-brand" />
              </span>
            </div>
          </div>
        </div>

        {/* Right — form card with faint grid background */}
        <div className="relative overflow-hidden rounded-3xl border border-black/5 bg-black/[0.02] p-6 sm:p-10 dark:border-white/10 dark:bg-white/[0.02]">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0"
            style={{
              backgroundImage:
                "linear-gradient(to right, rgba(127,127,127,0.12) 1px, transparent 1px), linear-gradient(to bottom, rgba(127,127,127,0.12) 1px, transparent 1px)",
              backgroundSize: "44px 44px",
              WebkitMaskImage:
                "radial-gradient(ellipse 90% 90% at 85% 0%, #000 20%, transparent 70%)",
              maskImage:
                "radial-gradient(ellipse 90% 90% at 85% 0%, #000 20%, transparent 70%)",
            }}
          />
          <div className="relative">
            <ContactForm />
          </div>
        </div>
      </div>
    </section>
  );
}
