"use client";

import { usePathname } from "next/navigation";
import { Footer } from "./Footer";
import { Navbar } from "./Navbar";

/**
 * Routes that render as standalone documents rather than pages of the site.
 *
 * /sda-registration is a replica of the Google Form it replaces, and a site
 * navbar across the top of it breaks that illusion — an entrant following a
 * WhatsApp link is there to fill one thing in, not to browse.
 */
const BARE_ROUTES = ["/sda-registration"];

/**
 * The site's chrome around the page. This exists as a client component only
 * because the decision needs the current path: the root layout is a server
 * component and cannot read it.
 */
export function SiteChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const bare = BARE_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );

  return (
    <>
      {!bare && <Navbar />}
      <main className="min-h-screen">{children}</main>
      <Footer />
    </>
  );
}
