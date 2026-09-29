"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useLanguage } from "@/component/LanguageProvider";
import Navbar from "@/component/Navbar";
import Footer from "@/component/Footer";
import Button from "@/component/Button";
import SectionHeading from "@/component/SectionHeading";
import Video from "@/component/Video";
import { homeData } from "@/data/home-data";
import { challenges, villages } from "./data";
import CircularGallery from "./CircularGallery";

import ScrollCharacterReveal from "./ScrollCharacterReveal";
export default function AboutPage() {
  const { language } = useLanguage();
  const [cms, setCms] = useState<any>(null);
  useEffect(() => { fetch("/api/cms/about").then(r => r.ok ? r.json() : null).then(setCms).catch(() => {}); }, []);
  const field = (item: any, name: string, fallback: string) => item?.[`${name}${language === "ar" ? "Ar" : "En"}`] || fallback;
  useEffect(() => { const seo = cms?.seo; if (!seo) return; const suffix = language === "ar" ? "Ar" : "En"; const title = seo[`title${suffix}`]; const description = seo[`description${suffix}`]; if (title) window.document.title = title; if (description) window.document.querySelector('meta[name="description"]')?.setAttribute("content", description); }, [cms, language]);
  const challengeCards = cms?.challenges?.items?.length ? cms.challenges.items.map((item: any, index: number) => ({ ...challenges[index], distance: field(item, "title", `${challenges[index].distance}\n${challenges[index].title}`).split("\n")[0], title: field(item, "title", `${challenges[index].distance}\n${challenges[index].title}`).split("\n").slice(1).join(" "), description: field(item, "paragraph", challenges[index].description), image: item.image || challenges[index].image, cta: field(item, "cta", `Register for the ${challenges[index].distance}`) })) : challenges;
  const raceCards = cms?.races?.items?.length ? cms.races.items.map((item: any, index: number) => ({ name: field(item, "title", villages[index].name), description: field(item, "paragraph", villages[index].description), image: item.image || villages[index].image, registerUrl: item.ctaHref || villages[index].registerUrl, cta: field(item, "cta", "Register Now"), color: villages[index].color })) : villages;
  const hero = cms?.hero; const journey = cms?.journey; const recognition = cms?.recognition;
  const heroLabel = field(hero, "label", "Emirates Village Run Series 2026"); const heroTitle = field(hero, "title", "Seven Races. One Journey Across the UAE."); const heroParagraph = field(hero, "paragraph", "The Emirates Villages Run Series is the UAE's nationwide running challenge, bringing together sport, community, heritage and discovery across all seven emirates.");
  const journeyLabel = field(journey, "label", "More Than a Running Series"); const journeyTitle = field(journey, "title", "Discover the UAE, One Village at a Time"); const journeyParagraph = field(journey, "paragraph", "From the first start line in Qidfa to the final race in Al Shuwaib, participants travel across the UAE and experience a different village, landscape and community at every stop.");
  const challengesSection = cms?.challenges; const racesSection = cms?.races;
  const challengesLabel = field(challengesSection, "label", "Built for Everyone"); const challengesTitle = field(challengesSection, "title", "Choose Your Challenge");
  const racesLabel = field(racesSection, "label", "The Seven Races"); const racesTitle = field(racesSection, "title", "Seven Villages. One Journey Across the UAE.");
  const recognitionLabel = field(recognition, "label", "Recognition & Legacy"); const recognitionTitle = field(recognition, "title", "A National Journey with International Recognition"); const recognitionParagraphs = field(recognition, "paragraph", "In its inaugural year, the Emirates Villages Run Series received international recognition through the UN Tourism Sports Tourism Award.\n\nEVRS returns in 2026 to continue connecting sport with authentic village destinations and introducing more people to the communities, landscapes and stories found across the UAE.").split("\n\n");
  return (
    <>
      <main id="main-content" className="bg-white" lang="en" dir="ltr">
        <section className="relative isolate flex h-[min(100svh,1080px)] min-h-[680px] flex-col bg-[#0b2d4d] text-white max-md:h-[90svh] max-md:min-h-[620px]">
          <div className="absolute inset-0 -z-[2] overflow-hidden [&_img]:absolute [&_img]:h-auto [&_img]:w-[35%] [&_img:nth-child(1)]:-left-[12%] [&_img:nth-child(1)]:-top-[17%] [&_img:nth-child(2)]:left-[16%] [&_img:nth-child(2)]:-top-[19%] [&_img:nth-child(3)]:left-[47%] [&_img:nth-child(3)]:-top-[19%] [&_img:nth-child(4)]:-right-[9%] [&_img:nth-child(4)]:top-[28%] [&_img:nth-child(5)]:-right-[8%] [&_img:nth-child(5)]:-bottom-[20%] [&_img:nth-child(6)]:left-[47%] [&_img:nth-child(6)]:-bottom-[20%] [&_img:nth-child(7)]:left-[18%] [&_img:nth-child(7)]:-bottom-[20%]" aria-hidden="true">
            <Image
              src="/home/hero-bg-last.png"
              alt=""
              fill
              className="-z-20 object-cover"
              sizes="100vw"
              preload
            />
          </div>
          <div className="absolute inset-3 -z-[1] grid grid-cols-3 grid-rows-[40%_17%_40%] gap-x-[1.7%] gap-y-[1.5%] overflow-hidden rounded-[10px] bg-white max-md:inset-2 [&_img]:object-cover" aria-hidden="true">
            <div className="relative col-start-1 row-start-1 row-end-3 overflow-hidden">
              <Video
                src={hero?.heroVideo || "/home/hero-video.webm"}
                poster="/home/hero-poster.jpg"
              />
            </div>
            <div className="relative col-start-1 row-start-3 overflow-hidden">
              <Image
                src={hero?.images?.[0] || "/about/hero-bottom-left.png"}
                alt=""
                fill
                sizes="33vw"
              />
            </div>
            <div className="relative col-start-2 row-start-1 row-end-4 overflow-hidden [&_img]:object-[50%_25%]">
              <Image
                src={hero?.images?.[1] || "/about/hero-center.png"}
                alt=""
                fill
                preload
                sizes="33vw"
              />
            </div>
            <div className="relative col-start-3 row-start-1 overflow-hidden [&_img]:-scale-x-100 [&_img]:object-top">
              <Image src={hero?.images?.[2] || "/about/hero-top-right.png"} alt="" fill sizes="33vw" />
            </div>
            <div className="relative col-start-3 row-start-2 row-end-4 overflow-hidden">
              <Video
                src={hero?.aboutVideo || "/home/about-section-video.webm"}
                poster="/home/about-poster.jpg"
              />
            </div>
            <div className="absolute inset-0 overflow-hidden bg-[rgba(0,0,0,0.6)]" />
          </div>
          <Navbar homeHrefPrefix="/" />
          <div className="m-auto w-[90%] max-w-[1150px] pt-20 pb-[55px] text-center min-[1600px]:max-w-[1340px] max-md:pt-[65px] [&>p]:text-[clamp(14px,1.3vw,25px)] [&>p]:font-bold [&>p]:uppercase [&_h1]:mt-5 [&_h1]:text-[clamp(40px,5.32vw,102px)] md:[&_h1]:text-[clamp(42px,5vw,62px)] md:[&_h1]:w-[80%] md:[&_h1]:mx-auto [&_h1]:leading-none [&_h1]:font-bold [&_h1]:uppercase">
            <p>{heroLabel}</p>
            <h1>{heroTitle}</h1>
          </div>
          <div className="mx-auto mb-[30px] w-[90%] max-w-[900px] text-center max-md:mb-5 [&_p]:text-[clamp(18px,1.82vw,25px)] [&_p]:leading-[1.28] [&_a]:mt-3 [&_a]:inline-flex [&_a]:p-3 [&_span]:size-7 [&_span]:rotate-90 [&_span]:bg-white [&_span]:[mask-size:contain] [&_span]:[mask-repeat:no-repeat] [&_span]:[mask-position:center]">
            <p>{heroParagraph}</p>
            <a href="#our-journey" aria-label="Discover our journey">
              <span style={{ maskImage: "url(/about/down-arrow.png)" }} />
            </a>
          </div>
        </section>

        <section id="our-journey" className="mx-auto grid w-[90%] max-w-[1440px] grid-cols-[.8fr_1.2fr] gap-[10%] py-[70px] max-md:grid-cols-1 max-md:gap-8 max-md:py-[45px] [&>div]:max-w-[440px]">
          <div className="!max-w-full">
            <SectionHeading
              eyebrow={journeyLabel}
              title={journeyTitle}
            />
            <Button href={journey?.ctaHref || "#seven-races"} tone="pink" className="mt-7 md:mt-12">{field(journey, "cta", "Find Your Race")}</Button>
          </div>
          <ScrollCharacterReveal
            text={journeyParagraph}
            className="text-[clamp(28px,3.4vw,65px)]! leading-none font-medium text-[#c6c6c9] max-md:text-[32px]!"
          />
        </section>

        <section className="mx-auto w-[90%] max-w-[1440px] pt-[25px] md:pb-[20px] max-md:pt-0" aria-label="Built for everyone">
          <SectionHeading
            eyebrow={challengesLabel}
            title={challengesTitle}
            centered
          />
          <div className="mt-[30px] pb-[30px]">
            {challengeCards.map((challenge: any, index: number) => (
              <article
                key={challenge.distance}
                className="sticky mb-6 grid min-h-[420px] grid-cols-[1fr_1.05fr_1fr] gap-6 rounded-[10px] p-5 text-white max-md:min-h-0 max-xl:grid-cols-2 max-md:gap-4 max-md:p-4 motion-reduce:relative motion-reduce:top-auto! [&_h3]:text-[clamp(28px,2.86vw,55px)] [&_h3]:leading-none [&_h3]:font-bold [&_h3]:uppercase max-md:[&_h3]:text-xl [&>p]:self-end [&>p]:text-[clamp(18px,1.82vw,35px)] [&>p]:leading-[1.08] max-md:[&>p]:self-center max-md:[&>p]:text-[15px] max-md:[&>p]:leading-[1.15]"
                style={{
                  backgroundColor: challenge.color,
                  top: `calc(20px + ${index * 16}px)`,
                  zIndex: index + 1,
                }}
              >
                <div className="flex flex-col justify-between md:gap-6 max-md:col-span-full max-md:flex-row max-md:items-center max-md:[&_a]:max-w-[135px] max-md:[&_a]:p-3 max-md:[&_a]:text-[10px]">
                  <h3 className="">
                    {challenge.distance}
                    <br />
                    {challenge.title}
                  </h3>
                  <Button href={homeData.register.href} tone="white">
                    {challenge.cta}
                  </Button>
                </div>
                <div className="relative aspect-[510/589] min-h-[380px] overflow-hidden rounded-[10px] max-md:aspect-auto max-md:h-full max-md:min-h-[235px] [&_img]:object-cover">
                  <Image
                    src={challenge.image}
                    alt={`Runners taking part in the ${challenge.distance} ${challenge.title}`}
                    fill
                    sizes="(max-width: 767px) 80vw, 30vw"
                  />
                </div>
                <p>{challenge.description}</p>
              </article>
            ))}
          </div>
        </section>

        <section id="seven-races" className="pb-[70px]">
          <div className="m-auto w-[90%] max-w-[640px]">
            <SectionHeading
              eyebrow={racesLabel}
              title={racesTitle}
              centered
            />
          </div>
          <CircularGallery villages={raceCards} />
        </section>

        <section
          className="relative isolate mx-auto mb-20 w-[90%] max-w-[1440px] rounded-[10px] bg-[#0b2d4d] p-4 max-md:mb-10 max-md:p-[9px]"
          aria-label="Recognition and legacy"
        >
          <div className="absolute inset-0 -z-[1] overflow-hidden rounded-[10px] [&_img]:absolute [&_img]:h-auto [&_img:nth-child(1)]:top-0 [&_img:nth-child(1)]:left-0 [&_img:nth-child(1)]:w-full [&_img:nth-child(2)]:right-0 [&_img:nth-child(2)]:top-[28%] [&_img:nth-child(2)]:w-[26%] [&_img:nth-child(3)]:right-0 [&_img:nth-child(3)]:bottom-0 [&_img:nth-child(3)]:w-[83%]" aria-hidden="true">
            <Image
              src={recognition?.decorativeImages?.[0] || "/about/recognition-top.svg"}
              alt=""
              width={1590}
              height={308}
            />
            <Image
              src={recognition?.decorativeImages?.[1] || "/about/recognition-right.svg"}
              alt=""
              width={412}
              height={356}
            />
            <Image
              src={recognition?.decorativeImages?.[2] || "/about/recognition-bottom.svg"}
              alt=""
              width={1311}
              height={289}
            />
          </div>
          <div className="grid grid-cols-[1.05fr_.8fr_1fr] gap-5 rounded-[7px] bg-white p-6 max-md:grid-cols-1 max-md:p-5">
            <div className="flex flex-col justify-between">
              <SectionHeading
                eyebrow={recognitionLabel}
                title={recognitionTitle}
              />
              <div className="mt-3 md:mt-6 flex flex-wrap gap-2 md:gap-3">
                <Button href={recognition?.ctaHref || homeData.register.href} tone="pink">{field(recognition, "cta", "Register Now")}</Button>
                <Button href="#seven-races">{field(recognition, "secondaryCta", "Explore the Races")}</Button>
              </div>
            </div>
            <div className="flex items-end justify-center overflow-hidden max-md:order-3 max-md:w-full">
              <Image
                src={recognition?.image || "/about/recognition-rahhal.png"}
                alt="Rahhal holding the Emirates Villages Run Series prize cheque"
                width={2000}
                height={2000}
                className="h-auto w-auto max-w-full origin-bottom scale-[1.10] mr-6 -translate-y-2 object-contain object-bottom"
              />
            </div>
            <div className="self-center [&_p]:text-[clamp(18px,1.56vw,30px)] [&_p]:leading-[1.24] md:[&_p+p]:mt-6 [&_p+p]:mt-3 max-md:[&_p]:text-[17px]">
              {recognitionParagraphs.map((paragraph: string) => <p key={paragraph}>{paragraph}</p>)}
            </div>
          </div>
        </section>
      </main>
      <Footer homeHrefPrefix="/" />
    </>
  );
}
