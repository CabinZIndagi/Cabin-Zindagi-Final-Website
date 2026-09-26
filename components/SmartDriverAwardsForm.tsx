"use client";

import { useEffect, useRef, useState } from "react";
import {
  EXPERIENCE_OPTIONS,
  STATES,
  VEHICLE_TYPES,
} from "@/lib/smart-driver-awards";

/**
 * A deliberate replica of the Google Form this page replaces: two pages, one
 * question per card, the host's theme bar across the title, and Back / Next /
 * Submit with a page counter underneath.
 *
 * Every colour here is hard-coded rather than taken from the site's tokens.
 * That is the point — a Form is a document surface, and it looks the same to
 * every entrant whatever theme the surrounding site is in. `cz-form` in
 * globals.css keeps that true in dark mode.
 */

type Status = "idle" | "sending" | "success" | "error";

const CARD =
  "rounded-lg border border-[#dadce0] bg-white px-6 py-5 sm:px-8 sm:py-6";

/** Required marker, in Google's own red. */
const Req = () => <span className="text-[#d93025]"> *</span>;

function ProgressFooter({
  page,
  onBack,
  onClear,
  children,
}: {
  page: 1 | 2;
  onBack?: () => void;
  onClear: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="mt-6 flex flex-wrap items-center gap-4">
      <div className="flex items-center gap-2">
        {onBack && (
          <button
            type="button"
            onClick={onBack}
            className="rounded px-6 py-2 text-sm font-medium text-[#434343] transition hover:bg-black/[0.04]"
          >
            Back
          </button>
        )}
        {children}
      </div>

      <div className="flex flex-1 items-center gap-3">
        <div className="h-1 flex-1 overflow-hidden rounded-full bg-[#dadce0]">
          <div
            className="h-full rounded-full bg-[#434343] transition-all duration-300"
            style={{ width: page === 1 ? "50%" : "100%" }}
          />
        </div>
        <span className="whitespace-nowrap text-sm text-[#5f6368]">
          Page {page} of 2
        </span>
      </div>

      <button
        type="button"
        onClick={onClear}
        className="rounded px-3 py-2 text-sm font-medium text-[#434343] transition hover:bg-black/[0.04]"
      >
        Clear form
      </button>
    </div>
  );
}

/**
 * The Form's dropdown, which is a popup listbox rather than a native <select>:
 * a "Choose" row sits above a divider, the current choice is tinted, and the
 * whole thing is a white sheet on the card. A native control cannot be styled
 * that way — the browser draws its menu itself.
 *
 * The value rides in a hidden input so FormData still picks it up. Hidden
 * inputs are barred from constraint validation, so `required` would be
 * ignored here; the submit handler checks these two fields by hand instead.
 */
function FormsSelect({
  name,
  value,
  onChange,
  options,
}: {
  name: string;
  value: string;
  onChange: (value: string) => void;
  options: readonly string[];
}) {
  const [open, setOpen] = useState(false);
  const wrap = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (!wrap.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const pick = (option: string) => {
    onChange(option);
    setOpen(false);
  };

  return (
    <div ref={wrap} className="relative mt-4 w-full max-w-xs">
      <input type="hidden" name={name} value={value} />
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className="flex w-full items-center justify-between gap-3 rounded border border-[#dadce0] bg-white px-4 py-2.5 text-left text-[14px] text-[#202124] transition hover:bg-[#f8f9fa]"
      >
        <span className={value ? "" : "text-[#5f6368]"}>{value || "Choose"}</span>
        <span
          aria-hidden
          className="shrink-0 border-x-4 border-t-[5px] border-x-transparent border-t-[#5f6368]"
        />
      </button>

      {open && (
        <div
          role="listbox"
          className="absolute left-0 right-0 top-0 z-20 max-h-80 overflow-y-auto rounded border border-[#dadce0] bg-white py-2 shadow-[0_2px_6px_2px_rgba(60,64,67,0.15)]"
        >
          <button
            type="button"
            role="option"
            aria-selected={!value}
            onClick={() => pick("")}
            className={`block w-full px-4 py-2.5 text-left text-[14px] text-[#5f6368] ${
              value ? "hover:bg-[#f1f3f4]" : "bg-[#e8f0fe]"
            }`}
          >
            Choose
          </button>
          <div className="my-2 border-t border-[#dadce0]" />
          {options.map((option) => (
            <button
              key={option}
              type="button"
              role="option"
              aria-selected={value === option}
              onClick={() => pick(option)}
              className={`block w-full px-4 py-2.5 text-left text-[14px] text-[#202124] ${
                value === option ? "bg-[#e8f0fe]" : "hover:bg-[#f1f3f4]"
              }`}
            >
              {option}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

/** A partner credit card — the logo blocks the Form carries between sections. */
function PartnerCard({ label }: { label: string }) {
  return (
    <div className={CARD}>
      <p className="text-[15px] text-[#202124]">{label}</p>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/logo.png"
        alt="Cabin Zindagi — The Human Side of Logistics"
        width={768}
        height={262}
        className="mt-4 h-16 w-auto object-contain"
      />
    </div>
  );
}

export function SmartDriverAwardsForm() {
  const [page, setPage] = useState<1 | 2>(1);
  const [stateName, setStateName] = useState("");
  const [experience, setExperience] = useState("");
  const [vehicles, setVehicles] = useState<string[]>([]);
  const [status, setStatus] = useState<Status>("idle");
  const [fieldError, setFieldError] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const toggleVehicle = (value: string) =>
    setVehicles((current) =>
      current.includes(value)
        ? current.filter((v) => v !== value)
        : [...current, value]
    );

  const clearForm = () => {
    formRef.current?.reset();
    setStateName("");
    setExperience("");
    setVehicles([]);
    setFieldError(null);
    setStatus("idle");
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFieldError(null);

    const data = new FormData(e.currentTarget);
    const phone = String(data.get("phone") ?? "");

    if (!stateName) {
      setFieldError("राज्य चुनें (Choose your state)");
      return;
    }
    if (!experience) {
      setFieldError("ड्राइविंग अनुभव चुनें (Choose your driving experience)");
      return;
    }

    const digits = phone.replace(/[^\d]/g, "").slice(-10);
    if (!/^[6-9]\d{9}$/.test(digits)) {
      setFieldError("कृपया सही मोबाइल नंबर भरें (Enter a valid mobile number)");
      return;
    }
    // A checkbox group cannot carry `required` the way an input can.
    if (vehicles.length === 0) {
      setFieldError("कम से कम एक वाहन चुनें (Select at least one vehicle type)");
      return;
    }

    setStatus("sending");
    try {
      const res = await fetch("/api/award-entries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.get("name"),
          phone,
          state: data.get("state"),
          city: data.get("city"),
          experience: data.get("experience"),
          vehicleTypes: vehicles,
          employer: data.get("employer"),
        }),
      });
      if (!res.ok) throw new Error(`Entry save failed: ${res.status}`);
      setStatus("success");
    } catch (err) {
      console.error(err);
      setStatus("error");
    }
  };

  const labelCls = "block text-[15px] leading-6 text-[#202124]";
  const hintCls = "mt-1 block text-[13px] leading-5 text-[#70757a]";
  // Forms' text fields are a single baseline rule, not a box.
  const lineInput =
    "mt-4 block w-full max-w-md border-0 border-b border-[#dadce0] bg-transparent px-0 pb-1.5 text-[14px] text-[#202124] outline-none transition placeholder:text-[#9aa0a6] focus:border-b-2 focus:border-[#434343]";

  if (status === "success") {
    return (
      <div className={CARD}>
        <h2 className="text-[22px] font-normal text-[#202124]">
          आपका नामांकन दर्ज हो गया
        </h2>
        <p className="mt-3 text-[14px] leading-6 text-[#202124]">
          Your response has been recorded. आपको इसी WhatsApp नंबर पर अपडेट
          मिलेगा।
        </p>
      </div>
    );
  }

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="space-y-3">
      {page === 1 ? (
        <>
          {/* Host's mark, in its own card above the title — the Form's header image. */}
          <div className={`${CARD} flex justify-center py-8`}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/logos/cdrm.jpeg"
              alt="CDRM — Centre for Driver Relationship Management"
              width={716}
              height={208}
              className="h-auto w-full max-w-[19rem] object-contain"
            />
          </div>

          {/* Title card: the theme bar sits flush on top of it. */}
          <div className="overflow-hidden rounded-lg border border-[#dadce0] bg-white">
            <div className="h-2.5 bg-[#434343]" />
            <div className="px-6 py-6 sm:px-8">
              <h1 className="text-[32px] font-normal leading-[40px] text-[#202124]">
                Smart Driver Awards Season 5 — Registration Form
              </h1>
              <div className="mt-4 space-y-4 text-[14px] leading-6 text-[#202124]">
                <p>Drivers Duniya आपका स्वागत करते हैं।</p>
                <p>Smart Driver Awards - Season 5 में अपना नामांकन दर्ज करें।</p>
                <p>
                  सभी जानकारी सही-सही भरें। गलत जानकारी देने पर नामांकन रद्द हो
                  सकता है।
                </p>
              </div>
            </div>
          </div>

          <PartnerCard label="Driver Welfare Partner" />

          <ProgressFooter page={1} onClear={clearForm}>
            <button
              type="button"
              onClick={() => setPage(2)}
              className="rounded bg-[#434343] px-6 py-2 text-sm font-medium text-white transition hover:bg-[#2c2c2c]"
            >
              Next
            </button>
          </ProgressFooter>
        </>
      ) : (
        <>
          <div className="overflow-hidden rounded-lg border border-[#dadce0] bg-white">
            <div className="h-2.5 bg-[#434343]" />
            <div className="px-6 py-6 sm:px-8">
              <h1 className="text-[32px] font-normal leading-[40px] text-[#202124]">
                Smart Driver Awards Season 5 — Registration Form
              </h1>
              <p className="mt-6 border-t border-[#dadce0] pt-4 text-[13px] text-[#d93025]">
                * Indicates required question
              </p>
            </div>
          </div>

          {/* Section header — white on the theme bar, description below it. */}
          <div className="overflow-hidden rounded-lg border border-[#dadce0] bg-white">
            <div className="bg-[#434343] px-6 py-3 sm:px-8">
              <h2 className="text-[15px] font-medium text-white">
                व्यक्तिगत जानकारी (Personal Information)
              </h2>
            </div>
            <div className="px-6 py-5 sm:px-8">
              <p className="text-[14px] text-[#202124]">
                अपनी बुनियादी जानकारी भरें
              </p>
            </div>
          </div>

          <div className={CARD}>
            <label className={labelCls} htmlFor="name">
              पूरा नाम (Full Name)
              <Req />
            </label>
            <span className={hintCls}>जैसा आपके ड्राइविंग लाइसेंस पर है</span>
            <input
              id="name"
              name="name"
              required
              maxLength={80}
              autoComplete="name"
              placeholder="Your answer"
              className={lineInput}
            />
          </div>

          <div className={CARD}>
            <label className={labelCls} htmlFor="phone">
              मोबाइल नंबर (WhatsApp Number)
              <Req />
            </label>
            <span className={hintCls}>
              यही नंबर WhatsApp पर आपको अपडेट मिलेगा
            </span>
            <input
              id="phone"
              name="phone"
              required
              type="tel"
              inputMode="numeric"
              autoComplete="tel"
              placeholder="Your answer"
              className={lineInput}
            />
          </div>

          <div className={CARD}>
            <span className={labelCls}>
              राज्य (State)
              <Req />
            </span>
            <FormsSelect
              name="state"
              value={stateName}
              onChange={setStateName}
              options={STATES}
            />
          </div>

          <div className={CARD}>
            <label className={labelCls} htmlFor="city">
              जिला / शहर (District / City)
              <Req />
            </label>
            <span className={hintCls}>आप जहाँ रहते हैं</span>
            <input
              id="city"
              name="city"
              required
              maxLength={80}
              placeholder="Your answer"
              className={lineInput}
            />
          </div>

          <div className={CARD}>
            <span className={labelCls}>
              कुल ड्राइविंग अनुभव (Total Driving Experience)
              <Req />
            </span>
            <FormsSelect
              name="experience"
              value={experience}
              onChange={setExperience}
              options={EXPERIENCE_OPTIONS}
            />
          </div>

          <div className={CARD}>
            <fieldset>
              <legend className={labelCls}>
                आप किस तरह का वाहन चलाते हैं? (Vehicle Type)
                <Req />
              </legend>
              <div className="mt-4 space-y-3">
                {VEHICLE_TYPES.map((v) => (
                  <label
                    key={v}
                    className="flex cursor-pointer items-center gap-3 text-[14px] text-[#202124]"
                  >
                    <input
                      type="checkbox"
                      checked={vehicles.includes(v)}
                      onChange={() => toggleVehicle(v)}
                      className="size-[18px] shrink-0 accent-[#434343]"
                    />
                    {v}
                  </label>
                ))}
              </div>
            </fieldset>
          </div>

          <div className={CARD}>
            <label className={labelCls} htmlFor="employer">
              वर्तमान नियोक्ता / फ्लीट का नाम (Current Employer / Fleet Name)
            </label>
            <span className={hintCls}>
              अगर आप किसी कंपनी या फ्लीट के साथ काम करते हैं तो बताएं
            </span>
            <input
              id="employer"
              name="employer"
              maxLength={120}
              placeholder="Your answer"
              className={lineInput}
            />
          </div>

          <PartnerCard label="Event Partner" />

          {(fieldError || status === "error") && (
            <p className="px-1 text-[13px] font-medium text-[#d93025]">
              {fieldError ??
                "कुछ गड़बड़ हुई, दोबारा कोशिश करें (Something went wrong — please try again)"}
            </p>
          )}

          <ProgressFooter page={2} onBack={() => setPage(1)} onClear={clearForm}>
            <button
              type="submit"
              disabled={status === "sending"}
              className="rounded bg-[#434343] px-6 py-2 text-sm font-medium text-white transition hover:bg-[#2c2c2c] disabled:opacity-60"
            >
              {status === "sending" ? "Submitting…" : "Submit"}
            </button>
          </ProgressFooter>
        </>
      )}
    </form>
  );
}
