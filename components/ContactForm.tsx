"use client";

import { useRef, useState } from "react";
import { useLanguage } from "@/lib/language-context";

type Status = "idle" | "sending" | "success" | "error";

// Index of "General Enquiry" in the interests list (the default selection).
const DEFAULT_INTEREST = 5;

export function ContactForm() {
  const { t } = useLanguage();
  const formRef = useRef<HTMLFormElement>(null);
  const [status, setStatus] = useState<Status>("idle");
  const [interest, setInterest] = useState<number>(DEFAULT_INTEREST);

  const serviceId = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID;
  const templateId = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID;
  const publicKey = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!formRef.current) return;

    if (!serviceId || !templateId || !publicKey) {
      // No EmailJS keys yet: log the submission so the form still works in dev.
      console.warn(
        "EmailJS not configured. Copy .env.local.example to .env.local and add your keys."
      );
      console.log(
        "Contact submission:",
        Object.fromEntries(new FormData(formRef.current).entries())
      );
      setStatus("success");
      formRef.current.reset();
      setInterest(DEFAULT_INTEREST);
      return;
    }

    setStatus("sending");
    try {
      const emailjs = (await import("@emailjs/browser")).default;
      await emailjs.sendForm(serviceId, templateId, formRef.current, {
        publicKey,
      });
      setStatus("success");
      formRef.current.reset();
      setInterest(DEFAULT_INTEREST);
    } catch (err) {
      console.error(err);
      setStatus("error");
    }
  };

  const labelCls = "mb-1.5 block text-sm font-medium";
  const fieldCls =
    "w-full rounded-lg border border-black/10 bg-black/[0.03] px-4 py-2.5 text-sm outline-none transition placeholder:opacity-50 focus:border-brand dark:border-white/15 dark:bg-white/[0.04]";

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label className={labelCls}>{t.contact.fullName}</label>
        <input
          name="from_name"
          required
          placeholder={t.contact.namePlaceholder}
          className={fieldCls}
        />
      </div>
      <div>
        <label className={labelCls}>{t.contact.emailAddress}</label>
        <input
          name="from_email"
          type="email"
          required
          placeholder={t.contact.emailPlaceholder}
          className={fieldCls}
        />
      </div>
      <div>
        <label className={labelCls}>{t.contact.company}</label>
        <input
          name="company"
          placeholder={t.contact.companyPlaceholder}
          className={fieldCls}
        />
      </div>
      <div>
        <label className={labelCls}>{t.contact.interestsLabel}</label>
        <select
          value={interest}
          onChange={(e) => setInterest(Number(e.target.value))}
          className={fieldCls}
        >
          {t.contact.interests.map((opt, i) => (
            <option key={i} value={i}>
              {opt}
            </option>
          ))}
        </select>
        {/* Submitted with the form for EmailJS */}
        <input
          type="hidden"
          name="interest"
          value={t.contact.interests[interest]}
        />
      </div>
      <div>
        <label className={labelCls}>{t.contact.messageLabel}</label>
        <textarea
          name="message"
          required
          rows={5}
          placeholder={t.contact.messagePlaceholder}
          className={fieldCls}
        />
      </div>
      <button
        type="submit"
        disabled={status === "sending"}
        className="rounded-lg bg-brand px-6 py-2.5 font-semibold text-[#1f2a33] transition hover:bg-brand-light disabled:opacity-60"
      >
        {status === "sending" ? t.contact.sending : t.contact.send}
      </button>
      {status === "success" && (
        <p className="text-sm font-medium text-green-600 dark:text-green-400">
          {t.contact.success}
        </p>
      )}
      {status === "error" && (
        <p className="text-sm font-medium text-red-600 dark:text-red-400">
          {t.contact.error}
        </p>
      )}
    </form>
  );
}
