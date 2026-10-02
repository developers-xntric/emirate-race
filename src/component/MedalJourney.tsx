"use client";

import Image from "next/image";
import { useHomeData } from "./LanguageProvider";
import Button from "./Button";
export default function MedalJourney() {
  const data = useHomeData();
  return (
    <section
      id="medal"
      className="mx-auto grid w-[90%] scroll-mt-8 gap-5 md:gap-[30px] md:grid-cols-2 2xl:max-w-[1440px]"
    >
      <article className="relative isolate  md:min-h-[520px] xl:min-h-[565px] 2xl:min-h-[630px] overflow-hidden rounded-[10px] bg-[#072f4f] p-3 md:p-6 text-white">
        <p className="mb-1 md:mb-3 text-sm font-bold text-[#bb0054] uppercase 2xl:text-lg">
          {data.medal.eyebrow}
        </p>
        <h2 className="text-[34px] leading-[1.02] font-bold uppercase md:text-[40px] lg:text-[36px] 2xl:text-[44px]">
          {data.medal.title}
        </h2>
        <div className="mt-2 2xl:mt-4 max-w-[630px] text-lg leading-[1.25] lg:text-base 2xl:text-lg">
          {data.medal.paragraphs.map((text) => (
            <p key={text} className={"mt-2"}>
              {text}
            </p>
          ))}
        </div>
        <Button href={data.register.href} tone="pink" className="mt-4 md:mt-8">
          {data.medal.cta}
        </Button>
        <div className="mt-4 md:mt-0 lg:-mt-8 h-44 lg:h-[60%] 2xl:h-[60%] xl:w-[100%] 2xl:w-[110%] overflow-hidden ">
          <div className="relative h-full w-full -left-1 2xl:-left-10">
            <Image
              src={data.assets.medalPattern}
              alt=""
              fill
              sizes="50vw"
              className="object-fill"
            />
          </div>
        </div>
      </article>
      <div className="grid">
        <article
          id="prizes"
          className="relative isolate h-full md:min-h-[500px]  scroll-mt-8 overflow-hidden rounded-[10px] bg-[#706cb5] p-4 text-white lg:min-h-0 md:p-6 2xl:p-[20px]"
        >
          <div className="relative z-10 ">
            <h2 className="text-[32px] leading-[1.02] font-bold uppercase lg:text-[36px] 2xl:text-[44px]">
              {data.prizes.title}
            </h2>
            <p className="mt-3 text-lg leading-[1.25] lg:text-base 2xl:text-lg">
              {data.prizes.description}
            </p>
          </div>
          <div className="-z-0 aspect-[294.26/322.25] mx-auto w-[55%] xl:w-[60%] 2xl:w-[55%] overflow-hidden">
            <div className="relative -top-[10.1%] h-[110.1%] w-full ">
              <Image
                src={data.assets.prizeRahhal}
                alt={data.prizes.alt}
                fill
                sizes="200vw"
                className="object-fill"
              />
            </div>
          </div>
          <div className="relative z-10 mt-8 flex flex-wrap gap-1 md:gap-3">
            <Button href="#prize-answer">{data.prizes.cta}</Button>
            <Button href={data.register.href} tone="pink">
              {data.register.label}
            </Button>
          </div>
        </article>
      </div>
    </section>
  );
}