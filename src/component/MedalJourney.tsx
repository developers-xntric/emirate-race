"use client";

import Image from "next/image";
import { useHomeData } from "./LanguageProvider";
import Button from "./Button";
export default function MedalJourney() {
  const data = useHomeData();
  return (
    <section
      id="medal"
      className="mx-auto grid w-[90%] scroll-mt-8 gap-[30px] md:grid-cols-2 2xl:max-w-[1440px]"
    >
      <article className="relative isolate min-h-[500px] md:min-h-[610px] 2xl:min-h-[650px] overflow-hidden rounded-[10px] bg-[#072f4f] p-3 md:p-6 text-white  2xl:p-[38px]">
        <div className="absolute end-0 bottom-0 -z-10 aspect-[606.69/616.3] w-[70%] overflow-hidden ">
          <div className="relative h-[130.35%] w-[132.36%]">
            <Image
              src={data.assets.medalPattern}
              alt=""
              fill
              sizes="50vw"
              className="object-fill rtl:scale-x-[-1]"
            />
          </div>
        </div>
        <p className="mb-3 text-sm font-bold text-[#bb0054] uppercase 2xl:text-lg">
          {data.medal.eyebrow}
        </p>
        <h2 className="text-[34px] leading-[1.02] font-bold uppercase md:text-[40px] lg:text-[36px] 2xl:text-[44px]">
          {data.medal.title}
        </h2>
        <div className="mt-2 2xl:mt-4 max-w-[630px] text-lg leading-[1.25] lg:text-base 2xl:text-lg">
          {data.medal.paragraphs.map((text, index) => (
            <p key={text} className={index === 2 ? "mt-5" : ""}>
              {text}
            </p>
          ))}
        </div>
        <Button href={data.register.href} tone="pink" className="mt-8">
          {data.medal.cta}
        </Button>
      </article>
      <div className="grid gap-[30px]">
        <article
          id="prizes"
          className="relative isolate scroll-mt-8 overflow-hidden rounded-[10px] bg-[#706cb5]  p-4 md:p-6 text-white 2xl:p-[20px]"
        >
          <div className="relative z-10 max-w-[68%] ">
            <h2 className="text-[32px] leading-[1.02] font-bold uppercase lg:text-[36px] 2xl:text-[44px]">
              {data.prizes.title}
            </h2>
            <p className="mt-3 text-lg leading-[1.25] lg:text-base 2xl:text-lg">
              {data.prizes.description}
            </p>
          </div>
          <div className="absolute end-3 bottom-[24%] md:bottom-5 -z-0 aspect-[294.26/322.25] w-[37%] overflow-hidden">
            <div className="relative -top-[10.1%] h-[110.1%] w-full rtl:-left-4.5 md:rtl:-left-7">
              <Image
                src={data.assets.prizeRahhal}
                alt={data.prizes.alt}
                fill
                sizes="20vw"
                className="object-fill"
              />
            </div>
          </div>
          <div className="relative z-10 mt-8 flex flex-wrap gap-3">
            <Button href="#prize-answer">{data.prizes.cta}</Button>
            <Button href={data.register.href} tone="pink">
              {data.register.label}
            </Button>
          </div>
        </article>
        <div className="relative md:block hidden min-h-[260px] overflow-hidden rounded-[10px]">
          <Image
            src={data.assets.prizeRunners}
            alt={data.prizes.photoAlt}
            fill
            sizes="(min-width: 768px) 45vw, 90vw"
            className="object-cover"
          />
        </div>
      </div>
    </section>
  );
}
