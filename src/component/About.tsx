"use client";

import Image from "next/image";
import { useHomeData } from "./LanguageProvider";
import SectionHeading from "./SectionHeading";
import Button from "./Button";
import Video from "./Video";
export default function About() {
  const data = useHomeData();
  return (
    <section
      id="about"
      className="mx-auto w-[90%] scroll-mt-8 py-7 md:py-20 2xl:max-w-[1440px] 2xl:py-[90px]"
    >
      <div className="grid gap-3 md:grid-cols-2 md:gap-[30px]">
        <div className="flex flex-col items-start justify-between gap-8">
          <SectionHeading
            eyebrow={data.about.eyebrow}
            title={data.about.title}
          />
          <div className="md:inline-flex hidden">
            <Button href={data.register.href} tone="pink" className="hidden md:inline-flex">
              {data.register.label}
            </Button>
          </div>
        </div>
        <div>
          <div className="space-y-3 md:space-y-5 text-lg leading-[1.25] text-black lg:text-base 2xl:text-lg">
            {data.about.paragraphs.map((text) => (
              <p key={text}>{text}</p>
            ))}
          </div>
          <div className="flex items-end justify-end">
            <Button href={data.register.href} tone="pink" className="mt-2 md:hidden">
              {data.register.label}
            </Button>
          </div>
          <div className=" mt-2 md:mt-7">
            <Image
              src={data.assets.quote}
              alt=""
              width={40}
              height={31}
              className="mb-3 h-[31px] w-[40px]"
            />
            <p className="max-w-[650px] text-lg leading-tight font-bold uppercase lg:text-base 2xl:text-lg">
              {data.about.patronage}
            </p>
          </div>
        </div>
      </div>
      <div className="relative mt-4 md:mt-12 aspect-[1590/728] overflow-hidden rounded-[10px] bg-[#072f4f] max-sm:aspect-[4/3] 2xl:mt-[72px]">
        <Video src={data.assets.aboutVideo} poster={data.assets.aboutPoster} />
      </div>
    </section>
  );
}
