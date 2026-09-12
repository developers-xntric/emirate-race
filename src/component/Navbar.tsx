"use client";
import Image from "next/image";
import { useState } from "react";
import { homeData as data } from "@/data/home-data";
import Button from "./Button";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  return (
    <header className="relative z-30 mx-auto flex w-[90%] items-center justify-between gap-6 pt-6 2xl:max-w-[1440px] 2xl:pt-[34px]">
      <a href="#" aria-label={data.brand}>
        <Image
          src={data.assets.logo}
          alt={data.brand}
          width={202}
          height={68}
          className="h-[54px] w-[160px] shrink-0 object-contain 2xl:h-[68px] 2xl:w-[202px]"
          preload
        />
      </a>
      <nav
        aria-label="Main navigation"
        className="hidden items-center gap-5 rounded-[5px] bg-black/30 p-2.5 pl-5 backdrop-blur-[22px] xl:flex 2xl:gap-6"
      >
        {data.navigation.map((link) => (
          <a
            key={link.href}
            href={link.href}
            className="whitespace-nowrap text-[13px] uppercase hover:text-white/70 focus-visible:outline-2 2xl:text-[15px]"
          >
            {link.label}
          </a>
        ))}
        <Button href={data.register.href} tone="white">
          {data.register.label}
        </Button>
      </nav>
      <button
        type="button"
        aria-label={open ? data.ui.closeMenu : data.ui.menu}
        aria-expanded={open}
        aria-controls="mobile-navigation"
        onClick={() => setOpen(!open)}
        className="flex size-12 items-center justify-center rounded bg-black/40 text-3xl backdrop-blur-xl xl:hidden"
      >
        {open ? "×" : "☰"}
      </button>
      {open && (
        <nav
          id="mobile-navigation"
          aria-label="Mobile navigation"
          onKeyDown={(event) => {
            if (event.key === "Escape") setOpen(false);
          }}
          className="absolute inset-x-0 top-[94px] flex flex-col rounded-lg bg-[#072f4f] p-5 shadow-xl xl:hidden"
        >
          {data.navigation.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="border-b border-white/15 py-3 uppercase"
            >
              {link.label}
            </a>
          ))}
          <Button href={data.register.href} tone="pink" className="mt-4">
            {data.register.label}
          </Button>
        </nav>
      )}
    </header>
  );
}
