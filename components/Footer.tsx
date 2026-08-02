"use client";

import Link from "next/link";
import { useLanguage } from "@/lib/language-context";
import { Logo } from "./Logo";
import { socials } from "./SocialLinks";

function ColHeading({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="text-xs font-semibold uppercase tracking-[0.2em] opacity-50">
      {children}
    </h3>
  );
}

const linkClass =
  "block text-sm opacity-80 transition hover:text-brandtext hover:opacity-100";

export function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="snap-end border-t border-black/5 dark:border-white/10">
      <div className="mx-auto max-w-6xl px-4 py-16">
        <div className="grid gap-10 sm:grid-cols-2 md:grid-cols-4">
          {/* Brand */}
          <div>
            <Logo className="h-14 w-auto" />
            <p className="mt-4 max-w-xs text-sm opacity-60">
              {t.footer.tagline}
            </p>
          </div>

          {/* Explore */}
          <nav className="space-y-4">
            <ColHeading>{t.footer.explore}</ColHeading>
            <div className="space-y-3">
              <Link href="/" className={linkClass}>
                {t.nav.home}
              </Link>
              <Link href="/impact" className={linkClass}>
                {t.nav.impact}
              </Link>
              <Link href="/stories" className={linkClass}>
                {t.nav.stories}
              </Link>
              <Link href="/products" className={linkClass}>
                {t.nav.products}
              </Link>
            </div>
          </nav>

          {/* Contact */}
          <nav className="space-y-4">
            <ColHeading>{t.nav.contact}</ColHeading>
            <div className="space-y-3">
              <Link href="/contact" className={linkClass}>
                {t.contact.heading}
              </Link>
              <a href="mailto:hello@cabinzindagi.com" className={linkClass}>
                hello@cabinzindagi.com
              </a>
            </div>
          </nav>

          {/* Connect */}
          <nav className="space-y-4">
            <ColHeading>{t.footer.connect}</ColHeading>
            <div className="space-y-3">
              {socials.map((s) => (
                <a
                  key={s.name}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={linkClass}
                >
                  {s.name}
                </a>
              ))}
            </div>
          </nav>
        </div>

        <p className="mt-14 text-xs opacity-50">
          © {new Date().getFullYear()} {t.brand}. {t.footer.rights}
        </p>
      </div>
    </footer>
  );
}
