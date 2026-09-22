"use client";

import Image from "next/image";
import { useState } from "react";
import Navbar from "@/component/Navbar";
import Footer from "@/component/Footer";
import { useLanguage } from "@/component/LanguageProvider";

type PartnerCardData = {
  logo: string;
  name: { en: string; ar: string };
  description: { en: string; ar: string };
};

const partnerCards: PartnerCardData[] = [
  {
    logo: "/partners/partner-1.svg",
    name: { en: "Emirates News Agency (WAM)", ar: "????? ????? ???????? (???)" },
    description: { en: "Coverage of the Emirates Villages Run Series and its wider community and tourism impact.", ar: "????? ????? ?????? ??? ???????? ?????? ?????? ?? ??????? ????????." },
  },
  {
    logo: "/partners/partner-2.svg",
    name: { en: "Emirates Council for Balanced Development", ar: "???? ???????? ??????? ?????????" },
    description: { en: "Supporting a connected series that celebrates local communities, heritage and discovery.", ar: "??? ????? ??????? ????? ?????????? ??????? ??????? ?????????." },
  },
  {
    logo: "/partners/partner-3.svg",
    name: { en: "Fujairah Tourism Authority", ar: "???? ??????? ???????" },
    description: { en: "Helping runners discover the landscapes and experiences found across the Emirates.", ar: "?????? ???????? ??? ?????? ??????? ???????? ?? ????? ????????." },
  },
  {
    logo: "/partners/partner-1.svg",
    name: { en: "UAE Athletics Federation", ar: "????? ???????? ?????? ?????" },
    description: { en: "Encouraging participation and creating memorable start lines for every runner.", ar: "????? ???????? ?????? ????? ?????? ????? ??? ????." },
  },
  {
    logo: "/partners/partner-2.svg",
    name: { en: "Emirates Villages Run Series", ar: "????? ?????? ??? ????????" },
    description: { en: "Bringing seven villages together through sport, community and shared journeys.", ar: "??? ??? ??? ?? ???? ??????? ???????? ???????? ????????." },
  },
  {
    logo: "/partners/partner-3.svg",
    name: { en: "Community Partners Network", ar: "???? ????? ???????" },
    description: { en: "Making every race welcoming, inclusive and connected to its host village.", ar: "??? ?? ???? ????? ??????? ?????? ??????? ?????? ???????." },
  },
];

type CardCopy = {
  hero: string;
  partnerEyebrow: string;
  partnerTitle: string;
  sponsorEyebrow: string;
  sponsorTitle: string;
  name: string;
  description: string;
  learnMore: string;
  previous: string;
  next: string;
};

const cardCopy: Record<"en" | "ar", CardCopy> = {
  en: {
    hero: "Partners & Sponsors",
    partnerEyebrow: "Partners",
    partnerTitle: "Supporting the Journey Across the Emirates",
    sponsorEyebrow: "Sponsors",
    sponsorTitle: "Powering Every Start Line",
    name: "Emirates News Agency (WAM)",
    description:
      "Coverage of the Emirates Villages Run Series and its wider community and tourism impact.",
    learnMore: "Learn more",
    previous: "Previous partner",
    next: "Next partner",
  },
  ar: {
    hero: "\u0627\u0644\u0634\u0631\u0643\u0627\u0621 \u0648\u0627\u0644\u0631\u0639\u0627\u0629",
    partnerEyebrow: "\u0627\u0644\u0634\u0631\u0643\u0627\u0621",
    partnerTitle: "\u064a\u062f\u0639\u0645\u0648\u0646 \u0627\u0644\u0631\u062d\u0644\u0629 \u0639\u0628\u0631 \u0627\u0644\u0625\u0645\u0627\u0631\u0627\u062a",
    sponsorEyebrow: "\u0627\u0644\u0631\u0639\u0627\u0629",
    sponsorTitle: "\u064a\u062f\u0639\u0645\u0648\u0646 \u0643\u0644 \u062e\u0637 \u0627\u0646\u0637\u0644\u0627\u0642",
    name: "\u0648\u0643\u0627\u0644\u0629 \u0623\u0646\u0628\u0627\u0621 \u0627\u0644\u0625\u0645\u0627\u0631\u0627\u062a (\u0648\u0627\u0645)",
    description:
      "\u062a\u063a\u0637\u064a\u0629 \u0633\u0644\u0633\u0644\u0629 \u0633\u0628\u0627\u0642\u0627\u062a \u0642\u0631\u0649 \u0627\u0644\u0625\u0645\u0627\u0631\u0627\u062a \u0648\u0623\u062b\u0631\u0647\u0627 \u0627\u0644\u0623\u0648\u0633\u0639 \u0641\u064a \u0627\u0644\u0645\u062c\u062a\u0645\u0639 \u0648\u0627\u0644\u0633\u064a\u0627\u062d\u0629.",
    learnMore: "\u0627\u0639\u0631\u0641 \u0627\u0644\u0645\u0632\u064a\u062f",
    previous: "\u0627\u0644\u0634\u0631\u064a\u0643 \u0627\u0644\u0633\u0627\u0628\u0642",
    next: "\u0627\u0644\u0634\u0631\u064a\u0643 \u0627\u0644\u062a\u0627\u0644\u064a",
  },
};

function PartnerCard({
  card,
  copy,
  language,
  compact = false,
}: {
  card?: PartnerCardData;
  copy: CardCopy;
  language: "en" | "ar";
  compact?: boolean;
}) {
  const name = card?.name[language] ?? copy.name;
  const description = card?.description[language] ?? copy.description;
  return (
    <article
      className={`overflow-hidden rounded-[10px] border-2 border-[#bb0054] bg-white ${compact ? "p-[9px]" : "p-[10px]"}`}
    >
      <div
        className={`flex items-center justify-center overflow-hidden rounded-[10px] bg-[#0b2d4d] ${compact ? "h-[clamp(165px,12.85vw,247px)]" : "h-[clamp(220px,16.04vw,308px)]"}`}
      >
        {card?.logo && (
          <Image
            src={card.logo}
            alt=""
            width={110}
            height={75}
            className="h-auto w-[110px] max-w-[35%] object-contain"
          />
        )}
      </div>
      <div className={`flex flex-col items-start ${compact ? "gap-2 pt-4" : "gap-2 pt-5"}`}>
        <h3 className={`${compact ? "text-[clamp(17px,1.56vw,30px)]" : "text-[clamp(20px,1.56vw,30px)]"} leading-[1.02] font-bold uppercase text-[#0b2d4d]`}>
          {name}
        </h3>
        <p className={`${compact ? "text-[clamp(12px,0.92vw,17.6px)]" : "text-[clamp(14px,1.15vw,22px)]"} leading-[1.23] text-[#033359]`}>
          {description}
        </p>
        <a
          href="#contact"
          className={`${compact ? "mt-1 text-[10px]" : "mt-2 text-sm"} font-bold uppercase text-[#bb0054] hover:underline focus-visible:outline-2 focus-visible:outline-offset-2`}
        >
          {copy.learnMore}
          <Image src="/partners/sponsor-8.svg" alt="" width={5} height={10} className="ms-1 inline-block h-[10px] w-[5px]" />
        </a>
      </div>
    </article>
  );
}

export default function PartnersPage() {
  const { language } = useLanguage();
  const copy = cardCopy[language];
  const [start, setStart] = useState(0);
  const [isChanging, setIsChanging] = useState(false);
  const visiblePartners = [0, 1, 2].map((offset) => partnerCards[(start + offset) % partnerCards.length]);

  function moveCarousel(step: number) {
    setIsChanging(true);
    setStart((value) => (value + step + partnerCards.length) % partnerCards.length);
    window.setTimeout(() => setIsChanging(false), 220);
  }

  return (
    <>
      <main id="main-content" className="bg-white" lang={language} dir={language === "ar" ? "rtl" : "ltr"}>
        <section className="relative isolate mx-2 mt-2  min-h-[660px] overflow-hidden rounded-[10px] text-white">
          <Image src="/partners/hero.png" alt="" fill priority sizes="100vw" className="-z-20 object-cover" />
          <div className="absolute inset-0 -z-10 bg-black/50" />
          <Navbar homeHrefPrefix="/" />
          <h1 className="absolute inset-x-4 top-1/2 -translate-y-1/2 text-center text-[clamp(42px,4.7vw,90px)] md:text-[clamp(40px,4vw,90px)] leading-none font-bold uppercase">
            {copy.hero}
          </h1>
        </section>

        <section className="mx-auto mt-[80px] w-[90%] max-w-[1590px] rounded-[10px] bg-[url('/partners/sponsor-6.svg')] bg-cover bg-center px-[4%] pb-[30px] pt-[45px] md:pb-[35px] md:pt-[48px]">
          <div className="mx-auto max-w-[884px] text-center">
            <p className="mb-3 text-sm font-bold uppercase text-[#bb0054] md:text-[22px]">{copy.partnerEyebrow}</p>
            <h2 className="text-[clamp(34px,3.125vw,60px)] leading-[.98] font-bold uppercase text-[#0b2d4d]">{copy.partnerTitle}</h2>
          </div>
          <div
            aria-live="polite"
            className={`mt-[48px] grid grid-cols-1 gap-6 transition duration-200 md:grid-cols-3 md:gap-[3.1%] ${isChanging ? "translate-x-2 opacity-30" : "translate-x-0 opacity-100"}`}
          >
            {visiblePartners.map((card, index) => (
              <PartnerCard key={`${start}-${card.logo}-${index}`} card={card} copy={copy} language={language} />
            ))}
          </div>
          <div className="mt-[28px] flex items-center justify-center gap-5" dir="ltr">
            <button
              type="button"
              aria-label={copy.previous}
              onClick={() => moveCarousel(-1)}
              className="transition-transform hover:scale-105 focus-visible:outline-2 focus-visible:outline-offset-4 cursor-pointer"
            >
              <Image src="/partners/arrow-left.svg" alt="" width={56} height={61} />
            </button>
            <button
              type="button"
              aria-label={copy.next}
              onClick={() => moveCarousel(1)}
              className="transition-transform hover:scale-105 focus-visible:outline-2 focus-visible:outline-offset-4  cursor-pointer"
            >
              <Image src="/partners/arrow-right2.png" alt="" width={56} height={61} className="" />
            </button>
          </div>
        </section>

        <section className="mx-auto w-[90%] max-w-[1590px] pb-[90px] pt-[80px] md:pb-[120px] md:pt-[96px]">
          <div className="mx-auto max-w-[884px] text-center">
            <p className="mb-3 text-sm font-bold uppercase text-[#bb0054] md:text-[22px]">{copy.sponsorEyebrow}</p>
            <h2 className="text-[clamp(34px,3.125vw,60px)] leading-[.98] font-bold uppercase text-[#0b2d4d]">{copy.sponsorTitle}</h2>
          </div>
          <div className="mt-[48px] grid grid-cols-1 gap-5 sm:grid-cols-2 md:gap-x-[1.8%] md:gap-y-5 lg:grid-cols-4">
            {Array.from({ length: 8 }, (_, index) => (
              <PartnerCard key={index} copy={copy} language={language} compact />
            ))}
          </div>
        </section>
      </main>
      <Footer homeHrefPrefix="/" />
    </>
  );
}
