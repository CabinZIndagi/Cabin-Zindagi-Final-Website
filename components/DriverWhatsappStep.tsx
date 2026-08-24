"use client";

import { useEffect, useState } from "react";
import { useLanguage } from "@/lib/language-context";
import { markWhatsappSeen } from "@/lib/driver-access";
import { WHATSAPP_GROUP_URL } from "@/data/driver-services";
import { DriverModal } from "./DriverModal";

/**
 * Last step of the flow: the driver group invite, with a QR for anyone reading
 * this on a laptop and a tap-through button for phones. Unlike the language and
 * details steps this one is skippable — joining the group is optional.
 *
 * The QR is generated in the browser from WHATSAPP_GROUP_URL, so it can never
 * drift out of sync with the link the button uses.
 */
export function DriverWhatsappStep({ onDone }: { onDone: () => void }) {
  const { t } = useLanguage();
  const [qr, setQr] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    // Loaded lazily so the QR encoder never lands in the initial page bundle.
    import("qrcode")
      .then((mod) => {
        // qrcode is CommonJS; take whichever shape the bundler hands back.
        const QRCode = (mod as unknown as { default?: typeof mod }).default ?? mod;
        return QRCode.toDataURL(WHATSAPP_GROUP_URL, {
          // 4 modules is the quiet zone the QR spec requires — anything less
          // and scanners struggle to find the code against the page.
          margin: 4,
          width: 512,
          // H tolerates ~30% damage: glare, a thumb on the screen, a bad angle.
          errorCorrectionLevel: "H",
          color: { dark: "#0b3d2c", light: "#ffffff" },
        });
      })
      .then((url) => {
        if (!cancelled) setQr(url);
      })
      .catch((err) => console.error("QR generation failed:", err));
    return () => {
      cancelled = true;
    };
  }, []);

  const finish = () => {
    markWhatsappSeen();
    onDone();
  };

  return (
    <DriverModal onDismiss={finish} dismissLabel={t.drivers.dismiss}>
      <div className="text-center">
        <span className="flex mx-auto h-12 w-12 items-center justify-center rounded-2xl bg-[#25D366]/15 text-[#128C7E] dark:text-[#25D366]">
          <span className="material-symbols-outlined text-[26px]">forum</span>
        </span>
        <h2 className="mt-3 text-xl font-extrabold">{t.drivers.whatsappTitle}</h2>
        <p className="mt-2 text-sm leading-relaxed opacity-60">
          {t.drivers.whatsappBody}
        </p>
      </div>

      {/* QR — the "album art" slot of the card. Always on a white plate so the
          code stays scannable in dark mode. */}
      <div className="mt-6 flex justify-center">
        <div className="rounded-2xl bg-white p-3 shadow-sm ring-1 ring-black/5">
          {qr ? (
            <img
              src={qr}
              alt={t.drivers.scanQr}
              width={208}
              height={208}
              className="h-[208px] w-[208px]"
            />
          ) : (
            <div className="flex h-[208px] w-[208px] items-center justify-center bg-neutral-100">
              <span className="h-7 w-7 animate-spin rounded-full border-2 border-[#25D366] border-t-transparent" />
            </div>
          )}
        </div>
      </div>

      <p className="mt-4 text-center text-sm font-medium opacity-60">
        {t.drivers.scanQr}
      </p>

      <a
        href={WHATSAPP_GROUP_URL}
        target="_blank"
        rel="noopener noreferrer"
        onClick={finish}
        className="mt-5 flex w-full items-center justify-center gap-2 rounded-full bg-[#25D366] px-6 py-4 text-base font-bold text-[#04231a] transition active:scale-[0.98] hover:bg-[#1ebe5a]"
      >
        {t.drivers.whatsappCta}
        <span aria-hidden>→</span>
      </a>
    </DriverModal>
  );
}
