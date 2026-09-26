import { SmartDriverAwardsForm } from "@/components/SmartDriverAwardsForm";
import { forms, formsDevanagari } from "@/lib/fonts";
import {
  ENTRIES_CLOSE_AT,
  ENTRIES_OPEN_AT,
  formatWindowDate,
  windowState,
} from "@/lib/smart-driver-awards";
import { pageMetadata } from "@/lib/site";

export const metadata = pageMetadata("/sda-registration");

// Rendered per request: a statically built page would freeze whichever side of
// the entry window happened to be true at build time, and the form would never
// open or close without a redeploy.
export const dynamic = "force-dynamic";

/**
 * Registration, built to look like the Google Form it replaces: Roboto on a
 * grey canvas, one question per white card, two pages.
 *
 * The replica is light-only on purpose. A form is a document surface, and an
 * entrant filling it in on a shared phone should see what the person who sent
 * them the link saw. `cz-form` in globals.css holds the surface light even when
 * the rest of the site is in dark mode, and SiteChrome keeps the site navbar
 * off this route entirely, so no clearance is needed at the top.
 */
export default function SmartDriverAwardsPage() {
  const state = windowState();

  return (
    <div
      className={`cz-form ${forms.variable} ${formsDevanagari.variable} min-h-screen bg-[#f0f0f0] px-4 pb-20 pt-8 sm:pt-12`}
      // Roboto first for Latin; the Devanagari face picks up the Hindi, which
      // Roboto has no glyphs for.
      style={{
        fontFamily:
          "var(--font-forms), var(--font-forms-deva), Roboto, Arial, sans-serif",
      }}
    >
      <div className="mx-auto max-w-[768px]">
        {state === "open" && <SmartDriverAwardsForm />}

        {state !== "open" && (
          <div className="overflow-hidden rounded-lg border border-[#dadce0] bg-white">
            <div className="h-2.5 bg-[#434343]" />
            <div className="px-6 py-6 sm:px-8">
              <h1 className="text-[32px] font-normal leading-[40px] text-[#202124]">
                Smart Driver Awards Season 5 — Registration Form
              </h1>
              {state === "before" ? (
                <p className="mt-4 text-[14px] leading-6 text-[#202124]">
                  नामांकन {formatWindowDate(ENTRIES_OPEN_AT)} से शुरू होगा।
                  <br />
                  This form will accept entries from{" "}
                  {formatWindowDate(ENTRIES_OPEN_AT)}.
                </p>
              ) : (
                <p className="mt-4 text-[14px] leading-6 text-[#202124]">
                  नामांकन {formatWindowDate(ENTRIES_CLOSE_AT)} को बंद हो गया।
                  <br />
                  This form is no longer accepting responses.
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
