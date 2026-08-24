"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AnimatePresence } from "motion/react";
import { useLanguage } from "@/lib/language-context";
import {
  hasChosenLanguage,
  hasSeenWhatsapp,
  readDriverAccess,
} from "@/lib/driver-access";
import { DriverLanguageStep } from "./DriverLanguageStep";
import { DriverDetailsStep } from "./DriverDetailsStep";
import { DriverWhatsappStep } from "./DriverWhatsappStep";
import { DriverHub } from "./DriverHub";

// language → details → whatsapp → hub. The popups sit over the hub, so a driver
// can see what they're unlocking while they answer. Only the last is skippable.
type Step = "loading" | "language" | "details" | "whatsapp" | "hub";

// Only same-site paths are honoured, so a crafted ?next= can't bounce a driver
// off to another host.
const safeNext = (value: string | null) =>
  value && value.startsWith("/") && !value.startsWith("//") ? value : null;


export function DriverPortal() {
  const { t } = useLanguage();
  const router = useRouter();
  // Set when a driver was sent here from a gated page (e.g. /stays); they get
  // returned there instead of being left on the hub.
  const next = safeNext(useSearchParams().get("next"));
  const [step, setStep] = useState<Step>("loading");

  // localStorage is only readable after mount, so the first paint is a
  // placeholder rather than a wrong step.
  useEffect(() => {
    const access = readDriverAccess();
    if (access) {
      // Drivers who signed up before the group card existed still get it once.
      setStep(hasSeenWhatsapp() ? "hub" : "whatsapp");
    } else {
      setStep(hasChosenLanguage() ? "details" : "language");
    }
  }, []);

  return (
    <main className="pt-24 sm:pt-28">
      <h1 className="sr-only">{t.drivers.heading}</h1>

      {/* The hub renders behind the popups; blurred until they're answered. */}
      <div
        className={
          step === "hub" || step === "loading"
            ? ""
            : "pointer-events-none select-none blur-sm"
        }
        aria-hidden={step !== "hub" && step !== "loading"}
      >
        <DriverHub onOpenWhatsapp={() => setStep("whatsapp")} />
      </div>

      <AnimatePresence>
        {step === "language" && (
          <DriverLanguageStep
            key="language"
            onDone={() =>
              setStep(readDriverAccess() ? "hub" : "details")
            }
          />
        )}
        {step === "whatsapp" && (
          <DriverWhatsappStep
            key="whatsapp"
            // A driver sent here from a gated page carries on to it once the
            // group card is answered.
            onDone={() => (next ? router.replace(next) : setStep("hub"))}
          />
        )}
        {step === "details" && (
          <DriverDetailsStep
            key="details"
            onBack={() => setStep("language")}
            onDone={() => setStep("whatsapp")}
          />
        )}
      </AnimatePresence>

    </main>
  );
}
