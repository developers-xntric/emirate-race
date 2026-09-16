"use client";
import Image from "next/image";
import { useState } from "react";
import { useLanguage } from "./LanguageProvider";
import { languageLabels } from "@/data/home-data/arabic-index";
import Button from "./Button";

export default function Navbar() {
  const { data, language, toggleLanguage } = useLanguage();
  const [open, setOpen] = useState(false);
  const languageSwitch = (
    <div dir="ltr" className="flex shrink-0 items-center gap-2 py-2.5 text-[13px] font-bold 2xl:text-[15px] mr-2 md:mr-0 rtl:ml-3 md:rtl:ml-0">
      {(["en", "ar"] as const).map((locale, index) => (
        <span key={locale} className="flex items-center gap-2 ">
          {index > 0 && <span aria-hidden="true" className="text-gray-500">|</span>}
          <button
            type="button"
            lang={locale}
            aria-pressed={language === locale}
            onClick={() => {
              if (language !== locale) toggleLanguage();
              setOpen(false);
            }}
            className={`cursor-pointer rounded focus-visible:outline-2 focus-visible:outline-offset-4 ${language === locale ? "text-white" : "text-gray-400"}`}
          >
            {languageLabels[locale]}
          </button>
        </span>
      ))}
    </div>
  );
  return (
    <header className="relative z-30 mx-auto flex w-[90%] items-center justify-between gap-6 max-sm:gap-2 pt-6 2xl:max-w-[1440px] 2xl:pt-[34px]">
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
        aria-label={"mainNavigation" in data.ui ? data.ui.mainNavigation : "Main navigation"}
        className="hidden items-center gap-5 rounded-[5px] bg-black/30 p-2.5 ps-5 backdrop-blur-[22px] xl:flex rtl:flex-wrap rtl:justify-center 2xl:gap-6"
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
        {languageSwitch}
        <Button href={data.register.href} tone="pink">
          {data.register.label}
        </Button>
      </nav>
      <div className="flex shrink-0 items-center gap-1 sm:gap-3 xl:hidden">
        {languageSwitch}
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
      </div>
      {open && (
        <nav
          id="mobile-navigation"
          aria-label={"mobileNavigation" in data.ui ? data.ui.mobileNavigation : "Mobile navigation"}
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
