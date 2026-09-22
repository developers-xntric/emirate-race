"use client";
import Image from "next/image";
import { useState, type FormEvent } from "react";
import Navbar from "@/component/Navbar";
import Footer from "@/component/Footer";
import { raceOptions } from "@/lib/contact/validation";
import { useLanguage } from "@/component/LanguageProvider";
type FormState = {
  name: string;
  email: string;
  phone: string;
  message: string;
  races: string[];
  website: string;
};
const empty: FormState = {
  name: "",
  email: "",
  phone: "",
  message: "",
  races: [],
  website: "",
};
export default function ContactPage() {
  const { language } = useLanguage();
  const copy = language === "ar" ? {
    contact: "\u062a\u0648\u0627\u0635\u0644 \u0645\u0639\u0646\u0627", help: "\u0646\u062d\u0646 \u0647\u0646\u0627 \u0644\u0645\u0633\u0627\u0639\u062f\u062a\u0643", greeting: "\u0645\u0631\u062d\u0628\u064b\u0627! \u0627\u0633\u0645\u064a", afterName: "\u0648\u0623\u0631\u063a\u0628 \u0641\u064a \u0627\u0644\u062a\u0648\u0627\u0635\u0644 \u0628\u0634\u0623\u0646 \u0633\u0644\u0633\u0644\u0629 \u0633\u0628\u0627\u0642\u0627\u062a \u0642\u0631\u0649 \u0627\u0644\u0625\u0645\u0627\u0631\u0627\u062a. \u064a\u0645\u0643\u0646\u0643 \u0645\u0631\u0627\u0633\u0644\u062a\u064a \u0639\u0628\u0631 \u0627\u0644\u0628\u0631\u064a\u062f \u0627\u0644\u0625\u0644\u0643\u062a\u0631\u0648\u0646\u064a", afterEmail: "\u0623\u0648 \u0627\u0644\u0627\u062a\u0635\u0627\u0644 \u0628\u064a \u0639\u0644\u0649", name: "\u0627\u0633\u0645\u0643 \u0627\u0644\u0643\u0627\u0645\u0644", phone: "\u0631\u0642\u0645 \u0627\u0644\u0647\u0627\u062a\u0641", message: "\u0631\u0633\u0627\u0644\u062a\u0643...", races: "\u0623\u064a \u0633\u0628\u0627\u0642 \u062a\u0647\u062a\u0645 \u0628\u0647\u061f", send: "\u0625\u0631\u0633\u0627\u0644 \u0627\u0633\u062a\u0641\u0633\u0627\u0631\u064a", sending: "\u062c\u0627\u0631\u064d \u0627\u0644\u0625\u0631\u0633\u0627\u0644..."
  } : {
    contact: "Contact Us", help: "We\'re Here to Help", greeting: "Hello! My name is", afterName: "and I\'d like to get in touch about the Emirates Villages Run Series. You can email me at", afterEmail: "or reach me on", name: "your full name", phone: "your phone number", message: "My message...", races: "Which race are you interested in?", send: "Send My Enquiry", sending: "Sending..."
  };
  const raceLabels = language === "ar" ? ["\u0642\u062f\u0641\u0639", "\u0627\u0644\u0644\u0647\u0628\u0627\u0628", "\u0641\u0644\u062c \u0627\u0644\u0645\u0639\u0644\u0627", "\u0627\u0644\u0634\u0648\u064a\u0628", "\u0645\u0635\u0641\u0648\u062a", "\u0627\u0644\u0631\u0645\u0633", "\u0648\u0627\u062f\u064a \u0627\u0644\u062d\u0644\u0648", "\u0623\u062e\u0631\u0649"] : raceOptions;
  const [form, setForm] = useState(empty),
    [errors, setErrors] = useState<Record<string, string>>({}),
    [status, setStatus] = useState<"idle" | "sending" | "success" | "error">(
      "idle",
    ),
    [notice, setNotice] = useState("");
  const update = (f: keyof FormState, v: string) =>
    setForm((x) => ({ ...x, [f]: v }));
  const toggle = (r: string) =>
    setForm((x) => ({
      ...x,
      races: x.races.includes(r)
        ? x.races.filter((v) => v !== r)
        : [...x.races, r],
    }));
  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");
    setErrors({});
    try {
      const r = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, requestId: crypto.randomUUID() }),
      });
      const x = await r.json();
      if (!r.ok) {
        setErrors(x.errors ?? {});
        setNotice(x.message);
        setStatus("error");
        return;
      }
      setNotice(x.message);
      setStatus("success");
      setForm(empty);
    } catch {
      setNotice("We could not send your enquiry. Please try again.");
      setStatus("error");
    }
  }
  return (
    <>
      <main id="main-content" className="overflow-hidden bg-white">
        <section className="relative isolate m-2 flex min-h-[430px] flex-col overflow-hidden rounded-[10px] text-white md:min-h-[520px] lg:aspect-[1891.51/741.569] lg:min-h-0">
          <Image
            src="/contact/hero.png"
            alt="Children celebrating at an Emirates Villages Run Series event"
            fill
            preload
            sizes="100vw"
            className="-z-20 object-cover object-center"
          />
          <div className="absolute inset-0 -z-10 bg-black/50" />
          <Navbar homeHrefPrefix="/" />
          <h1 className="absolute inset-0 z-10 flex items-center justify-center px-4 text-center text-[clamp(42px,4.7vw,90px)] md:text-[clamp(40px,4vw,90px)] font-bold uppercase leading-none">
            {copy.contact}
          </h1>
        </section>
        <section className="mx-auto grid w-[90%] max-w-[1440px] gap-8 py-14 lg:grid-cols-[450px_1fr] md:py-20">
          <div className="order-2 lg:order-1">
            <p className="text-sm font-bold uppercase text-[#bb0054] md:text-base">
              {copy.contact}
            </p>
            <h2 className="mt-3 text-[42px] font-bold uppercase leading-[.92] text-[#0b2d4d] md:text-[44px]">
              {copy.help}
            </h2>
            <a
              href="mailto:info@emiratesvillages.ae"
              className="mt-6 inline-flex items-center gap-3 text-base font-semibold text-[#0b2d4d] hover:underline"
            >
              <Image
                src="/contact/email.svg"
                alt=""
                width={54}
                height={54}
                className="size-10"
              />
              info@emiratesvillages.ae
            </a>
            <div className="relative mt-8 h-[400px] overflow-hidden rounded-[10px] bg-[#eef0f2] md:h-[550px] lg:h-[480px] 2xl:h-[500px]">
              <Image
                src="/contact/rahhal2.png"
                alt="Rahhal mascot"
                fill
                sizes="30vw"
                className="object-contain"
              />
            </div>
          </div>
          <form
            onSubmit={submit}
            noValidate
            className="rounded-[10px] border border-[#b50549]/20 p-5 shadow-sm md:p-8 order-1 lg:order-2"
          >
            <div className="text-[30px] leading-[1.12] text-[#0b2d4d] md:text-[38px] 2xl:text-[50px]">
              <label>
                {copy.greeting}{" "}
                <input
                  aria-label="Full name"
                  value={form.name}
                  onChange={(e) => update("name", e.target.value)}
                  placeholder={copy.name}
                  className="w-full border-b border-dotted border-[#bfbfbf] outline-none placeholder:text-[#bfbfbf] md:inline md:w-[230px] text-2xl"
                />{" "}
                {copy.afterName}{" "}
                <input
                  aria-label="Email address"
                  value={form.email}
                  onChange={(e) => update("email", e.target.value)}
                  placeholder="your@email.com"
                  className="w-full border-b border-dotted border-[#bfbfbf] outline-none placeholder:text-[#bfbfbf] md:inline md:w-[230px] text-2xl"
                />{" "}
                {copy.afterEmail}{" "}
                <input
                  aria-label="Phone number"
                  type="tel"
                  inputMode="numeric"
                  value={form.phone}
                  onChange={(e) => update("phone", e.target.value.replace(/[^\d+(). -]/g, ""))}
                  placeholder={copy.phone}
                  className="w-full border-b border-dotted border-[#bfbfbf] outline-none placeholder:text-[#bfbfbf] md:inline md:w-[260px] text-2xl"
                />
                .
              </label>
            </div>
            {(errors.name || errors.email || errors.phone) && (
              <p className="mt-2 text-sm text-[#bb0054]">
                {errors.name || errors.email || errors.phone}
              </p>
            )}
            <textarea
              aria-label="Message"
              value={form.message}
              onChange={(e) => update("message", e.target.value)}
              placeholder={copy.message}
              className="mt-8 min-h-24 w-full resize-y border-b border-[#d6d6d6] text-lg outline-none placeholder:text-[#bfbfbf] md:text-2xl"
            />
            <h3 className="mt-6 text-xl text-[#0b2d4d] md:text-3xl">
              {copy.races}
            </h3>
            <div className="mt-4 grid grid-cols-2 gap-2 md:grid-cols-4">
              {raceOptions.map((r, index) => (
                <button
                  key={r}
                  type="button"
                  aria-pressed={form.races.includes(r)}
                  onClick={() => toggle(r)}
                  className={`rounded-[10px] border cursor-pointer px-3 py-3 text-sm ${form.races.includes(r) ? "border-[#bb0054] bg-[#bb0054] text-white" : "border-[#bfbfbf] text-[#999] hover:border-[#bb0054] hover:text-[#bb0054]"}`}
                >
                  {raceLabels[index]}
                </button>
              ))}
            </div>
            {errors.races && (
              <p className="mt-2 text-sm text-[#bb0054]">{errors.races}</p>
            )}
            <input
              tabIndex={-1}
              value={form.website}
              onChange={(e) => update("website", e.target.value)}
              className="absolute -left-[9999px] h-px w-px opacity-0 "
              aria-hidden
            />
            <div className="mt-7 flex flex-col items-center gap-3">
              <button
                type="submit"
                disabled={status === "sending"}
                aria-busy={status === "sending"}
                className="rounded-[5px] bg-[#bb0054] cursor-pointer px-4 py-3.5 text-sm font-bold uppercase text-white hover:bg-[#072f4f] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {status === "sending" ? copy.sending : copy.send}
              </button>
              {notice && (
                <p
                  role="status"
                  className={`text-center text-sm ${status === "success" ? "text-green-700" : "text-[#bb0054]"}`}
                >
                  {notice}
                </p>
              )}
            </div>
          </form>
        </section>
      </main>
      <Footer homeHrefPrefix="/" />
    </>
  );
}
