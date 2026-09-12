import Image from "next/image";
import { homeData as data } from "@/data/home-data";
import Button from "./Button";
export default function CallToAction() {
  return (
    <section className="bg-[#f8f8f8] py-16 md:py-20">
      <div className="relative isolate mx-auto w-[90%] overflow-hidden rounded-[10px] bg-[#072f4f] p-7 text-white md:p-8 2xl:min-h-[258px] 2xl:max-w-[1440px]">
        <div className="absolute top-0 right-0 -z-10 h-full w-[47%] overflow-hidden max-md:opacity-35">
          <div className="relative md:block hidden bottom-0 md:-top-[117.15%] h-[100%] md:h-[362.87%] md:w-[132.36%]">
            <Image
              src={data.assets.ctaPattern}
              alt=""
              fill
              sizes="45vw"
              className="object-fill"
            />
          </div>
        </div>
        <h2 className="text-[34px] leading-none font-bold uppercase md:text-[40px] lg:text-[40px] 2xl:text-[44px]">
          {data.cta.title}
        </h2>
        <div className="mt-3 max-w-[800px] text-base leading-tight 2xl:text-lg">
          {data.cta.paragraphs.map((text) => (
            <p key={text}>{text}</p>
          ))}
        </div>
        <div className="mt-4 md:mt-10 flex flex-wrap gap-2 md:gap-5">
          <Button href={data.register.href} tone="pink">
            {data.register.label}
          </Button>
          <Button href="#calendar" tone="white" className="min-w-[142px]">
            {data.cta.explore}
          </Button>
        </div>
      </div>
    </section>
  );
}
