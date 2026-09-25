"use client";

import { FormEvent, useEffect, useState } from "react";

export default function PressKitModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [channelLink, setChannelLink] = useState("");
  const [status, setStatus] = useState<
    "idle" | "sending" | "success" | "error"
  >("idle");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (event: KeyboardEvent) => event.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);
  if (!open) return null;

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("sending");
    setMessage("");
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          kind: "press-kit",
          name,
          email,
          channelLink,
          requestId: crypto.randomUUID(),
        }),
      });
      const result = await response.json();
      if (!response.ok) {
        setStatus("error");
        setMessage(
          result.message || "Please review your details and try again.",
        );
        return;
      }
      setStatus("success");
      setMessage(result.message || "Thank you. Your press kit is ready to download.");
    } catch {
      setStatus("error");
      setMessage("We could not connect to the server. Please try again.");
    }
  }

  return (
    <div
      className="fixed inset-0 z-[300] flex items-center justify-center overflow-y-auto bg-[#072f4f]/55 p-4 backdrop-blur-[14px]"
      role="dialog"
      aria-modal="true"
      aria-labelledby="press-kit-title"
      onMouseDown={(event) => event.target === event.currentTarget && onClose()}
    >
      <div className="relative w-full max-w-[480px] rounded-[10px] bg-white px-5 py-7 shadow-[0_22px_80px_rgba(7,47,79,0.2)] sm:px-5 sm:py-9">
        <button
          type="button"
          onClick={onClose}
          aria-label="Close press kit form"
          className="absolute right-5 top-4 text-3xl font-light cursor-pointer leading-none text-[#072f4f] transition-transform hover:rotate-90"
        >
          x
        </button>
        <h2
          id="press-kit-title"
          className="pe-8 text-start text-xl font-bold tracking-[0.04em] text-[#072f4f] sm:text-2xl"
        >
          DOWNLOAD THE EVRS PRESS KIT
        </h2>
        <p className="mx-auto mt-3 max-w-[570px] text-start text-sm leading-relaxed text-[#072f4f]/75 sm:text-base">
          Access official EVRS 2026 media assets, event information and brand
          resources.
        </p>
        {status === "success" ? (
          <div className="mt-8 text-center">
            <p className="text-base text-[#072f4f]">{message}</p>
            <a
              href="/press-kit/EVRS-Press-Kit.pdf"
              download
              className="mt-6 inline-flex min-h-12 items-center rounded-[8px] cursor-pointer justify-center bg-[#bb0054] px-8 text-sm font-bold tracking-[0.04em] text-white transition-colors hover:bg-[#072f4f]"
            >
              DOWNLOAD PRESS KIT
            </a>
          </div>
        ) : (
          <form onSubmit={submit} className="mt-7 space-y-3">
            <label className="sr-only" htmlFor="press-name">
              Your full name
            </label>
            <input
              id="press-name"
              required
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Your full name"
              className="h-12 w-full border border-[#d7dce1] px-4 text-sm text-[#072f4f] outline-none transition-colors placeholder:text-[#072f4f]/45 focus:border-[#bb0054]"
            />
            <div className="grid gap-3 sm:grid-cols-[1fr_auto_1fr] sm:items-center">
              <label className="sr-only" htmlFor="press-email">
                Business email
              </label>
              <input
                id="press-email"
                required
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="Business Email"
                className="h-12 w-full border border-[#d7dce1] px-4 text-sm text-[#072f4f] outline-none transition-colors placeholder:text-[#072f4f]/45 focus:border-[#bb0054]"
              />
              <span className="hidden text-center text-sm text-[#072f4f]/60 sm:block">
                or
              </span>
              <label className="sr-only" htmlFor="press-channel">
                Channel link
              </label>
              <input
                id="press-channel"
                value={channelLink}
                onChange={(event) => setChannelLink(event.target.value)}
                placeholder="Channel Link"
                className="h-12 w-full border border-[#d7dce1] px-4 text-sm text-[#072f4f] outline-none transition-colors placeholder:text-[#072f4f]/45 focus:border-[#bb0054]"
              />
            </div>
            {message && (
              <p role="alert" className="text-sm text-[#bb0054]">
                {message}
              </p>
            )}
            <button
              disabled={status === "sending"}
              type="submit"
              className="mt-2 flex h-12 w-full items-center justify-center rounded-[8px] cursor-pointer bg-[#bb0054] text-sm font-bold tracking-[0.04em] text-white transition-colors hover:bg-[#072f4f] disabled:cursor-wait disabled:opacity-60"
            >
              {status === "sending" ? "SENDING�" : "DOWNLOAD PRESS KIT"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
