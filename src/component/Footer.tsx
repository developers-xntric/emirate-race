"use client";

import Image from "next/image";
import { useLanguage } from "./LanguageProvider";
import { useState } from "react";
import PressKitModal from "./PressKitModal";

function SocialIcon({ label }: { label: string }) {
  if (label === "Instagram") {
    return (
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        className="size-5 fill-none stroke-current stroke-2"
      >
        <rect x="3" y="3" width="18" height="18" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.5" cy="6.5" r="1" className="fill-current stroke-none" />
      </svg>
    );
  }

  if (label === "TikTok") {
    return (
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        className="size-5 fill-current"
      >
        <path d="M15.5 3c.4 2.3 1.8 3.7 4.5 4v3.2c-1.6.1-3.1-.4-4.5-1.3v6.3c0 4-3.2 5.8-6.1 5.8-3.1 0-5.4-2.2-5.4-5.1 0-3.6 3.2-5.9 7-5.2v3.2c-1.7-.5-3.5.3-3.5 2 0 1.1.8 1.9 1.9 1.9 1.5 0 2.3-1 2.3-2.7V3h3.8Z" />
      </svg>
    );
  }

  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="size-5 fill-current">
      <path d="M21.6 7.2a3 3 0 0 0-2.1-2.1C17.7 4.6 12 4.6 12 4.6s-5.7 0-7.5.5a3 3 0 0 0-2.1 2.1C1.9 9 1.9 12 1.9 12s0 3 .5 4.8a3 3 0 0 0 2.1 2.1c1.8.5 7.5.5 7.5.5s5.7 0 7.5-.5a3 3 0 0 0 2.1-2.1c.5-1.8.5-4.8.5-4.8s0-3-.5-4.8ZM10.1 15.2V8.8l5.5 3.2-5.5 3.2Z" />
    </svg>
  );
}
export default function Footer({
  homeHrefPrefix = "",
}: {
  homeHrefPrefix?: string;
}) {
  const { data, language } = useLanguage();
  const [pressKitOpen, setPressKitOpen] = useState(false);
  const raceLinks = [
    { label: "Qidfa", href: "/races/qidfa" },
    { label: "Lahbab", href: "/races/lahbab" },
    { label: "Wadi Al Helo", href: "/races/wadi-al-helo" },
    { label: "Falaj Al Mualla", href: "/races/falaj-al-mualla" },
    { label: "Masfout", href: "/races/masfout" },
    { label: "Al Rams", href: "/races/al-rams" },
    { label: "Al Shuwaib", href: "/races/al-shuwaib" },
  ];
  const localizedRaceLinks = raceLinks.map((race, index) => ({ ...race, label: data.ui.navRaces[index]?.label ?? race.label }));
  const pressKitLabel = language === "ar" ? "\u0627\u0644\u062d\u0642\u064a\u0628\u0629 \u0627\u0644\u0625\u0639\u0644\u0627\u0645\u064a\u0629" : "Press Kit";
  type FooterLink = { label: string; href?: string; pressKit?: boolean };
  const footerContent = data.footer as typeof data.footer & { links?: FooterLink[]; linksPrimary?: FooterLink[]; linksRaces?: FooterLink[]; preFooterLogo?: string };
  const cmsQuickLinks = footerContent.links;
  const cmsPrimaryLinks = footerContent.linksPrimary;
  const cmsRaceLinks = footerContent.linksRaces;
  const defaultPrimaryLinks: FooterLink[] = [
    { label: data.ui.nav.home, href: `${homeHrefPrefix}/` },
    { label: data.ui.nav.about, href: `${homeHrefPrefix}/about` },
    { label: data.ui.nav.contact, href: `${homeHrefPrefix}/contact` },
    { label: data.ui.nav.faqs, href: `${homeHrefPrefix}/faqs` },
    { label: pressKitLabel, pressKit: true },
  ];
  const preFooterLogo = footerContent.preFooterLogo ?? data.assets.preFooterLogo;
  const columns: FooterLink[][] = cmsQuickLinks?.length
    ? [cmsQuickLinks.slice(0, Math.ceil(cmsQuickLinks.length / 2)), cmsQuickLinks.slice(Math.ceil(cmsQuickLinks.length / 2))]
    : cmsPrimaryLinks?.length || cmsRaceLinks?.length
      ? [cmsPrimaryLinks?.length ? cmsPrimaryLinks : defaultPrimaryLinks, cmsRaceLinks?.length ? cmsRaceLinks : localizedRaceLinks]
      : [defaultPrimaryLinks, localizedRaceLinks];
  return (
    <footer id="contact" className="overflow-hidden bg-[#f8f8f8] text-white">
      <div
        aria-hidden="true"
        className="flex h-[45px] md:h-[60px] w-full overflow-hidden"
      >
        {Array.from({ length: 30 }, (_, index) => (
          <Image
            key={index}
            src={data.assets.footerChecker}
            alt=""
            width={110}
            height={75}
            className="-me-[22px] h-[75px] w-[110px] shrink-0"
          />
        ))}
      </div>
      <div className="bg-[#072f4f]">
        <div className="mx-auto w-[90%] pt-10 2xl:max-w-[1440px]">
          <div className="grid gap-5 md:gap-10 md:grid-cols-2 md:gap-[90px]">
            <div className="max-w-[620px]">
              <p className="text-[12px] md:text-lg leading-tight lg:text-base 2xl:text-lg">
                {data.footer.description}
              </p>
              <Image
                src={data.assets.footerLogo}
                alt={data.brand}
                width={486}
                height={107}
                className="mt-4 block h-auto w-[200px] max-w-full object-contain object-left md:mt-7 md:w-[438px]"
              />
              <p className="mt-3 md:mt-5  text-[12px] md:text-lg leading-tight lg:text-base 2xl:text-lg">
                {data.footer.organizer}
              </p>
              {preFooterLogo && (
                <Image
                  src={preFooterLogo}
                  alt=""
                  width={486}
                  height={107}
                  className=" md:rtl:mt-5 block h-auto w-[230px] max-w-full object-contain object-left  md:w-[400px]"
                />
              )}
            </div>
            <div>
              <h2 className="text-xl font-bold hidden">{data.footer.quickLinks}</h2>
              <div className="grid grid-cols-2 gap-8 md:gap-16">
                {columns.map((column, index) => (
                  <ul key={index} className="space-y-2 ">
                    {column.map((link, linkIndex) => (
                      <li key={linkIndex}>
                        {"href" in link ? (
                          <a
                            href={
                              (link.href ?? "").startsWith("#")
                                ? `${homeHrefPrefix}${link.href ?? ""}`
                                : link.href
                            }
                            className="text-sm md:text-base hover:underline 2xl:text-[22px]"
                          >
                            {link.label}
                          </a>
                        ) : (
                          <button
                            type="button"
                            onClick={() =>
                              "pressKit" in link &&
                              link.pressKit &&
                              setPressKitOpen(true)
                            }
                            title={
                              "pressKit" in link && link.pressKit
                                ? pressKitLabel
                                : undefined
                            }
                            className="text-start text-sm md:text-base 2xl:text-[22px] cursor-pointer"
                          >
                            {link.label}
                          </button>
                        )}
                      </li>
                    ))}
                  </ul>
                ))}
              </div>
              <div className="mt-5 md:mt-10 flex flex-wrap items-center justify-between gap-4">
                <a
                  href={(data.footer as typeof data.footer & { emailHref?: string }).emailHref || `mailto:${data.footer.email}`}
                  className="flex items-center gap-3 text-lg font-bold hover:underline"
                >
                  <Image
                    src={data.assets.email}
                    alt=""
                    width={49}
                    height={49}
                    className="size-[49px]"
                  />
                  {data.footer.email}
                </a>
                <div className="flex gap-3">
                  {data.footer.socials.map((social) => (
                    <a
                      key={social.label}
                      href={social.href}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={social.label}
                      className="flex size-12 items-center justify-center rounded-[5px] bg-[#BB0054] text-white hover:bg-[#1a568b] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#bb0054]"
                    >
                      <SocialIcon label={social.label} />
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div className="mt-4 md:mt-8 flex flex-wrap justify-between gap-4 border-t border-white/30 py-6 text-[12px] md:text-sm 2xl:text-base">
            <p>{data.footer.copyright}</p>
            <div className="flex flex-wrap gap-4">
              {data.footer.legal.map((label, index) => (
                <span key={label}>
                  {index > 0 && (
                    <span aria-hidden="true" className="me-4">
                      |
                    </span>
                  )}
                  {label}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
      <PressKitModal
        open={pressKitOpen}
        onClose={() => setPressKitOpen(false)}
      />
    </footer>
  );
}
