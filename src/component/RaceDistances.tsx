"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useHomeData } from "./LanguageProvider";
import SectionHeading from "./SectionHeading";
import Button from "./Button";

function PartnerCard({
  partner,
}: {
  partner: ReturnType<typeof useHomeData>["distances"]["partners"][number];
}) {
  return (
    <Link
      href="/partners"
      aria-label={`${partner.name} - Partners`}
      className="flex min-h-[100px] w-[240px] shrink-0 items-center justify-center rounded-[5px] border-2 border-transparent bg-white/16 p-4 backdrop-blur-md transition-colors duration-300 hover:border-[#bb0054] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#bb0054] lg:w-[300px]"
    >
      <Image
        src={partner.logo}
        alt={partner.name}
        width={160}
        height={54}
        className="h-[44px] w-auto max-w-full object-contain 2xl:h-[54px]"
      />
    </Link>
  );
}

export default function RaceDistances() {
  const data = useHomeData();
  const cardsRef = useRef<HTMLDivElement>(null);
  const [cardsVisible, setCardsVisible] = useState(false);
  const [animationCycle, setAnimationCycle] = useState(0);

  useEffect(() => {
    const cards = cardsRef.current;
    if (!cards) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setCardsVisible(entry.isIntersecting);
        if (entry.isIntersecting) setAnimationCycle((current) => current + 1);
      },
      { threshold: 0.12, rootMargin: "0px 0px -10% 0px" },
    );

    observer.observe(cards);
    return () => observer.disconnect();
  }, []);
  const marqueePartners = [...data.distances.partners, ...data.distances.partners];

  return (
    <section
      id="distances"
      className="relative isolate overflow-hidden py-10 md:py-16 text-white "
    >
      <div className="absolute inset-0 -z-20 overflow-hidden">
        <div className="relative md:block hidden -top-[11.55%] h-[111.54%] w-full">
          <Image
            src={data.assets.distancesBackground}
            alt=""
            fill
            sizes="100vw"
            className="object-fill"
          />
        </div>
        <div className="relative md:hidden block -top-[11.55%] h-[111.54%] w-full">
          <Image
            src={data.assets.distancesBackgroundMobile}
            alt=""
            fill
            sizes="100vw"
            className="object-fill"
          />
        </div>
      </div>
      <div className="absolute inset-0 -z-10 bg-black/80 md:bg-[#000]/90" />
      <div className="mx-auto w-[90%] 2xl:max-w-[1440px]">
        <SectionHeading
          eyebrow={data.distances.eyebrow}
          title={data.distances.title}
          light
        />
        <div
          ref={cardsRef}
          className="mt-3 grid gap-3 md:gap-[30px] md:grid-cols-3 "
        >
          {data.distances.cards.map((card, index) => (
            <article
              key={`${card.title}-${animationCycle}`}
              className={`flex flex-col rounded-[10px] border border-transparent bg-white/16 p-4 backdrop-blur-[6px] md:backdrop-blur-[12px] transition-[border-color,transform] duration-500 hover:-translate-y-1 hover:border-[#bb0054] ${cardsVisible ? "motion-safe:animate-distance-card-enter" : "opacity-0 translate-y-6"} motion-reduce:translate-y-0 motion-reduce:opacity-100`}
              style={{ animationDelay: `${index * 180}ms` }}
            >
              <div className="relative aspect-[473.38/320.86] overflow-hidden rounded-[5px]">
                <Image
                  src={card.image}
                  alt={card.alt}
                  fill
                  sizes="(min-width: 768px) 30vw, 90vw"
                  className="object-cover"
                />
              </div>
              <h3 className="mt-3 md:mt-6 text-[20px] md:text-[25px] leading-none font-bold uppercase 2xl:text-[32px]">
                {card.title}
              </h3>
              <p className="mt-3 mb-4 md:mb-6 text-lg leading-[1.25] lg:text-base 2xl:text-lg">
                {card.description}
              </p>
              <Button
                href={data.register.href}
                tone="pink"
                className="mt-auto w-full"
              >
                {card.cta}
              </Button>
            </article>
          ))}
        </div>
        <div className="mt-6 flex flex-wrap justify-between gap-2 text-sm font-bold uppercase 2xl:text-lg hidden">
          <p>{data.distances.partnersLabel}</p>
          <p>{data.distances.partnersTitle}</p>
        </div>
      </div>
      <div
        className="mt-5 w-full overflow-hidden hidden"
        aria-label={data.distances.partnersTitle}
      >
        <div className="flex w-max gap-4 pe-4 motion-safe:animate-quick-facts motion-reduce:translate-x-0 lg:gap-[30px] lg:pe-[30px]">
          {marqueePartners.map((partner, index) => (
            <PartnerCard key={`${partner.name}-${index}`} partner={partner} />
          ))}
        </div>
      </div>
    </section>
  );
}
