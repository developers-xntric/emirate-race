"use client";

import Image from "next/image";
import { useHomeData } from "./LanguageProvider";

function SocialIcon({ label }: { label: string }) {
  if (label === "Instagram") {
    return (
      <svg aria-hidden="true" viewBox="0 0 24 24" className="size-5 fill-none stroke-current stroke-2">
        <rect x="3" y="3" width="18" height="18" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.5" cy="6.5" r="1" className="fill-current stroke-none" />
      </svg>
    );
  }

  if (label === "TikTok") {
    return (
      <svg aria-hidden="true" viewBox="0 0 24 24" className="size-5 fill-current">
        <path d="M15.5 3c.4 2.3 1.8 3.7 4.5 4v3.2c-1.6.1-3.1-.4-4.5-1.3v6.3c0 4-3.2 5.8-6.1 5.8-3.1 0-5.4-2.2-5.4-5.1 0-3.6 3.2-5.9 7-5.2v3.2c-1.7-.5-3.5.3-3.5 2 0 1.1.8 1.9 1.9 1.9 1.5 0 2.3-1 2.3-2.7V3h3.8Z" />
      </svg>
    );
  }

  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="size-5 fill-current">
      <path d="M21.6 7.2a3 3 0 0 0-2.1-2.1C17.7 4.6 12 4.6 12 4.6s-5.7 0-7.5.5a3 3 0 0 0-2.1 2.1C1.9 9 1.9 12 1.9 12s0 3 .5 4.8a3 3 0 0 0 2.1 2.1c1.8.5 7.5.5 7.5.5s5.7 0 7.5-.5a3 3 0 0 0 2.1-2.1c.5-1.8.5-4.8.5-4.8s0-3-.5-4.8ZM10.1 15.2V8.8l5.5 3.2-5.5 3.2Z" />
    </svg>
  );
}export default function Footer({ homeHrefPrefix = '' }: { homeHrefPrefix?: string }) {
  const data = useHomeData();
  const columns = [
    data.navigation.slice(0, 3),
    data.navigation.slice(3, 6),
    [
      { label: data.footer.recognition, href: "#recognition" },
      data.navigation[6],
      data.register,
    ],
  ];
  return (
    <footer className="overflow-hidden bg-[#f8f8f8] text-white">
      <div aria-hidden="true" className="flex h-[45px] md:h-[60px] w-full overflow-hidden">
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
              <Image
                src={data.assets.footerLogo}
                alt={data.brand}
                width={486}
                height={107}
                className="mb-4 md:mb-7 block h-auto w-[200px] max-w-full object-contain object-left md:hidden"
              />
              <p className="text-[12px] md:text-lg leading-tight lg:text-base 2xl:text-lg">
                {data.footer.description}
              </p>
              <p className="mt-3 md:mt-5 text-[12px] md:text-lg leading-tight lg:text-base 2xl:text-lg">
                {data.footer.organizer}
              </p>
              <Image
                src={data.assets.footerLogo}
                alt={data.brand}
                width={486}
                height={107}
                className="mt-9 hidden w-[438px] max-w-full object-contain object-left md:block md:h-[96px]"
              />
            </div>
            <div>
              <h2 className="text-xl font-bold">{data.footer.quickLinks}</h2>
              <div className="mt-3 md:mt-7 grid grid-cols-3 md:gap-5">
                {columns.map((column, index) => (
                  <ul key={index} className="space-y-2 md:space-y-4">
                    {column.map((link) => (
                      <li key={link.href}>
                        {link.href ? (
                          <a
                            href={link.href.startsWith('#') ? `${homeHrefPrefix}${link.href}` : link.href}
                            className="text-sm md:text-base hover:underline 2xl:text-[22px]"
                          >
                            {link.label}
                          </a>
                        ) : (
                          <button
                            type="button"
                            className="text-left text-sm md:text-base 2xl:text-[22px]"
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
                  href={`mailto:${data.footer.email}`}
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
              {"legalLabel" in data.footer && <span>{data.footer.legalLabel}</span>}
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
    </footer>
  );
}
