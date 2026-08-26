"use client";

import { useState } from "react";
import { useLanguage } from "@/lib/language-context";
import { grantDriverAccess } from "@/lib/driver-access";
import { DriverModal } from "./DriverModal";

type Status = "idle" | "sending" | "error";

/**
 * The gate itself: name and mobile are required, email and truck number are
 * optional. Lists what unlocks on submit so the ask has visible value.
 */
export function DriverDetailsStep({
  onDone,
  onBack,
}: {
  onDone: (name: string) => void;
  onBack: () => void;
}) {
  const { t, locale } = useLanguage();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [truckNumber, setTruckNumber] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [fieldError, setFieldError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFieldError(null);

    const digits = phone.replace(/[^\d]/g, "").slice(-10);
    if (!/^[6-9]\d{9}$/.test(digits)) {
      setFieldError(t.drivers.invalidPhone);
      return;
    }

    setStatus("sending");
    try {
      const res = await fetch("/api/driver-leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, phone, email, truckNumber, locale }),
      });
      if (!res.ok) throw new Error(`Lead save failed: ${res.status}`);

      const trimmed = name.trim();
      grantDriverAccess(trimmed);
      onDone(trimmed);
    } catch (err) {
      console.error(err);
      setStatus("error");
    }
  };

  const labelCls = "mb-1.5 block text-sm font-medium";
  const fieldCls =
    "w-full rounded-xl border border-black/10 bg-black/[0.03] px-4 py-3 text-base outline-none transition placeholder:opacity-40 focus:border-brand dark:border-white/15 dark:bg-white/[0.06]";

  return (
    <DriverModal>
      {/* Picked the wrong language? This is the only way back to that step —
          the navbar toggle sits behind the modal backdrop. */}
      <button
        type="button"
        onClick={onBack}
        className="-ml-2 -mt-2 mb-1 flex items-center gap-1 rounded-full px-2 py-1.5 text-sm font-semibold opacity-60 transition hover:bg-black/5 hover:opacity-100 dark:hover:bg-white/10"
      >
        <span className="material-symbols-outlined text-[20px]">arrow_back</span>
        {t.drivers.langTitle}
      </button>

      <div className="text-center">
        <span className="material-symbols-outlined text-4xl text-brand">
          local_shipping
        </span>
        <h2 className="mt-3 text-xl font-extrabold">{t.drivers.formTitle}</h2>
        <p className="mt-2 text-sm leading-relaxed opacity-60">
          {t.drivers.formSub}
        </p>
      </div>

      {/* What the details buy them */}
      <ul className="mt-5 space-y-2 rounded-2xl bg-black/[0.04] p-4 dark:bg-white/[0.05]">
        {t.drivers.benefits.map((benefit) => (
          <li key={benefit} className="flex items-start gap-2.5 text-sm">
            <span className="material-symbols-outlined mt-px text-[18px] text-brand">
              check_circle
            </span>
            <span className="opacity-80">{benefit}</span>
          </li>
        ))}
      </ul>

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <div>
          <label className={labelCls} htmlFor="driver-name">
            {t.drivers.nameLabel}
          </label>
          <input
            id="driver-name"
            required
            maxLength={80}
            autoComplete="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={t.drivers.namePlaceholder}
            className={fieldCls}
          />
        </div>
        <div>
          <label className={labelCls} htmlFor="driver-phone">
            {t.drivers.phoneLabel}
          </label>
          <input
            id="driver-phone"
            type="tel"
            required
            inputMode="numeric"
            autoComplete="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder={t.drivers.phonePlaceholder}
            className={fieldCls}
          />
        </div>
        <div>
          <label className={labelCls} htmlFor="driver-truck">
            {t.drivers.truckLabel}{" "}
            <span className="font-normal opacity-50">{t.drivers.optional}</span>
          </label>
          <input
            id="driver-truck"
            autoComplete="off"
            maxLength={16}
            value={truckNumber}
            onChange={(e) => setTruckNumber(e.target.value.toUpperCase())}
            placeholder={t.drivers.truckPlaceholder}
            className={`${fieldCls} uppercase`}
          />
        </div>
        <div>
          <label className={labelCls} htmlFor="driver-email">
            {t.drivers.emailLabel}{" "}
            <span className="font-normal opacity-50">{t.drivers.optional}</span>
          </label>
          <input
            id="driver-email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={t.drivers.emailPlaceholder}
            className={fieldCls}
          />
        </div>

        <button
          type="submit"
          disabled={status === "sending"}
          className="w-full rounded-full bg-brand px-6 py-4 text-base font-bold text-[#1f2a33] transition active:scale-[0.98] hover:bg-brand-light disabled:opacity-60"
        >
          {status === "sending" ? t.drivers.submitting : t.drivers.submit}
        </button>

        {fieldError && (
          <p className="text-center text-sm font-medium text-red-600 dark:text-red-400">
            {fieldError}
          </p>
        )}
        {status === "error" && (
          <p className="text-center text-sm font-medium text-red-600 dark:text-red-400">
            {t.drivers.error}
          </p>
        )}

        <p className="text-center text-xs leading-relaxed opacity-50">
          {t.drivers.privacy}
        </p>
      </form>
    </DriverModal>
  );
}
