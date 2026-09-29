"use client";
import Image from "next/image";
import Navbar from "@/component/Navbar";
import Footer from "@/component/Footer";
import Button from "@/component/Button";
import SectionHeading from "@/component/SectionHeading";
import RouteMaps from "@/component/races/RouteMaps";
import RaceReveal from "@/component/races/RaceReveal";
import RaceAboutImage from "@/component/races/RaceAboutImage";
import RaceDistanceCards from "@/component/races/RaceDistanceCards";
import type { RacePageData } from "@/data/races/types";
import { useCmsRace } from "@/component/races/useCmsRace";
import { useLanguage } from "@/component/LanguageProvider";
import { usePathname } from "next/navigation";

const container = "mx-auto w-[90%] 2xl:max-w-[1440px]";

export default function RacePage({ race }: { race: RacePageData }) {
  const { language } = useLanguage();
  const slug = usePathname().split("/").filter(Boolean).pop() || "";
  const activeRace = useCmsRace(race, slug, language);
  return (
    <>
      <main id="main-content" className="overflow-hidden">
        <section className="relative isolate m-2 flex min-h-[640px] flex-col overflow-hidden rounded-[10px] text-white md:min-h-[560px] lg:min-h-0 lg:aspect-[1891.51/741.569]">
          <Image
            src={activeRace.assets.hero}
            alt="Runners setting off at an Emirates Villages race"
            fill
            preload
            sizes="100vw"
            className="-z-20 object-cover "
            style={{ objectPosition: activeRace.heroPosition }}
          />
          <div className="absolute inset-0 -z-10 bg-black/50" />
          <Navbar homeHrefPrefix="/" />
          <div className="mx-auto mt-auto grid w-[90%] 2xl:max-w-[1440px] gap-3 md:gap-6 pt-28 pb-7 md:pb-10 lg:grid-cols-[1.3fr_1fr] lg:items-end lg:gap-16">
            <h1 className="max-w-[960px] text-[clamp(32px,2.3vw,102px)]  md:text-[clamp(42px,4.3vw,102px)] leading-[.98] font-bold uppercase">
              {activeRace.heroTitle.map((line) => (
                <span key={line} className="block">
                  {line}
                </span>
              ))}
            </h1>
            <div>
              <p className="max-w-[680px] text-lg leading-tight 2xl:text-[20px]">
                {activeRace.introduction}
              </p>
              <div className="mt-6 flex flex-wrap items-center gap-3 rounded-[5px] bg-black/30 p-3 backdrop-blur-[22px]">
                <Image
                  src="/races/race-flag.svg"
                  alt=""
                  width={52}
                  height={34}
                  className="h-[27px] w-[41px] shrink-0 object-contain"
                />
                <p className="flex-1 text-sm xl:text-[1vw] 2xl:text-[15px] font-bold uppercase xl:text-md">
                  {activeRace.date}
                </p>
                <Button
                  href={activeRace.registerUrl}
                  tone="pink"
                  className="max-sm:w-full"
                >
                  {activeRace.cms.heroCta}
                </Button>
              </div>
            </div>
          </div>
        </section>

        <section
          aria-label="About the race"
          className={`${container} grid gap-5 py-6 md:grid-cols-2 md:gap-7 md:py-10 `}
        >
          <RaceReveal className="relative h-full min-h-[290px] overflow-hidden rounded-[10px] order-2 md:order-1">
            <RaceAboutImage
              src={activeRace.assets.about}
              alt={activeRace.aboutAlt}
              sizes="(min-width: 1536px) 706px, (min-width: 768px) 44vw, 90vw"
            />
          </RaceReveal>
          <div className="order-1 md:order-2">
            <RaceReveal
              delay={140}
              className="relative isolate flex h-full min-h-[400px] flex-col overflow-hidden rounded-[10px] bg-[#072f4f] p-4 md:p-6 text-white lg:min-h-[450px]"
            >
            <Image
              src={activeRace.assets.pattern}
              alt=""
              fill
              sizes="(max-width: 767px) (min-width: 1536px) 706px, (min-width: 768px) 44vw, 90vw"
              className="pointer-events-none -z-10 object-cover"
            />
            <Image
              src={activeRace.assets.mark}
              alt=""
              width={143}
              height={118}
              className="mb-5 h-[70px] w-[85px] object-contain lg:h-[95px] lg:w-[115px]"
            />
            <SectionHeading
              eyebrow={activeRace.cms.aboutEyebrow}
              title={activeRace.cms.aboutTitle}
              light
            />
            <div className="mt-2 space-y-1.5 md:space-y-3 text-base leading-[1.45] 2xl:text-[18px]">
              {activeRace.paragraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
            <div className="mt-auto pt-3 md:pt-7">
              <h3 className="mb-2 md:mb-4 text-lg font-bold uppercase">
                {activeRace.cms.raceDayTitle}
              </h3>
              <dl className="grid grid-cols-2 gap-x-4 gap-y-3 md:gap-y-5 text-sm lg:grid-cols-[1.5fr_1fr_1fr] 2xl:text-lg">
                <div className="col-span-2 lg:col-span-1">
                  <dt className="font-bold uppercase">{activeRace.cms.dateLabel}</dt>
                  <dd className="md:mt-2">{activeRace.cms.dateValue}</dd>
                </div>
                <div className="lg:border-s lg:border-white/40 lg:ps-5">
                  <dt className="font-bold uppercase">{activeRace.cms.arrivalLabel}</dt>
                  <dd className="md:mt-2">{activeRace.cms.arrivalValue}</dd>
                </div>
                <div className="border-s border-white/40 ps-5">
                  <dt className="font-bold uppercase">{activeRace.cms.startLabel}</dt>
                  <dd className="md:mt-2">{activeRace.cms.startValue}</dd>
                </div>
              </dl>
            </div>
          </RaceReveal>
          </div>
        </section>

        <section
          aria-label="Race distances"
          className={`${container} pb-12 `}
        >
          <div className="mb-5 w-full flex flex-wrap items-center justify-between gap-2 md:mb-4">
            <SectionHeading eyebrow={activeRace.cms.distancesEyebrow} title={activeRace.cms.distancesTitle} />
            <Button href={activeRace.cms.distancesHref} tone="pink">
              {activeRace.cms.distancesCta}
            </Button>
          </div>
          <RaceDistanceCards distances={activeRace.distances} />
        </section>

        <section
          aria-label="Race route maps"
          className="relative isolate py-9 "
        >
          <Image
            src="/races/route-grid.svg"
            alt=""
            fill
            sizes="100vw"
            className="pointer-events-none -z-10 object-cover"
          />
          <div className={container}>
            <SectionHeading
              eyebrow={activeRace.cms.mapsEyebrow}
              title={activeRace.cms.mapsTitle}
              centered
            />
            <RouteMaps
              routes={activeRace.routes}
              raceName={activeRace.name}
            />
            <div className="mt-5 grid items-center gap-2 md:mt-7 md:grid-cols-[1fr_1.1fr_auto] md:gap-10 md:px-8">
              <div>
                {activeRace.cms.routeCtaEyebrow && (
                  <p className="mb-2 text-sm font-bold uppercase text-[#bb0054]">
                    {activeRace.cms.routeCtaEyebrow}
                  </p>
                )}
                <h3 className="max-w-[430px] text-2xl leading-none font-bold uppercase 2xl:text-[40px]">
                  {activeRace.routeCta.title}
                </h3>
              </div>
              <p className="max-w-[450px] text-lg xl:text-xl leading-snug text-[#303030] ">
                {activeRace.routeCta.description}
              </p>
              <Button href={activeRace.registerUrl} tone="pink">
                {activeRace.routeCta.button}
              </Button>
            </div>
          </div>
        </section>

        <section
          aria-label={`${activeRace.name} location and registration`}
          className={`${container} grid gap-5 py-8 md:grid-cols-2 md:gap-7 md:py-14 `}
        >
          <div className="relative block aspect-[775.543/710.496] overflow-hidden rounded-[10px] border border-[#d7d7d7] bg-[#e8e8e8]">
            <iframe
              title={`${activeRace.location.name} location map`}
              src={`https://www.google.com/maps?q=${encodeURIComponent(activeRace.location.query)}&output=embed`}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="absolute inset-0 size-full border-0"
            />
          </div>
          <div className="relative isolate flex min-h-[350px] md:min-h-[400px] flex-col overflow-hidden rounded-[10px] bg-[#072f4f] p-4 md:p-6 text-white lg:p-5 2xl:p-8">
            <h2 className="relative z-10 max-w-[450px] text-[32px] leading-[1.02] font-bold uppercase lg:text-[40px] 2xl:text-[44px]">
              {activeRace.journey.title}
            </h2>
            <p className="relative z-10 mt-3 md:mt-2 max-w-[80%] 2xl:max-w-[550px] text-lg leading-snug 2xl:text-[20px]">
              {activeRace.journey.description}
            </p>
            <Button
              href={activeRace.cms.journeyHref}
              tone="pink"
              className="mt-5 self-start md:!hidden !block "
            >
              {activeRace.cms.journeyCta}
            </Button>
            <div className="pointer-events-none absolute end-0 bottom-0 -z-10 h-[72.1%] w-[64.7%] overflow-hidden">
              <div className="absolute top-0 start-0 h-[137.35%] w-[132.36%]">
                <Image
                  src="/races/journey-art.png"
                  alt=""
                  fill
                  sizes="40vw"
                  className="object-fill rtl:scale-x-[-1]"
                />
              </div>
            </div>
            <Button
              href={activeRace.cms.journeyHref}
              tone="pink"
              className="mt-auto self-start md:!block !hidden"
            >
              {activeRace.cms.journeyCta}
            </Button>
          </div>
        </section>
      </main>
      <Footer homeHrefPrefix="/" />
    </>
  );
}
