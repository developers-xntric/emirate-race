"use client";

import Image from "next/image";
import { useHomeData } from "./LanguageProvider";
import Navbar from "./Navbar";
import Video from "./Video";
import Button from "./Button";

export default function Hero() {
  const data = useHomeData();
  return (
    <section className="relative isolate md:min-h-[780px] overflow-hidden p-[8px] text-white lg:h-svh lg:min-h-0">
      <Image
        src={data.assets.heroBorder}
        alt=""
        fill
        className="-z-20 object-cover"
        sizes="100vw"
        preload
      />
      <div className="absolute inset-[8px] -z-10 overflow-hidden rounded-[10px] bg-[#072f4f]">
        <Video src={data.assets.heroVideo} poster={data.assets.heroPoster} />
        <div className="pointer-events-none absolute inset-0 bg-black/50" />
      </div>
      <Navbar />
      <div className="relative mx-auto mt-[180px] md:mt-[250px] mb-5 md:mb-10 grid w-[90%] gap-4 md:gap-8 lg:absolute lg:inset-x-0 lg:bottom-10 lg:mb-0 lg:grid-cols-[1.15fr_1fr] lg:items-end 2xl:bottom-[50px] 2xl:max-w-[1440px]">
        <h1 className="text-[clamp(34px,5.3vw,48px)] leading-[.98] font-bold uppercase [text-shadow:0_2px_20px_rgba(0,0,0,0.2)] lg:text-[68px] 2xl:text-[77px]">
          {data.hero.title.map((line, index) => (
            <span
              key={line}
              className={`block ${index === 2 ? "text-white" : "text-white/65 [-webkit-text-stroke:1px_rgba(255,255,255,0.5)]"}`}
            >
              {line}
            </span>
          ))}
        </h1>
        <div>
          <div className="space-y-3 md:space-y-5 text-base leading-[1.2] lg:text-base 2xl:text-lg">
            {data.hero.paragraphs.map((text) => (
              <p key={text}>{text}</p>
            ))}
          </div>
          <div className="mt-3 md:mt-6 flex flex-wrap items-center gap-3 rounded-[5px] bg-black/30 p-2 backdrop-blur-[22px]">
            <span className="rounded-[3px] bg-white/10 px-3 py-2 text-xs font-bold">
              {data.hero.next}
            </span>
            <Image
              src={data.assets.nextRaceFlag}
              alt=""
              width={52}
              height={34}
              className="h-[27px] w-[41px] object-contain"
            />
            <p className="flex-1 text-xs font-bold uppercase">
              {data.hero.dates}
            </p>
            <Button href="#calendar" tone="white" className="max-sm:w-full">
              {data.hero.cta}
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
