"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { useLanguage } from "@/lib/language-context";
import { LanguagePicker } from "./LanguagePicker";
import { Logo } from "./Logo";
import { motion, AnimatePresence } from "motion/react";

export function Navbar() {
  const { t } = useLanguage();
  const { resolvedTheme, setTheme } = useTheme();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);

  // next-themes only knows the real theme after mount; avoid hydration mismatch.
  useEffect(() => setMounted(true), []);
  
  // Close the mobile menu whenever the route changes.
  useEffect(() => setOpen(false), [pathname]);

  const links = [
    { href: "/", label: t.nav.home },
    { href: "/impact", label: t.nav.impact },
    { href: "/stories", label: t.nav.stories },
    { href: "/for-drivers", label: t.nav.drivers },
    { href: "/products", label: t.nav.products },
    { href: "/contact", label: t.nav.contact },
  ];

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  const themeButton = (
    <button
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
      aria-label="Toggle dark mode"
      title="Toggle dark mode"
      className="flex h-9 w-9 items-center justify-center rounded-full transition-colors duration-200 hover:bg-black/[0.04] dark:hover:bg-white/[0.06]"
    >
      <span className="material-symbols-outlined text-lg">
        {mounted && resolvedTheme === "dark" ? "light_mode" : "dark_mode"}
      </span>
    </button>
  );

  return (
    <>
      <header className="fixed top-4 left-0 right-0 z-50 mx-auto w-[calc(100%-2rem)] max-w-5xl transition-all duration-300">
        <nav className="flex items-center justify-between px-5 py-2 rounded-full border border-black/5 bg-white/70 backdrop-blur-md shadow-lg dark:border-white/10 dark:bg-neutral-900/70 shadow-black/[0.02] dark:shadow-neutral-950/40">
          <Link href="/" className="flex items-center" aria-label="Cabin Zindagi — Home">
            <Logo className="h-10 w-auto sm:h-11" />
          </Link>

          <ul className="hidden gap-2 text-sm font-semibold lg:flex">
            {links.map((link) => {
              const active = isActive(link.href);
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    aria-current={active ? "page" : undefined}
                    className={`relative rounded-full px-4 py-2 transition duration-200 ${
                      active
                        ? "text-brandtext dark:text-brand"
                        : "opacity-70 hover:opacity-100"
                    }`}
                  >
                    {link.label}
                  </Link>
                </li>
              );
            })}
          </ul>

          <div className="flex items-center gap-1.5">
            {/* Toggles — desktop only */}
            <div className="hidden items-center gap-1.5 lg:flex">
              <LanguagePicker />
              {themeButton}
            </div>

            {/* Hamburger — mobile only */}
            <button
              onClick={() => setOpen((v) => !v)}
              aria-label="Toggle menu"
              className="flex h-9 w-9 items-center justify-center rounded-full text-lg lg:hidden hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
            >
              {open ? "✕" : "☰"}
            </button>
          </div>
        </nav>

        {/* Floating Mobile Dropdown Menu with Glassmorphic design and Motion animation */}
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -10 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="absolute top-[calc(100%+0.5rem)] left-0 right-0 z-40 flex flex-col bg-white/95 dark:bg-neutral-950/95 backdrop-blur-lg border border-black/5 dark:border-white/10 rounded-[2rem] p-5 shadow-2xl lg:hidden origin-top"
            >
              <ul className="flex flex-col gap-1 text-lg font-bold tracking-tight">
                {links.map((link) => {
                  const active = isActive(link.href);
                  return (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        onClick={() => setOpen(false)}
                        aria-current={active ? "page" : undefined}
                        className={`block rounded-2xl px-4 py-3 transition duration-200 ${
                          active
                            ? "text-brandtext dark:text-brand"
                            : "opacity-70 hover:opacity-100"
                        }`}
                      >
                        {link.label}
                      </Link>
                    </li>
                  );
                })}
              </ul>

              {/* Toggles live inside the menu on mobile */}
              <div className="mt-4 flex items-center justify-between border-t border-black/10 pt-4 dark:border-white/10">
                <span className="text-xs font-bold uppercase tracking-wider opacity-50">Preferences</span>
                <div className="flex items-center gap-2">
                  <LanguagePicker compact />
                  {themeButton}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
    </>
  );
}

