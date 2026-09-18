"use client";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useLanguage } from "./LanguageProvider";
import { languageLabels } from "@/data/home-data/arabic-index";
import Button from "./Button";

export default function Navbar({
  homeHrefPrefix = "",
}: {
  homeHrefPrefix?: string;
}) {
  const { data, language, toggleLanguage } = useLanguage();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [racesOpen, setRacesOpen] = useState(false);
  const home = homeHrefPrefix || "/";
  const section = (id: string) => `${homeHrefPrefix}${id}`;
  const closeMobile = () => {
    setMobileOpen(false);
    setRacesOpen(false);
  };
  const languageSwitch = (
    <div
      dir="ltr"
      className="mr-2 flex shrink-0 items-center gap-2 py-2.5 text-[13px] font-bold md:mr-0 2xl:text-[15px]"
    >
      {(["en", "ar"] as const).map((locale, index) => (
        <span key={locale} className="flex items-center gap-2">
          {index > 0 && (
            <span aria-hidden className="text-gray-500">
              |
            </span>
          )}
          <button
            type="button"
            lang={locale}
            aria-pressed={language === locale}
            onClick={() => {
              if (language !== locale) toggleLanguage();
              closeMobile();
            }}
            className={`cursor-pointer rounded focus-visible:outline-2 focus-visible:outline-offset-4 ${language === locale ? "text-white" : "text-gray-400"}`}
          >
            {languageLabels[locale]}
          </button>
        </span>
      ))}
    </div>
  );
  const raceList = (mobile = false) => (
    <>
      {data.ui.navRaces.map((race, index) => (
        <Link
          key={race.href}
          href={race.href}
          onClick={() => {
            setRacesOpen(false);
            setMobileOpen(false);
          }}
          className={
            mobile
              ? "flex items-center justify-between py-2.5 text-sm"
              : "flex items-center justify-between rounded-md px-3 py-2.5 normal-case transition-colors hover:bg-white/10 focus-visible:bg-white/10 focus-visible:outline-none"
          }
        >
          <span className="font-semibold">
            {data.ui.nav.race} {String(index + 1).padStart(2, "0")} ·{" "}
            {race.label}
          </span>
        </Link>
      ))}
    </>
  );
  return (
    <header className="relative z-[100] mx-auto flex w-[90%] items-center justify-between gap-6 pt-6 max-sm:gap-2 2xl:max-w-[1440px] 2xl:pt-[34px]">
      <Link href={home} aria-label={data.brand}>
        <Image
          src={data.assets.logo}
          alt={data.brand}
          width={202}
          height={68}
          className="h-[54px] w-[160px] shrink-0 object-contain 2xl:h-[68px] 2xl:w-[202px]"
          preload
        />
      </Link>
      <nav
        aria-label={
          "mainNavigation" in data.ui
            ? data.ui.mainNavigation
            : "Main navigation"
        }
        className="hidden items-center gap-5 rounded-[5px] bg-black/30 p-2.5 ps-5 text-[13px] uppercase backdrop-blur-[22px] xl:flex 2xl:gap-6 2xl:text-[17px]"
      >
        <Link
          href={home}
          className="whitespace-nowrap transition-colors hover:text-white/70 focus-visible:outline-2"
        >
          {data.ui.nav.home}
        </Link>
        <Link
          href="/about"
          className="whitespace-nowrap transition-colors hover:text-white/70 focus-visible:outline-2"
        >
          {data.ui.nav.about}
        </Link>
        <div
          className="relative"
          onMouseEnter={() => setRacesOpen(true)}
          onMouseLeave={() => setRacesOpen(false)}
        >
          <button
            type="button"
            aria-expanded={racesOpen}
            aria-controls="race-navigation"
            onClick={() => setRacesOpen((open) => !open)}
            onKeyDown={(event) => {
              if (event.key === "Escape") setRacesOpen(false);
            }}
            className="inline-flex items-center gap-1 whitespace-nowrap transition-colors hover:text-white/70 focus-visible:outline-2 uppercase cursor-pointer"
          >
            {data.ui.nav.races}
            <svg
              aria-hidden
              viewBox="0 0 16 16"
              className={`size-3 transition-transform duration-200 ${racesOpen ? "rotate-180" : ""}`}
            >
              <path
                d="m3 6 5 5 5-5"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
          <div
            id="race-navigation"
            className={`absolute start-1/2 top-full w-52 2xl:w-64 -translate-x-1/2 origin-top rounded-[5px] border border-white/15 bg-black/45 backdrop-blur-[22px] p-2 shadow-2xl transition duration-200 ${racesOpen ? "visible scale-100 opacity-100" : "invisible scale-95 opacity-0"}`}
          >
           
            {raceList()} 
          </div>
        </div>
        <Link
          href={section("#gallery")}
          className="whitespace-nowrap transition-colors hover:text-white/70 focus-visible:outline-2"
        >
          {data.ui.nav.gallery}
        </Link>
        <Link
          href="/faqs"
          className="whitespace-nowrap transition-colors hover:text-white/70 focus-visible:outline-2"
        >
          {data.ui.nav.faqs}
        </Link>
        <Link
          href="/contact"
          className="whitespace-nowrap transition-colors hover:text-white/70 focus-visible:outline-2"
        >
          {data.ui.nav.contact}
        </Link>
        {languageSwitch}
        <Button href={data.register.href} tone="pink">
          {data.register.label}
        </Button>
      </nav>
      <div className="flex shrink-0 items-center gap-1 sm:gap-3 xl:hidden">
        {languageSwitch}
        <button
          type="button"
          aria-label={mobileOpen ? data.ui.closeMenu : data.ui.menu}
          aria-expanded={mobileOpen}
          aria-controls="mobile-navigation"
          onClick={() => setMobileOpen((open) => !open)}
          className="flex size-12 items-center justify-center rounded bg-black/40 text-white backdrop-blur-xl focus-visible:outline-2 focus-visible:outline-offset-4"
        >
          <svg
            aria-hidden
            viewBox="0 0 24 24"
            className="size-6 fill-none stroke-current stroke-2"
          >
            {mobileOpen ? (
              <path d="m6 6 12 12M18 6 6 18" strokeLinecap="round" />
            ) : (
              <path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="round" />
            )}
          </svg>
        </button>
      </div>
      {mobileOpen && (
        <nav
          id="mobile-navigation"
          aria-label={
            "mobileNavigation" in data.ui
              ? data.ui.mobileNavigation
              : "Mobile navigation"
          }
          onKeyDown={(event) => {
            if (event.key === "Escape") closeMobile();
          }}
          className="fixed inset-x-0 top-[94px] z-[200] mx-auto w-[90%] max-w-[1440px] max-h-[calc(100svh-112px)] overflow-y-auto rounded-lg bg-[#072f4f] p-5 shadow-xl xl:hidden"
        >
          <div className="flex flex-col">
            <Link
              href={home}
              onClick={closeMobile}
              className="border-b border-white/15 py-3 uppercase"
            >
              {data.ui.nav.home}
            </Link>
            <Link
              href="/about"
              onClick={closeMobile}
              className="border-b border-white/15 py-3 uppercase"
            >
              {data.ui.nav.about}
            </Link>
            <button
              type="button"
              aria-expanded={racesOpen}
              aria-controls="mobile-race-navigation"
              onClick={() => setRacesOpen((open) => !open)}
              className="flex items-center justify-between border-b border-white/15 py-3 text-left uppercase"
            >
              {data.ui.nav.races}
              <svg
                aria-hidden
                viewBox="0 0 16 16"
                className={`size-4 transition-transform duration-200 ${racesOpen ? "rotate-180" : ""}`}
              >
                <path
                  d="m3 6 5 5 5-5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
            {racesOpen && (
              <div
                id="mobile-race-navigation"
                className="border-b border-white/15 bg-white/5 px-3 py-2"
              >
                {raceList(true)}
              </div>
            )}
            <Link
              href={section("#gallery")}
              onClick={closeMobile}
              className="border-b border-white/15 py-3 uppercase"
            >
              {data.ui.nav.gallery}
            </Link>
            <Link
              href="/faqs"
              onClick={closeMobile}
              className="border-b border-white/15 py-3 uppercase"
            >
              {data.ui.nav.faqs}
            </Link>
        <Link
              href="/contact"
              onClick={closeMobile}
              className="border-b border-white/15 py-3 uppercase"
            >
              {data.ui.nav.contact}
            </Link>
          </div>
          <Button href={data.register.href} tone="pink" className="mt-4">
            {data.register.label}
          </Button>
        </nav>
      )}
    </header>
  );
}
