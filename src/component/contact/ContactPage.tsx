"use client";
import Image from "next/image";
import { useState, type FormEvent } from "react";
import Navbar from "@/component/Navbar";
import Footer from "@/component/Footer";
import { raceOptions } from "@/lib/contact/validation";
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
          <h1 className="mx-auto mt-auto mb-24 w-[90%] text-center text-[clamp(48px,6vw,90px)] font-bold uppercase leading-none md:mb-32">
            Contact Us
          </h1>
        </section>
        <section className="mx-auto grid w-[90%] max-w-[1590px] gap-8 py-14 md:grid-cols-[450px_1fr] md:py-20">
          <div className="order-2 md:order-1">
            <p className="text-sm font-bold uppercase text-[#bb0054] md:text-base">
              Contact Us
            </p>
            <h2 className="mt-3 text-[42px] font-bold uppercase leading-[.92] text-[#0b2d4d] md:text-[44px]">
              We&apos;re Here to Help
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
            <div className="relative mt-8 h-[400px] overflow-hidden rounded-[10px] bg-[#eef0f2] md:h-[550px] 2xl:h-[600px]">
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
            className="rounded-[10px] border border-[#b50549]/20 p-5 shadow-sm md:p-8 order-1 md:order-2"
          >
            <div className="text-[30px] leading-[1.12] text-[#0b2d4d] md:text-[38px] lg:text-[50px]">
              <label>
                Hello! My name is{" "}
                <input
                  aria-label="Full name"
                  value={form.name}
                  onChange={(e) => update("name", e.target.value)}
                  placeholder="your full name"
                  className="w-full border-b border-dotted border-[#bfbfbf] outline-none placeholder:text-[#bfbfbf] md:inline md:w-[230px] text-2xl"
                />{" "}
                and I&apos;d like to get in touch about the Emirates Villages
                Run Series. You can email me at{" "}
                <input
                  aria-label="Email address"
                  value={form.email}
                  onChange={(e) => update("email", e.target.value)}
                  placeholder="your@email.com"
                  className="w-full border-b border-dotted border-[#bfbfbf] outline-none placeholder:text-[#bfbfbf] md:inline md:w-[230px] text-2xl"
                />{" "}
                or reach me on{" "}
                <input
                  aria-label="Phone number"
                  value={form.phone}
                  onChange={(e) => update("phone", e.target.value)}
                  placeholder="your phone number"
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
              placeholder="My message..."
              className="mt-8 min-h-24 w-full resize-y border-b border-[#d6d6d6] text-lg outline-none placeholder:text-[#bfbfbf] md:text-2xl"
            />
            <h3 className="mt-6 text-xl text-[#0b2d4d] md:text-3xl">
              Which race are you interested in?
            </h3>
            <div className="mt-4 grid grid-cols-2 gap-2 md:grid-cols-4">
              {raceOptions.map((r) => (
                <button
                  key={r}
                  type="button"
                  aria-pressed={form.races.includes(r)}
                  onClick={() => toggle(r)}
                  className={`rounded-[10px] border px-3 py-3 text-sm ${form.races.includes(r) ? "border-[#bb0054] bg-[#bb0054] text-white" : "border-[#bfbfbf] text-[#999] hover:border-[#bb0054] hover:text-[#bb0054]"}`}
                >
                  {r}
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
                className="rounded-[5px] bg-[#bb0054] px-4 py-3.5 text-sm font-bold uppercase text-white hover:text-[#072f4f] disabled:opacity-60"
              >
                {status === "sending" ? "Sending..." : "Send My Enquiry"}
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
